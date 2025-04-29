import { useState, useRef } from "react";
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
  Popover
} from "@ui5/webcomponents-react";
import toast, { Toaster } from "react-hot-toast";
import { Grid } from "@mui/material";

import { agregarNotificacion, mensajesNotificaciones } from "./Notificaciones";

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
  const [notificaciones, setNotificaciones] = useState([]);
  const notiButtonRef = useRef(null);

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

      {/* Botón flotante de notificaciones */}
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
            ref={notiButtonRef}
            onClick={() => setOpenNotificaciones(true)}
          />
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
          <SideNavigationItem icon="home" text="Dashboard" data-route="/home" />
          <SideNavigationItem icon="retail-store" text="Producto" data-route="/producto" />
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

      {notiButtonRef.current && (
        <Popover
          headerText="Notificaciones recientes"
          open={openNotificaciones}
          opener={notiButtonRef.current}
          onClose={() => setOpenNotificaciones(false)}
        >
          <FlexBox direction="Column" style={{ padding: "1rem", gap: "0.5rem", maxHeight: "300px", overflowY: "auto" }}>
            {notificaciones.map((noti) => (
              <div key={noti.id} style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>
                <Text>{noti.mensaje}</Text>
              </div>
            ))}

            <Button onClick={() => agregarNotificacion("success", mensajesNotificaciones.exito, setNotificaciones)}>
              Agregar Notificación de Éxito
            </Button>
            <Button onClick={() => agregarNotificacion("info", mensajesNotificaciones.info, setNotificaciones)}>
              Agregar Notificación Informativa
            </Button>
            <Button onClick={() => agregarNotificacion("error", mensajesNotificaciones.error, setNotificaciones)}>
              Agregar Notificación de Error
            </Button>
          </FlexBox>
        </Popover>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </FlexBox>
  );
}
