
import { reaction, set, values, toJS, IReactionDisposer } from 'mobx'
import { logger } from '../../shared/logger'

interface SavingStore {
  stopSaving: IReactionDisposer
  startSaving: () => void
  clearSave: () => void
}

type ModifySaveFunctions = [
  IReactionDisposer, // stopSaving()
  () => void,        // startSaving()
  () => void         // clearSave()
]

const STOP_SAVING = 0
const START_SAVING = 1
const CLEAR_SAVE = 2

const saveDelay = 1000 // in milliseconds
const DEBUG = __DEV__ && false // make __DEV__ && true to see debugging output

const disposerMap = new Map<SavingStore, ModifySaveFunctions>()
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

function addSaveFunction (savingStore: SavingStore, modifySaveFunctions: ModifySaveFunctions) {
  Object.defineProperty(savingStore, 'stopSaving', {
    get (): SavingStore['stopSaving'] { return modifySaveFunctions[STOP_SAVING] },
    enumerable: false,
  })

  Object.defineProperty(savingStore, 'startSaving', {
    get (): SavingStore['startSaving'] { return modifySaveFunctions[START_SAVING] },
    enumerable: false,
  })

  Object.defineProperty(savingStore, 'clearSave', {
    get (): SavingStore['clearSave'] { return modifySaveFunctions[CLEAR_SAVE] },
    enumerable: false,
  })
}

const autoSave = <Prop>(name: string & keyof Prop) => <T>(mobxStore: T): T & SavingStore => {

  let saving = false
  const savingStore = mobxStore as T & SavingStore
  const localStorageKey = `${name}-store`

  const modifySaveFunctions: ModifySaveFunctions = [] as any

  modifySaveFunctions[START_SAVING] = function startSaving () {
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
    modifySaveFunctions[STOP_SAVING] = (() => {
      saving = false
      disposer()
    }) as IReactionDisposer
    modifySaveFunctions[STOP_SAVING].$mobx = disposer.$mobx
  }

  modifySaveFunctions[CLEAR_SAVE] = () => {
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

  modifySaveFunctions[START_SAVING]()

  return savingStore
}

export default autoSave
