import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { fetchEmployeesList, fetchWithAuth } from '../Utils';

const AddVacation = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vacationType, setVacationType] = useState('');
  const [motive, setMotive] = useState('');
  const [employees, setEmployees] = useState([]);
  const [status, setStatus] = useState([]);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployeesList();
        setEmployees(data.employees);
      } catch (error) {
        console.error('Error:', error);
        if (error.message === 'Unauthorized') {
          window.location.href = '/login';
        }
      }
    };
    loadEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth(`http://localhost:3000/api/v1/employees/${employeeId}/vacations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({start_date: startDate, end_date: endDate, vacation_type: vacationType, motive: motive, status: status})
      });
      if (!response.ok) {
        throw new Error('No se pudo agregar');
      }
      alert('Los datos se cargaron correctamente!');
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo agregar');
      if (error.message === 'Unauthorized') {
        window.location.href = '/login';
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Añadir vacaciones
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="employee-label">Empleado</InputLabel>
          <Select
            labelId="employee-label"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          >
            {employees.map(employee => (
              <MenuItem key={employee.id} value={employee.id}>
                {employee.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          Agregar vacaciones
        </Button>
      </form>
    </Container>
  );
};

export default AddVacation;
