
import { observable, reaction, action } from 'mobx'
import { isLoggedIn } from '../../api/isLoggedIn'
import { logger } from '../../../shared/logger'
import { selectGroup, setColor, getGroups } from '../../api/groups'
import { getColorsFromAnalysis } from '../../helpers/analysisColors'
import { GroupColorMode, ApiGroupInfo } from '../../../shared/apiTypes/hue'

export interface ApiStatusProp {
  apiStatus: ApiStatusStore
}

const TEN_SECONDS = 1000 * 10
export class ApiStatusStore {
  constructor () {
    reaction(
      () => this.offline,
      this._testOnlineStatus,
    )

    reaction(
      () => this.lightGroupId,
      this._setLightGroup,
    )

    reaction(
      () => ({
        groupId: this.lightGroupId,
        transmit: this.transmitToLightGroup,
        mode: this.transmitMode,
      }),
      this._transmitColorData,
    )

    isLoggedIn().then(loggedIn => {
      this.authenticated = loggedIn
      if (loggedIn) {
        this.fetchLightGroups().catch(e => {
          logger.error('Failed to fetch light groups:', e)
        })
      }
    }).catch(e => {
      logger.warn('Failed to check if the user is logged in:', e)
    })
  }

  readonly remoteApi = !__REMOTE_API__
  @observable authenticated = false
  @observable offline = false

  @observable loadingLightGroups = false
  @observable lightGroups: ApiGroupInfo[] | null = null
  @observable lightGroupId: number | undefined = undefined
  @observable lightGroupFetchError: Error | null = null

  @observable transmitToLightGroup = false
  @observable transmitMode: GroupColorMode = 'group'

  @action
  fetchLightGroups = async () => {
    if (this.loadingLightGroups || this.lightGroups) {
      return
    }

    this.lightGroupFetchError = null
    this.loadingLightGroups = true

    try {
      this._setLightGroups(await getGroups())
    } catch (error) {
      this._setLightGroupError(error)
    }
  }

  @action
  private _setLightGroups = (lightGroups: ApiGroupInfo[]) => {
    this.lightGroups = lightGroups
    this.loadingLightGroups = false
  }

  @action
  private _setLightGroupError = (error: Error | null) => {
    this.lightGroupFetchError = error
    this.loadingLightGroups = false
  }

  private _onlineTester: any = null
  private _testOnlineStatus = (offline: boolean) => {
    if (!offline) {
      if (this._onlineTester) {
        clearInterval(this._onlineTester)
        this._onlineTester = null
      }
      return
    }

    if (this._onlineTester) {
      return
    }

    this._onlineTester = setInterval(() => {
      isLoggedIn().catch(e => {
        logger.info('Still offline:', e)
      })
    }, TEN_SECONDS)
  }

  private _setLightGroup = (groupId: number | undefined) => {
    if (groupId === undefined) {
      return
    }

    selectGroup({ groupId }).catch(e => {
      logger.info('Failed to alert on light selection:', e)
    })
  }

  private _lastMode: GroupColorMode = 'group'
  private _transmitter: any = null
  private _transmitColorData = (
    { groupId, transmit, mode }: { groupId: number | undefined, transmit: boolean, mode: GroupColorMode },
  ) => {
    if (groupId === undefined || !transmit) {
      if (this._transmitter) {
        clearInterval(this._transmitter)
        this._transmitter = null
      }
      return
    }

    if (mode !== this._lastMode && this._transmitter) {
      clearInterval(this._transmitter)
      this._transmitter = null
    }

    if (!this._transmitter) {
      const rate = mode === 'group'
        ? 1000
        : 250
      const startTime = Date.now()
      this._transmitter = setInterval(() => {
        const [hsv] = getColorsFromAnalysis()
        const color = hsv
          ? { h: hsv.h, s: hsv.s, v: hsv.v }
          : { h: 0, s: 0, v: 0 }

        logger.info(`Setting color (${Date.now() - startTime})`)
        setColor({ groupId, color, mode }).catch(e => {
          logger.info('Failed to set group color:', e)
        })
      }, rate)
    }
  }
}

export const apiStatusStore = new ApiStatusStore()
