import { useEffect } from 'react'
import { useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import { TopBar } from '../components/nav/TopBar'
import { MealList } from '../components/meals/MealList'
import { NewMeal } from '../components/meals/NewMeal'
import { EditMeal } from '../components/meals/EditMeal'
import { PlanList } from '../components/plans/PlanList'
import { EditPlan } from '../components/plans/EditPlan'
import { CurrentPlan } from '../components/plans/CurrentPlan'
import { FoodList } from '../components/foods/FoodList'
import { NewFood } from '../components/foods/NewFood'
import { EditFood } from '../components/foods/EditFood'

export const ApplicationViews = () => {
  const [currentUser, setCurrentUser] = useState({})

  useEffect(() => {
    const localLearningUser = localStorage.getItem('meal-master_user')
    const learningUserObject = JSON.parse(localLearningUser)
    setCurrentUser(learningUserObject)
  }, [])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <TopBar currentUser={currentUser} />
            <Outlet />
          </>
        }
      >
        <Route index element={<CurrentPlan currentUser={currentUser} />} />
        <Route path="meals" element={<Outlet />}>
          <Route index element={<MealList currentUser={currentUser} />} />
          <Route path="new" element={<NewMeal currentUser={currentUser} />} />
          <Route path=":mealId">
            <Route
              path="edit"
              element={<EditMeal currentUser={currentUser} />}
            />
          </Route>
        </Route>
        <Route path="plans">
          <Route index element={<PlanList currentUser={currentUser} />} />
          <Route
            path=":planId/edit"
            element={<EditPlan currentUser={currentUser} />}
          />
        </Route>
        <Route path="foods" element={<Outlet />}>
          <Route index element={<FoodList currentUser={currentUser} />} />
          <Route path="new" element={<NewFood currentUser={currentUser} />} />
          <Route
            path=":foodId/edit"
            element={<EditFood currentUser={currentUser} />}
          />
        </Route>
      </Route>
    </Routes>
  )
}
