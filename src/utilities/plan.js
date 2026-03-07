import { getMyPlans, getPlanById } from '../services/planService'
import { attachPlanMeals } from './planMeals'

// takes planId and returns built plan object
export const buildPlan = async (planId) =>
  getPlanById(planId).then((planObj) =>
    attachPlanMeals(planObj).then((planObj) => planObj)
  )

// take a user id and return a list of the users plans with info attached
export const buildMyPlans = async (userId) => {
  return getMyPlans(userId).then((myPlans) =>
    Promise.all(myPlans.map((myPlan) => attachPlanMeals(myPlan))).then(
      (myPlans) => myPlans
    )
  )
}
