<template>
  <div>
    <h4>Battle Screen</h4>
    <div class="battle-page">
      <!-- Opponent's Pokémon -->
      <div class="opponent-pokemon">
        <h3>{{ opponentPokemon.name }}</h3>
        <!-- <h4>{{ opponentPokemon.type }}</h4> -->
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
        <!-- <h4>{{ playerPokemon.type }}</h4> -->
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
      <h4>相手スキル{{ opponentSkills }}</h4>
      <h4>自分スキル：{{ playerSkills }}</h4>
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
import { getSkillsForType } from "src/battle/skills";
import { GamePhase } from "src/battle/phase";

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
      gameState: {
      currentPhase: GamePhase.PLAYER_TURN, // ゲームの初期フェーズをプレイヤーターンに設定
    },
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
          type: response.data.types[0].type.name,
        };
        return pokemonInfo;
      } catch (error) {
        console.error("Error fetching pokemon info:", error);
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
      }
    },
    async loadPokemonSkills(pokemonType) {
      return getSkillsForType(pokemonType);
    },
    gameLoop() {
      switch (gameState.currentPhase) {
        case GamePhase.PLAYER_TURN:
          // プレイヤーが技を選択するまで待機する処理
          break;
        case GamePhase.ENEMY_TURN:
          handleEnemyTurn();
          break;
        case GamePhase.PROCESS_ACTION:
          processAction();
          break;
        case GamePhase.CHECK_HP:
          checkHp();
          break;
        case GamePhase.END_GAME:
          // ゲーム終了処理
          break;
      }
      requestAnimationFrame(gameLoop);
    },
    useSkill(skill) {
    // 技を使用した際の処理
    this.battleMessage = `プレイヤーは ${skill.name} を使用！`;
    // 技の効果を適用する処理
    // ...

    // 敵のターンに移行
    this.gameState.currentPhase = GamePhase.ENEMY_TURN;
  },
  },
  async created() {
    // Initialize battle
    // Set player's Pokémon name from route params and fetch its info
    const playerPokemonName = this.$route.params.pokemonName;
    const playerInfo = await this.getPokemonInfo(playerPokemonName);
    this.playerPokemon.name = playerInfo.name;
    this.playerPokemon.type = playerInfo.type;
    this.playerPokemon.backImage = playerInfo.image;

    // Fetch skills for player's Pokémon
    const playerSkills = await this.loadPokemonSkills(this.playerPokemon.type);
    this.playerSkills = playerSkills;

    // Randomly select an opponent Pokémon and fetch its info
    const opponentPokemonName = await this.getRandomOpponentName();
    const opponentInfo = await this.getPokemonInfo(opponentPokemonName);
    this.opponentPokemon.name = opponentInfo.name;
    this.opponentPokemon.type = opponentInfo.type;
    this.opponentPokemon.frontImage = opponentInfo.image;

    // Fetch skills for opponent's Pokémon
    const opponentSkills = await this.loadPokemonSkills(
      this.opponentPokemon.type
    );
    this.opponentSkills = opponentSkills;

    // Initialize battle message and HP
    this.battleMessage = "バトルスタート";
    this.playerPokemon.currentHp = this.playerPokemon.maxHp;
    this.opponentPokemon.currentHp = this.opponentPokemon.maxHp;

    requestAnimationFrame(this.gameLoop);
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
