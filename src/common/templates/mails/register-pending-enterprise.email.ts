import generateEmailTemplate from './generate-email-template';

const registerPendingEnterpriseEmail = (password: string, url: string) => {
  const content = `
    <p>¡Te damos la bienvenida a nuestra plataforma!</p>
    <p>Aquí podrás gestionar tus productos, inventarios, ventas, clientes, y cuentas por pagar de manera eficiente y sencilla.</p>
    <p>Como parte de tu registro, te hemos asignado una contraseña temporal:</p>
    <p><strong>Password Temporal: ${password}</strong></p>
    <p>Por favor, cambia tu contraseña una vez que inicies sesión por primera vez.</p>
    <a href="${url}" class="button">Iniciar Sesión</a>
    <p><strong>Tu empresa se encuentra en estado pendiente aprobación</strong></p>
  `;
  return generateEmailTemplate('Registro exitoso en Inventas-App', content);
};

export default registerPendingEnterpriseEmail;
