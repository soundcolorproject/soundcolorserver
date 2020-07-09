
import * as React from 'react'
import {
  patternInfo,
  patternDescription,
  buttonWrapper,
} from './patternInfo.pcss'
import { PatternName, PatternsStore } from '../../../../state/patternsStore'
import { LinkButton } from '../LinkButton'

export interface PatternInfoProps {
  pattern: PatternsStore['patternData'][PatternName]
  setPattern: (ev: React.MouseEvent<HTMLAnchorElement>) => void
}

export function PatternInfo ({ pattern, setPattern }: PatternInfoProps) {
  // TODO: use specific colors for each pattern
  const buttonBackground = pattern.colors.C
  return (
    <div className={patternInfo}>
      <h3>
        {pattern.label}
      </h3>
      <div className={patternDescription}>
        {pattern.description}
      </div>
      <div className={buttonWrapper}>
        <LinkButton
          to='/sovis'
          onClick={setPattern}
          color={buttonBackground}
        >Explore SOVIS with {pattern.label}</LinkButton>
      </div>
    </div>
  )
}
