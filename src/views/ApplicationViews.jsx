import { useEffect } from 'react'
import { useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import { TopBar } from '../components/nav/TopBar'
import { MealList } from '../components/meals/MealList'
import { NewMeal } from '../components/meals/NewMeal'
import { EditMeal } from '../components/meals/EditMeal'
import { PlanList } from '../components/plans/PlanList'

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
        <Route index element={<>Welcome</>} />
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
        </Route>
      </Route>
    </Routes>
  )
}
