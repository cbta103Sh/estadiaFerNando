const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    apellido: {type:String, required: true},
    userName: {type:String, required: true},
    pass: {type:String, required: true},
    tipoUsuario: { type: String, required: true } 
},{ versionKey: false })

const Usuario = mongoose.model('usuarios', userSchema);
module.exports= Usuario;