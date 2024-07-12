import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { fetchWithAuth } from '../Utils';

const EditEmployee = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [leader, setLeader] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetchWithAuth(`http://localhost:3000/api/v1/employees/${employeeId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const employee = await response.json();
        setName(employee.name);
        setEmail(employee.email);
        setLeader(employee.leader);
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedEmployee = { name, email, leader };
    try {
      const response = await fetchWithAuth(`http://localhost:3000/api/v1/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee),
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
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 4 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Empleado
        </Typography>
        <TextField
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Líder"
          value={leader}
          onChange={(e) => setLeader(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Guardar Cambios
        </Button>
      </Box>
    </Container>
  );
};

export default EditEmployee;
