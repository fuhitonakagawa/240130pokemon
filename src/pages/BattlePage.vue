<template>
  <div>
    <h4>Battle Screen</h4>
    <div class="battle-page">
      <!-- Opponent's Pokémon -->
      <div class="opponent-pokemon">
        <h3>{{ opponentPokemon.name }}</h3>
        <img
          :src="opponentPokemon.frontImage"
          alt="Front of opponent's Pokémon"
        />
        <!-- Opponent's Pokémon HP Bar -->
        <div class="pokemon-hp">
          <div class="hp-bar" :style="{ width: opponentHpWidth }" />
          <span
            >{{ opponentPokemon.currentHp }} / {{ opponentPokemon.maxHp }}</span
          >
        </div>
      </div>
      <!-- Player's Pokémon -->
      <div class="player-pokemon">
        <h3>{{ playerPokemon.name }}</h3>
        <img :src="playerPokemon.backImage" alt="Back of player's Pokémon" />
        <!-- Player's Pokémon HP Bar -->
        <div class="pokemon-hp">
          <div class="hp-bar" :style="{ width: playerHpWidth }" />
          <span>{{ playerPokemon.currentHp }} / {{ playerPokemon.maxHp }}</span>
        </div>
        <div class="skills">
          <button
            v-for="skill in playerSkills"
            :key="skill.name"
            @click="useSkill(skill)"
          >
            {{ skill.name }}
          </button>
        </div>
      </div>
      <div class="message-box">
        <h5>{{ battleMessage }}</h5>
      </div>
    </div>

    <!-- Display Pokémon and HP -->
    <!-- Skill buttons -->
    <!-- Victory/Defeat message -->
  </div>
</template>

<style>
.message-box {
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 20px;
  background-color: white;
}

.pokemon-hp {
  display: flex;
  align-items: center;
}

.hp-bar {
  background-color: green;
  height: 10px;
  border-radius: 5px;
  transition: width 0.5s ease;
}
</style>

<script>
import axios from "axios";

export default {
  data() {
    return {
      // Battle data
      battleMessage: "",
      playerPokemon: {
        name: "",
        maxHp: 100,
        currentHp: 100,
        backImage: "",
        isDefencing: false,
        isSleeping: false,
        isConfusiong: false,
      },
      opponentPokemon: {
        name: "",
        maxHp: 100,
        currentHp: 100,
        frontImage: "",
        isDefencing: false,
        isSleeping: false,
        isConfusiong: false,
      },
      playerSkills: [],
      opponentSkills: [],
    };
  },
  methods: {
    // Battle methods
    async getPokemonInfo(pokemonName) {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );
        const pokemonInfo = {
          name: response.data.name,
          image: response.data.sprites.front_default,
        };
        return pokemonInfo;
      } catch (error) {
        console.error("Error fetching pokemon info:", error);
        // Handle error (e.g., display a message or select a default Pokémon)
      }
    },
    async getRandomOpponentName() {
      const randomId = Math.floor(Math.random() * 500) + 1; // Generate a random ID between 1 and 1000
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${randomId}`
        );
        return response.data.name; // Return the name of the randomly selected Pokémon
      } catch (error) {
        console.error("Error fetching random opponent pokemon info:", error);
        // Handle error (e.g., display a message or select a default Pokémon)
      }
    },
  },
  async created() {
    // Initialize battle
    // Set player's Pokémon name from route params and fetch its info
    const playerPokemonName = this.$route.params.pokemonName;
    const playerInfo = await this.getPokemonInfo(playerPokemonName);
    this.playerPokemon.name = playerInfo.name;
    this.playerPokemon.backImage = playerInfo.image;

    // Randomly select an opponent Pokémon and fetch its info
    const opponentPokemonName = await this.getRandomOpponentName();
    const opponentInfo = await this.getPokemonInfo(opponentPokemonName);
    this.opponentPokemon.name = opponentInfo.name;
    this.opponentPokemon.frontImage = opponentInfo.image;

    // Initialize battle message and HP
    this.battleMessage = "バトルスタート";
    this.playerPokemon.currentHp = this.playerPokemon.maxHp;
    this.opponentPokemon.currentHp = this.opponentPokemon.maxHp;
  },
  computed: {
    playerHpWidth() {
      return (
        (this.playerPokemon.currentHp / this.playerPokemon.maxHp) * 100 + "%"
      );
    },
    opponentHpWidth() {
      return (
        (this.opponentPokemon.currentHp / this.opponentPokemon.maxHp) * 100 +
        "%"
      );
    },
  },
};
</script>
