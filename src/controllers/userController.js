import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { poolPromise } from '../config/dbConfig.js';
import { createSapUser } from '../services/sapProvisioningService.js';

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    const conn = await poolPromise;

    // Preparar y ejecutar consulta
    const stmt = await conn.prepare('SELECT * FROM Usuario WHERE email = ?');
    const result = await stmt.exec([email]);

    if (!result || result.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const user = result[0];

    // Comparar contraseña con bcrypt
    const isMatch = await bcrypt.compare(password, user.PASSWORD);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // ✅ ✅ ✅ AQUÍ GUARDAMOS EL CORREO EN SESIÓN
    req.session.userEmail = user.EMAIL;

    // Generar token
    const token = jwt.sign(
      { userId: user.ID, email: user.EMAIL, rol: user.ROL },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.ID,
        nombre: user.NOMBRE,
        email: user.EMAIL,
        rol: user.ROL
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor al procesar login" });
  }
};

//G
export const getUsers = async (req, res) => {
  try {
    const conn = await poolPromise;
    const stmt = await conn.prepare('SELECT * FROM Usuario');
    const result = await stmt.exec(); // devuelve un arreglo de usuarios

    res.json(result); // Envia todos los usuarios correctamente
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Obtener usuario por ID

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await poolPromise;

    const stmt = await conn.prepare('SELECT * FROM Usuario WHERE id = ?');
    const result = await stmt.exec([id]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(result[0]); // Devuelve el primer usuario encontrado
  } catch (error) {
    console.error("Error en getUserById:", error);
    res.status(500).json({ message: error.message });
  }
};


// Crear usuario
export const createUser = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!password) {
      return res.status(400).json({ message: "La contraseña es obligatoria" });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const pool = await poolPromise;

    // Insertar en tu base de datos local
    await pool.exec(
      'INSERT INTO Usuario (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, rol]
    );

    try {
      await createSapUser(email, nombre, ''); // Si tienes apellido, lo pasas como tercer argumento
      console.log(`✅ Usuario SAP creado para: ${email}`);
    } catch (sapError) {
      console.error(`❌ Error creando usuario en SAP:`, sapError.response?.data || sapError.message);
    }

    res.status(201).json({ message: "Usuario creado exitosamente en local y SAP" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};




// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, rol } = req.body;

    const conn = await poolPromise;

    // Verificar si el usuario existe
    const checkStmt = await conn.prepare('SELECT * FROM Usuario WHERE id = ?');
    const result = await checkStmt.exec([id]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const existingUser = result[0];

    // Hashear la contraseña solo si viene una nueva
    let hashedPassword = existingUser.PASSWORD;
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Ejecutar UPDATE
    const updateStmt = await conn.prepare(`
      UPDATE Usuario SET 
        nombre = ?, 
        email = ?, 
        password = ?, 
        rol = ? 
      WHERE id = ?
    `);

    await updateStmt.exec([nombre, email, hashedPassword, rol, id]);

    res.json({ message: "Usuario actualizado correctamente" });

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: error.message });
  }
};


// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await poolPromise;

    // Verificar si el usuario existe
    const checkStmt = await conn.prepare('SELECT * FROM Usuario WHERE id = ?');
    const result = await checkStmt.exec([id]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar usuario
    const deleteStmt = await conn.prepare('DELETE FROM Usuario WHERE id = ?');
    await deleteStmt.exec([id]);

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: error.message });
  }
};

