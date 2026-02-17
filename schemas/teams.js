import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    // C'est ici que la magie opère : ref: 'Pokemon'
    pokemons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pokemon', max: 6 }] 
});

export default mongoose.model('Team', teamSchema);