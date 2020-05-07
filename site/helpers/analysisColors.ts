
import { dBtoVolume } from '../audio/getAnalysis'
import { patternsStore } from '../state/patternsStore'
import { HSVa, toHsv } from '../pcss-functions/toHsv'
import { RGBa, toRgb } from '../pcss-functions/toRgb'
import { getLuminance } from '../pcss-functions'
import { HSLa } from '../pcss-functions/toHsl'
import { analysisStore } from '../state/analysisStore'

const smoothValues = {
  s: 0,
  v: 0,
  r: 0,
  g: 0,
  b: 0,
}

function smooth (color: RGBa | HSVa, key: keyof typeof smoothValues, delta: number, speed: number) {
  const smoothingVal = (1 - speed) ** (delta)
  return smoothValues[key] = smoothValues[key] * smoothingVal + (color as any)[key] * (1 - smoothingVal)
}

let lastTime = Date.now()
export function getColorsFromAnalysis (
  analysis = analysisStore,
  patterns = patternsStore,
): HSVa[] {
  const { noise, tones } = analysis
  let {
    transitionSpeed,
    noiseMultiplier,
    vibranceMultiplier,
    monochrome,
    currentPattern,
    patternData,
    minimumBrightness,
  } = patterns

  const colorMap = patternData[currentPattern].colors
  noiseMultiplier = noiseMultiplier > 0 ? 2 ** noiseMultiplier : 0
  vibranceMultiplier = 2 ** vibranceMultiplier
  const saturationMult = Math.max(0, Math.min(1 - (dBtoVolume(noise) * noiseMultiplier), 1))
  const newTime = Date.now()
  const delta = (newTime - lastTime) / 1000
  lastTime = newTime
  return tones.map(({ dB, note: { note } }) => {
    const valueMult = Math.max(0, Math.min(dBtoVolume(dB) * vibranceMultiplier, 1))
    const hsv = colorMap[note].clone()
    hsv.s *= saturationMult
    hsv.v *= valueMult

    hsv.s = (1 - minimumBrightness) * hsv.s
    hsv.v = 1 - ((1 - minimumBrightness) * (1 - hsv.v))

    const rgb = toRgb(hsv)
    const { h } = toHsv(new RGBa(
      smooth(rgb, 'r', delta, transitionSpeed),
      smooth(rgb, 'g', delta, transitionSpeed),
      smooth(rgb, 'b', delta, transitionSpeed),
    ))

    const hsva = new HSVa(
      h,
      smooth(hsv, 's', delta, transitionSpeed),
      smooth(hsv, 'v', delta, transitionSpeed),
    )

    if (monochrome) {
      const luminance = getLuminance(hsva)
      return toHsv(new HSLa(0, 0, luminance))
    }

    return hsva
  })
}
