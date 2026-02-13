export const getMyPlans = (userId) => {
  return fetch(
    `http://localhost:8088/plans?userId=${userId}&_embed=planMeals`
  ).then((res) => res.json())
}

export const savePlan = (newPlan) => {
  return fetch(`http://localhost:8088/plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPlan),
  }).then((res) => res.json())
}

export const getPlanById = (planId) => {
  return fetch(`http://localhost:8088/plans/${planId}`).then((res) =>
    res.json()
  )
}

export const updatePlan = (planObj) => {
  return fetch(`http://localhost:8088/plans/${planObj.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(planObj),
  })
}

export const deletePlan = (planId) => {
  return fetch(`http://localhost:8088/plans/${planId}?_dependent=planMeals`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
