const request = require('supertest')
const app = require ('../../app')
const { loadPlanetsData } = require('../../models/planets.model')
const { mongoConnect, mongoDisconnect } = require('../../services/mongo')

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect()
        await loadPlanetsData()
    })

    afterAll(async () => {
        await mongoDisconnect()
    })

    describe('Test GET / launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
      
    })
})

describe('Test POST / launches', () => {

    const data = {
        mission: 'irgendwos',
        rocket: 'wau',
        target: 'Kepler-62 f',
        launchDate: 'January 4, 2067'
    }

    const launchWithoutDate = {
        mission: 'irgendwos',
            rocket: 'wau',
            target: 'Kepler-62 f',
    }

    const launchDateWithInvalidDate = {
        mission: 'irgendwos',
        rocket: 'wau',
        target: 'Kepler-62 f',
        launchDate: 'noDate'
    }

    test('It should respond with 201 created', async () => {
        const response = await request(app)
        .post('/v1/launches')
        .send(data)
        .expect(201)

    const requestDate = new Date(data.launchDate).valueOf()    
    const responseDate = new Date(response.body.launchDate).valueOf()
    expect(responseDate).toBe(requestDate)
   
    expect(response.body).toMatchObject(launchWithoutDate)
    })
    test('catch missing required properties', async () => {
        const response = await request(app)
        .post('/v1/launches')
        .send(launchWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400)

    expect(response.body).toStrictEqual({
        
            error: 'Missing required launch property'
        
    })
    })
    test('catch invalid dates', async () => {
        const response = await request(app)
        .post('/v1/launches')
        .send(launchDateWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400)

    expect(response.body).toStrictEqual({
        
            error: 'Invalid launch date'
        
    })
    })
})
})

