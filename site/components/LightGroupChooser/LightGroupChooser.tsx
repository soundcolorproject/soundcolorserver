
import * as React from 'react'
import { injectAndObserve } from '../../state/injectAndObserve'
import { ApiStatusProp } from '../../state/apiStatusStore'
import { ApiGroupInfo } from '../../../shared/apiTypes/hue'
import { getGroups } from '../../api/groups'

import { lightGroupChooser } from './lightGroupChooser.pcss'

interface OwnProps {

}

type StateProps = ApiStatusProp

export type DeviceChooserProps = OwnProps & StateProps

interface OwnState {
  loading: boolean
  groups?: ApiGroupInfo[]
  error?: Error
}

export const LightGroupChooser = injectAndObserve<StateProps, OwnProps>(
  ({ apiStatus }) => ({ apiStatus }),
  class LightGroupChooser extends React.Component<DeviceChooserProps, OwnState> {
    state: OwnState = {
      loading: false,
    }

    componentDidMount () {
      if (this.props.apiStatus.authenticated) {
        this.fetchGroups()
      }
    }

    componentDidUpdate () {
      if (this.props.apiStatus.authenticated) {
        this.fetchGroups()
      }
    }

    setError = (error: Error) => this.setState({ error, loading: false })

    fetchGroups = (force = false) => {
      if (this.state.loading || this.state.groups || (this.state.error && !force)) {
        return
      }

      this.fetchGroupsAsync().catch(this.setError)
    }

    forceFetchGroups = () => this.fetchGroups(true)

    fetchGroupsAsync = async () => {
      this.setState({ loading: true })
      try {
        const groups = await getGroups()
        this.setState({ groups, loading: false })
      } catch (error) {
        this.setError(error)
      }
    }

    onGroupChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
      const { apiStatus } = this.props

      if (!ev.target.value) {
        apiStatus.lightGroupId = undefined
      } else {
        apiStatus.lightGroupId = parseInt(ev.target.value, 10)
      }
    }

    toggleTransmitting = () => {
      const { apiStatus } = this.props
      apiStatus.transmitToLightGroup = !apiStatus.transmitToLightGroup
    }

    render () {
      const { apiStatus } = this.props
      const { loading, error, groups } = this.state

      if (!apiStatus.authenticated) {
        return (
          <div id={lightGroupChooser}>
            <a
              href='/login'
              className='btn'
            >
              Log in to hue
            </a>
          </div>
        )
      }

      if (error) {
        return (
          <div id={lightGroupChooser}>
            Failed to fetch light groups!
            <button
              type='button'
              role='button'
              aria-label='Refetch light groups'
              onClick={this.forceFetchGroups}
            >
              Retry
            </button>
          </div>
        )
      }

      if (loading || !groups) {
        return (
          <div id={lightGroupChooser}>
            Loading light groups...
          </div>
        )
      }

      const transmitVerb = apiStatus.transmitToLightGroup
        ? 'Stop'
        : 'Start'

      return (
        <div id={lightGroupChooser}>
          <label>
            Light Group <br/>
            <select value={apiStatus.lightGroupId} onChange={this.onGroupChange}>
              <option value=''>Select a group</option>
              {
                groups.map(({ id, name, type, lightCount }) => (
                  <option key={id} value={id}>({type}) {name} -- {lightCount} lights</option>
                ))
              }
            </select>
          </label>
          <div>
            <button
              type='button'
              role='button'
              onClick={this.toggleTransmitting}
              aria-label={`${transmitVerb} transmitting to hue group`}
            >
              {transmitVerb} hue integration
            </button>
          </div>
        </div>
      )
    }
  },
)
