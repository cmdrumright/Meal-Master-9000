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
import { getPlanById, updatePlan } from '../../services/planService'
import { useNavigate, useParams } from 'react-router-dom'
import {
  addPlanMeal,
  getPlanMealsByPlanId,
  updatePlanMeal,
} from '../../services/planMealService'
import { getDays, getTimeSlots } from '../../services/dayService'
import { getMyMeals } from '../../services/mealService'
import { buildPlan } from '../../utilities/plan'
import {
  calculateAverageDailyCalories,
  calculateDayCalories,
} from '../../utilities/calories'
import { calculateMealCalories } from '../../utilities/meal'

export const EditPlan = ({ currentUser }) => {
  const [myPlan, setMyPlan] = useState({})
  const [myMeals, setMyMeals] = useState([])
  const [myPlanMeals, setMyPlanMeals] = useState([])
  const [days, setDays] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [selectedSlots, setSelectedSlot] = useState([])
  const [openMealSelect, setOpenMealSelect] = useState(false)

  const { planId } = useParams()

  const navigate = useNavigate()

  // TODO replace get command with build command
  useEffect(() => {
    buildPlan(planId).then((planObj) => {
      if (planObj.userId === currentUser?.id) {
        setMyPlan(planObj)
        getMyMeals(currentUser.id).then(setMyMeals)
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
    let copy = { ...myPlan }
    delete copy.planMeals
    updatePlan(copy).then(() => {
      navigate(-1)
    })
  }

  // make a state to store checkboxes
  // loop through checkboxes
  // check if existing planMeal entry
  // replace or delete existing entries
  // add new entry if none

  const toggleSlot = (dayId, slotId) => {
    // copy array
    let copy = [...selectedSlots]
    // check if item exists
    const foundIndex = selectedSlots.findIndex(
      (slot) => slot.dayId === dayId && slot.slotId === slotId
    )
    if (foundIndex != -1) {
      copy.splice(foundIndex, 1)
    } else {
      copy.push({ dayId: dayId, slotId: slotId })
    }
    setSelectedSlot(copy)
  }

  const isChecked = (dayId, slotId) => {
    const foundIndex = selectedSlots.findIndex(
      (slot) => slot.dayId === dayId && slot.slotId === slotId
    )
    return foundIndex != -1 ? true : false
  }

  const handleClose = () => setOpenMealSelect(false)

  const handleListItemClick = (mealId) => {
    selectedSlots.forEach((slot) => {
      // check if existing planMeal and overwrite or add new
      const foundPlanMeal = myPlan.planMeals.find(
        (planMeal) =>
          planMeal.dayId === slot.dayId && planMeal.timeSlotId === slot.slotId
      )
      let newPlanMeal = {
        planId: +planId,
        mealId: mealId,
        dayId: slot.dayId,
        timeSlotId: slot.slotId,
      }
      if (foundPlanMeal) {
        newPlanMeal.id = foundPlanMeal.id
        updatePlanMeal(newPlanMeal).then(() => {
          buildPlan(planId).then(setMyPlan)
        })
      } else {
        addPlanMeal(newPlanMeal).then(() => {
          buildPlan(planId).then(setMyPlan)
        })
      }
    })
    setOpenMealSelect(false)
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
      <Typography sx={{ m: 2 }} variant="h6" component="div">
        {calculateAverageDailyCalories(myPlan.planMeals)} Average Daily Calories
      </Typography>
      {selectedSlots.length ? (
        <Button
          variant="contained"
          color="secondary"
          sx={{ m: 2 }}
          onClick={() => setOpenMealSelect((prev) => !prev)}
        >
          Change Meal
        </Button>
      ) : (
        ''
      )}
      <Box
        sx={{
          m: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {days.map((day) => {
          return (
            <div key={day.id}>
              <Typography variant="h5" component="div">
                {day.name}
                {': '}
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
                  const foundPlanMeal = myPlan.planMeals.find(
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
                        <Checkbox
                          checked={isChecked(day.id, timeSlot.id)}
                          onChange={() => {
                            toggleSlot(day.id, timeSlot.id)
                          }}
                          slotProps={{
                            input: { 'aria-label': 'controlled' },
                          }}
                        />
                      </CardContent>
                    </Card>
                  )
                })}
              </Box>
            </div>
          )
        })}
      </Box>
      <Dialog onClose={handleClose} open={openMealSelect}>
        <DialogTitle>Select Meal</DialogTitle>
        <List sx={{ pt: 0 }}>
          {myMeals.map((meal) => (
            <ListItem disablePadding key={meal.id}>
              <ListItemButton onClick={() => handleListItemClick(meal.id)}>
                <ListItemText primary={meal.name} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton autoFocus onClick={() => navigate('/meals/new')}>
              <ListItemText primary="New Meal" />
            </ListItemButton>
          </ListItem>
        </List>
      </Dialog>
    </>
  )
}
