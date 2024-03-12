// db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://SturninoHernan:cbta103SH@FerNando.mongodb.net/estadia?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
});

module.exports = mongoose;
