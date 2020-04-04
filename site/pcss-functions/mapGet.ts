import { logger } from '../../shared/logger'

const mapRgx = /^\s*\(((?:.|\n)*)\)\s*$/
const mapItemRgx = /^(\w+):\s*([^ ](?:.|\n)*)$/

export function mapGet (map: string, name: string) {
  const mapMatch = mapRgx.exec(map)
  if (!mapMatch) {
    throw new Error(`Input to mapGet is not a valid map: ${map}`)
  }

  const mapItems = mapMatch[1].trim().split(',').map(item => {
    const itemMatch = mapItemRgx.exec(item.trim())
    if (!itemMatch) {
      logger.warn(`Map item not valid: ${item}`)
      return undefined
    }

    return itemMatch.slice(1)
  }).filter(m => m !== undefined) as string[][]

  const matchedItem = mapItems.find(i => i[0] === name)

  if (!matchedItem) {
    logger.warn(`No map item with the name ${name} found in ${map}`)
    return ''
  } else {
    return matchedItem[1]
  }
}
