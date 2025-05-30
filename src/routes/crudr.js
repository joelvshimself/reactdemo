import express from 'express';
import { poolPromise } from '../config/dbConfig.js';


const crudr = express.Router();

/**
 * @swagger
 * tags:
 *   name: temporal
 *   description: Endpoints de prueba para Producto, Venta, DetalleVenta, Inventario y Notificacion
 */

// ==== Nueva Orden ====

/**
 * @swagger
 * /api/nuevaorden:
 *   post:
 *     summary: Crear una nueva orden entre usuarios
 *     tags: [temporal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo_solicita:
 *                 type: string
 *               correo_provee:
 *                 type: string
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto:
 *                       type: string
 *                     cantidad:
 *                       type: integer
 *                     precio:
 *                       type: number
 *                     fecha_caducidad:
 *                       type: string
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 */

crudr.post('/nuevaorden', async (req, res) => {
  const { correo_solicita, correo_provee, productos } = req.body;

  if (!correo_solicita || !correo_provee || !Array.isArray(productos)) {
    return res.status(400).json({
      error: 'Faltan campos necesarios: correo_solicita, correo_provee o productos'
    });
  }

  let connection;

  try {
    connection = await poolPromise;

    // 1. Obtener ID del solicitante
    const idSolicitaQuery = await connection.exec(
      `SELECT getUsuarioIdByEmail('${correo_solicita}') AS id_solicita FROM DUMMY`
    );
    const id_solicita = idSolicitaQuery[0]?.ID_SOLICITA;

    if (!id_solicita) {
      return res.status(404).json({
        error: `Correo del solicitante no encontrado: ${correo_solicita}`
      });
    }

    // 2. Obtener ID del proveedor
    const idProveeQuery = await connection.exec(
      `SELECT getUsuarioIdByEmail('${correo_provee}') AS id_provee FROM DUMMY`
    );
    const id_provee = idProveeQuery[0]?.ID_PROVEE;

    if (!id_provee) {
      return res.status(404).json({
        error: `Correo del proveedor no encontrado: ${correo_provee}`
      });
    }

    // 3. Crear orden completa y recuperar ID desde SELECT
    const crearOrdenResult = await connection.exec(`
      DO BEGIN
        DECLARE nueva_orden INT;
        CALL crearOrdenExtensa(${id_solicita}, ${id_provee}, nueva_orden);
        SELECT :nueva_orden AS ID_ORDEN_OUTPUT FROM DUMMY;
      END;
    `);

    const nueva_orden = crearOrdenResult[0]?.ID_ORDEN_OUTPUT;

    if (!nueva_orden) {
      return res.status(500).json({
        error: 'No se pudo obtener el ID de la orden recién creada'
      });
    }

    // 4. Agregar subórdenes
    for (const producto of productos) {
      const { producto: nombre_producto, cantidad, precio } = producto;

      if (!nombre_producto || !cantidad || !precio) {
        return res.status(400).json({
          error: 'Cada producto debe tener nombre, cantidad y precio'
        });
      }

      await connection.exec(
        `CALL agregarSuborden(${nueva_orden}, '${nombre_producto}', ${cantidad}, ${precio})`
      );
    }

    // 5. Crear notificación
    await connection.exec(`
      INSERT INTO Notificacion (mensaje, fecha, tipo, id_usuario)
      VALUES ('Tienes una nueva orden asignada', CURRENT_DATE, 'orden', ${id_provee})
    `);

    res.status(201).json({
      message: 'Orden creada exitosamente',
      id_orden: nueva_orden
    });

  } catch (err) {
    console.error('❌ Error crítico al crear orden:', err);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Error crítico al crear orden',
        detail: err.message
      });
    }
  }
});

