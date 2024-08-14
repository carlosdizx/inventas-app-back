import generateEmailTemplate from './generate-email-template';

const registerActiveEnterpriseEmail = (password: string, url: string) => {
  const content = `
    <p>¡Se te ha registrado en Inventas App!</p>
    <p>Aquí podras gestionar tus ventas, productos, inventarios, </p>
    <p>Como parte de tu registro, te hemos asignado una contraseña temporal:</p>
    <p><strong>Password Temporal: ${password}</strong></p>
    <p>Por favor, cambia tu contraseña una vez que inicies sesión por primera vez.</p>
    <p>Alguien te ha registrado en <a href="${url}">Login</a>.</p>
    <a href="${url}" class="button">Iniciar Sesión</a>
  `;
  return generateEmailTemplate('Bienvenido a Inventas-App', content);
};

export default registerActiveEnterpriseEmail;
