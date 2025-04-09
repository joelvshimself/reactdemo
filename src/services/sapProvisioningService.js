import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SAP_TENANT = 'aswp5fkd8.trial-accounts.ondemand.com'; // 👈 tu dominio SAP
const CLIENT_ID = process.env.SAP_PROVISIONING_CLIENT_ID;
const CLIENT_SECRET = process.env.SAP_PROVISIONING_CLIENT_SECRET;

// 1. Obtener token de acceso para llamar al API
const getSapToken = async () => {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  const { data } = await axios.post(
    `https://${SAP_TENANT}/oauth/token`,
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET,
      },
    }
  );
  
  console.log('✅ Token obtenido de SAP:', data.access_token);
  return data.access_token;
};

// 2. Crear el usuario en SAP IAS
export const createSapUser = async (email, firstName, lastName) => {
  try {
    const token = await getSapToken();

    const userPayload = {
      userName: email,
      emails: [{ value: email, primary: true }],
      name: {
        familyName: lastName || 'Apellido',
        givenName: firstName || 'Nombre',
      },
      active: true
    };

    const response = await axios.post(
      `https://${SAP_TENANT}/service/scim/Users`,
      userPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    console.log('✅ Usuario creado en SAP:', response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.log('ℹ️ El usuario ya existe en SAP, no es necesario crear.');
      return;
    }
    console.error('❌ Error al crear usuario en SAP:', error.response?.data || error.message);
    throw error;
  }
};
