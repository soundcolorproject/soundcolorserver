
import * as React from 'react'
import { Provider } from 'mobx-react'

import { AnalysisProp, analysisStore } from './analysisStore'
import { AppColorsProp, appColorsStore } from './appColorsStore'
import { MediaProp, mediaStore } from './mediaStore'
import { PatternsProp, patternsStore } from './patternsStore'
import { RenderStateProp, renderStateStore } from './renderStateStore'

interface Props {
  children?: React.ReactNode,
}

export type MobxProviderProps =
  & AnalysisProp
  & AppColorsProp
  & MediaProp
  & PatternsProp
  & RenderStateProp

const stores: MobxProviderProps = {
  analysis: analysisStore,
  appColors: appColorsStore,
  media: mediaStore,
  patterns: patternsStore,
  renderState: renderStateStore,
}

export function MobxProvider ({ children }: Props) {
  return (
    <Provider {...stores}>
      {children}
    </Provider>
  )
}
