import { calculateMealCalories } from './meal'

// Take in array of plan meals and a day id, return total calories for that day
export const calculateDayCalories = (planMeals, dayId) => {
  return planMeals?.reduce(
    (total, planMeal) =>
      planMeal.dayId === dayId
        ? total + calculateMealCalories(planMeal.meal)
        : total,
    0
  )
}

// Take in array of plan meals and return average daily calories for the week
export const calculateAverageDailyCalories = (planMeals) =>
  Math.round(
    planMeals?.reduce(
      (total, planMeal) => total + calculateMealCalories(planMeal.meal),
      0
    ) / 7
  )
