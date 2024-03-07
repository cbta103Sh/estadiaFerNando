const mongoose = require('mongoose');


const reportSchema = new mongoose.Schema({
  No_Control:{type: Number, required: true},
  nombreAlumno: { type: String, required: true },
  apellidos: { type: String, required: true },
  nombrePadreTutor: { type: String, required: true },
  fechaReporte: {
    type: Date,
    default: Date.now
  },
  semestre: { type: String, required: true },
  grupo: { type: String, required: true },
  especialidad: { type: String, required: true },
  tipoReporte: { type: String, required: true },
  razon: { type: String, required: false },
  motivo: { type: String, required: true },
}, { versionKey: false });


// Modificar la función toJSON para incluir la fecha formateada
reportSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.fechaReporte = formatDate(ret.fechaReporte);
    return ret;
  }
});

function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}



const Report = mongoose.model('reportes', reportSchema);

module.exports = Report;
