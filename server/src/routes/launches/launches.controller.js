const {getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById} = require('../../models/launches.model')

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches())
}

function httpAddNewLaunch(req, res) {
    const launch = req.body

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({ // equal to return {'message': 'message', HTTPStatus.BADREQUEST} 
            error: 'Missing required launch property'
        })
    }
    launch.launchDate = new Date(launch.launchDate)
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        })
    }
    addNewLaunch(launch)
    return res.status(201).json(launch)
}

function httpDeleteLaunch(req, res){
    const launchID = +req.params.id

    if (!existsLaunchWithId(launchID)){
    return res.status(404).json({
        error: 'launch not found'
    })}

    const aborted = abortLaunchById(launchID)
    return res.status(200).json(aborted)

}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpDeleteLaunch
}