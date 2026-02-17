import express from 'express';
import User from '../schemas/users.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Ajouter un favori
router.post('/:pokemonId', auth, async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, { 
        $addToSet: { favorites: req.params.pokemonId } 
    });
    res.json({ message: "Ajouté aux favoris" });
});

// Retirer un favori
router.delete('/:pokemonId', auth, async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, { 
        $pull: { favorites: req.params.pokemonId } 
    });
    res.json({ message: "Retiré des favoris" });
});

export default router;