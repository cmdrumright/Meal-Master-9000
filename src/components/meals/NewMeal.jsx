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

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const newMeal = {
      name: mealName,
      userId: currentUser.id,
    }
    saveMeal(newMeal).then((data) => {
      navigate(`/meals/${data.id}`)
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
          Please enter a name for the meal.
        </FormHelperText>
      </FormControl>
      <Button variant="contained" color="primary" type="submit" sx={{ m: 2 }}>
        Save
      </Button>
    </form>
  )
}
