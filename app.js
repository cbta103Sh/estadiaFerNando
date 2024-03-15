  const express = require('express');
  const mongoose = require('./db');
  const path = require('path');
  const fs = require('fs');
  const bodyParser = require('body-parser');
  const { jsPDF } = require('jspdf');
  require('jspdf-autotable');
  const moment = require('moment');
  moment.locale('es'); 
  const Report = require('./models/reorteModel')
  const Citatorio = require('./models/citatorioModel');
  const Usuario = require('./models/userModel')
  const cors = require ('cors');
  const session = require('express-session');
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  


// Middleware de autorización para Administrador
const isAdmin = (req, res, next) => {
  if (req.user && req.user.tipoUsuario === 'Administrador') {
    next(); // Permitir acceso a la siguiente ruta
  } else {
    res.status(403).json({ message: 'Acceso no autorizado' });
  }
};

// Rutas para el rol de Administrador
app.get('/addReport', isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'addReport.html'));
});

app.get('/addUser', isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'addUser.html'));
});

app.get('/cartasCom', isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cartasCom.html'));
});

app.get('/citatorio', isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'citatorio.html'));
});

app.get('/muestraUsers', isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'muestraUsers.html'));
});

app.get('/muestraDatos', isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'muestraDatos.html'));
});

// Middleware de autorización para Prefecto
const isPrefect = (req, res, next) => {
  if (req.user && req.user.tipoUsuario === 'Prefecto') {
    next(); // Permitir acceso a la siguiente ruta
  } else {
    res.status(403).json({ message: 'Acceso no autorizado' });
  }

};
// Rutas para el rol de Prefecto
app.get('/prefecctosAdd', isPrefect, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'prefecctosAdd.html'));
});

