import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { version } from '../package.json'
import partner from './routes/partner'

// Express
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

// Log requests
app.use((req, res, next) => {
  console.info(`${(new Date()).toISOString()} | ${req.method} ${req.originalUrl}`)
  next()
})

// Routes
const router = express.Router()
router.get('/version', (req, res) => res.send(version))
router.use('/partner', partner)
app.use('/', router)

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  res.status(400).send({ error: 'internal' })
})

// Error handler 404
app.use((req, res) => {
  res.status(404).send({ error: 'not-found' })
})

// Start server
const port = process.argv[2] ? process.argv[2] : 3000
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.info(`Server listening on port ${port}`))
}

export default app
