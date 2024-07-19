import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ currUser, setCurrUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setCurrUser(null);
    navigate('/login');
  };

  console.log('Current User:', currUser);

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Portal de Vacaciones
            </Link>
          </Typography>
        </Box>
        {currUser ? (
          <>
            {currUser.is_leader && (
              <Button color="inherit" component={Link} to="/manage-requests" state={{ currentUser: currUser }}>
                Administrar solicitudes
              </Button>
            )}
            <Button color="inherit" component={Link} to="/request-vacation" state={{ currentUser: currUser }}>
              Solicitar vacaciones
            </Button>
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
