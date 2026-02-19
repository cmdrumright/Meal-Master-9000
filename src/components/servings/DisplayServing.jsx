import { AddBox, Edit } from '@mui/icons-material'
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
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { updateServing } from '../../services/servingService'
import {
  createServingNutrient,
  updateServingNutrient,
} from '../../services/nutrientService'

export const DisplayServing = ({
  serving,
  units,
  nutrients,
  reloadServings,
}) => {
  const blankServingNutrient = {
    servingId: 0,
    nutrientId: 0,
    qty: 0,
    unitId: 0,
  }
  const [editCalories, setEditCalories] = useState(false)
  const [newCalories, setNewCalories] = useState(0)
  const [nutrientIdToEdit, setNutrientIdtoEdit] = useState(0)
  const [updatedServingNutrient, setUpdatedServingNutrient] = useState({})
  const [newServingNutrient, setNewServingNutrient] =
    useState(blankServingNutrient)
  const [openCreateNutrient, setOpenCreateNutrient] = useState(false)

  useEffect(() => {
    setEditCalories(false)
  }, [serving])

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

  // handlers for create ServingNutrient Dialog

  const handleCreateNutrientClose = () => {
    setOpenCreateNutrient(false)
    setNewServingNutrient(blankServingNutrient)
  }

  const handleCreateNutrientSubmit = (e) => {
    e.preventDefault()
    createServingNutrient({
      ...newServingNutrient,
      servingId: serving.id,
    }).then(() => {
      handleCreateNutrientClose()
      reloadServings()
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
        <IconButton
          aria-label="new nutrient"
          onClick={() => {
            setOpenCreateNutrient(true)
          }}
        >
          <AddBox />
        </IconButton>
      </Box>

      {/* Dialog for updating a servingNutrient */}
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

      {/* Dialog For creating a new servingNutrient */}
      <Dialog
        open={openCreateNutrient}
        onClose={handleCreateNutrientClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Enter New Info'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleCreateNutrientSubmit} id="create-nutrient-form">
            {/* Selection box for nutrient, filtered to exclude existing nutrients */}
            <FormControl sx={{ m: 2 }}>
              <InputLabel id="nutrient-select-label">Nutrient</InputLabel>
              <Select
                labelId="nutrient-select-label"
                id="nutrient-select"
                value={newServingNutrient.nutrientId}
                label="Nutrient"
                onChange={(e) =>
                  setNewServingNutrient((prev) => ({
                    ...prev,
                    nutrientId: +e.target.value,
                  }))
                }
                required
              >
                {nutrients
                  .filter(
                    (nutrient) =>
                      !serving.servingNutrients.some(
                        (servingNutrient) =>
                          servingNutrient.nutrientId === nutrient.id
                      )
                  )
                  .map((nutrient) => {
                    return (
                      <MenuItem key={nutrient.id} value={nutrient.id}>
                        {nutrient.name}
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
                value={newServingNutrient.unitId}
                label="Units"
                onChange={(e) =>
                  setNewServingNutrient((prev) => ({
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
            <FormControl sx={{ m: 2 }}>
              <InputLabel htmlFor="qty">Quantity</InputLabel>
              <Input
                autoFocus={true}
                id="qty"
                type="number"
                value={newServingNutrient.qty}
                onChange={(e) =>
                  setNewServingNutrient((prev) => ({
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
          <Button onClick={handleCreateNutrientClose}>Cancel</Button>
          <Button type="submit" form="create-nutrient-form" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
