import * as React from "react";
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout"; // Icono de salir

const drawerWidth = 240;

export default function Home() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminar token
    navigate("/login"); // Redirigir a login
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <img src="/viba1.png" alt="Carnes ViBa" style={{ width: "120px" }} />
      </Box>
      <Divider />
      <List sx={{ flex: 1 }}>
        <ListItemButton>
          <HomeIcon sx={{ mr: 2 }} />
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate('/usuarios-list')}>
          <PersonIcon sx={{ mr: 2 }} />
          <ListItemText primary="Usuarios" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate('/producto')}>
          <StoreIcon sx={{ mr: 2 }} />
          <ListItemText primary="Producto" />
        </ListItemButton>

        <ListItemButton sx={{ pl: 4 }}>
          <ChevronRightIcon sx={{ mr: 1 }} />
          <ListItemText primary="Carne de res" />
        </ListItemButton>
        <ListItemButton sx={{ pl: 4 }}>
          <ChevronRightIcon sx={{ mr: 1 }} />
          <ListItemText primary="Carne de cerdo" />
        </ListItemButton>
        <ListItemButton sx={{ pl: 4 }}>
          <ChevronRightIcon sx={{ mr: 1 }} />
          <ListItemText primary="Pollo" />
        </ListItemButton>
        <ListItemButton sx={{ pl: 4 }}>
          <ChevronRightIcon sx={{ mr: 1 }} />
          <ListItemText primary="Pavo" />
        </ListItemButton>
      </List>
      <Divider />
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="caption" display="block">
          © 2025 Carnes ViBa
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: "linear-gradient(90deg, #8B0000, #E53935)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inicio
          </Typography>
          {/* Botón de logout en la barra superior */}
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
          <Typography variant="h6" sx={{ cursor: "pointer" }} onClick={handleLogout}>
            Salir
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          backgroundColor: "#fafafa",
          minHeight: "100vh",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">75</Typography>
                <Typography variant="body2" color="text.secondary">
                  Órdenes totales
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">357</Typography>
                <Typography variant="body2" color="text.secondary">
                  Proveedores totales
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">65</Typography>
                <Typography variant="body2" color="text.secondary">
                  Órdenes canceladas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">$128</Typography>
                <Typography variant="body2" color="text.secondary">
                  Ganancias totales
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
