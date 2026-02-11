import {
  Input,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getPlanById, updatePlan } from '../../services/planService'
import { useNavigate, useParams } from 'react-router-dom'
import { getPlanMealsByPlanId } from '../../services/planMealService'
import { getDays, getTimeSlots } from '../../services/dayService'

export const EditPlan = ({ currentUser }) => {
  const [myPlan, setMyPlan] = useState({})
  const [myPlanMeals, setMyPlanMeals] = useState([])
  const [days, setDays] = useState([])
  const [timeSlots, setTimeSlots] = useState([])

  const { planId } = useParams()

  const navigate = useNavigate()

  useEffect(() => {
    getPlanById(planId).then((planObj) => {
      if (planObj.userId === currentUser?.id) {
        setMyPlan(planObj)
        getPlanMealsByPlanId(planId).then(setMyPlanMeals)
        getDays().then(setDays)
        getTimeSlots().then(setTimeSlots)
      }
    })
  }, [currentUser])

  const handleChange = (e) => {
    let copy = { ...myPlan }
    if (e.target.id === 'pname') {
      copy.name = e.target.value
    }
    setMyPlan(copy)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updatePlan(myPlan).then(() => {
      navigate(-1)
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ m: 2 }}>
          <InputLabel htmlFor="pname">Plan Name</InputLabel>
          <Input
            autoFocus={true}
            id="pname"
            value={myPlan.name}
            onChange={handleChange}
            required
          />
          <FormHelperText id="my-helper-text">
            Please enter a name for the plan.
          </FormHelperText>
        </FormControl>
        <Button variant="contained" color="primary" type="submit" sx={{ m: 2 }}>
          Save
        </Button>
      </form>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {days.map((day) => {
          return (
            <div key={day.id}>
              <Typography variant="h4" component="div">
                {day.name}
              </Typography>
              <Box
                key={day.id}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-evenly',
                }}
              >
                {timeSlots.map((timeSlot) => {
                  const mealInfo = myPlanMeals.find(
                    (planMeal) =>
                      planMeal.dayId === day.id &&
                      planMeal.timeSlotId === timeSlot.id
                  )
                  return (
                    <Card key={timeSlot.id} sx={{ minWidth: 100, m: 1 }}>
                      <CardContent>
                        <Typography variant="h5" component="div">
                          {timeSlot.name}
                        </Typography>
                        <Typography variant="body2">
                          {mealInfo?.meal.name}
                        </Typography>
                        <Typography variant="body2">
                          {mealInfo?.meal.calories} calories
                        </Typography>
                      </CardContent>
                    </Card>
                  )
                })}
              </Box>
            </div>
          )
        })}
      </Box>
    </>
  )
}
