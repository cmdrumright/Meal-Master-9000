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
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getFoodById, saveFood, updateFood } from '../../services/foodService'
import { useNavigate, useParams } from 'react-router-dom'
import { createServing, getServingsByFood } from '../../services/servingService'
import { Edit } from '@mui/icons-material'
import { getAllUnits } from '../../services/unitService'
import { getAllNutrients } from '../../services/nutrientService'
import { DisplayServing } from '../servings/DisplayServing'

export const FoodDetails = ({ currentUser }) => {
  const blankServing = {
    foodId: 0,
    qty: 0,
    unitId: '',
    calories: 0,
  }
  const [foodObj, setFoodObj] = useState({})
  const [servings, setServings] = useState([])
  const [selectedServing, setSelectedServing] = useState('')
  const [editName, setEditName] = useState(false)
  const [units, setUnits] = useState([])
  const [nutrients, setNutrients] = useState([])
  const [openNewServingMenu, setOpenNewServingMenu] = useState(false)
  const [newServing, setNewServing] = useState(blankServing)

  const { foodId } = useParams()

  const navigate = useNavigate()

  const reloadServings = () => {
    getServingsByFood(foodId).then(setServings)
  }

  useEffect(() => {
    getAllUnits().then(setUnits)
    getAllNutrients().then(setNutrients)
  }, [])

  useEffect(() => {
    if (currentUser.id) {
      getFoodById(foodId).then((foundFood) => {
        if (foundFood.userId === currentUser.id) {
          setFoodObj(foundFood)
          reloadServings()
        } else {
          navigate(-1)
        }
      })
    }
  }, [foodId, currentUser])

  const handleChange = (e) => {
    let copy = { ...foodObj }
    if (e.target.id === 'fname') {
      copy.name = e.target.value
    } else if (e.target.id === 'calories') {
      copy.calories = +e.target.value
    }
    setFoodObj(copy)
  }

  const handleNameSubmit = (e) => {
    e.preventDefault()
    updateFood(foodObj).then(() => {
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

  // handlers for New Serving Menu
  const handleNewServingClose = () => {
    setOpenNewServingMenu(false)
    setNewServing(blankServing)
  }

  const handleCreateServingSubmit = (e) => {
    e.preventDefault()
    createServing({ ...newServing, foodId: +foodId }).then((data) => {
      reloadServings()
      handleNewServingClose()
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
                <InputLabel htmlFor="fname">Food Name</InputLabel>
                <Input
                  autoFocus={true}
                  id="fname"
                  value={foodObj.name}
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
              <Typography variant="h3">{foodObj.name}</Typography>
              <IconButton aria-label="edit" onClick={() => setEditName(true)}>
                <Edit />
              </IconButton>
            </>
          )}
        </Box>
        <FormControl sx={{ m: 2 }}>
          <InputLabel id="demo-simple-select-label">Serving Size</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedServing}
            label="Serving Size"
            onChange={handleServingSelect}
          >
            {servings
              ? servings.map((serving) => {
                  return (
                    <MenuItem key={serving.id} value={serving.id}>
                      {serving.qty}{' '}
                      {units.find((unit) => unit.id === serving.unitId).name}
                    </MenuItem>
                  )
                })
              : ''}
            <MenuItem value={-1}>{'Add Serving Size'}</MenuItem>
          </Select>
        </FormControl>
        {selectedServing ? (
          <DisplayServing
            serving={servings.find((serving) => serving.id === selectedServing)}
            units={units}
            nutrients={nutrients}
            reloadServings={reloadServings}
          />
        ) : (
          ''
        )}
      </Box>

      {/* Dialog For creating a new servingNutrient */}
      <Dialog
        open={openNewServingMenu}
        onClose={handleNewServingClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Enter New Info'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleCreateServingSubmit} id="create-serving-form">
            {/* Selection box for unit */}
            <FormControl sx={{ m: 2 }}>
              <InputLabel id="unit-select-label">Units</InputLabel>
              <Select
                labelId="unit-select-label"
                id="unit-select"
                value={newServing.unitId}
                label="Units"
                onChange={(e) =>
                  setNewServing((prev) => ({
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
                value={newServing.qty}
                onChange={(e) =>
                  setNewServing((prev) => ({
                    ...prev,
                    qty: +e.target.value,
                  }))
                }
                required
              />
            </FormControl>
            {/* Input for Calories */}
            <FormControl sx={{ m: 2 }}>
              <InputLabel htmlFor="calories">Calories</InputLabel>
              <Input
                autoFocus={true}
                id="calories"
                type="number"
                value={newServing.calories}
                onChange={(e) =>
                  setNewServing((prev) => ({
                    ...prev,
                    calories: +e.target.value,
                  }))
                }
                required
              />
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewServingClose}>Cancel</Button>
          <Button type="submit" form="create-serving-form" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
