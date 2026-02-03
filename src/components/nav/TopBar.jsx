// Displays the top bar for the application
// Shows a logo on the left and a burger for the sidebar if needed
// Shows a user Icon on the right that brings up the user menu

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

import { useState } from "react";
import { Lightbulb } from "@mui/icons-material";
import { useColorScheme } from "@mui/material";

export const TopBar = (currentUser) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { mode, setMode, systemMode } = useColorScheme();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTheme = () => {
    if (mode == "system") {
      if (systemMode == "light") {
        setMode("dark");
      } else {
        setMode("light");
      }
    } else if (mode == "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Meals
        </Typography>
        <div>
          <IconButton
            size="large"
            aria-label="theme toggle"
            onClick={handleTheme}
          >
            <Lightbulb />
          </IconButton>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};
