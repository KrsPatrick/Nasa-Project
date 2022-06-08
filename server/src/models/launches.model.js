const launches = new Map()

let latestFlightNumer = 100

const launch = {
    flightNumer: 100,
    mission: 'Kepler Exloration x',
    rocket: 'Expoer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['NASA', 'HATT'],
    upcoming: true,
    success: true,
}

launches.set(launch.flightNumer, launch) 

function existsLaunchWithId(launchId) {
    return launches.has(launchId)
}

function getAllLaunches() {
    return Array.from(launches.values())
}

function addNewLaunch(launch) {
    latestFlightNumer++
    launches.set(latestFlightNumer, Object.assign(launch, {
        upcoming: true,
        success: true,
        customers: ['ZTM', 'NASA'],
        flightNumer: latestFlightNumer,
    }))
}

function abortLaunchById(launchId){
    const aborted = launches.get(launchId)
    aborted.upcoming = false
    aborted.success = false
    return aborted
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById
}