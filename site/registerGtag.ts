
const globalGtagConfig = {
  app_id: 'com.soundcolorproject.www',
  app_name: 'SoundColorProject',
  app_version: __BUILD_VERSION__,
}

gtag('config', 'G-RJKV4XFL4G', globalGtagConfig)

window.gtagPatched = function (command: GtagCommand, two: GtagSecondParam, three?: GtagThirdParam) {
  if (command === 'event') {
    if (typeof three === 'object') {
      three = Object.assign(three, globalGtagConfig)
    } else {
      three = Object.assign({}, globalGtagConfig)
    }
  }

  (gtag as any)(command, two, three)
}

type GtagCommand = 'config' | 'set' | 'js' | 'event'
type GtagSecondParam = string | Gtag.CustomParams | Date
type GtagThirdParam = Gtag.ControlParams | Gtag.EventParams | Gtag.CustomParams
