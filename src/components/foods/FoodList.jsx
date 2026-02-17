import { useEffect, useState } from 'react'
import { deleteFood, getMyFoods } from '../../services/foodService'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

export const FoodList = ({ currentUser }) => {
  const [myFoods, setmyFoods] = useState([])
  const [idToDelete, setIdToDelete] = useState(0)

  const navigate = useNavigate()

  const loadFoods = () => {
    getMyFoods(currentUser.id).then(setmyFoods)
  }

  useEffect(() => {
    loadFoods()
  }, [currentUser])

  const handleClose = () => {
    setIdToDelete(0)
  }

  const handleDelete = () => {
    deleteFood(idToDelete).then(() => loadFoods())
    setIdToDelete(0)
  }

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        sx={{ m: 1 }}
        onClick={() => navigate('new')}
      >
        New Food
      </Button>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
        }}
      >
        {myFoods.map((food) => {
          return (
            <Card key={food.id} sx={{ minWidth: 275, m: 1 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {food.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => {
                    navigate(`${food.id}/edit`)
                  }}
                >
                  edit
                </Button>
                <Button size="small" onClick={() => setIdToDelete(food.id)}>
                  delete
                </Button>
              </CardActions>
            </Card>
          )
        })}
      </Box>

      <Dialog
        open={idToDelete != 0}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Please Confirm'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete this food?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Keep</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleDelete}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
