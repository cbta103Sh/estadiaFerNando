async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName: username, pass: password })
        });

        // Verifica el tipo de contenido de la respuesta
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();

            if (response.status === 200) {
                // Redirige según el tipo de usuario
                if (data.message === 'Administrador') {
                    window.location.href = '/addReport.html'; 
                } else if (data.message === 'Prefecto') {
                    window.location.href = '/prefectosAdd.html'; 
                } else {
                    document.getElementById('message').innerText = 'Acceso no autorizado';
                }
            } else {
                document.getElementById('message').innerText = 'Credenciales incorrectas';
            }
        } else {
            // Si no es JSON, muestra un mensaje de error
            document.getElementById('message').innerText = 'Respuesta no válida del servidor';
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        document.getElementById('message').innerText = 'Error al iniciar sesión';
    }
}
