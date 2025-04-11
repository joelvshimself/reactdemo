import { poolPromise } from '../config/dbConfig.js'; 

// Funcion para obtener un usuario por email
export async function getUserByEmail(email) {
  try {
    const conn = await poolPromise;

    // Preparamos la consulta parametrizada
    const stmt = await conn.prepare('SELECT * FROM Usuario WHERE email = ?');
    const result = await stmt.exec([email]);

    // Si no hay resultados, regresamos null
    if (!result || result.length === 0) {
      return null;
    }

    return result[0]; // Devolvemos el primer usuario encontrado
  } catch (error) {
    console.error('Error consultando usuario en SAP HANA:', error);
    throw error; 
  }
}
