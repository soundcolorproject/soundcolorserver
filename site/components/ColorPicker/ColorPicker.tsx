
import * as React from 'react'
import Pickr from '@simonwep/pickr'
import { injectAndObserve } from '../../state/injectAndObserve'
import { hexToHsv, hsvToHex } from '../../color/colorHelpers'
import { PatternsProp, Note } from '../../state/patternsStore'

interface OwnProps {
  note: Note
}

export type ColorPickerProps = PatternsProp & OwnProps

export const ColorPicker = injectAndObserve<PatternsProp, OwnProps>(
  ({ patterns }) => ({ patterns }),
  class ColorPicker extends React.Component<ColorPickerProps> {
    private picker: Pickr

    createPicker = (el: HTMLElement | null) => {
      if (this.picker || !el) {
        return
      }
      const { patterns, note } = this.props
      const customColors = patterns.patternData.custom.colors
      this.picker = Pickr.create({
        el: el,
        theme: 'nano',
        useAsButton: true,
        default: hsvToHex(customColors[note]),
        components: {
          palette: false,
          preview: true,
          opacity: false,
          hue: true,
          interaction: {
            input: true,
            save: true,
            cancel: true,
          },
        },
      })

      this.picker.on('cancel', (instance: Pickr) => {
        instance.hide()
      })

      this.picker.on('save', (color: Pickr.HSVaColor, instance: Pickr) => {
        customColors[note] = hexToHsv(color.toHEXA().toString())
        instance.hide()
      })
    }

    render () {
      const { note, patterns } = this.props
      const customColors = patterns.patternData.custom.colors
      const noteDesc = note.indexOf('#') > 1
        ? `${note[0]} Sharp`
        : note

      return (
        <button
          ref={this.createPicker}
          type='button'
          role='button'
          aria-label={`custom color for note ${noteDesc}`}
          style={{ background: hsvToHex(customColors[note]) }}
        >
          {note}
        </button>
      )
    }
  },
)