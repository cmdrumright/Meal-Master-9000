import { Edit } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'

export const DisplayServing = ({ serving, units, nutrients }) => {
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
          <Typography variant="h6">Calories: {serving.calories}</Typography>
          <IconButton aria-label="edit" onClick={() => {}}>
            <Edit />
          </IconButton>
        </Box>
        {serving.servingNutrients.map((servingNutrient) => {
          return (
            <Box key={servingNutrient.id}>
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
            </Box>
          )
        })}
      </Box>
    </>
  )
}
