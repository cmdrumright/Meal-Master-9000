import { getPlanMealsByPlanId } from '../services/planMealService'
import { attachMeal } from './meal'

// Take in a plan id and retrun a planMeals array with food info embeded
export const attachPlanMeals = async (planObj) => {
  return {
    ...planObj,
    planMeals: await getPlanMealsByPlanId(planObj.id).then((planMeals) =>
      Promise.all(
        planMeals.map((planMeal) =>
          attachMeal(planMeal).then((planMeal) => planMeal)
        )
      ).then((planMeals) => planMeals)
    ),
  }
}
