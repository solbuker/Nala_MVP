import React, { useState, useEffect } from 'react';
import { Button, Grid, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/v1/users/dashboard/me', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      if (!response.ok) {
        throw new Error('Error');
      }
      const data = await response.json();
      setCurrentUser(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentUser) {
    return <div>Cargando...</div>;
  }

  const MyVacations = () => {
    navigate('/my-vacations', { state: { currentUser } });
  };

  const EmployeesVacations = () => {
    navigate('/employees-vacations', { state: { currentUser } });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {currentUser.is_leader ? (
          <>
            <Grid item xs={12} md={6} lg={4}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: 2,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <Button variant="text" color="primary" onClick={MyVacations} fullWidth>
                  Mis vacaciones
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: 2,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <Button variant="text" color="primary" onClick={EmployeesVacations} fullWidth>
                  Vacaciones de empleados
                </Button>
              </Box>
            </Grid>
          </>
        ) : (
          <Grid item xs={12} md={6} lg={4}>
            <Box
              sx={{
                p: 3,
                bgcolor: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: 2,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <Button variant="text" color="primary" onClick={MyVacations} fullWidth>
                Mis vacaciones
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
