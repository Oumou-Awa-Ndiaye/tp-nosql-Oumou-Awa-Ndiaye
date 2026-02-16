import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './connect.js';
import pokemonRoutes from './routes/pokemons.js'; // Import des nouvelles routes

const app = express();

app.use(cors());
app.use(express.json()); // Indispensable pour lire le corps des requêtes POST/PUT
app.use('/assets', express.static('assets'));

// Utilisation du routeur pour toutes les requêtes commençant par /api/pokemons
app.use('/api/pokemons', pokemonRoutes);

app.get('/', (req, res) => {
    res.send('API Pokémon opérationnelle !');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});