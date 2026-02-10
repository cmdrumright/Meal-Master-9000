import { useEffect, useState } from 'react'
import { getMyPlans, savePlan } from '../../services/planService'
import { getMyMeals } from '../../services/mealService'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const PlanList = ({ currentUser }) => {
  const [myPlans, setMyPlans] = useState([])
  const [myMeals, setMyMeals] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    getMyPlans(currentUser.id).then(setMyPlans)
    getMyMeals(currentUser.id).then(setMyMeals)
  }, [currentUser])

  const calculatePlanAverage = (planMeals) => {
    // for each meal in array, find meal calories and add to average
    let calorieTotal = 0
    for (const planMeal of planMeals) {
      calorieTotal += myMeals.find(
        (myMeal) => myMeal.id === planMeal.mealId
      )?.calories
    }
    return Math.round(calorieTotal / 7)
  }

  const handleNew = () => {
    const newPlan = {
      name: 'New Plan',
      userId: currentUser.id,
    }
    savePlan(newPlan).then((data) => {
      navigate(`${data.id}/edit`)
    })
  }

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        sx={{ m: 1 }}
        onClick={handleNew}
      >
        New Plan
      </Button>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
        }}
      >
        {myPlans.map((plan) => {
          return (
            <Card key={plan.id} sx={{ minWidth: 275, m: 1 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {plan.name}
                </Typography>
                <Typography variant="body2">
                  {calculatePlanAverage(plan.planMeals)} daily calories
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => {
                    navigate(`${plan.id}/edit`)
                  }}
                >
                  edit
                </Button>
              </CardActions>
            </Card>
          )
        })}
      </Box>
    </>
  )
}
