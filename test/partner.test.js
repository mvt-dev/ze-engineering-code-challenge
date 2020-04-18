import http from 'http'
import supertest from 'supertest'
import app from '../src/server'

const mock = {
  id: 55,
  tradingName: 'Adega da Cerveja - Pinheiros',
  ownerName: 'Zé da Silva',
  document: '1432132123891/0005',
  coverageArea: {
    type: 'MultiPolygon', 
    coordinates: [
      [[[30, 20], [45, 40], [10, 40], [30, 20]]], 
      [[[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]]
    ]
  },
  address: { 
    type: 'Point',
    coordinates: [-46.57421, -21.785741]
  }
}

describe('Partner', () => {
  let server

  beforeAll((done) => {
    server = http.createServer(app)
    server.listen(done)
  })
  
  afterAll((done) => {
    server.close(done)
  })

  // Create
  it('Create', async () => {
    const res = await supertest(server)
      .post('/partner')
      .send(mock)
    expect(res.status).toBe(200)
    expect(res.body).toStrictEqual({ id: mock.id })
  })

  // Duplicate
  it('Duplicate', async () => {
    const res = await supertest(server)
      .post('/partner')
      .send(mock)
    expect(res.status).toBe(409)
  })

  // Get
  it('Get', async () => {
    const res = await supertest(server)
      .get('/partner/' + mock.id)
      .send(mock)
    expect(res.status).toBe(200)
    expect(res.body).toStrictEqual(mock)
  })

  // Search
  it('Search', async () => {
    const res = await supertest(server)
      .get('/partner')
      .query({ lng: mock.address.coordinates[0], lat: mock.address.coordinates[1] })
    expect(res.status).toBe(200)
  })
})
