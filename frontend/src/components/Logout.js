import React from 'react';
import { Button } from '@mui/material';

const Logout = ({ setCurrUser }) => {
  const logout = async (setCurrUser) => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "delete",
        headers: {
          "content-type": "application/json",
          "authorization": localStorage.getItem("token")
        },
      });
      const data = await response.json();
      if (!response.ok) throw data.error;
      localStorage.removeItem("token");
      setCurrUser(null);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleClick = e => {
    e.preventDefault();
    logout(setCurrUser);
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleClick}
    >
      Logout
    </Button>
  );
};

export default Logout;
