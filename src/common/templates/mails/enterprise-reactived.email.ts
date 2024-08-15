import generateEmailTemplate from './generate-email-template';

const enterpriseReactivatedEmail = (url: string) => {
  const content = `
    <p>¡Buenas noticias! El acceso a tu empresa ha sido restaurado.</p>
    <p>Ahora puedes volver a acceder a la plataforma y gestionar tus productos, inventarios, ventas, clientes, y cuentas por pagar como de costumbre.</p>
    <p>Para empezar, solo debes iniciar sesión en el siguiente enlace:</p>
    <a href="${url}" class="button">Iniciar Sesión</a>
    <p>Si tienes alguna pregunta o necesitas asistencia, nuestro equipo de soporte está aquí para ayudarte.</p>
  `;
  return generateEmailTemplate(
    'El acceso a tu empresa ha sido restaurado',
    content,
  );
};

export default enterpriseReactivatedEmail;
