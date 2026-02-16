import {
  Input,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveFood } from '../../services/foodService'

export const NewFood = ({ currentUser }) => {
  const [foodName, setFoodName] = useState('')

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const newFood = {
      name: foodName,
      userId: currentUser.id,
    }
    saveFood(newFood).then((data) => {
      navigate(`/foods/${data.id}/edit`)
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ m: 2 }}>
        <InputLabel htmlFor="mname">Food Name</InputLabel>
        <Input
          autoFocus={true}
          id="mname"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          required
        />
        <FormHelperText id="my-helper-text">
          Please enter a name for the food.
        </FormHelperText>
      </FormControl>
      <Button variant="contained" color="primary" type="submit" sx={{ m: 2 }}>
        Create
      </Button>
    </form>
  )
}
