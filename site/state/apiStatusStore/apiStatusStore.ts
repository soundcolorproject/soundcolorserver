
import { observable, reaction } from 'mobx'
import { isLoggedIn } from '../../api/isLoggedIn'
import { logger } from '../../../shared/logger'
import { selectGroup, setColor } from '../../api/groups'
import { getColorsFromAnalysis } from '../../helpers/analysisColors'

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
      }),
      this._transmitColorData,
    )

    isLoggedIn().then(loggedIn => {
      this.authenticated = loggedIn
    }).catch(e => {
      logger.warn('Failed to check if the user is logged in:', e)
    })
  }

  readonly remoteApi = !__REMOTE_API__
  @observable authenticated = false
  @observable offline = false
  @observable lightGroupId: number | undefined = undefined
  @observable transmitToLightGroup = false

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

  private _setLightGroup = (groupId: number | null) => {
    if (groupId === null) {
      return
    }

    selectGroup({ groupId }).catch(e => {
      logger.info('Failed to alert on light selection:', e)
    })
  }

  private _transmitter: any = null
  private _transmitColorData = (
    { groupId, transmit }: { groupId: number | undefined, transmit: boolean },
  ) => {
    if (groupId === undefined || !transmit) {
      if (this._transmitter) {
        clearInterval(this._transmitter)
        this._transmitter = null
      }
      return
    }

    if (!this._transmitter) {
      this._transmitter = setInterval(() => {
        const [hsv] = getColorsFromAnalysis()
        const color = hsv
          ? { h: hsv.h, s: hsv.s, v: hsv.v }
          : { h: 0, s: 0, v: 0 }

        setColor({ groupId, color }).catch(e => {
          logger.info('Failed to set group color:', e)
        })
      }, 1000)
    }
  }
}

export const apiStatusStore = new ApiStatusStore()
