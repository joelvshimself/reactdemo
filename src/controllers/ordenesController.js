import { poolPromise } from "../config/dbConfig.js";

// Obtener todas las órdenes
export const getOrdenes = async (req, res) => {
  try {
    const conn = await poolPromise;
    const stmt = await conn.prepare("SELECT * FROM ORDEN");
    const result = await stmt.exec();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener orden por ID
export const getOrdenById = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await poolPromise;
    const stmt = await conn.prepare("SELECT * FROM ORDEN WHERE ID_ORDEN = ?");
    const result = await stmt.exec([id]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear orden
export const createOrden = async (req, res) => {
  try {
    const { estado, fecha, id_usuario } = req.body;
    const conn = await poolPromise;
    const stmt = await conn.prepare(`
      INSERT INTO ORDEN (ESTADO, FECHA, ID_USUARIO)
      VALUES (?, ?, ?)
    `);
    await stmt.exec([estado, fecha, id_usuario]);

    res.status(201).json({ message: "Orden creada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar orden
export const updateOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, fecha, id_usuario } = req.body;
    const conn = await poolPromise;

    const stmt = await conn.prepare(`
      UPDATE ORDEN
      SET ESTADO = ?, FECHA = ?, ID_USUARIO = ?
      WHERE ID_ORDEN = ?
    `);
    await stmt.exec([estado, fecha, id_usuario, id]);

    res.json({ message: "Orden actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar orden
export const deleteOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await poolPromise;
    const stmt = await conn.prepare("DELETE FROM ORDEN WHERE ID_ORDEN = ?");
    await stmt.exec([id]);

    res.json({ message: "Orden eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
