export const getPlanMealsByPlanId = (planId) => {
  return fetch(
    `http://localhost:8088/planmeals?planId=${planId}&_expand=meal`
  ).then((res) => res.json())
}
