import { useEffect, useState } from 'react'
import { getMyMeals } from '../../services/mealService'
import { Box } from '@mui/material'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export const MealList = ({ currentUser }) => {
  const [myMeals, setMyMeals] = useState([])

  useEffect(() => {
    getMyMeals(currentUser.id).then(setMyMeals)
  }, [currentUser])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
        }}
      >
        {myMeals.map((meal) => {
          return (
            <Card key={meal.id} sx={{ minWidth: 275, m: 1 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {meal.name}
                </Typography>
                <Typography variant="body2">
                  {meal.calories} calories
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">edit</Button>
              </CardActions>
            </Card>
          )
        })}
      </Box>
    </>
  )
}
