 // Llama a la función para cargar los datos cuando la página se carga
 cargarDatos();
 
 // Función para cargar y mostrar los datos
 function cargarDatos() {
    fetch('/muestraDatos') // Cambia la ruta según tu configuración
        .then(response => response.json())
        .then(data => {
            mostrarDatos(data);

            const reportesPorNombre = obtenerNumeroReportesPorNombre(data);

            // Agrega la clase 'alumno-destacado' a las filas con 3 o más reportes
            resaltarAlumnos(reportesPorNombre);
        })
        .catch(error => console.error('Error al cargar datos:', error));
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
            
            <button  class="btn btn-warning  mt-1 rounded" onclick="generarPDF('${report._id}')">Imprimir</button>
            </td>
            `;
            tbody.appendChild(row);
        });
    } else {
        console.error('La respuesta del servidor no es un array:', data);
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
    const apellido = document.getElementById('apellido').value; // Nuevo campo de apellido
    const grupo = document.getElementById('grupo').value;
    const semestre = document.getElementById('semestre').value;
    const especialidad = document.getElementById('especialidad').value;
    const fechaInicial = document.getElementById('fechaInicial').value;
    const fechaFinal = document.getElementById('fechaFinal').value;
    
    // Construye la URL con los parámetros de filtro
    let url = '/filtrarDatos?';
    
    // Agrega cada criterio al URL solo si está presente
    if (nombre) url += `nombre=${nombre}&`;
    if (apellido) url += `apellido=${apellido}&`; // Nuevo campo de apellido
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
document.getElementById('apellido').addEventListener('input', actualizarTabla); // Nuevo evento para el campo de apellido
document.getElementById('grupo').addEventListener('change', actualizarTabla);
document.getElementById('semestre').addEventListener('change', actualizarTabla);
document.getElementById('especialidad').addEventListener('change', actualizarTabla);
document.getElementById('fechaInicial').addEventListener('input', () => actualizarTabla());
document.getElementById('fechaFinal').addEventListener('input', () => actualizarTabla());



// Función para contar el número de reportes para cada nombre
function obtenerNumeroReportesPorNombre(data) {
    const reportesPorNombre = {};

    // Contar el número de reportes para cada nombre y apellidos
    data.forEach(report => {
        const nombreAlumno = report.nombreAlumno; // Ajusta según la estructura de tu objeto
        const apellidos = report.apellidos; // Ajusta según la estructura de tu objeto

        const clave = `${nombreAlumno} ${apellidos}`;

        if (!reportesPorNombre[clave]) {
            reportesPorNombre[clave] = 1;
        } else {
            reportesPorNombre[clave]++;
        }
    });

    return reportesPorNombre;
}
async function obtenerNombreAlumnoConTresReportes() {
    try {
        // Realiza una solicitud al servidor para obtener el nombre del alumno con tres o más reportes
        const response = await fetch('/obtenerNombreAlumnoConTresReportes');
  
        // Verifica si la solicitud fue exitosa (código de estado 200)
        if (response.ok) {
            // Convierte la respuesta a JSON
            const data = await response.json();
  
            // Verifica si se recibió el nombre del alumno desde el servidor
            if (data.nombreAlumno && data.apellidos) {
                // Retorna el nombre del alumno obtenido desde el servidor
                return `${data.nombreAlumno} ${data.apellidos}`;
            } else {
                // Muestra una alerta indicando que hubo un problema al obtener el nombre del alumno
                alert('Hubo un problema al obtener el nombre del alumno. Por favor, inténtalo de nuevo.');
                return null;
            }
        } else {
            // Muestra una alerta indicando que hubo un problema al obtener el nombre del alumno
            alert('Hubo un problema al obtener el nombre del alumno. Por favor, inténtalo de nuevo.');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener el nombre del alumno:', error);
        // Muestra una alerta indicando que hubo un error al obtener el nombre del alumno
        alert('Error al obtener el nombre del alumno. Por favor, inténtalo de nuevo.');
        return null;
    }
}
async function resaltarAlumnos(reportesPorNombre) {
    const filas = document.querySelectorAll('#reportTableBody tr');
    const alumnosConTresReportes = [];

    filas.forEach(fila => {
        const nombreAlumno = fila.children[0].textContent; // Ajusta según la estructura de tu fila
        const apellidos = fila.children[1].textContent; // Ajusta según la estructura de tu fila
        const clave = `${nombreAlumno} ${apellidos}`;

        const numeroReportes = reportesPorNombre[clave] || 0;

        // Agrega la clase 'table-danger' de Bootstrap si tiene 3 o más reportes
        if (numeroReportes >= 5) {
            fila.classList.add('table-danger');

            // Agrega el alumno a la lista de alumnos con 3 reportes
            alumnosConTresReportes.push({
                nombre: nombreAlumno,
                apellidos: apellidos,
                reportes: numeroReportes
            });
        } else {
            fila.classList.remove('table-danger'); // Asegura que la clase se elimine si no cumple con el criterio
        }
    });
    
    // Muestra la notificación con la lista de alumnos
    mostrarNotificacion(alumnosConTresReportes);
}
async function verificarCitatorioExistente(nombreAlumno, apellidos) {
    try {
        // Modifica la URL para incluir tanto el nombre como los apellidos
        const url = `/verificarCitatorioExistente/${encodeURIComponent(nombreAlumno)}/${encodeURIComponent(apellidos)}`;
       
        const response = await fetch(url);

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
async function mostrarNotificacion(alumnosConTresReportes) {
    
    // Agrupa los reportes por nombre y apellidos de alumno
    const reportesPorAlumno = {};
    alumnosConTresReportes.forEach(alumno => {
        const nombre = alumno.nombre;
        const apellidos = alumno.apellidos;
        const clave = `${nombre} ${apellidos}`;
        const reportes = alumno.reportes;

        if (!reportesPorAlumno[clave]) {
            reportesPorAlumno[clave] = {
                nombre: nombre,
                apellidos: apellidos,
                reportes: reportes
            };
        } else {
            reportesPorAlumno[clave].reportes = reportes;
        }
    });

    const tablaHTML = `
    <div class="table-responsive">
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th scope="col">Nombre del Alumno</th>
                    <th scope="col">Apellidos del Alumno</th>
                    <th scope="col">Número de Reportes</th>
                    
                </tr>
            </thead>
            <tbody>
                ${Object.values(reportesPorAlumno).map(alumno => `
                    <tr>
                        <td>${alumno.nombre}</td>
                        <td>${alumno.apellidos}</td>
                        <td>${alumno.reportes}</td>
                       
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
    document.querySelectorAll('.generarCitatorioBtn').forEach(async btn => {
        const nombreAlumno = btn.getAttribute('data-alumno');
        const apellidosAlumno = btn.getAttribute('data-apellidos');
        const existeCitatorio = await verificarCitatorioExistente(nombreAlumno, apellidosAlumno);

        if (!existeCitatorio) {
            btn.addEventListener('click', async () => {
                await generarCitatorioBtn(nombreAlumno, apellidosAlumno);
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






