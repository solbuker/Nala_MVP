import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import { fetchWithAuth } from '../Utils';

const VacationShow = () => {
  const { employeeId, vacationId } = useParams();
  const [vacation, setVacation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVacation = async () => {
      try {
        const response = await fetchWithAuth(`http://localhost:3000/api/v1/employees/${employeeId}/vacations/${vacationId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setVacation(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchVacation();
  }, [employeeId, vacationId]);

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!vacation) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Container>
      <Box my={4}>
        <Paper elevation={3}>
          <Box p={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Detalles de las vacaciones
            </Typography>
            <Divider />
            <Box my={2}>
              <Typography variant="body1" gutterBottom>
                <strong>Empleado:</strong> {vacation.employee.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Fechas:</strong> {vacation.start_date} - {vacation.end_date}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Tipo:</strong> {vacation.vacation_type}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Motivo:</strong> {vacation.motive}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Status:</strong> {vacation.status}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default VacationShow;
