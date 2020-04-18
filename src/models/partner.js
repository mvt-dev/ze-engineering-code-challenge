import fs from 'fs'
import path from 'path'
import { point, polygon, distance, booleanPointInPolygon } from '@turf/turf'

let partners = []

/**
 * Get data from json file
 * @return {array} Partners[]
 */
const getData = () => {
  if (partners.length) return partners
  const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'pdvs.json')))
  partners = data.pdvs
  return partners
}

/**
 * Save data to json file
 */
const saveData = () => {
  const data = JSON.stringify({ pdvs: partners }, null, 2)
  fs.writeFile(path.join(process.cwd(), 'data', 'pdvs.json'), data, (error) => {
    if (error) console.error(error)
  })
}

/**
 * Get next available id
 * @return {number} ID
 */
const getNextId = () => {
  const data = getData().sort((a, b) => Number(a) - Number(b))
  return Number(data[data.length - 1].id) + 1
}

/**
 * Get partner by id
 * @param {number} id ID
 * @return {object} Partner
 */
const get = (id) => {
  const partner = getData().find(x => Number(x.id) === Number(id))
  return partner
}

/**
 * Find partner by id or document
 * @param {number} id ID
 * @param {string} document Document
 * @return {object} Partner
 */
const find = (id, document) => {
  return getData().find(x => x.id === id || x.document === document)
}

/**
 * Find partner by id or document
 * @param {number} [id] ID
 * @param {string} tradingName Trading Name
 * @param {string} ownerName Owner Name
 * @param {string} document Document
 * @param {object} coverageArea Coverage Area
 * @param {object} address Address
 * @return {number} ID
 */
const create = (
  id,
  tradingName,
  ownerName,
  document,
  coverageArea,
  address
) => {
  const newId = id ? id : getNextId()
  getData().push({
    id: newId,
    tradingName,
    ownerName,
    document,
    coverageArea,
    address
  })
  saveData()
  return newId
}

/**
 * Search nearest partner
 * @param {number} lng Longitude
 * @param {number} lat Latitude
 * @return {object} Partner
 */
const search = (lng, lat) => {
  const data = getData().map(x => {
    // Calculate distance
    x.distance = distance(point([lng, lat]), point(x.address.coordinates))
    // Check if is inside coverage
    x.inside = booleanPointInPolygon(point([lng, lat]), polygon(x.coverageArea.coordinates[0]))
    return x
  })
  const found = data.filter(x => x.inside).sort((a, b) => a.distance - b.distance)
  if (found.length === 0) return {}
  delete found[0].distance
  delete found[0].inside
  return found[0]
}

export {
  get,
  find,
  create,
  search
}
