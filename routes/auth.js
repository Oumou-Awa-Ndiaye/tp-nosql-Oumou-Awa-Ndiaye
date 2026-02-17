import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../schemas/users.js';

const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Création de l'utilisateur (le pre-save va hasher le password)
        await User.create({ username, password });
        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    } catch (error) {
        res.status(400).json({ error: "Nom d'utilisateur déjà pris" });
    }
});

// Connexion
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        // COMPARAISON DU MOT DE PASSE
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Identifiants invalides" });
        }

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET || 'secret_par_defaut', 
            { expiresIn: '24h' }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;