
import { dBtoVolume, MAX_TONES, ToneInfo } from '../audio/getAnalysis'
import { greyScale } from '../pcss-functions/getLuminance'
import { HSVa, toHsv } from '../pcss-functions/toHsv'
import { RGBa, toRgb } from '../pcss-functions/toRgb'
import { analysisStore } from '../state/analysisStore'
import { patternsStore } from '../state/patternsStore'

interface SmoothValues {
  s: number
  v: number
  r: number
  g: number
  b: number
}

interface Smoother {
  (color: RGBa | HSVa, key: keyof SmoothValues, delta: number, speed: number): number
}

function makeSmoother (): Smoother {
  const values: SmoothValues = {
    s: 0,
    v: 0,
    r: 0,
    g: 0,
    b: 0,
  }
  return function smooth (color, key, delta, speed) {
    const smoothingVal = (1 - speed) ** (delta)
    return values[key] = values[key] * smoothingVal + (color as any)[key] * (1 - smoothingVal)
  }
}

let smoothers: Smoother[]
function getSmoothers () {
  if (!smoothers) {
    smoothers = Array.from(Array(MAX_TONES)).map(makeSmoother)
  }

  return smoothers
}

function fillTones (tones: ToneInfo[]): ToneInfo[] {
  if (tones.length === 0) {
    return []
  }

  let output = [...tones]
  while (output.length < MAX_TONES) {
    output = [...output, ...tones]
  }

  return output.slice(0, MAX_TONES)
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
  return fillTones(tones).map(({ dB, note: { note } }, idx) => {
    const smooth = getSmoothers()[idx]
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
      // const luminance = getLuminance(hsva)
      return toHsv(greyScale(hsva))
    }

    return hsva
  })
}
