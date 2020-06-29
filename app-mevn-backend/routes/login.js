const express = require('express');
const router = express.Router();

// Importamos modelo Tarea
import User from '../models/user';

// Hash Contraseña
const bcrypt = require('bcrypt');
const saltRounds = 10;

// JWT
const jwt = require('jsonwebtoken');

router.post('/', async(req, res) => {
  
  const body = req.body;
  
  try {
    // Buscamos email en DB
    const usuarioDB = await User.findOne({ email: body.email });

    // Evaluamos si existe el email en DB
    if (!usuarioDB) {
      return res.status(400).json({
        mensaje: 'Usuario o contraseña incorrectos'
      })
    }

    // Evaluamos si la contraseña es correcta
    if (!bcrypt.compareSync(body.pass, usuarioDB.pass)) {
      return res.status(400).json({
        mensaje: 'Usuario o contraseña incorrectos'
      })
    }

    // Generar token
    let token = jwt.sign({
      data: usuarioDB
    }, 'secret', { expiresIn: 60 * 60 * 24 * 30 }) // Expira en 30 días
    //    ^
    //    |   Cambiar 'secret' por otra cosa

    return res.json({
      usuarioDB,
      token
    })

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ha ocurrido un error',
      error
    })
  }
})

module.exports = router;