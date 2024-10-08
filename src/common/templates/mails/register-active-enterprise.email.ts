import generateEmailTemplate from './generate-email-template';

const registerActiveEnterpriseEmail = (password: string, url: string) => {
  const content = `
    <p>Alguien te ha registrado en <a href="${url}">Inventas App</a>.</p>
    <p>Aquí podrás gestionar tus productos, inventarios, ventas, clientes, y cuentas por pagar de manera eficiente y sencilla.</p>
    <p>Como parte de tu registro, te hemos asignado una contraseña temporal:</p>
    <p><strong>Password Temporal: ${password}</strong></p>
    <p>Para empezar, solo debes iniciar sesión</p>
    <p>Por favor, cambia tu contraseña una vez que inicies sesión por primera vez.</p>
    <a href="${url}" class="button">Iniciar Sesión</a>
  `;
  return generateEmailTemplate('Bienvenido a Inventas-App', content);
};

export default registerActiveEnterpriseEmail;
