# ze-engineering-code-challenge
Ze Backend Challenge REST API

## Install
Before installing, download and install Node.js. Node.js 6 or higher is required.

```bash
$ npm install
```
## Run
To run the API in development mode, run:

```bash
$ npm run dev
```

The server should start listening on the port `3000`.

## REST API

### Get Partner

Request

    GET /partner/${id}

Response

```
{
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
```

### Create Partner

Request

    POST /partner

```
{
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
```

Response

```
{
  id: 55
}
```

### Search Partner

Request

    GET /partner?lng=${lng}&lat=${lat}

Response

```
{
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
```

## Tests
To run the test suite, first install the dependencies, then run:

```bash
$ npm run test
```

## Deploy
To build the API first run:

```bash
$ npm run build
```

After that, the build is available on the dist folder and can be easly be a part of a container or standalone
