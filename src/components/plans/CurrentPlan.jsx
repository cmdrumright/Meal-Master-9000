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
      getPlanById(planId).then((planObj) => {
        setMyPlan(planObj)
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
      <Typography variant="h3" component="div">
        {myPlan.name}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        sx={{ m: 2 }}
        onClick={() => navigate(`/plans/${planId}/edit`)}
      >
        Edit Plan
      </Button>
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
                    <Card key={timeSlot.id} sx={{ minWidth: 200, m: 1 }}>
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
