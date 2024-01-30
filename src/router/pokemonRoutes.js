const express = require('express');
const axios = require('axios');

const router = express.Router();

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

router.get('/:pokemonName', async (req, res) => {
  try {
    const { pokemonName } = req.params;
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${pokemonName}`);
    const pokemonData = {
      name: response.data.name,
      image: response.data.sprites.front_default
    };
    res.json(pokemonData);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
