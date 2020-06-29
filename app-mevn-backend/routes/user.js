const express = require('express');
const router = express.Router();

// Importamos modelo Tarea
import User from '../models/user';

// Hash Contraseña
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Filtrar campos de PUT
const _ = require('underscore');

const { verificarAuth, verificarAdmin } = require('../middleware/autenticacion')

router.post('/nuevo-usuario', async (req, res) => {
  const body = {
    nombre: req.body.nombre,
    email: req.body.email,
    role: req.body.role
  }

  body.pass = bcrypt.hashSync(req.body.pass, saltRounds);

  try {
    const userDB = await User.create(body);
    return res.json(userDB);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error',
      error
    });
  }
});

router.put('/usuario/:id', [verificarAuth, verificarAdmin], async(req, res) => {
  const _id = req.params.id;
  const body = _.pick(req.body, ['nombre', 'email', 'pass', 'activo']);

  if(body.pass){
    body.pass = bcrypt.hashSync(req.body.pass, saltRounds);
  }

  try {
    // {new:true} nos devuelve el usuario actualizado
    const usuarioDB = await User.findByIdAndUpdate(_id, body, {new: true, 
      runValidators: true});
    return res.json(usuarioDB);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ha ocurrido un error',
      error
    })
  }
});

module.exports = router;