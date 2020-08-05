
import { addons } from '@storybook/addons'
import { create } from '@storybook/theming/create'

const customDark = create({
  base: 'dark',

  appBg: '#29333E',
  appContentBg: '#3A4857',
  barBg: '#1B2128',
  appBorderColor: '#6C7681',

  brandTitle: 'Sound Color Project',
  brandUrl: 'https://soundcolorproject.com/',
  brandImage: '/android-chrome-64x64.png',
})

addons.setConfig({
  theme: customDark,
})
