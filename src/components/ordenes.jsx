
import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TablePagination, TextField, Select, MenuItem
} from '@mui/material';

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/ordenes`)
      .then(res => res.json())
      .then(data => setOrdenes(data))
      .catch(err => console.error('Error al obtener órdenes:', err));
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const ordenesFiltradas = ordenes.filter((orden) =>
    (orden.cliente?.toLowerCase().includes(busqueda.toLowerCase())) &&
    (filtroEstado === '' || orden.estado === filtroEstado)
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
      <TextField
        label="Buscar cliente"
        variant="outlined"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        sx={{ mb: 2, mr: 2 }}
      />
      <Select
        value={filtroEstado}
        onChange={(e) => setFiltroEstado(e.target.value)}
        displayEmpty
        sx={{ mb: 2 }}
      >
        <MenuItem value="">Todos los estados</MenuItem>
        <MenuItem value="Pendiente">Pendiente</MenuItem>
        <MenuItem value="Enviado">Enviado</MenuItem>
      </Select>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Prioridad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordenesFiltradas
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((orden) => (
                <TableRow key={orden.id}>
                  <TableCell>{orden.id}</TableCell>
                  <TableCell>{orden.cliente}</TableCell>
                  <TableCell>{orden.fecha}</TableCell>
                  <TableCell>{orden.estado}</TableCell>
                  <TableCell>${orden.total}</TableCell>
                  <TableCell>{orden.prioridad}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={ordenesFiltradas.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
