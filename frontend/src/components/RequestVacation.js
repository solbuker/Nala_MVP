import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { fetchWithAuth } from '../Utils';

const RequestVacation = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vacationType, setVacationType] = useState('');
  const [motive, setMotive] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const userId = localStorage.getItem('userId');

      const response = await fetchWithAuth(`http://localhost:3000/api/v1/users/${userId}/vacations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          vacation_type: vacationType,
          motive: motive,
          status: 'Pendiente'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData);
        return;
      }

      setSuccess('Solicitación exitosa');
      setStartDate('');
      setEndDate('');
      setVacationType('');
      setMotive('');
    } catch (error) {
      setErrors({ general: [error.message] });
    }
  };

  return (
    <Container>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Solicitar vacaciones
        </Typography>
        {success && <Typography color="success">{success}</Typography>}
        {errors.general && errors.general.map((msg, idx) => (
          <Typography key={idx} color="error">
            {msg}
          </Typography>
        ))}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Fecha de inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.start_date}
            helperText={errors.start_date ? errors.start_date.join(', ') : ''}
          />
          <TextField
            label="Fecha de fin"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.end_date}
            helperText={errors.end_date ? errors.end_date.join(', ') : ''}
          />
          <TextField
            label="Tipo de vacaciones"
            value={vacationType}
            onChange={(e) => setVacationType(e.target.value)}
            required
            fullWidth
            margin="normal"
            error={!!errors.vacation_type}
            helperText={errors.vacation_type ? errors.vacation_type.join(', ') : ''}
          />
          <TextField
            label="Motivo"
            value={motive}
            onChange={(e) => setMotive(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.motive}
            helperText={errors.motive ? errors.motive.join(', ') : ''}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Solicitar vacaciones
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RequestVacation;
