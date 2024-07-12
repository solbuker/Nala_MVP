import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

const AutocompleteEmployee = ({ setFilter }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions([]);
      setFilter('');
      return undefined;
    }

    setLoading(true);

    (async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/employees?q[name_cont]=${encodeURIComponent(inputValue)}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      const data = await response.json();

      if (active) {
        const uniqueEmployees = [...new Set(data.employees.map(emp => emp.name))].map(name => {
          return data.employees.find(emp => emp.name === name);
        });
        setOptions(uniqueEmployees);
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [inputValue, setFilter]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={selectedValue}
      onChange={(event, newValue) => {
        setSelectedValue(newValue);
        setFilter(newValue ? newValue.name : '');
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Buscar empleado"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default AutocompleteEmployee;
