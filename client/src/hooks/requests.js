const API_URL = ''

async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/v1/planets`)
  return await response.json()
  // Load planets and return as JSON.
}

// TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/v1/launches`)
  const fetchedLaunches = await response.json()
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  })
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/v1/launches`, {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(launch),
    })
  } catch(err) {
    return {
      ok: false,
    }
  }
  
  // Submit given launch data to launch system.
}
// TODO: Once API is ready.
  // Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/v1/launches/${id}`, {
    method: "delete",
  })
  } catch(err) {
    console.log(err)
    return {
      ok: false,
    }
  }
  
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};