// Función para cargar dinámicamente los usuarios en la tabla
async function cargarUsuarios() {
        // Realiza una solicitud GET al endpoint /usuarios para obtener los datos de los usuarios
        const response = await fetch('/usuarios');
        const usuarios = await response.json();

        // Obtén la referencia al cuerpo de la tabla
        const tablaUsuariosBody = document.getElementById('tablaUsuariosBody');

        // Limpia cualquier contenido existente en la tabla
        tablaUsuariosBody.innerHTML = '';

        // Itera sobre los usuarios y agrega una fila por cada uno
        usuarios.forEach(usuario => {
            const fila = `<tr>
                            <td>${usuario.name}</td>
                            <td>${usuario.apellido}</td>
                            <td>${usuario.userName}</td>
                            <td>${usuario.tipoUsuario}</td>
                            <td id="pass${usuario._id}">*****</td>
                            <td>
                                <!-- Botón para ver/ocultar contraseña -->
                                <button class="btn btn-success mt-1 rounded" id="verBtn${usuario._id}" onclick="verContraseña('${usuario._id}')">Ver Contraseña</button>

                                <button class="btn btn-danger mt-1 rounded" onclick="eliminarUsuario('${usuario._id}')">Eliminar</button>
                            </td>
                        </tr>`;
            tablaUsuariosBody.innerHTML += fila;
        });
    }


    async function verContraseña(usuarioId) {
    const passElement = document.getElementById(`pass${usuarioId}`);
    const verBtn = document.getElementById(`verBtn${usuarioId}`);

    try {
        if (passElement.textContent === '*****') {
            // Mostrar la contraseña
            const response = await fetch(`/usuario/${usuarioId}`);
            const usuario = await response.json();

            // Decodifica la contraseña base64
            const decodedPassword = atob(usuario.pass);

            // Actualiza el contenido del elemento con la contraseña decodificada del usuario
            passElement.textContent = decodedPassword;

            // Cambia el texto del botón
            verBtn.textContent = 'Ocultar Contraseña';
        } else {
            // Ocultar la contraseña nuevamente
            passElement.textContent = '*****';

            // Cambia el texto del botón
            verBtn.textContent = 'Ver Contraseña';
        }
    } catch (error) {
        console.error('Error al obtener/ocultar la contraseña del usuario:', error);
    }
}




// Definición de la función eliminarUsuario
function eliminarUsuario(usuarioId) {
    // Realiza una solicitud DELETE al endpoint /usuario/:id
    fetch(`/usuario/${usuarioId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
            // Puedes incluir otras cabeceras si es necesario
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al eliminar usuario: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Usuario eliminado correctamente', data);
        cargarUsuarios();
    })
    .catch(error => console.error('Error al eliminar usuario:', error));
}





// Llama a la función cargarUsuarios al cargar la página
cargarUsuarios();