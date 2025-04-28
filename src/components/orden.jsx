// orden.jsx
import { useState, useEffect } from "react";
import { FlexBox } from "@ui5/webcomponents-react";
import {
  ShellBar,
  SideNavigation,
  SideNavigationItem,
  Card,
  Title,
  Input,
  Button,
  Dialog,
  Select,
  Option
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/retail-store.js";
import "@ui5/webcomponents-icons/dist/employee.js";
import "@ui5/webcomponents-icons/dist/shipping-status.js";
import "@ui5/webcomponents-icons/dist/cart.js";
import "@ui5/webcomponents-icons/dist/navigation-right-arrow.js";
import "@ui5/webcomponents-icons/dist/delete.js";
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents-icons/dist/edit.js";
import { useNavigate } from "react-router-dom";
import {
  getOrdenes,
  createOrden,
  updateOrden,
  deleteOrden
} from "../services/ordenesService";

const drawerWidth = 240;

export default function Ordenes() {
  const navigate = useNavigate();
  const [isSidebarOpen] = useState(true);
  const [openCrear, setOpenCrear] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [ordenEditar, setOrdenEditar] = useState(null);
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [ordenes, setOrdenes] = useState([]);

  const [filtroEstado, setFiltroEstado] = useState("none");
  const [filtroFecha, setFiltroFecha] = useState("none");
  const [filtroUsuario, setFiltroUsuario] = useState("none");

  const [nuevaOrden, setNuevaOrden] = useState({
    estado: "",
    fecha: "",
    id_usuario: ""
  });

  const loadOrdenes = async () => {
    const data = await getOrdenes();
    setOrdenes(
      data.map((o) => ({
        id: o.ID_ORDEN,
        estado: o.ESTADO,
        fecha: o.FECHA,
        id_usuario: o.ID_USUARIO
      }))
    );
  };

  useEffect(() => {
    loadOrdenes();
  }, []);

  const eliminarOrdenesSeleccionadas = async () => {
    for (let id of ordenesSeleccionadas) {
      await deleteOrden(id);
    }
    setOrdenesSeleccionadas([]);
    await loadOrdenes();
  };

  const agregarOrden = async () => {
    const ok = await createOrden(nuevaOrden);
    if (ok) {
      await loadOrdenes();
      setNuevaOrden({ estado: "", fecha: "", id_usuario: "" });
      alert("Orden creada correctamente");
    } else {
      alert("Error al crear orden");
    }
  };

  const handleEditarGuardar = async () => {
    const ok = await updateOrden(ordenEditar.id, ordenEditar);
    if (ok) {
      await loadOrdenes();
      setOpenEditar(false);
      setOrdenesSeleccionadas([]);
      alert("Orden actualizada correctamente");
    } else {
      alert("Error al actualizar orden");
    }
  };

  const handleNavigationClick = (event) => {
    const selected = event.detail.item.dataset.route;
    if (selected) navigate(selected);
  };

  return (
    <FlexBox direction="Row" style={{ height: "100vh", width: "100vw" }}>
      <ShellBar
        logo={<img src="/viba1.png" alt="Carnes ViBa" style={{ height: "40px" }} />}
        primaryTitle="Órdenes"
        onProfileClick={() => navigate("/login")}
        profile={{ image: "/viba1.png" }}
        style={{
          width: "100%",
          background: "#B71C1C",
          color: "white",
          position: "fixed",
          zIndex: 1201
        }}
      />

      {isSidebarOpen && (
        <div
          style={{
            width: drawerWidth,
            marginTop: "3.5rem",
            height: "calc(100vh - 3.5rem)",
            backgroundColor: "#fff",
            boxShadow: "2px 0 5px rgba(0,0,0,0.05)"
          }}
        >
          <SideNavigation onSelectionChange={handleNavigationClick}>
            <SideNavigationItem icon="home" text="Dashboard" data-route="/Home" />
            <SideNavigationItem icon="retail-store" text="Producto" data-route="/producto" />
            <SideNavigationItem icon="employee" text="Usuarios" data-route="/usuarios" />
            <SideNavigationItem icon="shipping-status" text="Órdenes" data-route="/orden" />
            <SideNavigationItem icon="cart" text="Ventas" data-route="/venta" />
          </SideNavigation>
        </div>
      )}

      <FlexBox
        direction="Column"
        style={{ flexGrow: 1, padding: "2rem", marginTop: "4rem", backgroundColor: "#fafafa", minHeight: "100vh" }}
      >
        <Title level="H3" style={{ marginBottom: "1rem" }}>Órdenes</Title>

        <FlexBox direction="Row" justifyContent="SpaceBetween" style={{ marginBottom: "1rem" }}>
          <Input
            placeholder="Buscar por Estado"
            style={{ width: "300px" }}
            icon="search"
            value={busqueda}
            onInput={(e) => setBusqueda(e.target.value)}
          />
          <FlexBox direction="Row" wrap style={{ gap: "0.5rem" }}>
            <Button design="Negative" icon="delete" onClick={eliminarOrdenesSeleccionadas} disabled={ordenesSeleccionadas.length === 0}>Eliminar</Button>
            <Button design="Emphasized" icon="add" onClick={() => setOpenCrear(true)}>Crear</Button>
            <Button design="Attention" icon="edit" disabled={ordenesSeleccionadas.length !== 1} onClick={() => {
              const ordenToEdit = ordenes.find(o => o.id === ordenesSeleccionadas[0]);
              if (ordenToEdit) {
                setOrdenEditar(ordenToEdit);
                setOpenEditar(true);
              }
            }}>Editar</Button>
          </FlexBox>
        </FlexBox>

        <Card style={{ padding: "1rem", marginTop: "1rem" }}>
          <Title level="H5" style={{ marginBottom: "1rem", padding: "12px" }}>Base de Datos de Órdenes</Title>
          <div style={{ overflowY: "auto", maxHeight: "520px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "sans-serif" }}>
              <thead style={{ backgroundColor: "#f5f5f5" }}>
                <tr>
                  <th style={{ textAlign: "center" }}></th>
                  <th style={{ textAlign: "center" }}>Imagen</th>
                  <th style={{ textAlign: "center" }}>Cliente</th>
                  <th style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                      Fecha
                      <Select style={{ width: "50px", fontSize: "0.75rem" }} onChange={(e) => setFiltroFecha(e.target.value)}>
                        <Option value="none">⇅</Option>
                        <Option value="asc">↑</Option>
                        <Option value="desc">↓</Option>
                      </Select>
                    </div>
                  </th>
                  <th style={{ textAlign: "center" }}>Pago</th>
                  <th style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                      Estado
                      <Select style={{ width: "50px", fontSize: "0.75rem" }} onChange={(e) => setFiltroEstado(e.target.value)}>
                        <Option value="none">⇅</Option>
                        <Option value="asc">↑ A-Z</Option>
                        <Option value="desc">↓ Z-A</Option>
                      </Select>
                    </div>
                  </th>
                  <th style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                      ID Usuario
                      <Select style={{ width: "50px", fontSize: "0.75rem" }} onChange={(e) => setFiltroUsuario(e.target.value)}>
                        <Option value="none">⇅</Option>
                        <Option value="asc">1-1000</Option>
                        <Option value="desc">1000-1</Option>
                      </Select>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...ordenes].filter((o) => o.estado.toLowerCase().includes(busqueda.toLowerCase())).sort((a, b) => {
                  if (filtroEstado !== "none") return filtroEstado === "asc" ? a.estado.localeCompare(b.estado) : b.estado.localeCompare(a.estado);
                  if (filtroFecha !== "none") return filtroFecha === "asc" ? a.fecha.localeCompare(b.fecha) : b.fecha.localeCompare(a.fecha);
                  if (filtroUsuario !== "none") return filtroUsuario === "asc" ? parseInt(a.id_usuario) - parseInt(b.id_usuario) : parseInt(b.id_usuario) - parseInt(a.id_usuario);
                  return 0;
                }).map((orden) => (
                  <tr key={orden.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ textAlign: "center", padding: "4px" }}>
                      <input type="checkbox" checked={ordenesSeleccionadas.includes(orden.id)} onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          setOrdenesSeleccionadas([...ordenesSeleccionadas, orden.id]);
                        } else {
                          setOrdenesSeleccionadas(ordenesSeleccionadas.filter((id) => id !== orden.id));
                        }
                      }} />
                    </td>
                    <td style={{ textAlign: "center", padding: "4px" }}>
                      <img src="/carne.png" alt="Producto" style={{ width: "30px", borderRadius: "6px" }} />
                    </td>
                    <td style={{ textAlign: "center", padding: "4px" }}>Leslie Alexander</td>
                    <td style={{ textAlign: "center", padding: "4px" }}>{orden.fecha}</td>
                    <td style={{ textAlign: "center", padding: "4px" }}>
                      <span style={{ padding: "2px 6px", backgroundColor: orden.id % 2 === 0 ? "#c8f7c5" : "#fde2c5", color: orden.id % 2 === 0 ? "#1c7f00" : "#944a00", borderRadius: "6px", fontWeight: "bold" }}>{orden.id % 2 === 0 ? "Pagado" : "No pagado"}</span>
                    </td>
                    <td style={{ textAlign: "center", padding: "4px" }}>
                      <span style={{ padding: "2px 6px", backgroundColor: orden.estado.toLowerCase() === "envio" ? "#dcd0ff" : orden.estado.toLowerCase() === "cancelado" ? "#ffbdbd" : "#eee", borderRadius: "6px", fontWeight: "bold" }}>{orden.estado}</span>
                    </td>
                    <td style={{ textAlign: "center", padding: "4px" }}>{orden.id_usuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Dialog headerText="Agregar Orden" open={openCrear} onAfterClose={() => setOpenCrear(false)} footer={<Button design="Emphasized" onClick={() => { agregarOrden(); setOpenCrear(false); }}>Guardar</Button>}>
          <FlexBox style={{ padding: "1rem", gap: "1rem" }}>
            <Input placeholder="Estado" value={nuevaOrden.estado} onInput={(e) => setNuevaOrden({ ...nuevaOrden, estado: e.target.value })} />
            <Input placeholder="Fecha" value={nuevaOrden.fecha} onInput={(e) => setNuevaOrden({ ...nuevaOrden, fecha: e.target.value })} />
            <Input placeholder="ID Usuario" value={nuevaOrden.id_usuario} onInput={(e) => setNuevaOrden({ ...nuevaOrden, id_usuario: e.target.value })} />
          </FlexBox>
        </Dialog>

        <Dialog headerText="Editar Orden" open={openEditar} onAfterClose={() => setOpenEditar(false)} footer={<Button design="Emphasized" onClick={handleEditarGuardar}>Guardar</Button>}>
          {ordenEditar && (
            <FlexBox style={{ padding: "1rem", gap: "1rem" }}>
              <Input placeholder="Estado" value={ordenEditar.estado} onInput={(e) => setOrdenEditar({ ...ordenEditar, estado: e.target.value })} />
              <Input placeholder="Fecha" value={ordenEditar.fecha} onInput={(e) => setOrdenEditar({ ...ordenEditar, fecha: e.target.value })} />
              <Input placeholder="ID Usuario" value={ordenEditar.id_usuario} onInput={(e) => setOrdenEditar({ ...ordenEditar, id_usuario: e.target.value })} />
            </FlexBox>
          )}
        </Dialog>
      </FlexBox>
    </FlexBox>
  );
}