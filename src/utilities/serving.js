import { getServingsByFood } from '../services/servingService'

export const attachServings = async (foodObj) => {
  return {
    ...foodObj,
    servings: await getServingsByFood(foodObj.id),
  }
}
