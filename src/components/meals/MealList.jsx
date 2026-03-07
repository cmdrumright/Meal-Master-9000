import { useEffect, useState } from 'react'
import { Box, CardActionArea } from '@mui/material'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { buildMyMeals, calculateMealCalories } from '../../utilities/meal'

export const MealList = ({ currentUser }) => {
  const [myMeals, setMyMeals] = useState([])

  const navigate = useNavigate()

  const loadMeals = () => {
    buildMyMeals(currentUser.id).then(setMyMeals)
  }

  useEffect(() => {
    loadMeals()
  }, [currentUser])

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        sx={{ m: 1 }}
        onClick={() => navigate('new')}
      >
        New Meal
      </Button>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
        }}
      >
        {myMeals.map((meal) => {
          return (
            <Card
              key={meal.id}
              sx={{ minWidth: 275, m: 1 }}
              onClick={() => {
                navigate(`${meal.id}`)
              }}
            >
              <CardActionArea>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {meal.name}
                  </Typography>
                  <Typography variant="body2">
                    {calculateMealCalories(meal)} calories
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          )
        })}
      </Box>
    </>
  )
}
