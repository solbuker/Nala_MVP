import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Box,
  Checkbox,
  FormControlLabel
} from '@mui/material';

const MyVacations = () => {
  const [vacations, setVacations] = useState([]);
  const [filteredVacations, setFilteredVacations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statuses, setStatuses] = useState([]);

  const fetchVacations = useCallback(async (page = 1, rowsPerPage = 10) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const paginationQuery = `page=${page}&per_page=${rowsPerPage}`;
      const url = `http://localhost:3000/api/v1/users/${userId}/vacations?${paginationQuery}&sort=start_date&order=desc`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error fetching vacations');
      }

      const data = await response.json();
      setVacations(data.vacations);
      setTotalCount(data.pagy.count);
      setCurrentPage(data.pagy.page - 1);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  useEffect(() => {
    fetchVacations(currentPage + 1, rowsPerPage);
  }, [currentPage, rowsPerPage, fetchVacations]);

  useEffect(() => {
    setFilteredVacations(
      vacations.filter(vacation => statuses.length === 0 || statuses.includes(vacation.status))
    );
  }, [vacations, statuses]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };

  const handleStatusChange = (checked, status) => {
    setStatuses(prev => {
      return checked
        ? [...prev, status]
        : prev.filter(s => s !== status);
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Mis vacaciones
      </Typography>
      {error && <Typography color="error">Error: {error}</Typography>}

      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={statuses.includes('Aprobado')}
              onChange={(e) => handleStatusChange(e.target.checked, 'Aprobado')}
            />
          }
          label="Aprobado"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={statuses.includes('Rechazado')}
              onChange={(e) => handleStatusChange(e.target.checked, 'Rechazado')}
            />
          }
          label="Rechazado"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={statuses.includes('Pendiente')}
              onChange={(e) => handleStatusChange(e.target.checked, 'Pendiente')}
            />
          }
          label="Pendiente"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="vacations table">
          <TableHead>
            <TableRow>
              <TableCell>Fecha de inicio</TableCell>
              <TableCell>Fecha de fin</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Tipo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVacations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No vacations found.</TableCell>
              </TableRow>
            ) : (
              filteredVacations.map((vacation) => (
                <TableRow key={vacation.id}>
                  <TableCell>{vacation.start_date}</TableCell>
                  <TableCell>{vacation.end_date}</TableCell>
                  <TableCell>{vacation.status}</TableCell>
                  <TableCell>{vacation.motive}</TableCell>
                  <TableCell>{vacation.vacation_type}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={currentPage}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas por página"
      />
    </Box>
  );
};

export default MyVacations;
