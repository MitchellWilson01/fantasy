import { csv } from 'd3'
import dataESPN from '../assets/datasets/regular_ppr.csv'

export const readDataset = async () => {
  const data = await csv(dataESPN)
  data.map((player) => {
    player.isDrafted = false
    return player
  })
  return data
}