cargarCitatorios();
function cargarCitatorios() {
  fetch('/obtener-citatorios') // Cambia la ruta según tu configuración
      .then(response => response.json())
      .then(data => {
          mostrarCitatorios(data);
      })
      .catch(error => console.error('Error al cargar citatorios:', error));
}

// Función para mostrar los citatorios en la tabla
function mostrarCitatorios(data) {
  const tbody = document.getElementById('reportTableBody');
  tbody.innerHTML = '';
  
  if (Array.isArray(data)) {
      data.forEach(citatorio => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${citatorio.nombreAlumno}</td>
              <td>${citatorio.apellidos}</td>
              <td>${citatorio.nombrePadreTutor}</td>
              <td>${new Date(citatorio.fechaCitatorio).toLocaleDateString()}</td>
              
              <td>
              <button class="btn btn-danger mt-1 rounded" onclick="eliminarCitatorio('${citatorio._id}')">Eliminar</button>
              <br>
              <button class="btn btn-warning mt-1 rounded" onclick="generarCitatorioPDF('${citatorio._id}')">Generar PDF</button>

              </td>
          `;
          tbody.appendChild(row);
      });
  } else {
      console.error('La respuesta del servidor no es un array:', data);
  }
}

function generarCitatorioPDF(citatorioId) {
  // Realiza una solicitud al servidor para generar el PDF
  fetch(`/generarCitatorioPDF/${citatorioId}`)
  .then(response => response.blob())
  .then(blob => {
      // Crea un objeto URL para el blob
      const blobURL = URL.createObjectURL(blob);
      
      // Crea un enlace y simula un clic para descargar el archivo
      const a = document.createElement('a');
      a.href = blobURL;
      a.download = `citatorio_${citatorioId}.pdf`;
      a.click();
      
      // Libera el objeto URL después de un breve retraso
      setTimeout(() => URL.revokeObjectURL(blobURL), 100);
  })
  .catch(error => console.error('Error al generar el PDF del citatorio:', error));
}

function eliminarCitatorio(id) {
    // Mostrar una alerta de confirmación al usuario
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este citatorio?');

    // Verificar si el usuario confirmó la eliminación
    if (confirmacion) {
        fetch(`/eliminar-citatorio/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                console.log('Citatorio eliminado correctamente');
                // Volver a cargar los citatorios después de eliminar uno
                cargarCitatorios();
            } else {
                console.error('Error al eliminar citatorio');
            }
        })
        .catch(error => console.error('Error al eliminar citatorio:', error));
    }
}
