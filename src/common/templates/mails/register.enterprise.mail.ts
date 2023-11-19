const registerEnterpriseMail = (password: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            text-align: center;
            padding: 50px;
        }
        .container {
            background-color: #fff;
            margin: auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
        }
        .button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bienvenido a Inventas-App</h1>
        <p>¡Tu registro se ha completado con éxito!</p>
        <p>Como parte de tu registro, te hemos asignado una contraseña temporal:</p>
        <p><strong>Password Temporal: ${password}</strong></p>
        <p>Por favor, cambia tu contraseña una vez que inicies sesión por primera vez.</p>
    </div>
</body>
</html>
`;

export default registerEnterpriseMail;
