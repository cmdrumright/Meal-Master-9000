export const getPlanMealsByPlanId = (planId) => {
  return fetch(
    `http://localhost:8088/planmeals?planId=${planId}&_expand=meal`
  ).then((res) => res.json())
}

export const addPlanMeal = (newPlanMeal) => {
  return fetch(`http://localhost:8088/planmeals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPlanMeal),
  })
}

export const updatePlanMeal = (planMealObj) => {
  return fetch(`http://localhost:8088/planmeals/${planMealObj.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(planMealObj),
  })
}
