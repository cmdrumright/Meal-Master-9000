export const getMyMeals = (userId) => {
  return fetch(`http://localhost:8088/meals?userId=${userId}`).then((res) =>
    res.json()
  )
}

export const saveMeal = (newMeal) => {
  return fetch(`http://localhost:8088/meals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newMeal),
  })
}
