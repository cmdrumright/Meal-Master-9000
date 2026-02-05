import {
  Input,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
} from '@mui/material'
import { useState } from 'react'
import { saveMeal } from '../../services/mealService'
import { useNavigate } from 'react-router-dom'

export const NewMeal = ({ currentUser }) => {
  const [mealName, setMealName] = useState('')
  const [calories, setCalories] = useState(0)

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const newMeal = {
      name: mealName,
      calories: calories,
      userId: currentUser.id,
    }
    saveMeal(newMeal).then((res) => {
      navigate(-1)
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ m: 2 }}>
        <InputLabel htmlFor="mname">Meal Name</InputLabel>
        <Input
          autoFocus={true}
          id="mname"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          required
        />
        <FormHelperText id="my-helper-text">
          Please enter your first name.
        </FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 2 }}>
        <InputLabel htmlFor="calories">Calories</InputLabel>
        <Input
          id="calories"
          type="number"
          value={calories}
          onChange={(e) => setCalories(parseInt(e.target.value))}
        />
        <FormHelperText id="my-helper-text">
          Please enter your last name.
        </FormHelperText>
      </FormControl>{' '}
      <Button variant="contained" color="primary" type="submit" sx={{ m: 2 }}>
        Save
      </Button>
    </form>
  )
}
