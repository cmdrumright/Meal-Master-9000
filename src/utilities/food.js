import { getFoodById } from '../services/foodService'
import { attachServings } from './serving'

// Take a mealFood object and return a copy with food info attached
export const attachFood = async (mealFoodObj) => {
  return {
    ...mealFoodObj,
    food: await getFoodById(mealFoodObj.foodId).then((foodObj) =>
      attachServings(foodObj).then((foodObj) => foodObj)
    ),
  }
}
