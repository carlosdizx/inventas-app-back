import generateEmailTemplate from './generate-email-template';

const notificationOtpUserEmail = (code: string) => {
  const content = `
    <p>¡Tu acción debe ser confirmada!</p>
    <p>Como parte de tu confirmación debes ingresar el siguiente código OTP:</p>
    <p><strong>Código: ${code}</strong></p>
    <p>Si crees que esto es un error comunicate con soporte.</p>
    <p>Correo de soporte: inventasapp@gmail.com</p>
  `;
  return generateEmailTemplate('Confirma tu solicitud', content);
};

export default notificationOtpUserEmail;
