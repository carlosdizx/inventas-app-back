const notificationOtpUserEmail = (code: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            padding: 50px;
        }
        .container {
            background-color: #fff;
            margin: auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            text-align: center;
        }
        h1 {
            color: #007bff;
        }
        .button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
        }
        p {
            line-height: 1.6;
        }
    </style>
    <title>Registro Exitoso</title>
</head>
<body>
    <div class="container">
        <h1>Confirma tu solicitud</h1>
        <p>¡Tu acción debe ser confirmada!</p>
        <p>Como parte de tu confirmación debes ingresar el siguiente código OTP:</p>
        <p><strong>Código: ${code}</strong></p>
        <p>Si crees que esto es un error comunicate con soporte.</p>
        <p>Correo de soporte: inventasapp@gmail.com</p>
    </div>
</body>
</html>
`;

export default notificationOtpUserEmail;