/**
 * @swagger
 * /api/completarorden/{id}:
 *   post:
 *     summary: Completar una orden y actualizar inventario
 *     description: Inserta en la tabla Inventario una fila por cada unidad de los productos asociados a la orden especificada.
 *     tags:
 *       - temporal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden que se quiere completar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inventario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Orden 5 completada e inventario actualizado
 *       404:
 *         description: No se encontraron productos para la orden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No hay productos asociados a la orden 5
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al completar orden
 *                 detail:
 *                   type: string
 *                   example: Error al ejecutar getProductosPorOrden
 */

crudr.post('/completarorden/:id', async (req, res) => {
  const ordenId = req.params.id;
  let connection;

  try {
    connection = await poolPromise;

    // Obtener fecha actual en formato YYYY-MM-DD
    const today = new Date().toISOString().slice(0, 10);

    // 1. Cambiar estado de la orden a 'completada' y asignar fecha_recepcion
    await connection.exec(`
      UPDATE Orden
      SET estado = 'completada',
          fecha_recepcion = '${today}'
      WHERE id_orden = ${ordenId}
    `);

    // 2. Obtener el ID del detallista (usuario que solicitó la orden)
    const detallistaResult = await connection.exec(`
      SELECT id_usuario_solicita
      FROM Orden
      WHERE id_orden = ${ordenId}
    `);

    const id_detallista = detallistaResult[0]?.ID_USUARIO_SOLICITA;

    if (!id_detallista) {
      return res.status(404).json({
        error: `No se encontró el solicitante para la orden ${ordenId}`
      });
    }

    // 3. Crear notificación para el detallista
    await connection.exec(`
      INSERT INTO Notificacion (mensaje, fecha, tipo, id_usuario)
      VALUES ('¡Tu orden #${ordenId} ya llegó!', CURRENT_DATE, 'orden_recibida', ${id_detallista})
    `);

    // 4. Obtener productos de la orden
    const productos = await connection.exec(
      `SELECT * FROM getProductosPorOrden(${ordenId})`
    );

    if (productos.length === 0) {
      return res.status(404).json({
        error: `No hay productos asociados a la orden ${ordenId}`
      });
    }

    // 5. Insertar productos en inventario
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    for (const prod of productos) {
      const { NOMBRE_PRODUCTO, CANTIDAD } = prod;

      for (let i = 0; i < CANTIDAD; i++) {
        await connection.exec(`
          INSERT INTO Inventario (producto, fecha, estado, tipo_movimiento, observaciones)
          VALUES (?, ?, 'disponible', 'ingreso por orden', ?)
        `, [NOMBRE_PRODUCTO, now, `Orden completada: #${ordenId}`]);
      }
    }

    res.status(200).json({
      message: `Orden ${ordenId} completada, fecha de recepción registrada, notificación enviada al detallista y productos ingresados al inventario`
    });

  } catch (error) {
    console.error('❌ Error al completar orden:', error);
    res.status(500).json({
      error: 'Error al completar orden',
      detail: error.message
    });
  }
});


/**
 * @swagger
 * /api/vender:
 *   post:
 *     summary: Realizar una venta de productos del inventario
 *     tags: [temporal]
 *     description: |
 *       Procesa la venta de productos disponibles en inventario.
 *       Valida la existencia de suficiente stock, registra la venta y actualiza el inventario como vendido.
 *       Productos soportados: arrachera, ribeye, tomahawk, diezmillo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto:
 *                       type: string
 *                       description: Nombre del producto (arrachera, ribeye, tomahawk, diezmillo)
 *                     cantidad:
 *                       type: integer
 *                       description: Número de unidades a vender
 *     responses:
 *       201:
 *         description: Venta realizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id_venta:
 *                   type: integer
 *                 total:
 *                   type: number
 *       400:
 *         description: Error de validación o inventario insuficiente
 *       500:
 *         description: Error interno al procesar la venta
 */

