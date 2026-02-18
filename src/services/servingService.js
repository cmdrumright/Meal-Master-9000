export const getServingsByFood = (foodId) => {
  return fetch(
    `http://localhost:8088/servings?foodId=${foodId}&_embed=servingNutrients`
  ).then((res) => res.json())
}

// export const saveServing = (newFood) => {
//   return fetch(`http://localhost:8088/foods`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(newFood),
//   }).then((res) => res.json())
// }
//
// export const getFoodById = (foodId) => {
//   return fetch(`http://localhost:8088/foods/${foodId}`).then((res) =>
//     res.json()
//   )
// }
//
export const updateServing = (servingObj) => {
  return fetch(`http://localhost:8088/servings/${servingObj.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(servingObj),
  })
}
//
// export const deleteFood = (foodId) => {
//   return fetch(`http://localhost:8088/Foods/${foodId}?_dependent=planFoods`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
// }
