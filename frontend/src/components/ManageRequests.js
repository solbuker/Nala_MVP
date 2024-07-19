import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, IconButton, Typography, Box } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

const ManageRequests = () => {
  const [employees, setEmployees] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pendingVacations, setPendingVacations] = useState([]);

  const fetchEmployees = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const paginationQuery = `page=${currentPage + 1}&per_page=${rowsPerPage}`;
      const leaderFilter = `q[leader_id_eq]=${userId}`;
      const url = `http://localhost:3000/api/v1/users?${paginationQuery}&${leaderFilter}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error');
      }

      const data = await response.json();
      setEmployees(data.users);
      setTotalCount(data.pagy.count);
      setCurrentPage(data.pagy.page - 1);
    } catch (error) {
      setError(error.message);
    }
  }, [currentPage, rowsPerPage]);

  const fetchPendingVacations = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const vacations = [];

      for (const employee of employees) {
        const url = `http://localhost:3000/api/v1/users/${employee.id}/vacations?q[status_eq]=Pendiente&page=${currentPage + 1}&per_page=${rowsPerPage}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Error');
        }

        const data = await response.json();
        vacations.push(...data.vacations);
      }

      setPendingVacations(vacations);
    } catch (error) {
      setError(error.message);
    }
  }, [employees, currentPage, rowsPerPage]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (employees.length > 0) {
      fetchPendingVacations();
    }
  }, [employees, fetchPendingVacations]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };


  const handleApproveVacation = async (userId, vacationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/users/${userId}/vacations/${vacationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ status: 'Aprobado' })
      });
      if (!response.ok) {
        throw new Error('No se pudo aprobar');
      }
      alert('Las vacaciones se aprobaron exitosamente');
      setPendingVacations((prevVacations) =>
        prevVacations.filter((vacation) => vacation.id !== vacationId)
      );
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo aprobar');
    }
  };

  const handleDenyVacation = async (userId, vacationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/users/${userId}/vacations/${vacationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ status: 'Rechazado' })
      });
      if (!response.ok) {
        throw new Error('No se pudo rechazar');
      }
      alert('Las vacaciones se rechazaron exitosamente');
      setPendingVacations((prevVacations) =>
        prevVacations.filter((vacation) => vacation.id !== vacationId)
      );
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo rechazar');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Administrar solicitudes
      </Typography>
      {error && <Typography color="error">Error: {error}</Typography>}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="pending vacations table">
          <TableHead>
            <TableRow>
              <TableCell>Empleado</TableCell>
              <TableCell>Periodo</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingVacations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No se encontraron vacaciones pendientes.</TableCell>
              </TableRow>
            ) : (
              pendingVacations.map((vacation) => (
                <TableRow key={vacation.id}>
                  <TableCell>{vacation.user.name}</TableCell>
                  <TableCell>{vacation.start_date} - {vacation.end_date}</TableCell>
                  <TableCell>{vacation.vacation_type}</TableCell>
                  <TableCell>{vacation.motive}</TableCell>
                  <TableCell>{vacation.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleApproveVacation(vacation.user.id, vacation.id)}>
                      <CheckIcon color="success" />
                    </IconButton>
                    <IconButton onClick={() => handleDenyVacation(vacation.user.id, vacation.id)}>
                      <CloseIcon color="error" />
                    </IconButton>
                  </TableCell>
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
        labelRowsPerPage="Rows per page"
      />
    </Box>
  );
};

export default ManageRequests;
