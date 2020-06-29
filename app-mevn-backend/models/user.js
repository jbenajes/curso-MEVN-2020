import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const uniqueValidator = require('mongoose-unique-validator');

// Roles
const roles = {
  values: ['ADMIN', 'USER'],
  message: '{VALUE} no es un rol válido'
}

const userSchema = new Schema({
  nombre:   { type: String, required: [true, 'Nombre obligatorio'] },
  email: { type: String, unique: true, required: [true, 'Email obligatorio'] },
  pass: { type: String, required: [true, 'Contraseña obligatoria'] },
  date: { type: Date, default: Date.now },
  role: { type: String, default: 'USER', enum: roles },
  activo: { type: Boolean, default: true }
});

// Validator
userSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' });

// Eliminar pass de respuesta JSON
userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.pass;
  return obj;
}

// Convertir a modelo
const User = mongoose.model('User', userSchema);

export default User;
