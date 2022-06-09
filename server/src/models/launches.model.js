const launches = require('./launches.mongo')
const planets = require('./plantes.mongo')





const launch = {
    flightNumber: 100,
    mission: 'Kepler Exloration x',
    rocket: 'Expoer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['NASA', 'HATT'],
    upcoming: true,
    success: true,
}

saveLaunch(launch)



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

async function getAllLaunches() {
    return await launches.find({}, {
        '_id': 0, '__v': 0,
    })
}

async function saveLaunch(launch){
    const planet = await planets.findOne({
        kepler_name: launch.target,
    })

    if (!planet) {
        throw new Error('No matchin planet found')
    }
    
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true
    })
}

async function scheduleNewLaunch(launch){

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
    abortLaunchById
}