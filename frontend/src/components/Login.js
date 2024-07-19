import React, { useRef, useState } from 'react';
import { TextField, Button, Container, Typography, Link, Box } from '@mui/material';

const Login = ({ setCurrUser, setShow }) => {
  const formRef = useRef();
  const [error, setError] = useState(null); // State to store error messages

  const login = async (userInfo, setCurrUser) => {
    const url = "http://localhost:3000/login";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userInfo)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error');
      }

      localStorage.setItem("token", response.headers.get("Authorization"));
      localStorage.setItem("userId", data.id);
      setCurrUser(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);
    const userInfo = {
      "user": {
        email: data.email,
        password: data.password
      }
    };
    login(userInfo, setCurrUser);
    e.target.reset();
  };

  const handleClick = e => {
    e.preventDefault();
    setShow(false);
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
          Login
        </Typography>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>} {}
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
          label="Password"
          type="password"
          name="password"
          placeholder="Password"
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
          Login
        </Button>
      </Box>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Si no está registrado, <Link href="#signup" onClick={handleClick}>Signup</Link>
      </Typography>
    </Container>
  );
};

export default Login;
