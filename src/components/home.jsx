import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShellBar,
  SideNavigation,
  SideNavigationItem,
  Card,
  Title,
  Text,
  FlexBox,
  Button,
  Dialog,
} from "@ui5/webcomponents-react";
import { Grid } from "@mui/material";

import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/retail-store.js";
import "@ui5/webcomponents-icons/dist/navigation-right-arrow.js";
import "@ui5/webcomponents-icons/dist/employee.js";
import "@ui5/webcomponents-icons/dist/shipping-status.js";
import "@ui5/webcomponents-icons/dist/cart.js";
import "@ui5/webcomponents-icons/dist/bell.js";

const drawerWidth = 240;

export default function Home() {
  const navigate = useNavigate();
  const [isSidebarOpen] = useState(true);
  const [openNotificaciones, setOpenNotificaciones] = useState(false);

  const notificaciones = [
    { id: 1, mensaje: "Nueva orden recibida" },
    { id: 2, mensaje: "Se ha cancelado una venta" },
    { id: 3, mensaje: "Stock bajo en carne de cerdo" },
    { id: 4, mensaje: "Usuario nuevo registrado" },
  ];

  const handleNavigationClick = (event) => {
    const selected = event.detail.item.dataset.route;
    if (selected) navigate(selected);
  };

  return (
    <FlexBox direction="Row" style={{ height: "100vh", width: "100vw" }}>
      <ShellBar
        logo={<img src="/viba1.png" alt="Carnes ViBa" style={{ height: "40px" }} />}
        primaryTitle="Productos"
        onProfileClick={() => navigate("/login")}
        profile={{ image: "/viba1.png" }}
        style={{
          width: "100%",
          background: "#B71C1C",
          color: "white",
          position: "fixed",
          zIndex: 1201,
        }}
      />

      {/* Botón flotante de notificaciones con badge */}
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "60px",
          zIndex: 1500,
        }}
      >
        <div style={{ position: "relative" }}>
          <Button
            icon="bell"
            design="Transparent"
            onClick={() => setOpenNotificaciones(true)}
          />
          {notificaciones.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                backgroundColor: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "10px",
                fontWeight: "bold",
                zIndex: 2000,
              }}
            >
              {notificaciones.length}
            </span>
          )}
        </div>
      </div>

      {isSidebarOpen && (
        <div
          style={{
            width: drawerWidth,
            marginTop: "3.5rem",
            height: "calc(100vh - 3.5rem)",
            backgroundColor: "#fff",
            boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
          }}
        >
          <SideNavigation onSelectionChange={handleNavigationClick}>
            <SideNavigationItem icon="home" text="Dashboard" data-route="/Home" />
            <SideNavigationItem icon="retail-store" text="Producto" data-route="/producto" />
            <SideNavigationItem icon="navigation-right-arrow" text="Carne de res" />
            <SideNavigationItem icon="navigation-right-arrow" text="Carne de cerdo" />
            <SideNavigationItem icon="navigation-right-arrow" text="Pollo" />
            <SideNavigationItem icon="navigation-right-arrow" text="Pavo" />
            <SideNavigationItem icon="employee" text="Usuarios" data-route="/usuarios" />
            <SideNavigationItem icon="shipping-status" text="Órdenes" data-route="/orden" />
            <SideNavigationItem icon="cart" text="Ventas" data-route="/venta" />
          </SideNavigation>
        </div>
      )}

      <FlexBox
        direction="Column"
        style={{
          flexGrow: 1,
          padding: "2rem",
          marginTop: "4rem",
          backgroundColor: "#fafafa",
          minHeight: "100vh",
        }}
      >
        <Grid container spacing={2}>
          {[{ title: "75", subtitle: "Clientes registrados" },
            { title: "357", subtitle: "Proveedores totales" },
            { title: "65", subtitle: "Ordenes canceladas" },
            { title: "$128", subtitle: "Ganancias totales" },
          ].map((stat, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Card style={{ padding: "1rem" }}>
                <div style={{ paddingInline: "0.5rem" }}>
                  <Title level="H5">{stat.title}</Title>
                  <Text style={{ color: "#666", fontSize: "14px", marginTop: 4 }}>
                    {stat.subtitle}
                  </Text>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} style={{ marginTop: "1rem" }}>
          <Grid item xs={12} md={6}>
            <Card style={{ height: 300, padding: "1rem" }}>
              <Title level="H6">Predicción de demanda</Title>
              <FlexBox
                direction="Column"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#eee",
                  height: "100%",
                  marginTop: "1rem",
                  borderRadius: "8px",
                }}
              >
                <Text style={{ fontSize: "12px", color: "#777" }}>contenido</Text>
              </FlexBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card style={{ height: 300, padding: "1rem" }}>
              <Title level="H6">Tiempo en recibir un pedido</Title>
              <FlexBox
                direction="Column"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#eee",
                  height: "100%",
                  marginTop: "1rem",
                  borderRadius: "8px",
                }}
              >
                <Text style={{ fontSize: "12px", color: "#777" }}>contenido</Text>
              </FlexBox>
            </Card>
          </Grid>
        </Grid>
      </FlexBox>

      <Dialog
        headerText="Notificaciones recientes"
        open={openNotificaciones}
        onAfterClose={() => setOpenNotificaciones(false)}
        footer={
          <Button onClick={() => setOpenNotificaciones(false)} design="Emphasized">
            Cerrar
          </Button>
        }
      >
        <ul style={{ padding: "1rem", margin: 0, listStyle: "none" }}>
          {notificaciones.map((n) => (
            <li key={n.id} style={{ padding: "0.5rem 0", borderBottom: "1px solid #ddd" }}>
              🔔 {n.mensaje}
            </li>
          ))}
        </ul>
      </Dialog>
    </FlexBox>
  );
}
