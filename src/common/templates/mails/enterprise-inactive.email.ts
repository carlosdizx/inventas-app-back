import generateEmailTemplate from './generate-email-template';

const enterpriseInactiveEmail = () => {
  const content = `
    <p>Te informamos que el acceso a tu empresa ha sido suspendido.</p>
    <p>Esto significa que no podrás acceder a la plataforma ni gestionar tus productos, inventarios, ventas, clientes, y cuentas por pagar.</p>
    <p>Si consideras que esto es un error o si deseas restaurar el acceso a tu empresa, por favor, ponte en contacto con nuestro equipo de soporte.</p>
    <p>Puedes acceder al portal de soporte en el siguiente enlace:</p>
    <a class="button" href="mailto:inventasapp@gmail.com">Contactar con soporte</a>
  `;
  return generateEmailTemplate(
    'El acceso a tu empresa ha sido suspendido',
    content,
  );
};

export default enterpriseInactiveEmail;
