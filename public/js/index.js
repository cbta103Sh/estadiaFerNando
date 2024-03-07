function mostrarRazones(tipoReporte) {
    // Oculta todos los campos de razón
    document.querySelector('.razonAcademico').style.display = 'none';
    document.querySelector('.razonConducta').style.display = 'none';
    document.querySelector('.razonOtro').style.display = 'none';

    // Muestra el campo de razón correspondiente al tipo de reporte seleccionado
    if (tipoReporte === 'academico') {
        document.querySelector('.razonAcademico').style.display = 'block';
    } else if (tipoReporte === 'conducta') {
        document.querySelector('.razonConducta').style.display = 'block';
    } else if (tipoReporte === 'otro') {
        document.querySelector('.razonOtro').style.display = 'block';
    }
}
 // Obtiene referencias a los elementos del DOM
 var semestreSelect = document.getElementById('semestre');
 var especialidadSelect = document.getElementById('especialidad');

 // Define una función para manejar el cambio de semestre
 function handleSemestreChange() {
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
        especialidadSelect.disabled = false;
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

