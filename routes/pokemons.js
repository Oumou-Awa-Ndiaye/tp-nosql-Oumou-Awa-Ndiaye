import express from 'express';
import Pokemon from '../schemas/pokemons.js';

const router = express.Router();

// --- UNE SEULE ROUTE GET POUR TOUT : Liste, Filtres, Tri et Pagination ---
router.get('/', async (req, res) => {
    try {
        // 1. FILTRAGE (Étapes 4.1, 4.2 & 4.5)
        let filters = {};
        
        if (req.query.type) {
            filters.type = req.query.type;
        }

        if (req.query.name) {
            // Recherche partielle et insensible à la casse
            filters["name.english"] = { $regex: req.query.name, $options: 'i' };
        }

        // 2. PAGINATION - Calculs (Étape 4.4)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        // 3. CONSTRUCTION DE LA REQUÊTE
        let query = Pokemon.find(filters);

        // 4. TRI (Étape 4.3)
        if (req.query.sort) {
            query = query.sort(req.query.sort);
        }

        // 5. EXÉCUTION
        const total = await Pokemon.countDocuments(filters);
        const pokemonsList = await query.skip(skip).limit(limit);

        // 6. RÉPONSE FORMATÉE
        res.json({
            data: pokemonsList,
            page: page,
            limit: limit,
            total: total,
            totalPages: Math.ceil(total / limit)
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- RESTE DU CRUD (Inchangé) ---

// Chercher par ID (Étape 3.1)
router.get('/:id', async (req, res) => {
    try { 
        const pokemon = await Pokemon.findOne({ id: req.params.id });
        if (!pokemon) return res.status(404).json({ error: 'Pokémon non trouvé' });
        res.json(pokemon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ajouter (Étape 3.2)
router.post('/', async (req, res) => {
    try {
        const newPokemon = await Pokemon.create(req.body);
        res.status(201).json(newPokemon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Modifier (Étape 3.3)
router.put('/:id', async (req, res) => {
    try {
        const updated = await Pokemon.findOneAndUpdate(
            { id: req.params.id }, 
            req.body, 
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Pokémon inexistant' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Supprimer (Étape 3.4)
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Pokemon.findOneAndDelete({ id: req.params.id });
        if (!deleted) return res.status(404).json({ error: 'Pokémon non trouvé' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;