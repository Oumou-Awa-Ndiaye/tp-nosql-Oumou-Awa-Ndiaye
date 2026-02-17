import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './connect.js';
import pokemonRoutes from './routes/pokemons.js';
import authRoutes from './routes/auth.js';
import teamRoutes from './routes/teams.js'; 
const app = express();

app.use(cors());
app.use(express.json()); 
app.use('/assets', express.static('assets'));

// Utilisation des routes
app.use('/api/pokemons', pokemonRoutes);
app.use('/api/auth', authRoutes); // <-- Étape 5.2 : Branchement des routes d'auth
app.use('/api/teams', teamRoutes);

app.get('/', (req, res) => {
    res.send('API Pokémon opérationnelle !');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});