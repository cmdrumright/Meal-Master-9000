import { Edit } from '@mui/icons-material'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { updateServing } from '../../services/servingService'

export const DisplayServing = ({
  serving,
  units,
  nutrients,
  reloadServings,
}) => {
  const [editCalories, setEditCalories] = useState(false)
  const [newCalories, setNewCalories] = useState(0)

  const handleChange = (e) => {
    setNewCalories(+e.target.value)
  }

  const handleCalorieSubmit = (e) => {
    e.preventDefault()
    let servingCopy = { ...serving }
    servingCopy.calories = newCalories
    delete servingCopy.servingNutrients
    updateServing(servingCopy).then(() => {
      reloadServings()
      setEditCalories(false)
    })
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          m: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          {editCalories ? (
            <form onSubmit={handleCalorieSubmit}>
              <FormControl sx={{ m: 2 }}>
                <InputLabel htmlFor="fname">Food Name</InputLabel>
                <Input
                  autoFocus={true}
                  id="fname"
                  value={newCalories}
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
              <Typography variant="h6">Calories: {serving.calories}</Typography>
              <IconButton
                aria-label="edit"
                onClick={() => {
                  setEditCalories(true)
                  setNewCalories(serving.calories)
                }}
              >
                <Edit />
              </IconButton>
            </>
          )}
        </Box>
        {serving.servingNutrients.map((servingNutrient) => {
          return (
            <Box key={servingNutrient.id}>
              <Typography variant="body1">
                {
                  nutrients.find(
                    (nutrient) => nutrient.id === servingNutrient.nutrientId
                  ).name
                }
                {': '}
                {servingNutrient.qty}{' '}
                {units.find((unit) => unit.id === servingNutrient.unitId).name}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </>
  )
}
