import { getMealFoodsById } from '../services/mealService'
import { attachFood } from './food'

// take a meal object and return a copy with mealFoods attached
export const attachMealFoods = async (mealObj) => {
  return {
    ...mealObj,
    mealFoods: await getMealFoodsById(mealObj.id).then((mealFoods) =>
      Promise.all(mealFoods.map((mealFood) => attachFood(mealFood))).then(
        (mealFoods) => mealFoods
      )
    ),
  }
}

// take in a built mealFood object and return calculated calories
export const calculateMealFoodCalories = (mealFoodObj) => {
  let calculatedCalories = -1
  const foundServing = mealFoodObj.food?.servings.find(
    (serving) =>
      serving.unitId === mealFoodObj.unitId &&
      serving.foodId === mealFoodObj.foodId
  )
  if (foundServing) {
    calculatedCalories =
      (foundServing.calories / foundServing.qty) * mealFoodObj.qty
  }
  return calculatedCalories
}
