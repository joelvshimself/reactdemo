import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShellBar,
  SideNavigation,
  SideNavigationItem,
  Card,
  Title,
  Text,
  FlexBox
} from "@ui5/webcomponents-react";
import { Grid } from "@mui/material"; 

import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/retail-store.js";
import "@ui5/webcomponents-icons/dist/navigation-right-arrow.js";

const drawerWidth = 240;

export default function Home() {
  const navigate = useNavigate();
  const [isSidebarOpen] = useState(true);

  const handleNavigationClick = (event) => {
    const selected = event.detail.item.dataset.route;
    if (selected) navigate(selected);
  };

  return (
    <FlexBox direction="Row" style={{ height: "100vh", width: "100vw" }}>
      {/* ShellBar superior */}
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

      {/* SideNavigation */}
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
  </SideNavigation>

        </div>
      )}

      {/* Contenido principal */}
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
        {/* Tarjetas resumen */}
        <Grid container spacing={2}>
          {[
            { title: "75", subtitle: "c1" },
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

        {/* Placeholders de graficos */}
        <Grid container spacing={2} style={{ marginTop: "1rem" }}>
          <Grid item xs={12} md={6}>
            <Card style={{ height: 300, padding: "1rem" }}>
              <Title level="H6">Prediccion de demanda (Placeholder)</Title>
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
              <Title level="H6">Tiempo en recibir un pedido (Placeholder)</Title>
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
    </FlexBox>
  );
}
