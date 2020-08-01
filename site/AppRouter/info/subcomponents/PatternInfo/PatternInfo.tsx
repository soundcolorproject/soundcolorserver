
import * as React from 'react'

import { LinkButton } from '../../../../components/LinkButton'
import { getContrastingColor } from '../../../../pcss-functions'
import { notes, PatternName, PatternsStore } from '../../../../state/patternsStore'

import {
  buttonWrapper,
  patternDescription,
  patternInfo,
  startPatternButton,
} from './patternInfo.pcss'

export interface PatternInfoProps {
  isCustom?: boolean
  pattern: PatternsStore['patternData'][PatternName]
  setPattern: (ev: React.MouseEvent<HTMLAnchorElement>) => void
}

interface ColorCssVars {
  [item: string]: string
}

export function PatternInfo ({ isCustom, pattern, setPattern }: PatternInfoProps) {
  const noteColors = !isCustom
    ? pattern.colors
    : (pattern as PatternsStore['patternData']['custom']).defaultColors
  const buttonNoteColor = pattern.buttonNoteColor
  const buttonBackground = noteColors[buttonNoteColor]

  const startIndex = notes.indexOf(buttonNoteColor)
  const noteHoverColors = Array.from(Array(12)).map((_, i) => (
    noteColors[notes[(i + startIndex) % notes.length]]
  ))

  const colorVars: ColorCssVars = {}
  noteHoverColors.forEach((color, i) => {
    colorVars[`--pattern-color-${i}`] = color.toString()
    colorVars[`--pattern-contrast-${i}`] = getContrastingColor(color).toString()
  })

  return (
    <div className={patternInfo} style={colorVars}>
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
          className={startPatternButton}
        >Explore SOVIS with {pattern.label}</LinkButton>
      </div>
    </div>
  )
}
