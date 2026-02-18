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
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getFoodById, saveFood, updateFood } from '../../services/foodService'
import { useNavigate, useParams } from 'react-router-dom'
import { getServingsByFood } from '../../services/servingService'
import { Edit } from '@mui/icons-material'
import { getAllUnits } from '../../services/unitService'
import { getAllNutrients } from '../../services/nutrientService'
import { DisplayServing } from '../servings/DisplayServing'

export const FoodDetails = ({ currentUser }) => {
  const [foodObj, setFoodObj] = useState({})
  const [servings, setServings] = useState([])
  const [selectedServing, setSelectedServing] = useState()
  const [editName, setEditName] = useState(false)
  const [units, setUnits] = useState([])
  const [nutrients, setNutrients] = useState([])

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

  return (
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
          onChange={(e) => setSelectedServing(e.target.value)}
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
  )
}