crudr.post('/vender', async (req, res) => {
  const { productos } = req.body;
  let connection;

  if (!Array.isArray(productos)) {
    return res.status(400).json({ error: 'Se requiere un array de productos y cantidades.' });
  }

  // Inicializar cantidades
  let cant_arrachera = 0;
  let cant_ribeye = 0;
  let cant_tomahawk = 0;
  let cant_diezmillo = 0;

  // Contar cantidades por producto
  for (const item of productos) {
    const { producto, cantidad } = item;
    if (!producto || typeof cantidad !== 'number') {
      return res.status(400).json({ error: 'Cada producto debe tener nombre y cantidad numérica.' });
    }

    switch (producto.toLowerCase()) {
      case 'arrachera':
        cant_arrachera += cantidad;
        break;
      case 'ribeye':
        cant_ribeye += cantidad;
        break;
      case 'tomahawk':
        cant_tomahawk += cantidad;
        break;
      case 'diezmillo':
        cant_diezmillo += cantidad;
        break;
      default:
        return res.status(400).json({ error: `Producto no reconocido: ${producto}` });
    }
  }

  try {
    connection = await poolPromise;

    // 1. Validar si hay suficiente inventario
    const validarInventario = await connection.exec(`
      SELECT resultado FROM puedoVenderInventario(
        ${cant_arrachera}, ${cant_ribeye}, ${cant_tomahawk}, ${cant_diezmillo}
      )
    `);

    const inventarioDisponible = validarInventario[0]?.RESULTADO;

    if (inventarioDisponible !== 1) {
      return res.status(400).json({ error: 'No hay suficiente inventario para completar la venta.' });
    }

    // 2. Crear la venta
    await connection.exec(`
      INSERT INTO Venta (fecha, total)
      VALUES (CURRENT_DATE, 0)
    `);

    // 3. Obtener ID de la venta recién creada
    const ventaResult = await connection.exec(`
      SELECT MAX(id_venta) AS id_venta FROM Venta
    `);

    const idVenta = ventaResult[0]?.ID_VENTA;

    if (!idVenta) {
      return res.status(500).json({ error: 'No se pudo crear la venta.' });
    }

    let totalVenta = 0;

    // 4. Para cada producto vendido
    for (const item of productos) {
      const { producto, cantidad } = item;

      // Seleccionar N productos disponibles de inventario
      const inventarioDisponible = await connection.exec(`
        SELECT id_inventario
        FROM Inventario
        WHERE producto = '${producto}' AND estado = 'disponible'
        ORDER BY fecha
        LIMIT ${cantidad}
      `);

      if (inventarioDisponible.length < cantidad) {
        return res.status(400).json({ error: `Inventario insuficiente para ${producto}` });
      }

      // 5. Insertar cada producto en DetalleVenta
      for (const inv of inventarioDisponible) {
        const idInventario = inv.ID_INVENTARIO;

        // Asumimos precio fijo para este ejemplo
        let precioUnitario = 0;
        switch (producto.toLowerCase()) {
          case 'arrachera': precioUnitario = 320; break;
          case 'ribeye': precioUnitario = 450; break;
          case 'tomahawk': precioUnitario = 600; break;
          case 'diezmillo': precioUnitario = 280; break;
        }

        await connection.exec(`
          INSERT INTO DetalleVenta (id_venta, id_inventario, costo_unitario)
          VALUES (${idVenta}, ${idInventario}, ${precioUnitario})
        `);

        // Actualizar inventario como vendido
        await connection.exec(`
          UPDATE Inventario
          SET estado = 'vendido',
              tipo_movimiento = 'salida por venta',
              observaciones = 'Vendido en venta #${idVenta}'
          WHERE id_inventario = ${idInventario}
        `);

        totalVenta += precioUnitario;
      }
    }

    // 6. Actualizar el total de la venta
    await connection.exec(`
      UPDATE Venta
      SET total = ${totalVenta}
      WHERE id_venta = ${idVenta}
    `);

    res.status(201).json({ message: 'Venta realizada exitosamente.', id_venta: idVenta, total: totalVenta });

  } catch (error) {
    console.error('❌ Error al vender:', error);
    res.status(500).json({ error: 'Error al procesar la venta', detail: error.message });
  }
});






export default crudr;
