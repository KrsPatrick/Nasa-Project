const request = require('supertest')
const app = require ('../../app')

describe('Test GET / launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
        .get('/launches')
        .expect('Content-Type', /json/)
        .expect(200);
      
    })
})

describe('Test POST / launches', () => {

    const data = {
        mission: 'irgendwos',
        rocket: 'wau',
        target: 'namek',
        launchDate: 'January 4, 2067'
    }

    const launchWithoutDate = {
        mission: 'irgendwos',
            rocket: 'wau',
            target: 'namek',
    }

    const launchDateWithInvalidDate = {
        mission: 'irgendwos',
        rocket: 'wau',
        target: 'namek',
        launchDate: 'noDate'
    }

    test('It should respond with 201 created', async () => {
        const response = await request(app)
        .post('/launches')
        .send(data)
        .expect(201)

    const requestDate = new Date(data.launchDate).valueOf()    
    const responseDate = new Date(response.body.launchDate).valueOf()
    expect(responseDate).toBe(requestDate)
   
    expect(response.body).toMatchObject(launchWithoutDate)
    })
    test('catch missing required properties', async () => {
        const response = await request(app)
        .post('/launches')
        .send(launchWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400)

    expect(response.body).toStrictEqual({
        
            error: 'Missing required launch property'
        
    })
    })
    test('catch invalid dates', async () => {
        const response = await request(app)
        .post('/launches')
        .send(launchDateWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400)

    expect(response.body).toStrictEqual({
        
            error: 'Invalid launch date'
        
    })
    })
})