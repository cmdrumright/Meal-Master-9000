export const getUserByEmail = (email) => {
  return fetch(`http://localhost:8088/users?email=${email}`).then((res) =>
    res.json()
  )
}

export const createUser = (user) => {
  return fetch('http://localhost:8088/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  }).then((res) => res.json())
}

export const getActivePlanByUserId = (userId) => {
  return fetch(`http://localhost:8088/users/${userId}`).then((res) =>
    res.json().then((data) => data.activePlanId)
  )
}

export const setActivePlan = (userId, planId) => {
  return fetch(`http://localhost:8088/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ activePlanId: planId }),
  }).then((res) => res.json())
}
