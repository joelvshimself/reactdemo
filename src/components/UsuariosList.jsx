import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function UsersList() {
  const navigate = useNavigate();
  const { token } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5030/users", {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          setError(data.error || "Error al obtener usuarios");
        }
      } catch (err) {
        setError("⛔ Error de conexión con la API");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    } else {
      setError("Token inválido o no autenticado");
    }
  }, [token]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw" }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Lista de Usuarios
          </Typography>
          <Button color="inherit" onClick={() => navigate("/home")}>Inicio</Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, backgroundColor: "#fafafa", minHeight: "100vh" }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Creado en</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.ID}>
                            <TableCell>{user.ID}</TableCell>
                            <TableCell>{user.NAME}</TableCell>
                            <TableCell>{user.EMAIL}</TableCell>
                            <TableCell>{user.CREATEDAT}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
