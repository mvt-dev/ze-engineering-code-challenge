import express from 'express'
import Joi from '@hapi/joi'
import { get, find, create, search } from '../models/partner'

const router = express.Router()

// Search nearest partner
router.get('/', (req, res, next) => {
  try {
    // Validate request
    const { error, value } = Joi.object({
      lng: Joi.number().required(),
      lat: Joi.number().required()
    }).validate(req.query)
    if (error) {
      console.warn(error)
      return res.status(422).send({ error: 'validation', fields: [...error.details.map(x => x.path[0])] })
    }
    // Search partner
    const partner = search(value.lng, value.lat)
    res.send(partner)
  } catch (err) {
    next(err)
  }
})

// Get partner
router.get('/:id', (req, res, next) => {
  try {
    // Validate request
    const { error, value } = Joi.object({
      id: Joi.number().integer().required()
    }).validate(req.params)
    if (error) {
      console.warn(error)
      return res.status(422).send({ error: 'validation', fields: [...error.details.map(x => x.path[0])] })
    }
    // Get partner
    const partner = get(value.id)
    res.send(partner)
  } catch (err) {
    next(err)
  }
})

// Create partner
router.post('/', (req, res, next) => {
  try {
    // Validate request
    const { error, value } = Joi.object({
      id: Joi.number().integer().allow(null),
      tradingName: Joi.string().empty('').required(),
      ownerName: Joi.string().empty('').required(),
      document: Joi.string().regex(/^\d{13}\/\d{4}$/).required(),
      coverageArea: Joi.object({
        type: Joi.string().valid('MultiPolygon').required(),
        coordinates: Joi.array().min(1)
      }),
      address: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().items(Joi.number()).min(2).max(2)
      })
    }).validate(req.body)
    if (error) {
      console.warn(error)
      return res.status(422).send({ error: 'validation', fields: [...error.details.map(x => x.path[0])] })
    }
    // Check if already exists
    const found = find(value.id, value.document)
    if (found) {
      const fields = []
      if (found.id === value.id) fields.push('id')
      if (found.document === value.document) fields.push('document')
      console.warn(`Duplicate resource ${JSON.stringify(fields)}`)
      return res.status(409).send({ error: 'duplicate', fields })
    }
    // Get partner
    const id = create(
      value.id,
      value.tradingName,
      value.ownerName,
      value.document,
      value.coverageArea,
      value.address
    )
    res.send({ id })
  } catch (err) {
    next(err)
  }
})

export default router
