import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { fetchWithAuth } from '../Utils';

const EditVacation = () => {
  const { employeeId, vacationId } = useParams();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vacationType, setVacationType] = useState('');
  const [motive, setMotive] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchVacation = async () => {
      try {
        const response = await fetchWithAuth(`http://localhost:3000/api/v1/employees/${employeeId}/vacations/${vacationId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Error');
        }
        const vacation = await response.json();
        setStartDate(vacation.start_date);
        setEndDate(vacation.end_date);
        setVacationType(vacation.vacation_type);
        setMotive(vacation.motive);
        setStatus(vacation.status); // Aquí establecemos el valor de status
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchVacation();
  }, [employeeId, vacationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedVacation = { start_date: startDate, end_date: endDate, vacation_type: vacationType, motive: motive, status: status };
    try {
      const response = await fetchWithAuth(`http://localhost:3000/api/v1/employees/${employeeId}/vacations/${vacationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVacation),
      });
      if (!response.ok) {
        throw new Error('No se pudo actualizar');
      }
      alert('Los cambios se guardaron correctamente!');
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo actualizar');
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Vacation
      </Typography>
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
        />
        <TextField
          label="Tipo"
          value={vacationType}
          onChange={(e) => setVacationType(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Motivo"
          value={motive}
          onChange={(e) => setMotive(e.target.value)}
          fullWidth
          margin="normal"
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
      </form>
    </Container>
  );
};

export default EditVacation;
