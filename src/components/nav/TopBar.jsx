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
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

export const TopBar = (currentUser) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorNav, setAnchorNav] = useState(null);
  const { mode, setMode, systemMode } = useColorScheme();

  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNavMenu = (event) => {
    setAnchorNav(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseNav = () => {
    setAnchorNav(null);
  };

  const logout = () => {
    localStorage.removeItem("learning_user");
    navigate("/login", { replace: true });
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
          onClick={() => navigate("/")}
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <HomeIcon />
        </IconButton>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleNavMenu}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-navbar"
          anchorEl={anchorNav}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorNav)}
          onClose={handleCloseNav}
        >
          <MenuItem onClick={() => navigate("/meals")}>Meals</MenuItem>
        </Menu>
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
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};
