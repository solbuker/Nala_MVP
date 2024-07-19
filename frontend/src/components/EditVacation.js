import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import { fetchWithAuth } from '../Utils';

const EditVacation = () => {
  const { userId, vacationId } = useParams();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vacationType, setVacationType] = useState('');
  const [motive, setMotive] = useState('');
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchVacation = async () => {
      try {
        const response = await fetchWithAuth(`http://localhost:3000/api/v1/users/${userId}/vacations/${vacationId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          setErrors(errorData);
          throw new Error('Error fetching vacation data');
        }
        const vacation = await response.json();
        setStartDate(vacation.start_date);
        setEndDate(vacation.end_date);
        setVacationType(vacation.vacation_type);
        setMotive(vacation.motive);
        setStatus(vacation.status);
      } catch (error) {
        console.error('Error:', error);
        setErrors({ general: [error.message] });
      }
    };

    fetchVacation();
  }, [userId, vacationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const updatedVacation = { start_date: startDate, end_date: endDate, vacation_type: vacationType, motive: motive, status: status };
    try {
      const response = await fetchWithAuth(`http://localhost:3000/api/v1/users/${userId}/vacations/${vacationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVacation),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData);
        return;
      }
      setSuccess('Los cambios se guardaron correctamente!');
      navigate('/');
    } catch (error) {
      setErrors({ general: [error.message] });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this vacation?')) {
      try {
        const response = await fetchWithAuth(`http://localhost:3000/api/v1/users/${userId}/vacations/${vacationId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to delete vacation');
        }
        alert('Vacation deleted successfully!');
        navigate('/');
      } catch (error) {
        console.error('Error:', error);
        setErrors({ general: [error.message] });
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Editar vacaciones
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
          label="Tipo"
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
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Estado</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Estado"
          >
            <MenuItem value="Aprobado">Aprobado</MenuItem>
            <MenuItem value="Rechazado">Rechazado</MenuItem>
            <MenuItem value="Pendiente">Pendiente</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Actualizar vacaciones
        </Button>
        <Box sx={{ mt: 2 }}>
          <Button onClick={handleDelete} variant="contained" color="error" fullWidth>
            Eliminar vacaciones
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default EditVacation;
