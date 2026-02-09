import {
  Input,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getMealById, saveMeal, updateMeal } from '../../services/mealService'
import { useNavigate, useParams } from 'react-router-dom'

export const EditMeal = ({ currentUser }) => {
  const [mealObj, setMealObj] = useState({})

  const { mealId } = useParams()

  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser.id) {
      getMealById(mealId).then((foundMeal) => {
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
    } else if (e.target.id === 'calories') {
      copy.calories = +e.target.value
    }
    setMealObj(copy)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateMeal(mealObj).then((res) => {
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
          value={mealObj.name}
          onChange={handleChange}
          required
        />
        <FormHelperText id="my-helper-text">
          Please enter a name for the meal.
        </FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 2 }}>
        <InputLabel htmlFor="calories">Calories</InputLabel>
        <Input
          id="calories"
          type="number"
          value={mealObj.calories}
          onChange={handleChange}
        />
        <FormHelperText id="my-helper-text">
          Please enter the total calories for the meal.
        </FormHelperText>
      </FormControl>{' '}
      <Button variant="contained" color="primary" type="submit" sx={{ m: 2 }}>
        Save
      </Button>
    </form>
  )
}
