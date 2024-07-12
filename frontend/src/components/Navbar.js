import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ currUser, setCurrUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrUser(null);
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Vacation Portal
            </Link>
          </Typography>
        </Box>
        {currUser ? (
          <>
            <Button color="inherit" component={Link} to="/add-vacation">Añadir Vacaciones</Button>
            <Button color="inherit" component={Link} to="/add-employee">Añadir Empleado</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
