export const getMyFoods = (userId) => {
  return fetch(`http://localhost:8088/Foods?userId=${userId}`).then((res) =>
    res.json()
  )
}

export const saveFood = (newFood) => {
  return fetch(`http://localhost:8088/foods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newFood),
  }).then((res) => res.json())
}

export const getFoodById = (foodId) => {
  return fetch(`http://localhost:8088/foods/${foodId}`).then((res) =>
    res.json()
  )
}

export const updateFood = (foodObj) => {
  return fetch(`http://localhost:8088/foods/${foodObj.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(foodObj),
  })
}

export const deleteFood = (foodId) => {
  return fetch(`http://localhost:8088/Foods/${foodId}?_dependent=planFoods`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
