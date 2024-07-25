const SERVER = {
  FATAL: 'Error interno del servidor, contacte al administrador',
};

const CRUD = {
  UPDATED: 'Registro actualizado',
  CREATED: 'Registro creado exitosamente',
  NOT_FOUND: 'Registro no encontrado',
};
const AUTH = {
  INVALID_CREDENTIALS: 'Credenciales invalidas o erradas',
  USER_NOT_FOUND: 'Usuario no encontrado o inactivo',
  EXPIRE_SESSION: 'Sesión expirada, vuelva a iniciar sesión',
};

const OTP = {
  NOT_FOUND: 'No se encontró una solicitud de confirmación via OTP',
  INVALID: 'Otp invalido',
  EXPIRED: 'Otp expirado',
};

export { SERVER, CRUD, AUTH, OTP };
