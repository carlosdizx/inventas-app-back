const SERVER = {
  FATAL: 'Error interno del servidor, contacte al administrador',
};

const CRUD = {
  UPDATED: 'Registro actualizado',
  CREATED: 'Registro creado exitosamente',
  NOT_FOUND: 'Registro no encontrado o inactivo',
  CONFLICT: 'Operación invalida, genera o contiene una inconsistencia',
  NOT_EXIST: 'Un registro que no fue encontrado',
};
const AUTH = {
  INVALID_CREDENTIALS: 'Credenciales invalidas o erradas',
  NOT_FOUND: 'Usuario no encontrado o inactivo',
  EXPIRE_SESSION: 'Es necesario que vuelva a iniciar sesión',
  FORBIDDEN: (email: string) => `'${email}' no tiene permiso para esta acción`,
  INVALID: 'Solicitud es invalida',
};

const OTP = {
  SUCCESS: 'OTP registrado y solicitado exitosamente',
  NOT_FOUND:
    'No se encontró una solicitud de confirmación via OTP, vuelve solicita un código',
  INVALID: 'Otp invalido',
  EXPIRED: 'Otp expirado, vuelve a solicitar un código otp',
};

const ENTERPRISE = {
  NOT_FOUND: 'Empresa no encontrada o se encuentra inactiva',
  MAX_USER: (maxUsers: number) =>
    `Tu plan solo permite ${maxUsers} usuarios activos`,
  PLAN_NOT_FOUND: 'El plan de la empresa no fue encontrado',
};

const INVENTORY = {
  INACTIVE_PRODUCT: 'Se encontró un producto inactivo o no existe',
};

const PAYMENTS = {
  NO_CREDITS: 'El cliente no tiene deuda pendientes por pagar',
  NOTIFICATE: 'El cliente fue notificado via correo',
};

export { SERVER, CRUD, AUTH, OTP, ENTERPRISE, INVENTORY, PAYMENTS };
