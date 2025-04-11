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
import "@ui5/webcomponents-icons/dist/navigation-right-arrow.js";
import "@ui5/webcomponents-icons/dist/delete.js";
import "@ui5/webcomponents-icons/dist/add.js";
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

  const ordenar = (lista, campo, orden) => {
    if (orden === "asc") {
      return [...lista].sort((a, b) => a[campo].localeCompare(b[campo]));
    } else if (orden === "desc") {
      return [...lista].sort((a, b) => b[campo].localeCompare(a[campo]));
    }
    return lista;
  };

  const getOrdenesOrdenadas = () => {
    let resultado = ordenes.filter(o => o.estado.toLowerCase().includes(busqueda.toLowerCase()));
    resultado = ordenar(resultado, "estado", filtroEstado);
    resultado = ordenar(resultado, "fecha", filtroFecha);
    resultado = ordenar(resultado, "id_usuario", filtroUsuario);
    return resultado;
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

  const eliminarOrdenesSeleccionadas = async () => {
    for (let id of ordenesSeleccionadas) {
      await deleteOrden(id);
    }
    setOrdenesSeleccionadas([]);
    await loadOrdenes();
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
          minHeight: "100vh"
        }}
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
        </FlexBox>

        <Card style={{ padding: "1rem", marginTop: "1rem" }}>
          <Title level="H5" style={{ marginBottom: "1rem", padding: "12px" }}>
            Base de Datos de Órdenes
          </Title>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "sans-serif" }}>
              <thead style={{ backgroundColor: "#f5f5f5" }}>
                <tr>
                  <th></th>
                  <th>Imagen</th>
                  <th>
                    Cliente
                  </th>
                  <th>
                    Fecha<br />
                    <Select style={{ width: "100px" }} onChange={(e) => setFiltroFecha(e.target.value)}>
                      <Option value="none">⇅</Option>
                      <Option value="asc">↑</Option>
                      <Option value="desc">↓</Option>
                    </Select>
                  </th>
                  <th>Pago</th>
                  <th>
                    Estado<br />
                    <Select style={{ width: "100px" }} onChange={(e) => setFiltroEstado(e.target.value)}>
                      <Option value="none">⇅</Option>
                      <Option value="asc">↑</Option>
                      <Option value="desc">↓</Option>
                    </Select>
                  </th>
                  <th>
                    ID Usuario<br />
                    <Select style={{ width: "100px" }} onChange={(e) => setFiltroUsuario(e.target.value)}>
                      <Option value="none">⇅</Option>
                      <Option value="asc">↑</Option>
                      <Option value="desc">↓</Option>
                    </Select>
                  </th>
                </tr>
              </thead>
              <tbody>
                {getOrdenesOrdenadas().map((orden) => (
                  <tr key={orden.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ textAlign: "center", padding: "12px" }}>
                      <input
                        type="checkbox"
                        checked={ordenesSeleccionadas.includes(orden.id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          if (checked) {
                            setOrdenesSeleccionadas([...ordenesSeleccionadas, orden.id]);
                          } else {
                            setOrdenesSeleccionadas(
                              ordenesSeleccionadas.filter((id) => id !== orden.id)
                            );
                          }
                        }}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <img src="/carne.png" alt="Producto" style={{ width: "40px", borderRadius: "8px" }} />
                    </td>
                    <td style={{ textAlign: "center" }}>Leslie Alexander</td>
                    <td style={{ textAlign: "center" }}>{orden.fecha}</td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{
                        padding: "4px 10px",
                        backgroundColor: orden.id % 2 === 0 ? "#c8f7c5" : "#fde2c5",
                        color: orden.id % 2 === 0 ? "#1c7f00" : "#944a00",
                        borderRadius: "8px",
                        fontWeight: "bold"
                      }}>
                        {orden.id % 2 === 0 ? "Pagado" : "No pagado"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span style={{
                        padding: "4px 10px",
                        backgroundColor: orden.estado.toLowerCase() === "envio"
                          ? "#dcd0ff"
                          : orden.estado.toLowerCase() === "cancelado"
                            ? "#ffbdbd"
                            : "#eee",
                        borderRadius: "8px",
                        fontWeight: "bold"
                      }}>
                        {orden.estado}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>{orden.id_usuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Dialog
          headerText="Agregar Orden"
          open={openCrear}
          onAfterClose={() => setOpenCrear(false)}
          footer={
            <Button design="Emphasized" onClick={() => {
              agregarOrden();
              setOpenCrear(false);
            }}>
              Guardar
            </Button>
          }
        >
          <FlexBox style={{ padding: "1rem", gap: "1rem" }}>
            <Input
              placeholder="Estado"
              name="estado"
              value={nuevaOrden.estado}
              onInput={(e) => setNuevaOrden({ ...nuevaOrden, estado: e.target.value })}
            />
            <Input
              placeholder="Fecha"
              name="fecha"
              value={nuevaOrden.fecha}
              onInput={(e) => setNuevaOrden({ ...nuevaOrden, fecha: e.target.value })}
            />
            <Input
              placeholder="ID Usuario"
              name="id_usuario"
              value={nuevaOrden.id_usuario}
              onInput={(e) => setNuevaOrden({ ...nuevaOrden, id_usuario: e.target.value })}
            />
          </FlexBox>
        </Dialog>

        <Dialog
          headerText="Editar Orden"
          open={openEditar}
          onAfterClose={() => setOpenEditar(false)}
          footer={<Button design="Emphasized" onClick={handleEditarGuardar}>Guardar</Button>}
        >
          {ordenEditar && (
            <FlexBox style={{ padding: "1rem", gap: "1rem" }}>
              <Input
                placeholder="Estado"
                value={ordenEditar.estado}
                onInput={(e) => setOrdenEditar({ ...ordenEditar, estado: e.target.value })}
              />
              <Input
                placeholder="Fecha"
                value={ordenEditar.fecha}
                onInput={(e) => setOrdenEditar({ ...ordenEditar, fecha: e.target.value })}
              />
              <Input
                placeholder="ID Usuario"
                value={ordenEditar.id_usuario}
                onInput={(e) => setOrdenEditar({ ...ordenEditar, id_usuario: e.target.value })}
              />
            </FlexBox>
          )}
        </Dialog>
      </FlexBox>
    </FlexBox>
  );
}