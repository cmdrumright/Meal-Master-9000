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
  Checkbox,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getMyPlans, getPlanById, updatePlan } from '../../services/planService'
import { useNavigate, useParams } from 'react-router-dom'
import {
  addPlanMeal,
  getPlanMealsByPlanId,
  updatePlanMeal,
} from '../../services/planMealService'
import { getDays, getTimeSlots } from '../../services/dayService'
import { getMyMeals } from '../../services/mealService'
import {
  getActivePlanByUserId,
  setActivePlan,
} from '../../services/userService'
import { buildPlan } from '../../utilities/plan'
import { calculateMealFoodCalories } from '../../utilities/mealFood'
import { calculateMealCalories } from '../../utilities/meal'
import {
  calculateAverageDailyCalories,
  calculateDayCalories,
} from '../../utilities/calories'

export const CurrentPlan = ({ currentUser }) => {
  const [planId, setPlanId] = useState(0)
  const [myPlan, setMyPlan] = useState({})
  const [myPlans, setMyPlans] = useState([])
  const [myMeals, setMyMeals] = useState([])
  const [myPlanMeals, setMyPlanMeals] = useState([])
  const [days, setDays] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [selectedSlots, setSelectedSlot] = useState([])
  const [openPlanSelect, setOpenPlanSelect] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser.id) {
      getActivePlanByUserId(currentUser.id).then(setPlanId)
      getMyPlans(currentUser.id).then(setMyPlans)
    }
  }, [currentUser])

  useEffect(() => {
    if (planId > 0) {
      buildPlan(planId).then(setMyPlan)
      getPlanById(planId).then((planObj) => {
        // setMyPlan(planObj)
        getMyMeals(currentUser.id).then(setMyMeals)
        getPlanMealsByPlanId(planId).then(setMyPlanMeals)
        getDays().then(setDays)
        getTimeSlots().then(setTimeSlots)
      })
    }
  }, [planId])

  const handleListItemClick = (planId) => {
    setActivePlan(currentUser.id, planId).then(() => {
      getActivePlanByUserId(currentUser.id).then(setPlanId)
    })
    setOpenPlanSelect(false)
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        sx={{ m: 2 }}
        onClick={() => setOpenPlanSelect((prev) => !prev)}
      >
        Change Plan
      </Button>
      <Button
        variant="contained"
        color="secondary"
        sx={{ m: 2 }}
        onClick={() => navigate(`/plans/${planId}/edit`)}
      >
        Edit Plan
      </Button>
      <Typography variant="h4" component="div" sx={{ mx: 2 }}>
        {myPlan.name}
      </Typography>
      <Typography variant="h6" component="div" sx={{ mx: 2 }}>
        {calculateAverageDailyCalories(myPlan.planMeals)} Average Daily Calories
      </Typography>

      {/* Map days and timeSlots to get list of potential meal times */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          m: 2,
        }}
      >
        {days.map((day) => {
          return (
            <div key={day.id}>
              <Typography variant="h5" component="div">
                {day.name}
              </Typography>
              <Typography variant="h7" component="div">
                {calculateDayCalories(myPlan.planMeals, day.id)} Calories
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
                  const foundPlanMeal = myPlan.planMeals?.find(
                    (planMeal) =>
                      planMeal.dayId === day.id &&
                      planMeal.timeSlotId === timeSlot.id
                  )
                  return (
                    <Card key={timeSlot.id} sx={{ minWidth: 200, m: 1 }}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {timeSlot.name}
                        </Typography>
                        {foundPlanMeal ? (
                          <>
                            <Typography variant="body2">
                              {foundPlanMeal.meal.name}
                            </Typography>
                            <Typography variant="body2">
                              {calculateMealCalories(foundPlanMeal.meal)}{' '}
                              calories
                            </Typography>
                          </>
                        ) : (
                          ''
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </Box>
            </div>
          )
        })}
      </Box>
      <Dialog
        onClose={() => setOpenPlanSelect((prev) => !prev)}
        open={openPlanSelect}
      >
        <DialogTitle>Select Plan</DialogTitle>
        <List sx={{ pt: 0 }}>
          {myPlans.map((plan) => (
            <ListItem disablePadding key={plan.id}>
              <ListItemButton onClick={() => handleListItemClick(plan.id)}>
                <ListItemText primary={plan.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>
    </>
  )
}
