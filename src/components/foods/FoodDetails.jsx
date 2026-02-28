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
import { deleteFood, getFoodById, updateFood } from '../../services/foodService'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createServing,
  deleteServing,
  getServingsByFood,
} from '../../services/servingService'
import { Delete, Edit } from '@mui/icons-material'
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
  const [openFoodDelete, setOpenFoodDelete] = useState(false)
  const [openServingDelete, setOpenServingDelete] = useState(false)

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
    createServing({ ...newServing, foodId: +foodId }).then(() => {
      reloadServings()
      handleNewServingClose()
    })
  }

  // handlers for Food Delete Menu
  const handleDeleteClose = () => {
    setOpenFoodDelete(false)
  }

  const handleFoodDelete = () => {
    for (const serving of servings) {
      deleteServing(serving.id)
    }
    deleteFood(+foodId).then(() => {
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
      reloadServings()
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
          <IconButton
            aria-label="delete"
            onClick={() => setOpenFoodDelete(true)}
          >
            <Delete />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            m: 2,
          }}
        >
          <FormControl fullWidth sx={{ m: 2 }}>
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
            <IconButton
              aria-label="delete"
              onClick={() => setOpenServingDelete(true)}
            >
              <Delete />
            </IconButton>
          ) : (
            ''
          )}
        </Box>
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

      {/* Dialog For creating a new serving */}
      <Dialog
        open={openNewServingMenu}
        onClose={handleNewServingClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Enter New Info'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleCreateServingSubmit} id="create-serving-form">
            <Box sx={{ m: 1 }}>
              {/* Selection box for unit */}
              <FormControl fullWidth sx={{ my: 2 }}>
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
              <FormControl fullWidth sx={{ my: 2 }}>
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
              <FormControl fullWidth sx={{ my: 2 }}>
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
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewServingClose}>Cancel</Button>
          <Button type="submit" form="create-serving-form" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog to Delete Food */}
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
            onClick={handleFoodDelete}
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
