import express from 'express';
import Pokemon from '../schemas/pokemons.js';

const router = express.Router();

// Étape 3.1 — READ : Lister tous les Pokémon
router.get('/', async (req, res) => {
    try {
        const pokemonsList = await Pokemon.find();
        res.json(pokemonsList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Étape 3.1 — READ : Chercher par ID
router.get('/:id', async (req, res) => {
    try { 
        const pokemon = await Pokemon.findOne({ id: req.params.id });
        if (!pokemon) return res.status(404).json({ error: 'Pokémon non trouvé' });
        res.json(pokemon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Étape 3.2 — CREATE : Ajouter un Pokémon
router.post('/', async (req, res) => {
    try {
        const newPokemon = await Pokemon.create(req.body);
        res.status(201).json(newPokemon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Étape 3.3 — UPDATE : Modifier un Pokémon
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

// Étape 3.4 — DELETE : Supprimer un Pokémon
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