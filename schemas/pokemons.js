import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
    id: { 
        type: Number, 
        required: true, 
        unique: true,
        min: [1, "L'id doit être un entier positif"] // 6.C
    },
    name: {
        english: { type: String, required: true },
        japanese: String,
        chinese: String,
        french: String
    },
    type: [{ 
        type: String, 
        enum: {
            values: [
                'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 
                'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 
                'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
            ],
            message: '{VALUE} n\'est pas un type de Pokémon valide' // 6.C
        }
    }],
    base: {
        HP: { type: Number, min: [1, "Minimum 1"], max: [255, "Maximum 255"] }, // 6.C
        Attack: { type: Number, min: 1, max: 255 },
        Defense: { type: Number, min: 1, max: 255 },
        "Sp. Attack": { type: Number, min: 1, max: 255 },
        "Sp. Defense": { type: Number, min: 1, max: 255 },
        Speed: { type: Number, min: 1, max: 255 }
    },
    image: String
});

export default mongoose.model('Pokemon', pokemonSchema);