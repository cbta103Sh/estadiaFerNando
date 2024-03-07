const mongoose = require('mongoose');
const moment = require('moment');

const citatorioSchema = new mongoose.Schema({
  No_Control:{type: Number, required: true},
  nombreAlumno: { type: String, required: true },
  apellidos: { type: String, required: true }, // Agregado el campo apellidos
  reportes: [
    {
      tipoReporte: { type: String, required: true },
      razon: { type: String, required: false },
      motivo: { type: String, required: true },
    }
  ],
  nombrePadreTutor: { type: String, required: true }, // Agregado el campo nombrePadreTutor
  fechaCitatorio: {
    type: Date,
    default: () => moment().add(1, 'days').toDate(),
  },
}, { versionKey: false });

const Citatorio = mongoose.model('citatorios', citatorioSchema);

module.exports = Citatorio;
