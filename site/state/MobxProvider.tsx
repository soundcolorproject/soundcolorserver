
import * as React from 'react'
import { Provider } from 'mobx-react'

import { AnalysisProp, analysisStore } from './analysisStore'
import { ApiStatusProp, apiStatusStore } from './apiStatusStore'
import { MediaProp, mediaStore } from './mediaStore'
import { PatternsProp, patternsStore } from './patternsStore'
import { RenderStateProp, renderStateStore } from './renderStateStore'
import { RoutingProp, routingStore } from './routingStore'

interface Props {
  children?: React.ReactNode
}

export type MobxProviderProps =
  & AnalysisProp
  & ApiStatusProp
  & MediaProp
  & PatternsProp
  & RenderStateProp
  & RoutingProp

const stores: MobxProviderProps = {
  analysis: analysisStore,
  apiStatus: apiStatusStore,
  media: mediaStore,
  patterns: patternsStore,
  renderState: renderStateStore,
  routing: routingStore,
}

export function MobxProvider ({ children }: Props) {
  return (
    <Provider {...stores}>
      {children}
    </Provider>
  )
}
