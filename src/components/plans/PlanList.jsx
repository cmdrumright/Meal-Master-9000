import { useEffect, useState } from 'react'
import { deletePlan, getMyPlans, savePlan } from '../../services/planService'
import { getMyMeals } from '../../services/mealService'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const PlanList = ({ currentUser }) => {
  const [myPlans, setMyPlans] = useState([])
  const [myMeals, setMyMeals] = useState([])
  const [idToDelete, setIdToDelete] = useState(0)

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

  const handleClose = () => {
    setIdToDelete(0)
  }

  const handleDelete = () => {
    deletePlan(idToDelete).then(() => {
      getMyPlans(currentUser.id).then(setMyPlans)
    })
    setIdToDelete(0)
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
                <Button size="small" onClick={() => setIdToDelete(plan.id)}>
                  delete
                </Button>
              </CardActions>
            </Card>
          )
        })}
      </Box>
      <Dialog
        open={idToDelete != 0}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Please Confirm'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete this plan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Keep</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleDelete}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
