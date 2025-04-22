// venta.jsx
import { useState } from "react";
import { FlexBox, ShellBar, SideNavigation, SideNavigationItem, Card, Title, Input, Button, Dialog } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/retail-store.js";
import "@ui5/webcomponents-icons/dist/employee.js";
import "@ui5/webcomponents-icons/dist/shipping-status.js";
import "@ui5/webcomponents-icons/dist/cart.js"; // ícono válido para ventas
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents-icons/dist/edit.js";
import "@ui5/webcomponents-icons/dist/delete.js";
import { useNavigate } from "react-router-dom";

export default function Venta() {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [ventasSeleccionadas, setVentasSeleccionadas] = useState([]);
  const [openCrear, setOpenCrear] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [ventaEditar, setVentaEditar] = useState(null);
  const [nuevaVenta, setNuevaVenta] = useState({ cliente: "", fecha: "", cantidad: "", total: "" });
  const [busqueda, setBusqueda] = useState("");

  const agregarVenta = () => {
    const nueva = { ...nuevaVenta, id: Date.now() };
    setVentas([...ventas, nueva]);
    setNuevaVenta({ cliente: "", fecha: "", cantidad: "", total: "" });
  };

  const editarVenta = () => {
    const actualizadas = ventas.map(v => v.id === ventaEditar.id ? ventaEditar : v);
    setVentas(actualizadas);
    setOpenEditar(false);
  };

  const eliminarVentas = () => {
    const filtradas = ventas.filter(v => !ventasSeleccionadas.includes(v.id));
    setVentas(filtradas);
    setVentasSeleccionadas([]);
  };

  const handleNavigationClick = (e) => {
    const route = e.detail.item.dataset.route;
    if (route) navigate(route);
  };

  return (
    <FlexBox direction="Row" style={{ height: "100vh", width: "100vw" }}>
      <ShellBar
        logo={<img src="/viba1.png" alt="ViBa" style={{ height: "40px" }} />}
        primaryTitle="Ventas"
        profile={{ image: "/viba1.png" }}
        style={{ width: "100%", background: "#B71C1C", color: "white", position: "fixed", zIndex: 1201 }}
      />
      <div style={{ width: 240, marginTop: "3.5rem", backgroundColor: "#fff" }}>
        <SideNavigation onSelectionChange={handleNavigationClick}>
          <SideNavigationItem icon="home" text="Dashboard" data-route="/home" />
          <SideNavigationItem icon="retail-store" text="Producto" data-route="/producto" />
          <SideNavigationItem icon="employee" text="Usuarios" data-route="/usuarios" />
          <SideNavigationItem icon="shipping-status" text="Órdenes" data-route="/orden" />
          <SideNavigationItem icon="cart" text="Ventas" data-route="/venta" />
        </SideNavigation>
      </div>

      <FlexBox direction="Column" style={{ flexGrow: 1, marginTop: "4rem", padding: "2rem", backgroundColor: "#fafafa" }}>
        <Title level="H4">Ventas</Title>

        <FlexBox direction="Row" justifyContent="SpaceBetween" style={{ marginBottom: "1rem" }}>
          <Input
            placeholder="Buscar por Cliente"
            style={{ width: "300px" }}
            value={busqueda}
            onInput={(e) => setBusqueda(e.target.value)}
          />
          <FlexBox direction="Row" style={{ gap: "0.5rem" }}>
            <Button design="Negative" icon="delete" disabled={!ventasSeleccionadas.length} onClick={eliminarVentas}>Eliminar</Button>
            <Button design="Emphasized" icon="add" onClick={() => setOpenCrear(true)}>Crear</Button>
            <Button design="Attention" icon="edit" disabled={ventasSeleccionadas.length !== 1} onClick={() => {
              const venta = ventas.find(v => v.id === ventasSeleccionadas[0]);
              if (venta) {
                setVentaEditar(venta);
                setOpenEditar(true);
              }
            }}>Editar</Button>
          </FlexBox>
        </FlexBox>

        <Card style={{ padding: "1rem", marginTop: "1rem" }}>
          <Title level="H5" style={{ marginBottom: "1rem", padding: "12px" }}>Base de Datos de Ventas</Title>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace" }}>
            <thead style={{ backgroundColor: "#f5f5f5" }}>
              <tr>
                <th></th>
                <th style={{ textAlign: "center" }}>Cliente</th>
                <th style={{ textAlign: "center" }}>Fecha</th>
                <th style={{ textAlign: "center" }}>Cantidad</th>
                <th style={{ textAlign: "center" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {ventas
                .filter(v => v.cliente.toLowerCase().includes(busqueda.toLowerCase()))
                .map((venta) => (
                  <tr key={venta.id} style={{ textAlign: "center", borderBottom: "1px solid #eee" }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={ventasSeleccionadas.includes(venta.id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          if (checked) setVentasSeleccionadas([...ventasSeleccionadas, venta.id]);
                          else setVentasSeleccionadas(ventasSeleccionadas.filter(id => id !== venta.id));
                        }}
                      />
                    </td>
                    <td>{venta.cliente}</td>
                    <td>{venta.fecha}</td>
                    <td>{venta.cantidad}</td>
                    <td><b>${venta.total}</b></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>

        {/* Diálogo Crear */}
        <Dialog
          headerText="Nueva Venta"
          open={openCrear}
          onAfterClose={() => setOpenCrear(false)}
          footer={<Button onClick={() => { agregarVenta(); setOpenCrear(false); }} design="Emphasized">Guardar</Button>}
        >
          <FlexBox style={{ padding: "1rem", gap: "1rem" }} direction="Column">
            <Input placeholder="Cliente" value={nuevaVenta.cliente} onInput={(e) => setNuevaVenta({ ...nuevaVenta, cliente: e.target.value })} />
            <Input placeholder="Fecha" value={nuevaVenta.fecha} onInput={(e) => setNuevaVenta({ ...nuevaVenta, fecha: e.target.value })} />
            <Input placeholder="Cantidad" value={nuevaVenta.cantidad} onInput={(e) => setNuevaVenta({ ...nuevaVenta, cantidad: e.target.value })} />
            <Input placeholder="Total" value={nuevaVenta.total} onInput={(e) => setNuevaVenta({ ...nuevaVenta, total: e.target.value })} />
          </FlexBox>
        </Dialog>

        {/* Diálogo Editar */}
        <Dialog
          headerText="Editar Venta"
          open={openEditar}
          onAfterClose={() => setOpenEditar(false)}
          footer={<Button onClick={editarVenta} design="Emphasized">Guardar</Button>}
        >
          {ventaEditar && (
            <FlexBox style={{ padding: "1rem", gap: "1rem" }} direction="Column">
              <Input placeholder="Cliente" value={ventaEditar.cliente} onInput={(e) => setVentaEditar({ ...ventaEditar, cliente: e.target.value })} />
              <Input placeholder="Fecha" value={ventaEditar.fecha} onInput={(e) => setVentaEditar({ ...ventaEditar, fecha: e.target.value })} />
              <Input placeholder="Cantidad" value={ventaEditar.cantidad} onInput={(e) => setVentaEditar({ ...ventaEditar, cantidad: e.target.value })} />
              <Input placeholder="Total" value={ventaEditar.total} onInput={(e) => setVentaEditar({ ...ventaEditar, total: e.target.value })} />
            </FlexBox>
          )}
        </Dialog>
      </FlexBox>
    </FlexBox>
  );
}
