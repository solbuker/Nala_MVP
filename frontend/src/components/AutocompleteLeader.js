import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

const AutocompleteLeader = ({ setFilter }) => {
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
      const response = await fetch(`http://localhost:3000/api/v1/employees?q[leader_cont]=${encodeURIComponent(inputValue)}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      const data = await response.json();

      if (active) {
        const uniqueLeaders = [...new Set(data.employees.map(emp => emp.leader))].map(leader => {
          return data.employees.find(emp => emp.leader === leader);
        });
        setOptions(uniqueLeaders);
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
        setFilter(newValue ? newValue.leader : '');
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.leader}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Buscar Líder"
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

export default AutocompleteLeader;
