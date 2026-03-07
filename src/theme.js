import { createTheme } from '@mui/material/styles'
import { green, blue, red } from '@mui/material/colors'

// Create a theme instance.
export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: green[500],
        },
        secondary: {
          main: blue[500],
        },
        error: {
          main: red.A400,
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: green[500],
        },
        secondary: {
          main: blue[500],
        },
        error: {
          main: red.A400,
        },
      },
    },
  },
})
