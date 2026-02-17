import express from 'express';
import Team from '../schemas/teams.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Récupérer une équipe précise
router.get('/:id', auth, async (req, res) => {
    try {
        // .populate('pokemons') va chercher les détails de chaque ID dans la liste
        const team = await Team.findById(req.params.id).populate('pokemons');
        
        if (!team) return res.status(404).json({ error: "Équipe non trouvée" });
        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;