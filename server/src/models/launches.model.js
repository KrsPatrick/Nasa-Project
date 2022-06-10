const axios = require('axios')

const launches = require('./launches.mongo')
const planets = require('./plantes.mongo')


async function populateLaunches() {
    const SPACE_X_URL = 'https://api.spacexdata.com/v4/launches/query'
    console.log("Load launches data...")
    const response = await axios.post(SPACE_X_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    })

    if (response.status !== 200) {
        console.log('Problem downloading data')
        throw new Error('Launch data download failed')
    }

    const launchDocs = response.data.docs
    for (const launchDoc of launchDocs ) {
        const payloads = launchDoc['payloads']
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            customers: customers,
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            
        }

        await saveLaunch(launch)
    }
}

async function loadLaunchData() {

    
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    })
    if (firstLaunch) {
        console.log('launch data already loaded')
        
    } else {
        await populateLaunches()
    }
    
}

async function findLaunch(filter) {
    return await launches.findOne(filter)
}

async function existsLaunchWithId(launchId) {
    return await launches.findOne({
        flightNumber: launchId,
    })
}

async function getLatestFligthNumber() {
    const DEFAULT_FLIGHT_NUMBER = 100
    const latestLaunch = await launches
    .findOne({})
    .sort('-flightNumber')

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
} 

async function getAllLaunches(skip, limit) {
    return await launches
    .find({}, {'_id': 0, '__v': 0,})
    .sort({flightNumber: 1})
    .skip(skip)
    .limit(limit)
}

async function saveLaunch(launch){    
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true
    })
}

async function scheduleNewLaunch(launch){

    const planet = await planets.findOne({
        kepler_name: launch.target,
    })

    if (!planet) {
        throw new Error('No matching planet found')
    }

    const newFlightNumber = await getLatestFligthNumber() + 1

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA'],
        flightNumber: newFlightNumber

    })

    await saveLaunch(newLaunch)
}



async function abortLaunchById(launchId){
    const aborted = await launches.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false,
    })

    return aborted.modifiedCount === 1
    
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
    loadLaunchData
}