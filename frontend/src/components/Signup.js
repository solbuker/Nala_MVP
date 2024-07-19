import React, { useRef, useState } from 'react';
import { TextField, Button, Container, Typography, Link, Box } from '@mui/material';

const Signup = ({ setCurrUser, setShow }) => {
  const formRef = useRef();
  const [error, setError] = useState(null);

  const mapBackendErrors = (errors) => {
    if (!errors || errors.length === 0) return 'An error occurred';

    const filteredErrors = errors.filter(error =>
      !error.includes("Name can't be blank")
    );

    const maxErrorsToShow = 2;
    return filteredErrors.slice(0, maxErrorsToShow).join(', ');
  };

  const signup = async (userInfo, setCurrUser) => {
    const url = "http://localhost:3000/signup";
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userInfo)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(mapBackendErrors(data.errors));
      }

      localStorage.setItem('token', response.headers.get("Authorization"));
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
    signup(userInfo, setCurrUser);
    e.target.reset();
  };

  const handleClick = e => {
    e.preventDefault();
    setShow(true);
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
          Signup
        </Typography>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>} {/* Display error messages */}
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
          Signup
        </Button>
      </Box>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Si ya está registrado, <Link href="#login" onClick={handleClick}>Login</Link>
      </Typography>
    </Container>
  );
};

export default Signup;
