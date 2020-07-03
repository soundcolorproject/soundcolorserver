
import { useMemo } from 'react'

import { logger } from '../../shared/logger'

import { AnalysisProp, analysisStore } from './analysisStore'
import { ApiStatusProp, apiStatusStore } from './apiStatusStore'
import { MediaProp, mediaStore } from './mediaStore'
import { PatternsProp, patternsStore } from './patternsStore'
import { RenderStateProp, renderStateStore } from './renderStateStore'
import { RoutingProp, routingStore } from './routingStore'

export type MobxStoresProps =
  & AnalysisProp
  & ApiStatusProp
  & MediaProp
  & PatternsProp
  & RenderStateProp
  & RoutingProp

export function useStores () {
  return useMemo<MobxStoresProps>(() => Object.freeze({
    analysis: analysisStore,
    apiStatus: apiStatusStore,
    media: mediaStore,
    patterns: patternsStore,
    renderState: renderStateStore,
    routing: routingStore,
  }), [])
}
