import {
  Input,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getPlanById, updatePlan } from '../../services/planService'
import { useNavigate, useParams } from 'react-router-dom'

export const EditPlan = ({ currentUser }) => {
  const [myPlan, setMyPlan] = useState({})

  const { planId } = useParams()

  const navigate = useNavigate()

  useEffect(() => {
    getPlanById(planId).then((planObj) => {
      if (planObj.userId === currentUser?.id) {
        setMyPlan(planObj)
      }
    })
  }, [currentUser])

  const handleChange = (e) => {
    let copy = { ...myPlan }
    if (e.target.id === 'pname') {
      copy.name = e.target.value
    }
    setMyPlan(copy)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updatePlan(myPlan).then(() => {
      navigate(-1)
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ m: 2 }}>
          <InputLabel htmlFor="pname">Plan Name</InputLabel>
          <Input
            autoFocus={true}
            id="pname"
            value={myPlan.name}
            onChange={handleChange}
            required
          />
          <FormHelperText id="my-helper-text">
            Please enter a name for the plan.
          </FormHelperText>
        </FormControl>
        <Button variant="contained" color="primary" type="submit" sx={{ m: 2 }}>
          Save
        </Button>
      </form>
    </>
  )
}
