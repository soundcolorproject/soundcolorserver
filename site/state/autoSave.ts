
import { IReactionDisposer, reaction, set, toJS, values } from 'mobx'

import { logger } from '../../shared/logger'

interface SavingStore {
  stopSaving: IReactionDisposer
  startSaving: () => void
  clearSave: () => void
}

const saveDelay = 1000 // in milliseconds
const DEBUG = __DEV__ && false // make __DEV__ && true to see debugging output

const disposerMap = new Map<SavingStore, SavingStore>()
const storesBeingSaved: SavingStore[] = []

export function stopSavingAllStores () {
  storesBeingSaved.forEach(store => {
    store.stopSaving()
  })
}

export function restartSavingAllStores () {
  storesBeingSaved.forEach(store => {
    store.startSaving()
  })
}

export function clearAllSaves () {
  storesBeingSaved.forEach(store => {
    store.stopSaving()
    store.clearSave()
  })
}

if (__DEV__) {
  const global = window as any
  global.stopSavingAllStores = stopSavingAllStores
  global.restartSavingAllStores = restartSavingAllStores
  global.clearAllSaves = clearAllSaves
}

function defineSaveProp (savingStore: SavingStore, modifySaveFunctions: SavingStore, key: keyof SavingStore) {
  Object.defineProperty(savingStore, key, {
    get (): SavingStore[typeof key] { return modifySaveFunctions[key] },
    enumerable: false,
    configurable: false,
    writable: false,
  })
}

function addSaveFunction (savingStore: SavingStore, modifySaveFunctions: SavingStore) {
  defineSaveProp(savingStore, modifySaveFunctions, 'stopSaving')
  defineSaveProp(savingStore, modifySaveFunctions, 'startSaving')
  defineSaveProp(savingStore, modifySaveFunctions, 'clearSave')
}

const autoSave = <Prop>(name: string & keyof Prop) => <T>(mobxStore: T): T & SavingStore => {

  let saving = false
  const savingStore = mobxStore as T & SavingStore
  const localStorageKey = `${name}-store`

  const modifySaveFunctions: SavingStore = {} as any

  modifySaveFunctions.startSaving = function startSaving () {
    if (saving) {
      DEBUG && logger.debug(`Already saving ${name} store.`)
      return
    }

    // will run on change
    const disposer = reaction(
      () => values(mobxStore),
      () => {
        DEBUG && logger.debug(`writing ${name} store...`)

        let jsonObj = mobxStore

        if (!('toJSON' in mobxStore)) {
          jsonObj = toJS(mobxStore)
        }

        // from then on serialize and save to localStorage
        localStorage.setItem(localStorageKey, JSON.stringify(jsonObj))
      },
      {
        delay: saveDelay,
        name: `${name} saver`,
        onError: (err) => {
          logger.warn(`Failed to save ${name} store:`, err)
        },
      },
    )
    saving = true
    modifySaveFunctions.stopSaving = (() => {
      saving = false
      disposer()
    }) as IReactionDisposer
    modifySaveFunctions.stopSaving.$mobx = disposer.$mobx
  }

  modifySaveFunctions.clearSave = () => {
    localStorage.removeItem(localStorageKey)
  }

  if (disposerMap.has(savingStore)) {
    return savingStore
  }

  DEBUG && logger.log(`inflating ${name} store...`)
  // on load check if there's an existing store on localStorage and extend the store
  const existingStore = localStorage.getItem(localStorageKey)

  if (existingStore) {
    DEBUG && logger.log(`existing value found for ${name} store`)
    set(mobxStore, JSON.parse(existingStore))
  } else {
    DEBUG && logger.log(`unable to find existing value for ${name} store`)
  }

  disposerMap.set(savingStore, modifySaveFunctions)
  storesBeingSaved.push(savingStore)

  addSaveFunction(savingStore, modifySaveFunctions)

  modifySaveFunctions.startSaving()

  return savingStore
}

export default autoSave