app.get('/prefectosMuestra', isPrefect, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'prefectosMuestra.html'));
});








  /*--------------------Endpoint login ---------------------------*/
  app.post('/login', async (req, res) => {
    try {
      const { userName, pass } = req.body;
      
      // Busca al usuario por nombre de usuario en la base de datos
      const usuario = await Usuario.findOne({ userName });
      
      // Verifica si el usuario existe
      if (!usuario) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }
      
      // Decodifica la contraseña almacenada en base64
      const decodedPassword = Buffer.from(usuario.pass, 'base64').toString('utf-8');
      
      // Compara la contraseña proporcionada con la almacenada en la base de datos
      if (pass !== decodedPassword) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }
      
      // Envía la información del tipo de usuario como respuesta JSON
      if (usuario.tipoUsuario === 'Administrador') {
        res.json({ message: 'Administrador' });
      } else if (usuario.tipoUsuario === 'Prefecto') {
        res.json({ message: 'Prefecto' });
      } else {
        res.status(403).json({ message: 'Acceso no autorizado' });
      }
      
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  });
  
  
  /*--------------------Endpoints del archivo addReport.html ---------------------------*/
  
  app.get('/', async (req, res) => {
    
    res.sendFile(path.join(__dirname, 'public', 'Login.html'));
  });
  app.post('/create-report', isAdmin , async (req, res) => {
    try {
      // Captura los datos del formulario
      const {
        No_Control,
        nombreAlumno,
        apellidos,
        nombrePadreTutor,
        fechaReporte,
        semestre,
        grupo,
        especialidad,
        tipoReporte,
        motivo,
      } = req.body;
      
      let razon;
      
      switch (tipoReporte) {
        case 'academico':
        razon = req.body.razonAcademico || '';
        break;
        case 'conducta':
        razon = req.body.razonConducta || '';
        break;
        case 'otro':
        razon = req.body.razonOtro || '';
        break;
        default:
        // Manejo de errores o asignar un valor por defecto
        break;
      }
      
      const newReport = new Report({
        No_Control,
        nombreAlumno,
        apellidos,
        nombrePadreTutor,
        fechaReporte,
        semestre,
        grupo,
        especialidad,
        tipoReporte,
        razon,
        motivo,
      });
      
      await newReport.save();
      res.send('<script>alert("Dato añadido con éxito"); window.location.href = "/addReport.html";</script>');
    } catch (error) {
      console.log('Error al crear un nuevo reporte:', error);
      res.status(500).send('Error al crear un nuevo reporte');
    }
  });
  
  app.post('/create-report-prefectos',  async (req, res) => {
    try {
      // Captura los datos del formulario
      const {
        No_Control,
        nombreAlumno,
        apellidos,
        nombrePadreTutor,
        fechaReporte,
        semestre,
        grupo,
        especialidad,
        tipoReporte,
        motivo,
      } = req.body;
      
      let razon;
      
      switch (tipoReporte) {
        case 'academico':
        razon = req.body.razonAcademico || '';
        break;
        case 'conducta':
        razon = req.body.razonConducta || '';
        break;
        case 'otro':
        razon = req.body.razonOtro || '';
        break;
        default:
        // Manejo de errores o asignar un valor por defecto
        break;
      }
      
      const newReport = new Report({
        No_Control,
        nombreAlumno,
        apellidos,
        nombrePadreTutor,
        fechaReporte,
        semestre,
        grupo,
        especialidad,
        tipoReporte,
        razon,
        motivo,
      });
      
      await newReport.save();
      res.send('<script>alert("Dato añadido con éxito"); window.location.href = "/prefectosAdd.html";</script>');
    } catch (error) {
      console.log('Error al crear un nuevo reporte:', error);
      res.status(500).send('Error al crear un nuevo reporte');
    }
  });
  
  // Ruta para generar el PDF de un reporte específico
  app.get('/generarPDF/:reportId', async (req, res) => {
    try {
      const reportId = req.params.reportId;
      const report = await Report.findById(reportId);
      
      if (!report) {
        return res.status(404).json({ error: 'Reporte no encontrado' });
      }
      const formattedDate = moment(report.fechaReporte).format('DD/MM/YYYY');
      
      // Genera el PDF
      const pdf = new jsPDF();
      const contenido = `
      Reporte Escolar
      Estimado padre, madre o tutor ${report.nombrePadreTutor},
      El día ${formattedDate} se realizó un reporte a su hijo ${report.nombreAlumno} del 
      semestre: ${report.semestre} 
      y grupo: ${report.grupo}
      Por el siguiente motivo:
      ${report.motivo}
      `;
      const lines = pdf.splitTextToSize(contenido, pdf.internal.pageSize.width - 40);
      pdf.text(20, 40, lines);
      
      // Agregar imágenes
      const leftImagePath = path.join(__dirname, 'public', 'img', 'sep.png'); // Ruta de la imagen izquierda
      const rightImagePath = path.join(__dirname, 'public', 'img', 'Emblema_CBTA.png'); // Ruta de la imagen derecha
      
      const leftImage = fs.readFileSync(leftImagePath);
      const rightImage = fs.readFileSync(rightImagePath);
      
      // Medidas de las imágenes
      const leftImgWidth = 50; // Ancho de la imagen izquierda
      const leftImgHeight = 20; // Alto de la imagen izquierda
      const rightImgWidth = 60; // Ancho de la imagen derecha
      const rightImgHeight = 20; // Alto de la imagen derecha
      
      // Añade imagen izquierda
      pdf.addImage(leftImage, 'JPEG', 10, 10, leftImgWidth, leftImgHeight);
      
      // Añade imagen derecha
      const pageWidth = pdf.internal.pageSize.getWidth(); // Ancho de la página
      const marginRight = 10; // Margen derecho para la imagen
      const marginTop = 10; // Margen superior para la imagen
      pdf.addImage(rightImage, 'JPEG', pageWidth - rightImgWidth - marginRight, marginTop, rightImgWidth, rightImgHeight);
      
      // Espacios para firmas
      const signatureY = pdf.internal.pageSize.getHeight() - 30; // Posición vertical de las firmas
      pdf.line(10, signatureY, 90, signatureY); // Línea para la firma Prefectura
      pdf.text('Firma Prefectura', 30, signatureY + 5); // Texto para la firma Prefectura
      pdf.line(pageWidth - 90, signatureY, pageWidth - 10, signatureY); // Línea para la firma Control Escolar
      pdf.text('Firma Control Escolar', pageWidth - 90, signatureY + 5); // Texto para la firma Control Escolar
      
      // Envía el PDF como respuesta
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=reporte_${reportId}.pdf`);
      
      // Convierte el ArrayBuffer a Buffer antes de enviarlo
      const buffer = Buffer.from(pdf.output('arraybuffer'));
      res.end(buffer);
      
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      res.status(500).json({ error: 'Error al generar el PDF' });
    }
  });
  
  app.post('/generarCartaCompromisoPDF', (req, res) => {
    try {
      const { nombreAlumno, apellidos, nombrePadreTutor, fechaReporte, semestre, grupo, especialidad, razonOtro, motivo } = req.body;
      
      // Formatear fecha
      const formattedDate = moment(fechaReporte).format('DD/MM/YYYY');
      
      // Generar el PDF
      const pdf = new jsPDF();
      
      // Configurar el tamaño de fuente más grande para el título "Carta Compromiso"
      pdf.setFontSize(20); // Tamaño de fuente más grande
      pdf.text('CARTA COMPROMISO DE SEGUIMIENTO', pdf.internal.pageSize.getWidth() / 2, 60, { align: 'center' }); // Alineación centrada
      
      // Configurar el tamaño de fuente normal para el contenido de la carta compromiso
      pdf.setFontSize(12); // Tamaño de fuente normal
      
      // Agregar la fecha en la esquina superior derecha
      pdf.text(`Cosio, Aguascalientes a ${formattedDate}`, pdf.internal.pageSize.getWidth() - 20, 40, { align: 'right' });
      
      // Agregar contenido
      const contentLines = [
        `Por medio de la presente Yo ${nombreAlumno} ${apellidos}, alumno(a) perteneciente al ${semestre}° semestre del grupo ${grupo}, reafirmo mi compromiso por el cumplimiento del Reglamento General de Alumnos del Centro de Bachillerato Tecnológico Agropecuario No. 103 "Saturnino Hernan", por ello manifiesto que soy consciente, que si llegara a incumplir alguna de las condiciones ahí expuestas CONSTARÁ BAJA DEFINITIVA debido a la reincidencia a la mala conducta y bajo rendimiento académico.`,
        
        '', // Salto de línea adicional para un interlineado más amplio
        
        `Cabe señalar que Yo ${nombrePadreTutor} padre/madre o tutor de la/el estudiante antes mencionado, he sido notificado DE FORMA REITERADA de la situación académica y de conducta de mi hijo(a), me comprometo a darle el seguimiento preciso y mantener una comunicación efectiva con las autoridades del plantel, con pleno reconocimiento de las consecuencias que le traerá al alumno el no cumplir con las condiciones antes expuestas.`,
        
        '', // Salto de línea adicional para un interlineado más amplio
        
        `Lo anterior con el propósito de favorecer a mi desempeño académico, buscando en todo momento responsabilizarme de tener un mejoramiento en mi conducta y desempeño, con la finalidad de terminar el bachillerato en tiempo y forma.`,
        
        '', // Salto de línea adicional para un interlineado más amplio
        
        `Sin más por el momento me despido, no sin antes reiterar mi compromiso con la armonía y el buen desempeño del grupo que me corresponde.`,
      ];
      // Agregar imágenes
      const leftImagePath = path.join(__dirname, 'public', 'img', 'sep.png'); // Ruta de la imagen izquierda
      const rightImagePath = path.join(__dirname, 'public', 'img', 'Emblema_CBTA.png'); // Ruta de la imagen derecha
      
      const leftImage = fs.readFileSync(leftImagePath);
      const rightImage = fs.readFileSync(rightImagePath);
      
      // Medidas de las imágenes
      const leftImgWidth = 50; // Ancho de la imagen izquierda
      const leftImgHeight = 20; // Alto de la imagen izquierda
      const rightImgWidth = 60; // Ancho de la imagen derecha
      const rightImgHeight = 20; // Alto de la imagen derecha
      
      // Añade imagen izquierda
      pdf.addImage(leftImage, 'JPEG', 10, 10, leftImgWidth, leftImgHeight);
      
      // Añade imagen derecha
      const pageWidth = pdf.internal.pageSize.getWidth(); // Ancho de la página
      const marginRight = 10; // Margen derecho para la imagen
      const marginTop = 10; // Margen superior para la imagen
      pdf.addImage(rightImage, 'JPEG', pageWidth - rightImgWidth - marginRight, marginTop, rightImgWidth, rightImgHeight);
      
      
      // Dividir el contenido en líneas que se ajusten al ancho de la página
      const splitContent = pdf.splitTextToSize(contentLines.join('\n'), pdf.internal.pageSize.getWidth() - 40);
      
      // Agregar el contenido al PDF
      pdf.text(splitContent, 20, 80);
      
      const lineWidth = 80;
      // Posición vertical de las firmas
      const signatureY = pdf.internal.pageSize.getHeight() - 50; // Posición vertical de las firmas
      
      // Firma Prefectura 1
      pdf.line(20, signatureY, 20 + lineWidth, signatureY); // Línea para la firma Prefectura
      pdf.text('Firma Prefectura', 20 + lineWidth / 2 - 20, signatureY + 5); // Texto para la firma Prefectura
      
      // Firma Control Escolar 1
      pdf.line(20 + lineWidth + 20, signatureY, 20 + lineWidth * 2 + 20, signatureY); // Línea para la firma Control Escolar
      pdf.text('Firma Control Escolar', 20 + lineWidth * 3 / 2, signatureY + 5); // Texto para la firma Control Escolar
      
      // Firma Prefectura 2
      pdf.line(20, signatureY - 30, 20 + lineWidth, signatureY - 30); // Línea para la firma Prefectura
      pdf.text('Firma Prefectura', 20 + lineWidth / 2 - 20, signatureY - 25); // Texto para la firma Prefectura
      
      // Firma Control Escolar 2
      pdf.line(20 + lineWidth + 20, signatureY - 30, 20 + lineWidth * 2 + 20, signatureY - 30); // Línea para la firma Control Escolar
      pdf.text('Firma Control Escolar', 20 + lineWidth * 3 / 2, signatureY - 25); // Texto para la firma Control Escolar
      
      
      const nombreArchivoPDF = `cartaCompromiso_${nombreAlumno.replace(/\s+/g, '')}_${apellidos.replace(/\s+/g, '')}.pdf`;
      
      // Envía el PDF como respuesta con el nombre del archivo dinámico
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivoPDF}"`);
      
      // Convierte el ArrayBuffer a Buffer antes de enviarlo
      const buffer = Buffer.from(pdf.output('arraybuffer'));
      res.end(buffer);
      
    } catch (error) {
      console.error('Error al generar el PDF de la carta compromiso:', error);
      res.status(500).json({ error: 'Error al generar el PDF de la carta compromiso' });
    }
  });
  
  
  
  
  
  
  
  /*--------------------Funciones de los citatorio.html ---------------------------*/
  app.get('/obtener-citatorios', async (req, res) => {
    try {
      const citatorios = await Citatorio.find();
      res.json(citatorios);
    } catch (error) {
      console.error('Error al obtener los citatorios:', error);
      res.status(500).json({ error: 'Error al obtener los citatorios' });
    }
  });
  app.get('/generarCitatorioPDF/:citatorioId', async (req, res) => {
    try {
      const citatorioId = req.params.citatorioId;
      const citatorio = await Citatorio.findById(citatorioId);
      
      if (!citatorio) {
        return res.status(404).json({ error: 'Citatorio no encontrado' });
      }
      const formattedDate = moment(citatorio.fechaCitatorio).format('DD/MM/YYYY');
      
      // Genera el PDF
      const pdf = new jsPDF();
      
      // Configura el tamaño de fuente más grande para el título "Citatorio Escolar"
      pdf.setFontSize(20); // Tamaño de fuente más grande
      pdf.text('Citatorio Escolar', pdf.internal.pageSize.getWidth() / 2, 40, { align: 'center' }); // Alineación centrada
      
      // Configura el tamaño de fuente normal para el contenido del citatorio
      pdf.setFontSize(12); // Tamaño de fuente normal
      
      // Agrega cada sección del citatorio individualmente
      pdf.text(`Estimado padre, madre o tutor ${citatorio.nombrePadreTutor},`, 20, 60);
      pdf.text(`El día ${formattedDate} se emitió un citatorio para su hijo ${citatorio.nombreAlumno} ${citatorio.apellidos} por los siguientes motivos:`, 20, 70);
      
      // Detalles del Citatorio
      pdf.text('Detalles del Citatorio:', 20, 80);
      pdf.text(`- Nombre del alumno: ${citatorio.nombreAlumno}`, 20, 90);
      pdf.text(`- Apellidos: ${citatorio.apellidos}`, 20, 100);
      pdf.text(`- Fecha del Citatorio: ${moment(citatorio.fechaCitatorio).format('DD/MM/YYYY')}`, 20, 110);
      pdf.text('Reportes:', 20, 120);
      
      // Agrega los detalles de cada reporte
      citatorio.reportes.forEach((reporte, index) => {
        const y = 130 + (index * 10); // Incrementa la posición vertical para cada reporte
        pdf.text(`${index + 1}. Tipo de reporte: ${reporte.tipoReporte}, Razón: ${reporte.razon}, Motivo: ${reporte.motivo}`, 20, y);
      });
      
      // Agrega el texto adicional después de los reportes
      const additionalText = "Por este medio me dirijo a usted, de la manera más atenta, para solicitarle que asista a esta institución, CBTA No.103, con la finalidad de informarle respecto a la situación académica y de disciplina de su hijo.";
      const additionalTextLines = pdf.splitTextToSize(additionalText, pdf.internal.pageSize.getWidth() - 40); // Dividir texto en líneas que se ajusten al ancho de la página
      const additionalTextHeight = pdf.getTextDimensions(additionalTextLines).h; // Calcular la altura del texto
      
      // Ajustar la posición vertical del texto adicional
      const startY = 130 + (citatorio.reportes.length * 10) + 20;
      pdf.text(additionalTextLines, 20, startY, { lineHeightFactor: 1.5 }); // Alinea el texto a una altura de línea de 1.2
      
      // Agregar imágenes
      const leftImagePath = path.join(__dirname, 'public', 'img', 'sep.png'); // Ruta de la imagen izquierda
      const rightImagePath = path.join(__dirname, 'public', 'img', 'Emblema_CBTA.png'); // Ruta de la imagen derecha
      
      const leftImage = fs.readFileSync(leftImagePath);
      const rightImage = fs.readFileSync(rightImagePath);
      
      // Medidas de las imágenes
      const leftImgWidth = 50; // Ancho de la imagen izquierda
      const leftImgHeight = 20; // Alto de la imagen izquierda
      const rightImgWidth = 60; // Ancho de la imagen derecha
      const rightImgHeight = 20; // Alto de la imagen derecha
      
      // Añade imagen izquierda
      pdf.addImage(leftImage, 'JPEG', 10, 10, leftImgWidth, leftImgHeight);
      
      // Añade imagen derecha
      const pageWidth = pdf.internal.pageSize.getWidth(); // Ancho de la página
      const marginRight = 10; // Margen derecho para la imagen
      const marginTop = 10; // Margen superior para la imagen
      pdf.addImage(rightImage, 'JPEG', pageWidth - rightImgWidth - marginRight, marginTop, rightImgWidth, rightImgHeight);
      
      // Espacios para firmas
      const signatureY = pdf.internal.pageSize.getHeight() - 30; // Posición vertical de las firmas
      pdf.line(10, signatureY, 90, signatureY); // Línea para la firma Prefectura
      pdf.text('Firma Prefectura', 30, signatureY + 5); // Texto para la firma Prefectura
      pdf.line(pageWidth - 90, signatureY, pageWidth - 10, signatureY); // Línea para la firma Control Escolar
      pdf.text('Firma Orientación Educativa', pageWidth - 70, signatureY + 5); // Texto para la firma Control Escolar
      
      // Envía el PDF como respuesta
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=citatorio_${citatorioId}.pdf`);
      
      // Convierte el ArrayBuffer a Buffer antes de enviarlo
      const buffer = Buffer.from(pdf.output('arraybuffer'));
      res.end(buffer);
      
    } catch (error) {
      console.error('Error al generar el PDF del citatorio:', error);
      res.status(500).json({ error: 'Error al generar el PDF del citatorio' });
    }
  });
  
  
  /*--------------------Endpoints del archivo muestraDatos.html ---------------------------*/
  app.get('/muestraDatos', async (req, res) => {
    try {
      const reports = await Report.find();
      
      // Verifica si se recuperaron datos
      if (!reports || reports.length === 0) {
        return res.status(404).json({ error: 'No se encontraron reportes' });
      }
      
      // Envía los datos como respuesta
      res.json(reports);
    } catch (error) {
      console.error('Error al obtener reportes:', error);
      
      // Muestra el mensaje de error en la consola del servidor
      console.error('Mensaje de error:', error.message);
      
      res.status(500).json({ error: 'Error al obtener reportes' });
    }
  });
  app.delete('/eliminarReporte/:id', async (req, res) => {
    const reportId = req.params.id;
    
    try {
      // Implementa la lógica para eliminar el informe de la base de datos
      await Report.findByIdAndDelete(reportId);
      res.status(200).json({ message: 'Informe eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar informe:', error);
      res.status(500).json({ error: 'Error al eliminar informe' });
    }
  })  
  app.get('/filtrarDatos', async (req, res) => {
    try {
      // Obtén los parámetros de la consulta (query parameters)
      const {nombre, apellido, grupo, semestre, especialidad, fechaInicial, fechaFinal } = req.query;
      
      // Construye un objeto con los parámetros de filtro
      const filtro = {};
      
      if (nombre) filtro.nombreAlumno = new RegExp(nombre, 'i');
      if (apellido) filtro.apellidos = new RegExp(apellido, 'i');
      if (grupo && grupo.toLowerCase() !== 'todo') {
        filtro.grupo = grupo;
      }
      if (semestre && semestre.toLowerCase() !== 'todo') {
        filtro.semestre = semestre;
      }
      if (especialidad && especialidad.toLowerCase() !== 'todo') {
        filtro.especialidad = especialidad;
      }
      
      // Agrega la lógica para filtrar por un rango de fechas
      if (fechaInicial && fechaFinal) {
        filtro.fechaReporte = {
          $gte: new Date(fechaInicial),
          $lte: new Date(fechaFinal),
        };
      }
      
      // Realiza la consulta a la base de datos con los filtros
      const datosFiltrados = await Report.find(filtro);
      
      // Devuelve los datos filtrados como respuesta en formato JSON
      res.json(datosFiltrados);
    } catch (error) {
      console.error('Error al filtrar datos:', error);
      res.status(500).send('Error al filtrar datos');
    }
  });
  app.get('/imprimirHistorial', async (req, res) => {
    try {
      // Obtén los parámetros de la consulta (query parameters)
      const { nombre, apellido, grupo, semestre, especialidad, fechaInicial, fechaFinal } = req.query;
      
      // Construye un objeto con los parámetros de filtro
      const filtro = {};
      
      if (nombre) filtro.nombreAlumno = new RegExp(nombre, 'i');
      if (apellido) filtro.apellidos = new RegExp(apellido, 'i');
      if (grupo && grupo.toLowerCase() !== 'todo') {
        filtro.grupo = grupo;
      }
      if (semestre && semestre.toLowerCase() !== 'todo') {
        filtro.semestre = semestre;
      }
      if (especialidad && especialidad.toLowerCase() !== 'todo') {
        filtro.especialidad = especialidad;
      }
      
      // Agrega la lógica para filtrar por un rango de fechas
      if (fechaInicial && fechaFinal) {
        filtro.fechaReporte = {
          $gte: new Date(fechaInicial),
          $lte: new Date(fechaFinal),
        };
      }
      
      // Realiza la consulta a la base de datos con los filtros
      const datosFiltrados = await Report.find(filtro);
      
      // Genera el PDF con los datos filtrados en forma de tabla
      const pdf = new jsPDF({
        orientation: 'landscape', // Establece la orientación a horizontal
        unit: 'mm',
        format: 'letter',
      });
      
      // Función para agregar imágenes en cada página
      const addImages = () => {
        const leftImagePath = path.join(__dirname, 'public', 'img', 'sep.png'); // Ruta de la imagen izquierda
        const rightImagePath = path.join(__dirname, 'public', 'img', 'Emblema_CBTA.png'); // Ruta de la imagen derecha
        
        const leftImage = fs.readFileSync(leftImagePath);
        const rightImage = fs.readFileSync(rightImagePath);
        
        // Medidas de la imagen izquierda
        const leftImgWidth = 50; // Ancho de la imagen izquierda
        const leftImgHeight = 20; // Alto de la imagen izquierda
        
        // Medidas de la imagen derecha
        const rightImgWidth = 60; // Ancho de la imagen derecha
        const rightImgHeight = 20; // Alto de la imagen derecha
        
        // Añade imagen izquierda
        pdf.addImage(leftImage, 'JPEG', 10, 10, leftImgWidth, leftImgHeight); // Utiliza las medidas de la imagen izquierda
        
        // Añade imagen derecha
        const pageWidth = pdf.internal.pageSize.getWidth(); // Ancho de la página
        const marginRight = 10; // Margen derecho para la imagen
        const marginTop = 10; // Margen superior para la imagen
        pdf.addImage(rightImage, 'JPEG', pageWidth - rightImgWidth - marginRight, marginTop, rightImgWidth, rightImgHeight); // Utiliza las medidas de la imagen derecha
      };
      
      
      
      // Construir el texto del título con los datos filtrados
      let titulo = 'Historial Reportes';
      const filtrosAplicados = [];
      if (nombre) {
        filtrosAplicados.push(`Nombre: ${nombre}`);
      }
      if (apellido) {
        filtrosAplicados.push(`Apellido: ${apellido}`);
      }
      if (grupo !== 'todo') {
        filtrosAplicados.push(`Grupo: ${grupo}`);
      }
      if (semestre !== 'todo') {
        filtrosAplicados.push(`Semestre: ${semestre}`);
      }
      if (especialidad !== 'todo') {
        filtrosAplicados.push(`Especialidad: ${especialidad}`);
      }
      if (fechaInicial && fechaFinal) {
        filtrosAplicados.push(`Fecha: ${fechaInicial} - ${fechaFinal}`);
      }
      if (filtrosAplicados.length > 0) {
        titulo += ` (${filtrosAplicados.join(', ')})`;
      }
      
      // Construir el texto del encabezado con los filtros seleccionados
      let headerText = "Historial Reportes";
      if (nombre) headerText += ` - Nombre: ${nombre}`;
      if (apellido) headerText += ` - Apellido: ${apellido}`;
      if (grupo && grupo.toLowerCase() !== 'todo') headerText += ` - Grupo: ${grupo}`;
      if (semestre && semestre.toLowerCase() !== 'todo') headerText += ` - Semestre: ${semestre}`;
      if (especialidad && especialidad.toLowerCase() !== 'todo') headerText += ` - Especialidad: ${especialidad}`;
      if (fechaInicial && fechaFinal) headerText += ` - Fecha: ${fechaInicial} - ${fechaFinal}`;
      
      // Colocar el texto en el PDF
      pdf.setFontSize(10); // Tamaño de fuente del título
      const titleWidth = pdf.getStringUnitWidth(headerText) * pdf.internal.getFontSize() / pdf.internal.scaleFactor; // Ancho del texto
      const titleX = (pdf.internal.pageSize.getWidth() - titleWidth) / 2; // Centra el texto horizontalmente
      pdf.text(headerText, titleX, 30); // Posición del texto del título
      
      // Agrega las imágenes y la tabla en cada página
      let pageNumber = 1;
      let rowsPerPage = 20;
      for (let i = 0; i < datosFiltrados.length; i += rowsPerPage) { // Muestra solo las siguientes 20 filas en cada página
        if (i > 0) {
          pdf.addPage();
          pageNumber++;
          pdf.text(headerText, titleX, 30);
        }
        addImages();
        
        // Encabezados de la tabla
        const headers = ['Nombre ', 'Apellidos', 'Padre/Tutor', 'Fecha Reporte  ', 'Sem', 'Grpo', 'Especialidad', 'Tipo Reporte', 'Razón', 'Motivo'];
        
        // Datos de la tabla
        const data = datosFiltrados.slice(i, i + rowsPerPage).map(reporte => [
          reporte.nombreAlumno,
          reporte.apellidos,
          reporte.nombrePadreTutor,
          moment(reporte.fechaReporte).format('DD/MM/YYYY'), // Formatea la fecha
          reporte.semestre,
          reporte.grupo,
          reporte.especialidad,
          reporte.tipoReporte,
          reporte.razon,
          reporte.motivo,
        ]);
        
        // Agregar tabla
        const tableConfig = {
          startY: 40, // Deja espacio entre las imágenes y la tabla
          head: [headers],
          body: data,
          theme: 'grid',
          headStyles: { angle: 90, fillColor: [6, 59, 0], textColor: [255, 255, 255] },
        };
        pdf.autoTable(tableConfig);
      }
      
      // Obtener la altura de la página basada en el formato y la orientación
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calcular la posición vertical de las firmas en la última página
      const signatureY = pageHeight - 30; // Ajusta la posición vertical de las firmas
      
      // Espacio de firma para Prefectura
      pdf.line(10, signatureY + 5, 90, signatureY + 5); // Dibuja una línea horizontal
      pdf.text('Firma Prefectura', 35, signatureY + 10); // Posiciona el texto debajo de la línea
      
      // Espacio de firma para Control Escolar
      pdf.line(pdf.internal.pageSize.getWidth() - 90, signatureY + 5, pdf.internal.pageSize.getWidth() - 10, signatureY + 5); // Dibuja una línea horizontal
      pdf.text('Jefe de Departamento Academico', pdf.internal.pageSize.getWidth() - 75, signatureY + 10); // Posiciona el texto debajo de la línea
      
      // Envía el PDF como respuesta
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=historial.pdf');
      
      // Convierte el PDF a un buffer y lo envía
      const pdfBuffer = pdf.output('arraybuffer');
      res.send(Buffer.from(pdfBuffer));
    } catch (error) {
      console.error('Error al imprimir historial:', error);
      res.status(500).send('Error al imprimir historial');
    }
  });
  
  app.delete('/eliminarSextosSemestres', async (req, res) => {
    try {
      // Lógica para eliminar los reportes del sexto semestre
      await Report.deleteMany({ semestre: '6' }); // Elimina todos los reportes del sexto semestre
      
      // Envía una respuesta de éxito
      res.status(200).send('Los reportes del sexto semestre han sido eliminados correctamente.');
    } catch (error) {
      // Manejo de errores
      console.error('Error al eliminar reportes del sexto semestre:', error);
      res.status(500).send('Error al eliminar reportes del sexto semestre.');
    }
    
  });
  // Definir el endpoint para obtener la cantidad de alumnos del sexto semestre
  app.get('/obtenerCantidadSextoSemestre', async (req, res) => {
    try {
      // Realizar la consulta para obtener la cantidad de alumnos del sexto semestre
      const count = await Report.countDocuments({ semestre: '6' });
      
      // Enviar la cantidad como respuesta
      res.json({ count });
    } catch (error) {
      console.error('Error al obtener la cantidad de alumnos del sexto semestre:', error);
      res.status(500).json({ error: 'Error al obtener la cantidad de alumnos del sexto semestre' });
    }
  });
  
  
  
  /*--------------------Endpoints de los usuarios ---------------------------*/
  
  app.post('/registro-usuario', async (req, res) => {
    try {
      const { nombre, apellido, userName, pass, confirmPass, email, tipoUsuario } = req.body;
      
      // Verifica que las contraseñas coincidan
      if (pass !== confirmPass) {
        return res.status(400).send('<script>alert("Las contraseñas no coinciden"); window.location.href = "/addUser.html";</script>');
      }
      
      // Codifica la contraseña en base64
      const base64EncodedPassword = Buffer.from(pass).toString('base64');
      
      // Crea un nuevo usuario con la contraseña codificada en base64
      const nuevoUsuario = new Usuario({
        name: nombre,
        apellido,
        userName,
        pass: base64EncodedPassword, // Almacena la contraseña codificada en base64
        email,
        tipoUsuario,
      });
      
      // Guarda el nuevo usuario en la base de datos
      await nuevoUsuario.save();
      
      res.send('<script>alert("Usuario registrado con éxito"); window.location.href = "/addUser.html";</script>');
    } catch (error) {
      console.log('Error al registrar un nuevo usuario:', error);
      res.status(500).send('Error al registrar un nuevo usuario');
    }
  });
  app.delete('/usuario/:id', async (req, res) => {
    try {
      const usuarioId = req.params.id;
      
      // Utiliza el modelo de Mongoose para buscar y eliminar el usuario por su ID
      const usuario = await Usuario.findByIdAndDelete(usuarioId);
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar usuario por ID:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  app.get('/usuario/:id', async (req, res) => {
    try {
      const usuarioId = req.params.id;
      const usuario = await obtenerUsuarioPorId(usuarioId);
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json(usuario);
    } catch (error) {
      console.error('Error al obtener la contraseña del usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  async function obtenerUsuarioPorId(usuarioId) {
    try {
      // Utiliza el modelo de Mongoose para buscar el usuario por su ID
      const usuario = await Usuario.findById(usuarioId);
      
      // Retorna el objeto de usuario
      return usuario;
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      throw error; // Puedes manejar el error según tus necesidades
    }
  }
  
  app.get('/usuarios', async (req, res) => {
    try {
      // Obtiene todos los usuarios de la base de datos excluyendo la contraseña
      const usuarios = await Usuario.find({}, { pass: 0 });
      
      // Envía los usuarios como respuesta en formato JSON
      res.json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).send('Error al obtener usuarios');
    }
  });
  
  
  
  
  
  /*--------------------Funciones de los citatorios ---------------------------*/
  async function obtenerCitatorios() {
    try {
      const citatorios = await Citatorio.find();
      // console.log("console de la funcion obrenetr: ", citatorios)
      return citatorios;
    } catch (error) {
      console.error('Error al obtener los citatorios:', error);
      throw error; // Re-lanzamos el error para manejarlo en el lugar que llame a esta función
    }
  }
  
  app.get('/verificarCitatorioExistente/:No_Control', async (req, res) => {
    try {
        const noControlParam = req.params.No_Control.toLowerCase(); // Convertir a minúsculas
    
        // Obtener los citatorios de la base de datos
        const citatoriosP = await obtenerCitatorios();
        
        // Verificar si existe algún citatorio con el número de control dado
        const existeCitatorio = citatoriosP.some((citatorio) => {
            return String(citatorio.No_Control).toLowerCase() === noControlParam;
        });
        
        res.json({ existeCitatorio });
        console.log('Existe citatorio:', existeCitatorio); 
    } catch (error) {
        console.error('Error al verificar citatorio existente:', error);
        res.status(500).json({ error: 'Error interno del servidor al verificar citatorio existente.' });
    }
});

  app.get('/obtenerNombreAlumnoConTresReportes', async (req, res) => {
    try {
      // Ejecutar la consulta de agregación para encontrar alumnos con cinco o más reportes
      const alumnoConTresReportes = await Report.aggregate([
        { 
          $group: { 
            _id: { No_Control: '$No_Control' }, 
            totalReportes: { $sum: 1 } 
          } 
        },
        { 
          $match: { 
            totalReportes: { $gte: 5 } 
          } 
        },
        { 
          $limit: 1 
        }
      ]);
      
      // Imprimir los datos obtenidos en la consola para depurar
      console.log('Datos obtenidos:', alumnoConTresReportes);
      
      // Verificar si se encontró algún alumno con cinco o más reportes
      if (alumnoConTresReportes.length > 0) {
        // Si se encontró, obtener el número de control del primer alumno
        const No_Control = alumnoConTresReportes[0]._id.No_Control;
        console.log(No_Control)
        // Enviar el número de control como respuesta
        res.json({ No_Control });
      } else {
        // Si no se encontró ningún alumno con cinco o más reportes, enviar un error 404
        res.status(404).json({ error: 'No se encontró ningún alumno con cinco o más reportes.' });
      }
    } catch (error) {
      // Manejar errores internos del servidor
      console.error('Error al obtener nombre del alumno con tres o más reportes:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });
  
  
  
  async function obtenerReportesPorNoControl(No_Control) {
    try {
      // Utiliza Mongoose para buscar los reportes basados en el número de control
      const reportes = await Report.find({ No_Control });
      
      
      return reportes;
    } catch (error) {
      console.error('Error al obtener reportes por número de control:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
      
    }
  } 
  
  
  app.get('/generarCitatorio/:No_Control', async (req, res) => {
    const noControlParam = req.params.No_Control; // Cambiado el nombre de la variable para evitar conflicto
    console.log(noControlParam)
    try {
      // Lógica para obtener reportes relevantes del alumno
      const reportes = await obtenerReportesPorNoControl(noControlParam);
      //console.log("reportes del alumno: ", reportes);
      
      if (reportes.length < 5) {
        return res.status(404).send('No hay suficientes reportes para generar un citatorio.');
      }
      
      // Extraer la información relevante de cada reporte
      const motivos = reportes.map((reporte) => ({
        tipoReporte: reporte.tipoReporte,
        razon: reporte.razon,
        motivo: reporte.motivo,
      }));
      const nombrePadreTutor = reportes[0].nombrePadreTutor;
      
      // Obtener el nombre del alumno y apellidos a partir del primer reporte
      const No_Control =reportes[0].No_Control; // Se usa el No_Control del primer reporte
      const nombreAlumno = reportes[0].nombreAlumno;
      const apellidos = reportes[0].apellidos;
      
      // Crear el citatorio con la información recopilada
      const nuevoCitatorio = new Citatorio({
        No_Control,
        nombreAlumno,
        apellidos,
        nombrePadreTutor,
        reportes: motivos,
      });
      
      // Guardar el citatorio en la base de datos
      await nuevoCitatorio.save();
      
      res.status(200).json({ message: 'Citatorio generado y guardado correctamente.' });
    } catch (error) {
      console.error('Error al generar citatorio:', error);
      res.status(500).json({ error: 'Error interno del servidor al generar citatorio.' });
    }
  });
  
  
  app.delete('/eliminar-citatorio/:id', async (req, res) => {
    const citatorioId = req.params.id;
    
    try {
        // Lógica para eliminar el citatorio con el ID proporcionado
        await Citatorio.findByIdAndDelete(citatorioId);
        
        // Envía una respuesta 200 (OK) si la eliminación fue exitosa
        res.sendStatus(200);
    } catch (error) {
        // En caso de error, envía una respuesta 500 (Error interno del servidor) y muestra el error
        console.error('Error al eliminar citatorio:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar citatorio.' });
    }
});









  /*--------------------Endpoint para cerrar sesion ---------------------------*/
 
// Configuración del middleware de sesión
app.use(session({
  secret: '123456789', // Cambia esto por una clave secreta para firmar la sesión
  resave: false,
  saveUninitialized: false
}));
// Ruta para cerrar sesión
app.post('/logout', (req, res) => {
  // Invalida la sesión del usuario
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).send('Error interno del servidor');
    }
    // Agrega cabeceras para evitar el almacenamiento en caché
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.setHeader('Pragma', 'no-cache');
    // Redirige al usuario a la página de inicio de sesión
    res.redirect('/');
  });
});

  /*--------------------Servidor ---------------------------*/
  const PORT = process.env.PORT || 3002
  ;
  app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
  });
  
  