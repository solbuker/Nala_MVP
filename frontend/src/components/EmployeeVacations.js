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
  IconButton,
  Typography,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Autocomplete
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const EmployeeVacations = () => {
  const [employees, setEmployees] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statuses, setStatuses] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);
  const navigate = useNavigate();

  const fetchEmployees = useCallback(async (page = 1, rowsPerPage = 10) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const paginationQuery = `page=${page}&per_page=${rowsPerPage}`;
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
        throw new Error(errorText || 'Error fetching employees');
      }

      const data = await response.json();
      setEmployees(data.users);
      setTotalCount(data.pagy.count);
      setCurrentPage(data.pagy.page - 1);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  useEffect(() => {
    fetchEmployees(currentPage + 1, rowsPerPage);
  }, [currentPage, rowsPerPage, fetchEmployees]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };

  const handleEditVacation = (userId, vacationId) => {
    navigate(`/edit-vacation/${userId}/${vacationId}`);
  };


  const handleStatusChange = (checked, status) => {
    setStatuses(prev => {
      return checked
        ? [...prev, status]
        : prev.filter(s => s !== status);
    });
  };

  const handleEmployeeChange = (event, newValue) => {
    setSelectedEmployees(newValue);
  };

  const toggleExpandEmployee = (employeeId) => {
    setExpandedEmployeeId(prevId => (prevId === employeeId ? null : employeeId));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Vacaciones de empleados
      </Typography>
      {error && <Typography color="error">Error: {error}</Typography>}

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
        </Box>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Autocomplete
          multiple
          options={employees}
          getOptionLabel={(option) => option.name}
          onChange={handleEmployeeChange}
          renderInput={(params) => <TextField {...params} label="Empleados" variant="outlined" />}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="employees vacations table">
          <TableHead>
            <TableRow>
              <TableCell>Empleado</TableCell>
              <TableCell>Vacaciones</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Dias de vacaciones por año</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No se encontraron empleados.</TableCell>
              </TableRow>
            ) : (
              employees
                .filter(employee => selectedEmployees.length === 0 || selectedEmployees.includes(employee))
                .map((employee) => (
                  <TableRow key={employee.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      {employee.name}
                      <IconButton onClick={() => toggleExpandEmployee(employee.id)}>
                        {expandedEmployeeId === employee.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      {expandedEmployeeId === employee.id && (
                        <Box>
                          {employee.vacations
                            .filter(vacation => statuses.length === 0 || statuses.includes(vacation.status))
                            .map((vacation) => (
                              <Box key={vacation.id} sx={{ borderBottom: '1px solid #ddd', mb: 1, pb: 1 }}>
                                <TextField
                                  label="Dias"
                                  value={`${vacation.start_date} - ${vacation.end_date}`}
                                  variant="standard"
                                  fullWidth
                                  InputProps={{ readOnly: true }}
                                  sx={{ cursor: 'pointer' }}
                                  onClick={() => handleEditVacation(employee.id, vacation.id)}
                                />
                              </Box>
                            ))}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {expandedEmployeeId === employee.id && (
                        <Box>
                          {employee.vacations
                            .filter(vacation => statuses.length === 0 || statuses.includes(vacation.status))
                            .map((vacation) => (
                              <Box key={vacation.id} sx={{ borderBottom: '1px solid #ddd', mb: 1, pb: 1 }}>
                                <TextField
                                  label="Estado"
                                  value={vacation.status}
                                  variant="standard"
                                  fullWidth
                                  InputProps={{ readOnly: true }}
                                />
                              </Box>
                            ))}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {expandedEmployeeId === employee.id && (
                        <Box>
                          {employee.vacations
                            .filter(vacation => statuses.length === 0 || statuses.includes(vacation.status))
                            .map((vacation) => (
                              <Box key={vacation.id} sx={{ borderBottom: '1px solid #ddd', mb: 1, pb: 1 }}>
                                <TextField
                                  label="Tipo"
                                  value={vacation.type}
                                  variant="standard"
                                  fullWidth
                                  InputProps={{ readOnly: true }}
                                />
                              </Box>
                            ))}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {expandedEmployeeId === employee.id && (
                        <Box>
                          {employee.vacations
                            .filter(vacation => statuses.length === 0 || statuses.includes(vacation.status))
                            .map((vacation) => (
                              <Box key={vacation.id} sx={{ borderBottom: '1px solid #ddd', mb: 1, pb: 1 }}>
                                <TextField
                                  label="Motivo"
                                  value={vacation.motive}
                                  variant="standard"
                                  fullWidth
                                  InputProps={{ readOnly: true }}
                                />
                              </Box>
                            ))}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {expandedEmployeeId === employee.id && (
                        <Box>
                          {Object.entries(employee.total_vacation_days || {}).map(([year, days]) => (
                            <Box key={year} sx={{ borderBottom: '1px solid #ddd', mb: 1, pb: 1 }}>
                              <TextField
                                label={year}
                                value={`${days} dias`}
                                variant="standard"
                                fullWidth
                                InputProps={{ readOnly: true }}
                              />
                            </Box>
                          ))}
                        </Box>
                      )}
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

export default EmployeeVacations;
