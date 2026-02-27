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
  }).then((res) => res.json())
}

export const getMealById = (mealId) => {
  return fetch(`http://localhost:8088/meals/${mealId}`).then((res) =>
    res.json()
  )
}

export const updateMeal = (mealObj) => {
  return fetch(`http://localhost:8088/meals/${mealObj.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mealObj),
  })
}

export const deleteMeal = (mealId) => {
  return fetch(
    `http://localhost:8088/meals/${mealId}?_dependent=planMeals&_dependent=mealFoods`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

// Meal Foods functions

export const getMealFoodsById = (mealId) => {
  return fetch(
    `http://localhost:8088/mealFoods/?mealId=${mealId}&_expand=food&_expand=unit`
  ).then((res) => res.json())
}

export const addMealFood = (newMealFood) => {
  return fetch(`http://localhost:8088/mealFoods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newMealFood),
  })
}
