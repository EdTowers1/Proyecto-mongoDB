const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        password: hashedPassword
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar al usuario por username
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        // Comparar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

        // Generar un token de sesión (JWT)
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;