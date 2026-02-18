import { Edit } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { updateServing } from '../../services/servingService'
import { updateServingNutrient } from '../../services/nutrientService'

export const DisplayServing = ({
  serving,
  units,
  nutrients,
  reloadServings,
}) => {
  const [editCalories, setEditCalories] = useState(false)
  const [newCalories, setNewCalories] = useState(0)
  const [nutrientIdToEdit, setNutrientIdtoEdit] = useState(0)
  const [updatedServingNutrient, setUpdatedServingNutrient] = useState({})

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

  const startNutrientEdit = (servingNutrient) => {
    setNutrientIdtoEdit(servingNutrient.id)
    setUpdatedServingNutrient({ ...servingNutrient })
  }

  const handleNutrientSubmit = (e) => {
    e.preventDefault()
    updateServingNutrient(updatedServingNutrient).then(() => {
      reloadServings()
      handleClose()
    })
  }

  const handleClose = () => {
    setNutrientIdtoEdit(0)
    setUpdatedServingNutrient({})
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
                <InputLabel htmlFor="calories">Calorie Amount</InputLabel>
                <Input
                  autoFocus={true}
                  id="calories"
                  value={newCalories}
                  onChange={handleChange}
                  required
                />
                <FormHelperText id="my-helper-text">
                  Please enter new calorie amount
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
            <Box key={servingNutrient.id} sx={{ display: 'flex' }}>
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
              <IconButton
                aria-label="edit"
                onClick={() => {
                  startNutrientEdit(servingNutrient)
                }}
              >
                <Edit />
              </IconButton>
            </Box>
          )
        })}
      </Box>
      <Dialog
        open={nutrientIdToEdit != 0}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Enter New Info'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleNutrientSubmit} id="edit-form">
            <InputLabel htmlFor="amount">Quantity</InputLabel>
            <Input
              autoFocus={true}
              id="amount"
              type="number"
              value={updatedServingNutrient.qty}
              onChange={(e) =>
                setUpdatedServingNutrient((prev) => ({
                  ...prev,
                  qty: +e.target.value,
                }))
              }
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="edit-form" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
