import {
  Input,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material'
import { useEffect, useState } from 'react'
import {
  deleteFood,
  getFoodById,
  getMyFoods,
  updateFood,
} from '../../services/foodService'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteServing } from '../../services/servingService'
import { AddBox, Delete, Edit } from '@mui/icons-material'
import { getAllUnits } from '../../services/unitService'
import { updateMeal, addMealFood, deleteMeal } from '../../services/mealService'
import { buildMealById, calculateMealCalories } from '../../utilities/meal'
import { calculateMealFoodCalories } from '../../utilities/mealFood'

export const MealDetails = ({ currentUser }) => {
  const blankMealFood = {
    mealId: 0,
    foodId: 0,
    qty: 0,
    unitId: '',
  }
  const [mealObj, setMealObj] = useState({ mealFoods: [] })
  const [myFoods, setMyFoods] = useState([])
  const [selectedServing, setSelectedServing] = useState('')
  const [editName, setEditName] = useState(false)
  const [units, setUnits] = useState([])
  const [openNewServingMenu, setOpenNewServingMenu] = useState(false)
  const [newMealFood, setNewMealFood] = useState(blankMealFood)
  const [openAddFood, setOpenAddFood] = useState(false)
  const [openFoodDelete, setOpenMealDelete] = useState(false)
  const [openServingDelete, setOpenServingDelete] = useState(false)

  const { mealId } = useParams()

  const navigate = useNavigate()

  const loadMeal = () => {
    buildMealById(mealId).then(setMealObj)
  }

  useEffect(() => {
    getAllUnits().then(setUnits)
  }, [])

  useEffect(() => {
    if (currentUser.id) {
      getMyFoods(currentUser.id).then(setMyFoods)
      buildMealById(mealId).then((foundMeal) => {
        if (foundMeal.userId === currentUser.id) {
          setMealObj(foundMeal)
        } else {
          navigate(-1)
        }
      })
    }
  }, [mealId, currentUser])

  const handleChange = (e) => {
    let copy = { ...mealObj }
    if (e.target.id === 'mname') {
      copy.name = e.target.value
    }
    setMealObj(copy)
  }

  const handleNameSubmit = (e) => {
    e.preventDefault()
    let copy = { ...mealObj }
    delete copy.mealFoods
    updateMeal(copy).then(() => {
      setEditName(false)
    })
  }

  const handleServingSelect = (e) => {
    const selectValue = e.target.value
    if (selectValue === -1) {
      setOpenNewServingMenu(true)
    } else {
      setSelectedServing(selectValue)
    }
  }

  // handlers for adding food
  const handleAddFoodClose = () => {
    setOpenAddFood(false)
    setNewMealFood(blankMealFood)
  }

  const handleAddFoodSubmit = (e) => {
    e.preventDefault()
    addMealFood({ ...newMealFood, mealId: +mealId }).then(() => {
      loadMeal()
      handleAddFoodClose()
    })
  }

  // handlers for Meal Delete Menu
  const handleDeleteClose = () => {
    setOpenMealDelete(false)
  }

  const handleMealDelete = () => {
    deleteMeal(+mealId).then(() => {
      navigate(-1)
    })
  }

  // handlers for serving Delete Menu
  const handleServingDeleteClose = () => {
    setOpenServingDelete(false)
  }

  const handleServingDelete = () => {
    deleteServing(selectedServing).then(() => {
      handleServingDeleteClose()
      setSelectedServing('')
    })
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            m: 2,
          }}
        >
          {editName ? (
            <form onSubmit={handleNameSubmit}>
              <FormControl sx={{ m: 2 }}>
                <InputLabel htmlFor="mname">Food Name</InputLabel>
                <Input
                  autoFocus={true}
                  id="mname"
                  value={mealObj.name}
                  onChange={handleChange}
                  required
                />
                <FormHelperText id="my-helper-text">
                  Please enter a name for the food.
                </FormHelperText>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ m: 2 }}
              >
                Save
              </Button>
            </form>
          ) : (
            <>
              <Typography variant="h3">{mealObj.name}</Typography>
              <IconButton aria-label="edit" onClick={() => setEditName(true)}>
                <Edit />
              </IconButton>
            </>
          )}
          <IconButton
            aria-label="delete"
            onClick={() => setOpenMealDelete(true)}
          >
            <Delete />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 2,
          }}
        >
          <Typography variant="h5">
            Total Calories: {calculateMealCalories(mealObj)}
          </Typography>
          {mealObj.mealFoods.length
            ? mealObj.mealFoods.map((mealFood) => {
                return (
                  <Typography key={mealFood.id}>
                    {mealFood.food.name}
                    {': '}
                    {mealFood.qty} {mealFood.unit.name}
                    {': '}
                    {calculateMealFoodCalories(mealFood)}
                  </Typography>
                )
              })
            : ''}
          <IconButton
            aria-label="add-food"
            onClick={() => {
              setOpenAddFood(true)
            }}
          >
            <AddBox />
          </IconButton>
        </Box>
      </Box>

      {/* TODO replace with food add. Dialog For creating a new servingNutrient */}
      <Dialog
        open={openAddFood}
        onClose={handleAddFoodClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Enter New Info'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddFoodSubmit} id="add-food-form">
            {/* Selection box for food */}
            <FormControl sx={{ m: 2 }}>
              <InputLabel id="food-select-label">Food</InputLabel>
              <Select
                labelId="food-select-label"
                id="food-select"
                value={newMealFood.foodId}
                label="Food"
                onChange={(e) =>
                  setNewMealFood((prev) => ({
                    ...prev,
                    foodId: +e.target.value,
                  }))
                }
                required
              >
                {myFoods.map((food) => {
                  return (
                    <MenuItem key={food.id} value={food.id}>
                      {food.name}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
            {/* Selection box for unit */}
            <FormControl sx={{ m: 2 }}>
              <InputLabel id="unit-select-label">Units</InputLabel>
              <Select
                labelId="unit-select-label"
                id="unit-select"
                value={newMealFood.unitId}
                label="Units"
                onChange={(e) =>
                  setNewMealFood((prev) => ({
                    ...prev,
                    unitId: +e.target.value,
                  }))
                }
                required
              >
                {units.map((unit) => {
                  return (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
            {/* Input for Quantity */}
            <FormControl sx={{ m: 2 }}>
              <InputLabel htmlFor="qty">Quantity</InputLabel>
              <Input
                autoFocus={true}
                id="qty"
                type="number"
                value={newMealFood.qty}
                onChange={(e) =>
                  setNewMealFood((prev) => ({
                    ...prev,
                    qty: +e.target.value,
                  }))
                }
                required
              />
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddFoodClose}>Cancel</Button>
          <Button type="submit" form="add-food-form" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog to Delete Meal */}
      <Dialog
        open={openFoodDelete}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Please Confirm'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete this food?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Keep</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleMealDelete}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog to Delete Serving */}
      <Dialog
        open={openServingDelete}
        onClose={handleServingDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Please Confirm'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete this serving?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleServingDeleteClose}>Keep</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleServingDelete}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
