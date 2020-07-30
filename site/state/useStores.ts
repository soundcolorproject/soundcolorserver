
import { useMemo } from 'react'

import { logger } from '../../shared/logger'

import { AnalysisProp, analysisStore } from './analysisStore'
import { ApiStatusProp, apiStatusStore } from './apiStatusStore'
import { MediaProp, mediaStore } from './mediaStore'
import { PatternsProp, patternsStore } from './patternsStore'
import { RenderStateProp, renderStateStore } from './renderStateStore'
import { RoutingProp, routingStore } from './routingStore'
import { IntroStoreProp, introStore } from './introStore'

export type MobxStoresProps =
  & AnalysisProp
  & ApiStatusProp
  & IntroStoreProp
  & MediaProp
  & PatternsProp
  & RenderStateProp
  & RoutingProp

const stores: MobxStoresProps = Object.freeze({
  analysis: analysisStore,
  apiStatus: apiStatusStore,
  intro: introStore,
  media: mediaStore,
  patterns: patternsStore,
  renderState: renderStateStore,
  routing: routingStore,
})

export function useStores () {
  return useMemo<MobxStoresProps>(() => stores, [])
}

if (__DEV__) {
  (window as any).stores = stores
}
