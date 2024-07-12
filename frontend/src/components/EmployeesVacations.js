import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AutocompleteEmployee from './AutocompleteEmployee';
import AutocompleteLeader from './AutocompleteLeader';

const EmployeesVacations = () => {
  const [employees, setEmployees] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [nameFilter, setNameFilter] = useState('');
  const [leaderFilter, setLeaderFilter] = useState('');
  const navigate = useNavigate();

  const buildNameQueryString = (name) => {
    return name ? `q[name_cont]=${encodeURIComponent(name)}` : '';
  };

  const buildLeaderQueryString = (leader) => {
    return leader ? `q[leader_cont]=${encodeURIComponent(leader)}` : '';
  };

  const fetchEmployees = useCallback(async (page = 1, rowsPerPage = 10, name, leader) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No se encontró token');

      const nameQuery = buildNameQueryString(name);
      const leaderQuery = buildLeaderQueryString(leader);
      const paginationQuery = `page=${page}&per_page=${rowsPerPage}`;
      const filterQuery = [nameQuery, leaderQuery].filter(Boolean).join('&');

      const url = `http://localhost:3000/api/v1/employees?${filterQuery}&${paginationQuery}`;

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
      setEmployees(data.employees);
      setTotalCount(data.pagy.count);
      setCurrentPage(data.pagy.page - 1);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  useEffect(() => {
    fetchEmployees(currentPage + 1, rowsPerPage, nameFilter, leaderFilter);
  }, [currentPage, rowsPerPage, nameFilter, leaderFilter, fetchEmployees]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };

  const handleEditVacation = (employeeId, vacationId) => {
    navigate(`/edit-vacation/${employeeId}/${vacationId}`);
  };

  const handleEditEmployee = (employeeId) => {
    navigate(`/edit-employee/${employeeId}`);
  };

  const handleDeleteVacation = async (employeeId, vacationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/employees/${employeeId}/vacations/${vacationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      if (!response.ok) {
        throw new Error('No se pudo eliminar');
      }
      alert('Eliminación exitosa!');
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) => ({
          ...employee,
          vacations: employee.vacations.filter((vacation) => vacation.id !== vacationId),
        }))
      );
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo eliminar');
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/employees/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      if (!response.ok) {
        throw new Error('No se pudo eliminar');
      }
      alert('Eliminación exitosa!');
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== employeeId)
      );
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo eliminar');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Portal de Vacaciones
      </Typography>
      {error && <Typography color="error">Error: {error}</Typography>}
      <AutocompleteEmployee setFilter={setNameFilter} />
      <AutocompleteLeader setFilter={setLeaderFilter} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de empleados">
          <TableHead>
            <TableRow>
              <TableCell>Empleado</TableCell>
              <TableCell>Líder</TableCell>
              <TableCell>Vacaciones</TableCell>
              <TableCell>Vacaciones por año</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No se encontraron empleados.</TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    {employee.name}
                    <IconButton onClick={() => handleEditEmployee(employee.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteEmployee(employee.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>{employee.leader}</TableCell>
                  <TableCell>
                    <ul>
                      {employee.vacations && employee.vacations.length > 0 ? (
                        employee.vacations.map(vacation => (
                          <li key={vacation.id}>
                            <Link to={`employees/${employee.id}/vacations/${vacation.id}`}>{vacation.start_date} - {vacation.end_date}</Link>
                            <IconButton onClick={() => handleEditVacation(employee.id, vacation.id)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteVacation(employee.id, vacation.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </li>
                        ))
                      ) : (
                        <li>No se encontraron vacaciones.</li>
                      )}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <ul>
                      {employee.total_vacation_days && Object.entries(employee.total_vacation_days).map(([year, days]) => (
                        <li key={year}>{year}: {days} días</li>
                      ))}
                    </ul>
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
        labelRowsPerPage="Filas por página"
      />
    </Box>
  );
};

export default EmployeesVacations;
