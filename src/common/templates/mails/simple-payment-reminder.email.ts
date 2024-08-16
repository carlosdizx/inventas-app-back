import generateEmailTemplate from './generate-email-template';
import formatAsCurrency from '../../util/format-as-currency.util';

const simplePaymentReminderEmail = (
  clientName: string,
  totalAmount: number,
  enterpriseName: string,
) => {
  const content = `
    <p>Estimado(a) ${clientName},</p>
    <p>Te recordamos que tienes un crédito pendiente con <strong>${enterpriseName}</strong>.</p>
    <p>El monto total a pagar es de <strong>$${formatAsCurrency(totalAmount)}</strong>.</p>
    <p>Por favor, realiza el pago a la brevedad posible.</p>
    <p>Gracias por tu atención.</p>
  `;
  return generateEmailTemplate('Recordatorio de Pago Pendiente', content);
};

export default simplePaymentReminderEmail;
