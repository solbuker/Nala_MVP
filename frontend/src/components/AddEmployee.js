import React, { useRef } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { fetchWithAuth } from '../Utils'; // Asegúrate de importar correctamente
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const formRef = useRef();
  const navigate = useNavigate();

  const addEmployee = async (employeeInfo) => {
    const url = "http://localhost:3000/api/v1/employees";
    try {
      const response = await fetchWithAuth(url, {
        method: 'post',
        headers: {
          "content-type": 'application/json',
          "accept": 'application/json'
        },
        body: JSON.stringify(employeeInfo)
      });
      if (!response.ok) throw new Error('Error al añadir el empleado');
      alert('Empleado añadido correctamente');
      navigate('/'); // Redirigir a la página principal
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);
    const employeeInfo = {
      "employee": { name: data.name, email: data.email, leader: data.leader }
    };
    addEmployee(employeeInfo);
    e.target.reset();
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        ref={formRef}
        onSubmit={handleSubmit}
        sx={{ mt: 4 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Añadir Empleado
        </Typography>
        <TextField
          label="Nombre"
          name="name"
          placeholder="Nombre"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          type="email"
          name="email"
          placeholder="Email"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Líder"
          name="leader"
          placeholder="Líder"
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
          Añadir Empleado
        </Button>
      </Box>
    </Container>
  );
};

export default AddEmployee;
