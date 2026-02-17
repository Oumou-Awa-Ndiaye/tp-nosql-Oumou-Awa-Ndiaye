import express from 'express';
import Pokemon from '../schemas/pokemons.js';
import auth from '../middleware/auth.js'; 

const router = express.Router();

// --- 6.B : Statistiques avec Agrégation ---
// Note : Placer cette route AVANT router.get('/:id')
router.get('/stats', async (req, res) => {
    try {
        const statsByType = await Pokemon.aggregate([
            { $unwind: "$type" }, // Sépare les types pour les compter individuellement
            {
                $group: {
                    _id: "$type",
                    nombre: { $sum: 1 }, // Nombre de Pokémon par type
                    moyenneHP: { $avg: "$base.HP" } // Moyenne des HP par type
                }
            },
            { $sort: { nombre: -1 } }
        ]);

        // Recherche des records individuels
        const topAttack = await Pokemon.findOne().sort({ "base.Attack": -1 }).limit(1);
        const topHP = await Pokemon.findOne().sort({ "base.HP": -1 }).limit(1);

        res.json({
            parType: statsByType,
            plusGrandeAttaque: topAttack,
            plusDeHP: topHP
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- GET : Liste des Pokémon ---
router.get('/', async (req, res) => {
    try {
        let filters = {};
        if (req.query.type) filters.type = req.query.type;
        if (req.query.name) {
            filters["name.english"] = { $regex: req.query.name, $options: 'i' };
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        let query = Pokemon.find(filters);
        if (req.query.sort) query = query.sort(req.query.sort);

        const total = await Pokemon.countDocuments(filters);
        const pokemonsList = await query.skip(skip).limit(limit);

        res.json({
            data: pokemonsList,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- GET : Détail par ID ---
router.get('/:id', async (req, res) => {
    try { 
        const pokemon = await Pokemon.findOne({ id: req.params.id });
        if (!pokemon) return res.status(404).json({ error: 'Pokémon non trouvé' });
        res.json(pokemon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- POST : Ajouter (Protégé) ---
router.post('/', auth, async (req, res) => {
    try {
        const newPokemon = await Pokemon.create(req.body);
        res.status(201).json(newPokemon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- PUT : Modifier (Protégé) ---
router.put('/:id', auth, async (req, res) => {
    try {
        const updated = await Pokemon.findOneAndUpdate(
            { id: req.params.id }, 
            req.body, 
            { new: true, runValidators: true } // runValidators active la validation 6.C
        );
        if (!updated) return res.status(404).json({ error: 'Pokémon inexistant' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- DELETE : Supprimer (Protégé) ---
router.delete('/:id', auth, async (req, res) => {
    try {
        const deleted = await Pokemon.findOneAndDelete({ id: req.params.id });
        if (!deleted) return res.status(404).json({ error: 'Pokémon non trouvé' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;