// Define una función para manejar el cambio de semestre
function handleSemestreChange() {
    var semestreSelect = document.getElementById('semestre');
    var especialidadSelect = document.getElementById('especialidad');
    var semestreValue = semestreSelect.value;

    // Habilita el campo de especialidad si el semestre no es 1, de lo contrario, desactívalo y establece en 'N/A'
    especialidadSelect.disabled = semestreValue === '1';
    if (semestreValue === '1') {
        especialidadSelect.value = 'N/A';
    }
}

// Función para manejar el envío del formulario
document.getElementById('envioReporte').addEventListener('submit', function (event) {
    // Habilitar el campo de especialidad antes de enviar el formulario
    document.getElementById('especialidad').disabled = false;
});

// Ejecuta la función handleSemestreChange al cargar la página para establecer el estado inicial
handleSemestreChange();

function validateDate() {
    var fechaInput = document.getElementById('fechaReporte');
    var fechaSeleccionada = new Date(fechaInput.value);
    var fechaHoy = new Date();

    // Verifica si la fecha seleccionada es válida y no es posterior a hoy
    if (isNaN(fechaSeleccionada) || fechaSeleccionada > fechaHoy) {
        alert('Selecciona una fecha válida que no sea posterior a hoy.');
        fechaInput.valueAsDate = fechaHoy;
    }
}

// Función para establecer la fecha actual al cargar la página
window.onload = function () {
    var fechaInput = document.getElementById('fechaReporte');
    var fechaHoy = new Date();
    fechaInput.valueAsDate = fechaHoy;
};






// Función para generar la carta compromiso PDF
function generarCartaCompromisoPDF() {
    
    const formData = {
        // Aquí debes colocar los datos del formulario, por ejemplo:
        nombreAlumno: document.getElementById('nombreAlumno').value,
        apellidos: document.getElementById('apellidos').value,
        nombrePadreTutor: document.getElementById('nombrePadreTutor').value,
        fechaReporte: document.getElementById('fechaReporte').value,
        semestre: document.getElementById('semestre').value,
        grupo: document.getElementById('grupo').value,
        especialidad: document.getElementById('especialidad').value,
       
    };

    // Hacer una solicitud al servidor para generar el PDF
    fetch('/generarCartaCompromisoPDF', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        // Verificar si la respuesta es un archivo PDF
        if (response.headers.get('content-type') === 'application/pdf') {
            // Crear un objeto URL para el PDF generado
            return response.blob().then(blob => {
                const url = window.URL.createObjectURL(blob);
                // Abrir el PDF en una nueva ventana del navegador
                window.open(url);
            });
        } else {
            // Si la respuesta no es un PDF, mostrar un mensaje de error
            return response.json().then(data => {
                alert(data.error || 'Error: No se pudo generar el PDF');
            });
        }
    })
    .catch(error => {
        console.error('Error al generar el PDF de la carta compromiso:', error);
        alert('Error: No se pudo generar el PDF');
    });
}

// Asignar la función generarCartaCompromisoPDF al botón correspondiente
document.getElementById('btnGenerarPDF').addEventListener('click', generarCartaCompromisoPDF);
