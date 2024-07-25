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
  NOT_FOUND: 'Usuario no encontrado o inactivo',
  EXPIRE_SESSION: 'Es necesario que vuelva a iniciar sesión',
  FORBIDDEN: (email: string) => `'${email}' no tiene permiso para esta acción`,
};

const OTP = {
  NOT_FOUND: 'No se encontró una solicitud de confirmación via OTP',
  INVALID: 'Otp invalido',
  EXPIRED: 'Otp expirado',
};

const ENTERPRISE = {
  NOT_FOUND: 'Empresa no encontrada o se encuentra inactiva',
  MAX_USER: (maxUsers: number) =>
    `Tu plan solo permite ${maxUsers} usuarios activos`,
};

export { SERVER, CRUD, AUTH, OTP, ENTERPRISE };
