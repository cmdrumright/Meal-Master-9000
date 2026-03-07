import { getMealById, getMyMeals } from '../services/mealService'
import { attachMealFoods, calculateMealFoodCalories } from './mealFood'

// take mealPlan object and return copy with Meal attached
export const attachMeal = async (mealPlanObj) => {
  return {
    ...mealPlanObj,
    meal: await getMealById(mealPlanObj.mealId).then((mealObj) =>
      attachMealFoods(mealObj).then((mealObj) => mealObj)
    ),
  }
}

// take in a built meal object and return total calories
export const calculateMealCalories = (mealObj) => {
  return mealObj.mealFoods.reduce(
    (total, mealFood) => total + calculateMealFoodCalories(mealFood),
    0
  )
}

// take a user id and return a list of the users meals with info attached
export const buildMyMeals = async (userId) => {
  return getMyMeals(userId).then((myMeals) =>
    Promise.all(myMeals.map((myMeal) => attachMealFoods(myMeal))).then(
      (myMeals) => myMeals
    )
  )
}

// take meal id and return meal object with info attached
export const buildMealById = (mealId) =>
  getMealById(mealId).then((mealObj) =>
    attachMealFoods(mealObj).then((mealObj) => mealObj)
  )
