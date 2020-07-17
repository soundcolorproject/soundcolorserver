
import { requireSvg } from './requireSvg'

export type IconSize = keyof typeof iconSizes

export const iconSizes = {
  xxs: 12,
  xs: 16,
  sm: 20,
  med: 24,
  lg: 28,
  xl: 32,
  xxl: 36,
}

const container = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
container.appendChild(defs)
container.id = 'svg-container'
document.body.appendChild(container)

function buildSvgContainer (name: string) {
  const svgStr: string = requireSvg(`./${name}.svg`).default
  const svgContainer = document.createElement('div')
  svgContainer.innerHTML = svgStr

  const svg = svgContainer.children[0] as SVGSVGElement
  if (!svg) {
    return
  }

  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  group.id = name
  Array.from(svg.children).forEach(child => {
    if (child.nodeName === 'defs') {
      Array.from(child.children).forEach(def => {
        defs.appendChild(def)
      })
    } else {
      group.appendChild(child)
    }
  })

  container.appendChild(group)

  return `#${name}`
}

export type IconName = keyof typeof iconOptions

export const iconOptions = {
  about: buildSvgContainer('about'),
  arrow_back: buildSvgContainer('arrow_back'),
  arrow_forward: buildSvgContainer('arrow_forward'),
  colors: buildSvgContainer('colors'),
  connections: buildSvgContainer('connections'),
  delete: buildSvgContainer('delete'),
  download: buildSvgContainer('download'),
  favorite_border: buildSvgContainer('favorite_border'),
  favorite: buildSvgContainer('favorite'),
  fullscreen: buildSvgContainer('fullscreen'),
  home: buildSvgContainer('home'),
  info: buildSvgContainer('info'),
  launch: buildSvgContainer('launch'),
  logo: buildSvgContainer('logo'),
  minimize: buildSvgContainer('minimize'),
  music_note: buildSvgContainer('music_note'),
  palette: buildSvgContainer('palette'),
  patreon: buildSvgContainer('patreon'),
  pause_circle: buildSvgContainer('pause_circle'),
  pause: buildSvgContainer('pause'),
  play_circle: buildSvgContainer('play_circle'),
  play: buildSvgContainer('play'),
  refresh: buildSvgContainer('refresh'),
  settings: buildSvgContainer('settings'),
  stop_circle: buildSvgContainer('stop_circle'),
  tune: buildSvgContainer('tune'),
  visibility_off: buildSvgContainer('visibility_off'),
}

export interface IconProperties {
  fullWidth: number
  fullHeight: number
  marginWidth: number
  marginHeight: number
}

export type IconViewBox = {
  viewWidth: number
  viewHeight: number
}

export type IconSizeProperties = {
  [size in IconSize]?: IconProperties
}

export type IconViewProperties = IconViewBox & IconSizeProperties

const iconSizeNames = Object.keys(iconSizes) as IconSize[]
function buildIconSizes (iconWidth: number, iconTrueWidth: number, iconHeight = iconWidth, iconTrueHeight = iconTrueWidth) {
  const widthRatio = iconTrueWidth / iconWidth
  const heightRatio = iconTrueHeight / iconHeight
  const sizeProperties: IconViewProperties = {
    viewWidth: iconTrueWidth,
    viewHeight: iconTrueHeight,
  }

  iconSizeNames.forEach(sizeName => {
    const size = iconSizes[sizeName]
    const fullWidth = widthRatio * size
    const fullHeight = heightRatio * size
    sizeProperties[sizeName] = {
      fullWidth,
      fullHeight,
      marginWidth: (fullWidth - size) / 2,
      marginHeight: (fullHeight - size) / 2,
    }
  })

  return sizeProperties
}

const newIconSizes = buildIconSizes(16, 24)
export const iconProperties: { [icon in IconName]?: IconViewProperties } = {
  about: {
    ...newIconSizes,
  },
  arrow_back: {
    ...newIconSizes,
  },
  colors: {
    ...newIconSizes,
  },
  connections: {
    ...newIconSizes,
  },
  download: {
    ...newIconSizes,
  },
  fullscreen: {
    ...newIconSizes,
  },
  logo: {
    ...newIconSizes,
  },
  minimize: {
    ...newIconSizes,
  },
  music_note: {
    ...newIconSizes,
  },
  patreon: {
    ...buildIconSizes(100, 100, 96, 96),
  },
  pause_circle: {
    ...newIconSizes,
  },
  play: {
    ...newIconSizes,
  },
  play_circle: {
    ...newIconSizes,
  },
  stop_circle: {
    ...newIconSizes,
  },
  tune: {
    ...newIconSizes,
  },
  visibility_off: {
    ...newIconSizes,
  },
}

export const iconNames = Object.keys(iconOptions) as IconName[]
