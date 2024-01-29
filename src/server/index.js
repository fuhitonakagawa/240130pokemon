// import express from 'express';
// import cors from 'cors';
// import trainerRoutes from '../router/trainerRoutes';
// import pokemonRoutes from '../router/pokemonRoutes';

const express = require('express');
const cors = require('cors');
const trainerRoutes = require('../router/trainerRoutes');
const pokemonRoutes = require('../router/pokemonRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/trainers', trainerRoutes);
app.use('/api/pokemon', pokemonRoutes); 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
