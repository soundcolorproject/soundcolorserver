
import * as React from 'react'
import {
  patternInfo,
  patternDescription,
  buttonWrapper,
  patternButton,
} from './patternInfo.pcss'
import { PatternName, PatternsStore } from '../../../../state/patternsStore'
import { getContrastingColor } from '../../../../pcss-functions'

export interface PatternInfoProps {
  pattern: PatternsStore['patternData'][PatternName]
  setPattern: () => void
}

export function PatternInfo ({ pattern, setPattern }: PatternInfoProps) {
  const buttonBackground = pattern.colors.C
  const buttonColor = getContrastingColor(buttonBackground)
  return (
    <div className={patternInfo}>
      <h3>
        {pattern.label}
      </h3>
      <div className={patternDescription}>
        {pattern.description}
      </div>
      <div className={buttonWrapper}>
        <button
          type='button'
          onClick={setPattern}
          className={patternButton}
          style={{ backgroundColor: buttonBackground.toString(), color: buttonColor }}
        >Explore SOVIS with {pattern.label}</button>
      </div>
    </div>
  )
}
