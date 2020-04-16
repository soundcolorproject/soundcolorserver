
const container = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
container.id = 'svg-container'
document.body.appendChild(container)

const requireSvg = require.context('./svg', true, /\.svg/)
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
    group.appendChild(child)
  })

  container.appendChild(group)

  return `#${name}`
}

export type IconName = keyof typeof iconOptions

export const iconOptions = {
  arrow_back: buildSvgContainer('arrow_back'),
  arrow_forward: buildSvgContainer('arrow_forward'),
  delete: buildSvgContainer('delete'),
  favorite_border: buildSvgContainer('favorite_border'),
  favorite: buildSvgContainer('favorite'),
  fullscreen: buildSvgContainer('fullscreen'),
  home: buildSvgContainer('home'),
  info: buildSvgContainer('info'),
  launch: buildSvgContainer('launch'),
  palette: buildSvgContainer('palette'),
  play: buildSvgContainer('play'),
  refresh: buildSvgContainer('refresh'),
  settings: buildSvgContainer('settings'),
  tune: buildSvgContainer('tune'),
  visibility_off: buildSvgContainer('visibility_off'),
}

export const iconNames = Object.keys(iconOptions) as IconName[]
