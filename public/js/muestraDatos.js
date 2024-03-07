 // Llama a la función para cargar los datos cuando la página se carga
 cargarDatos();
 
 // Función para cargar y mostrar los datos
 async function cargarDatos() {
    try {
        const response = await fetch('/muestraDatos');
        const data = await response.json();
        
        mostrarDatos(data);

        const reportesPorNoControl = await obtenerNumeroReportesPorNoControl(data);

        // Agrega la clase 'alumno-destacado' a las filas con 3 o más reportes
        resaltarAlumnos(reportesPorNoControl);
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}


// Función para mostrar los datos en la tabla
function mostrarDatos(data) {
    const tbody = document.getElementById('reportTableBody');
    tbody.innerHTML = '';
    
    if (Array.isArray(data)) {
        data.forEach(report => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${report.No_Control}</td>
            <td>${report.nombreAlumno}</td>
            <td>${report.apellidos}</td>
            <td>${report.nombrePadreTutor}</td>
            <td>${report.fechaReporte}</td>
            <td>${report.semestre}</td>
            <td>${report.grupo}</td>
            <td>${report.especialidad}</td>
            <td>${report.tipoReporte}</td>
            <td>${report.razon}</td>
            <td>${report.motivo}</td>
            <td>
            <button class="btn btn-danger mt-1 rounded" onclick="eliminarReporte('${report._id}')">Eliminar</button> <br>
            <button  class="btn btn-warning  mt-1 rounded" onclick="generarPDF('${report._id}')">Imprimir</button>
            </td>
            `;
            tbody.appendChild(row);
        });
    } else {
        console.error('La respuesta del servidor no es un array:', data);
    }
}

function eliminarReporte(reportId) {
    if (confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
        // Confirmación del usuario antes de eliminar
        
        fetch(`/eliminarReporte/${reportId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al eliminar reporte con ID ${reportId}`);
            }
            // Si la respuesta es exitosa, puedes actualizar la interfaz de usuario según sea necesario
            console.log(`Reporte con ID ${reportId} eliminado exitosamente`);
            // Vuelve a cargar los datos después de la eliminación
            cargarDatos();
        })
        .catch(error => console.error('Error al eliminar reporte:', error));
    }
}
function generarPDF(reportId) {
    // Realiza una solicitud al servidor para generar el PDF
    fetch(`/generarPDF/${reportId}`)
    .then(response => response.blob())
    .then(blob => {
        // Crea un objeto URL para el blob
        const blobURL = URL.createObjectURL(blob);
        
        // Crea un enlace y simula un clic para descargar el archivo
        const a = document.createElement('a');
        a.href = blobURL;
        a.download = `reporte_${reportId}.pdf`;
        a.click();
        
        // Libera el objeto URL después de un breve retraso
        setTimeout(() => URL.revokeObjectURL(blobURL), 100);
    })
    .catch(error => console.error('Error al generar el PDF:', error));
}
function actualizarTabla() {
    console.log("Evento de cambio detectado. Ejecutando actualizarTabla...");
    
    // Obtén los valores de los filtros
    
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value; 
    const grupo = document.getElementById('grupo').value;
    const semestre = document.getElementById('semestre').value;
    const especialidad = document.getElementById('especialidad').value;
    const fechaInicial = document.getElementById('fechaInicial').value;
    const fechaFinal = document.getElementById('fechaFinal').value;
    
    // Construye la URL con los parámetros de filtro
    let url = '/filtrarDatos?';
    
    // Agrega cada criterio al URL solo si está presente
   
    if (nombre) url += `nombre=${nombre}&`;
    if (apellido) url += `apellido=${apellido}&`; 
    if (grupo) url += `grupo=${grupo}&`;
    if (semestre) url += `semestre=${semestre}&`;
    if (especialidad) url += `especialidad=${especialidad}&`;
    if (fechaInicial) url += `fechaInicial=${fechaInicial}&`;
    if (fechaFinal) url += `fechaFinal=${fechaFinal}&`;
    
    console.log("URL construida:", url);
    
    // Realiza la solicitud al servidor con la URL construida
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error de red: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Datos recibidos:", data);
        
        // Limpia la tabla
        const tableBody = document.getElementById('reportTableBody');
        tableBody.innerHTML = "";
        
        // Si hay datos, agrega las filas a la tabla
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(report => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${report.No_Control}</td>
                <td>${report.nombreAlumno}</td>
                <td>${report.apellidos}</td>
                <td>${report.nombrePadreTutor}</td>
                <td>${report.fechaReporte}</td>
                <td>${report.semestre}</td>
                <td>${report.grupo}</td>
                <td>${report.especialidad}</td>
                <td>${report.tipoReporte}</td>
                <td>${report.razon}</td>
                <td>${report.motivo}</td>
                <td>
                <button class="btn btn-danger mt-1 rounded" onclick="eliminarReporte('${report._id}')">Eliminar</button>
                
                <button class="btn btn-warning mt-1 rounded" onclick="generarPDF('${report._id}')">Imprimir</button>
                </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            console.log("No se recibieron datos o los datos están vacíos.");
        }
    })
    .catch(error => console.error('Error al cargar datos:', error));
}
// Enlaza la función actualizarTabla a los eventos de cambio en los campos de filtro

document.getElementById('nombre').addEventListener('input', actualizarTabla);
document.getElementById('apellido').addEventListener('input', actualizarTabla); 
document.getElementById('grupo').addEventListener('change', actualizarTabla);
document.getElementById('semestre').addEventListener('change', actualizarTabla);
document.getElementById('especialidad').addEventListener('change', actualizarTabla);
document.getElementById('fechaInicial').addEventListener('input', () => actualizarTabla());
document.getElementById('fechaFinal').addEventListener('input', () => actualizarTabla());



// Función para contar el número de reportes para cada nombre
async function obtenerNumeroReportesPorNoControl(data) {
    const reportesPorNoControl = {};

    // Contar el número de reportes para cada número de control
    data.forEach(report => {
        const No_Control = report.No_Control; // Ajusta según la estructura de tu objeto
        
        if (!reportesPorNoControl[No_Control]) {
            reportesPorNoControl[No_Control] = 1;
            
        } else {
            reportesPorNoControl[No_Control]++;
        }
    });

    return reportesPorNoControl;
}


async function resaltarAlumnos(reportesPorNoControl) {
    try {
        const filas = document.querySelectorAll('#reportTableBody tr');
        const alumnosConTresReportes = [];

        filas.forEach(fila => {
            const No_Control = fila.children[0].textContent; // Ajusta según la estructura de tu fila
           // console.log("numero: ", No_Control)
            const numeroReportes = reportesPorNoControl[No_Control] || 0;
            
            if (numeroReportes >= 5) {
                fila.classList.add('table-danger');
                alumnosConTresReportes.push({
                    No_Control: No_Control,
                    reportes: numeroReportes
                });
                
            } else {
                fila.classList.remove('table-danger');
            }
        });
        
       //console.log('Alumnos con tres reportes:', alumnosConTresReportes);
        
        mostrarNotificacion(alumnosConTresReportes);
    } catch (error) {
        console.error('Error al resaltar alumnos:', error);
    }
}



async function obtenerNombreAlumnoConTresReportes() {
    try {
        const response = await fetch('/obtenerNombreAlumnoConTresReportes');
  
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            if (data.No_Control) {
                return data.No_Control;
                
            } else {
                console.error('No se recibió el número de control del alumno desde el servidor:', data);
                return null;
            }
        } else {
            console.error('Error al obtener el número de control del alumno:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error al obtener el número de control del alumno:', error);
        return null;
    }
}




async function mostrarNotificacion(alumnosConTresReportes) {
    
    // Crea un objeto para almacenar los reportes por número de control de alumno
    const reportesPorNoControl = {};
    
    // Recorre la lista de alumnos con tres reportes
    alumnosConTresReportes.forEach(alumno => {
        const No_Control = alumno.No_Control;
        const reportes = alumno.reportes;

        // Almacena el número de reportes en el objeto reportesPorNoControl
        reportesPorNoControl[No_Control] = reportes;
    });

    // Construye la tabla HTML
    const tablaHTML = `
    <div class="table-responsive">
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th scope="col">Número de Control</th>
                    <th scope="col">Número de Reportes</th>
                    <th scope="col">Acción</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(reportesPorNoControl).map(([No_Control, reportes]) => `
                    <tr>
                        <td>${No_Control}</td>
                        <td>${reportes}</td>
                        <td>
                            <button class="generarCitatorioBtn btn btn-warning btn-sm" data-noControl="${No_Control}">
                                Generar Citatorio
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    `;
    
    // Selecciona el contenedor de toasts de Bootstrap
    const contenedorToast = document.getElementById('contenedorToast');
    
    // Crea un nuevo elemento toast de Bootstrap
    const toast = new bootstrap.Toast(document.getElementById('notificacionToast'));

    // Cambia el contenido de la notificación con la tabla HTML
    document.getElementById('toastBody').innerHTML = tablaHTML;
    
    // Agrega el evento click a los botones de generación de citatorio
    document.querySelectorAll('.generarCitatorioBtn').forEach(async btn => {
        const noControl = btn.getAttribute('data-noControl');
        const existeCitatorio = await verificarCitatorioExistente(noControl);

        if (!existeCitatorio) {
            btn.addEventListener('click', async () => {
                await generarCitatorioBtn(noControl);
                // Después de generar el citatorio, elimina la fila de la tabla
                const fila = btn.closest('tr');
                fila.parentNode.removeChild(fila);
            }); 
        } else {
            // Si ya hay un citatorio, elimina la fila de la tabla
            const fila = btn.closest('tr');
            fila.parentNode.removeChild(fila);
        }
    });

    // Muestra la notificación
    toast.show();
}




async function verificarCitatorioExistente(No_Control) {
    try {
        // Modifica la URL para incluir el número de control
        const url = `/verificarCitatorioExistente/${encodeURIComponent(No_Control)}`;
       
        const response = await fetch(url);
        console.log("consola mensaje", url)
        if (response.ok) {
            const data = await response.json();
            
            return data.existeCitatorio;
        } else {
            // Manejar el caso de respuesta no exitosa (status diferente a 200)
            console.error('Error al verificar citatorio existente:', response.status);
            throw new Error('Error al verificar citatorio existente');
        }
    } catch (error) {
        // Manejar errores generales, como problemas de red
        console.error('Error al verificar citatorio existente:', error.message || error);
        return false;
    }
}



async function generarCitatorioBtn(No_Control) {
    try {
        // Modifica la URL para incluir el número de control
        const url = `/generarCitatorio/${encodeURIComponent(No_Control)}`;
        console.log('URL de la solicitud:', url);

        // Realiza una solicitud al servidor para generar el citatorio
        const response = await fetch(url);

        // Verifica si la solicitud fue exitosa (código de estado 200)
        if (response.ok) {
            // Muestra una alerta indicando que el citatorio se generó y guardó correctamente
            alert('Citatorio generado y guardado en la base de datos correctamente.');
        } else {
            // Muestra una alerta indicando que hubo un problema al generar el citatorio
            alert('Hubo un problema al generar el citatorio. Por favor, inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error al generar citatorio:', error);

        // Muestra una alerta indicando el tipo de error
        alert(`Error al generar citatorio: ${error.message || 'Error desconocido'}. Por favor, inténtalo de nuevo.`);
    }
}

function imprimirHistorial() {
    // Obtén los valores de los filtros
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const grupo = document.getElementById('grupo').value;
    const semestre = document.getElementById('semestre').value;
    const especialidad = document.getElementById('especialidad').value;
    const fechaInicial = document.getElementById('fechaInicial').value;
    const fechaFinal = document.getElementById('fechaFinal').value;

    // Construye la URL con los parámetros de filtro
    let url = `/imprimirHistorial?`;

    // Agrega cada criterio al URL solo si está presente
    if (nombre) url += `nombre=${nombre}&`;
    if (apellido) url += `apellido=${apellido}&`;
    if (grupo) url += `grupo=${grupo}&`;
    if (semestre) url += `semestre=${semestre}&`;
    if (especialidad) url += `especialidad=${especialidad}&`;
    if (fechaInicial) url += `fechaInicial=${fechaInicial}&`;
    if (fechaFinal) url += `fechaFinal=${fechaFinal}&`;

    // Abre una nueva ventana o pestaña del navegador con la URL construida
    window.open(url, '_blank');
}

// Función para manejar la eliminación de los reportes del sexto semestre
async function eliminarSextosSemestres() {
    // Verificar si hay alumnos de sexto semestre
    const sextoSemestreCount = await obtenerCantidadSextoSemestre();
  
    if (sextoSemestreCount === 0) {
      alert('No hay alumnos de sexto semestre.');
      return;
    }
  
    // Pedir confirmación al usuario
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar los alumnos del sexto semestre?');
  
    if (confirmacion) {
      // Enviar solicitud al servidor para eliminar los reportes del sexto semestre
      fetch('/eliminarSextosSemestres', {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          alert('Los reportes del sexto semestre han sido eliminados correctamente.');
        } else {
          throw new Error('Error al eliminar los reportes del sexto semestre.');
        }
      })
      .catch(error => {
        console.error('Error al eliminar los reportes del sexto semestre:', error);
        alert('Error al eliminar los reportes del sexto semestre. Por favor, inténtalo de nuevo.');
      });
    } else {
      alert('Operación de eliminación cancelada.');
    }
  }
  
  // Función para obtener la cantidad de alumnos del sexto semestre
  async function obtenerCantidadSextoSemestre() {
    const response = await fetch('/obtenerCantidadSextoSemestre');
    const data = await response.json();
    return data.count;
  }
  



