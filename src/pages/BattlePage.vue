<template>
  <div>
    <h4>Battle Screen</h4>
    <q-btn label="トレーナー情報に戻る" @click="goToInfoPage" color="primary" />
    <div class="message-box">
      <h5>{{ battleMessage }}</h5>
    </div>
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
          <span
            >{{ opponentPokemon.currentHp }} / {{ opponentPokemon.maxHp }}</span
          >
          <div class="hp-bar" :style="{ width: opponentHpWidth }" />
        </div>
      </div>
      <!-- Player's Pokémon -->
      <div class="player-pokemon">
        <h3>{{ playerPokemon.name }}</h3>
        <!-- <h4>{{ playerPokemon.type }}</h4> -->
        <img :src="playerPokemon.backImage" alt="Back of player's Pokémon" />
        <!-- Player's Pokémon HP Bar -->
        <div class="pokemon-hp">
          <span>{{ playerPokemon.currentHp }} / {{ playerPokemon.maxHp }}</span>
          <div class="hp-bar-background" />
          <div class="hp-bar" :style="{ width: playerHpWidth }" />
        </div>
        <div class="skills" v-show="isButtonVisible">
          <button
            v-for="skill in playerSkills"
            :key="skill.name"
            @click="useSkill(skill)"
            class="skill-button"
          >
            {{ skill.name }}
          </button>
        </div>
      </div>
      <!-- <h4>相手スキル{{ opponentSkills }}</h4>
      <h4>自分スキル：{{ playerSkills }}</h4> -->
    </div>
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
  width: 100%;
  background-color: #ccc; /* グレーの背景バー */
  border-radius: 5px;
  overflow: hidden;
}

.hp-bar-background {
  background-color: #ccc;
  width: 100%;
  height: 10px;
  position: absolute;
  top: 0;
  left: 0;
}

.hp-bar {
  background-color: rgb(9, 133, 9);
  height: 10px;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.skill-button {
  background-color: #4caf50; /* ボタンの背景色 */
  color: white; /* テキスト色 */
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
  box-shadow: 0 4px #999;
}

.skill-button:hover {
  background-color: #45a049;
}

.skill-button:active {
  background-color: #45a049;
  box-shadow: 0 2px #666;
  transform: translateY(2px);
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
        currentPhase: null,
      },
      isButtonVisible: false,
      currentStep: 0,
    };
  },
  methods: {
    goToInfoPage() {
      this.$router.push({ name: "TrainerInfoPage" });
    },
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

    async handlePlayerTurn() {
      // 自分のHPが0以下なら勝敗判定フェーズへ
      if (this.playerPokemon.currentHp <= 0) {
        this.gameState.currentPhase = GamePhase.END_GAME;
        return;
      }

      if (this.playerPokemon.isSleeping) {
        this.battleMessage = `${this.playerPokemon.name} は 眠っている！`;
        this.playerPokemon.isSleeping = false;
        this.gameState.currentPhase = GamePhase.ENEMY_TURN;
        return;
      } else if (this.playerPokemon.isConfusing) {
        this.battleMessage = `${this.playerPokemon.name} は 混乱して自分を攻撃した！`;
        this.playerPokemon.currentHp -= 20;
        this.playerPokemon.isConfusing = false;
        this.gameState.currentPhase = GamePhase.ENEMY_TURN;
        return;
      } else {
        this.battleMessage = "わざを選択してください";
        this.isButtonVisible = true;
      }
    },

    async useSkill(skill) {
      // 技の使用メッセージを表示
      const msg = `${this.playerPokemon.name} は ${skill.name} を使用！`;
      this.battleMessage = msg;
      console.log(msg);
      this.isButtonVisible = false; // ボタンを非表示にする
      await this.wait(1000);

      this.applySkillEffect(this.playerPokemon, this.opponentPokemon, skill);
      await this.wait(1000);

      // 技の効果適用後にフェーズを更新
      this.gameState.currentPhase = GamePhase.ENEMY_TURN;
      console.log(this.gameState.currentPhase);
      return;
    },

    applySkillEffect(user, target, skill) {
      let msg;
      switch (skill.category) {
        case "Attack":
          target.currentHp -= skill.power;
          msg = `${target.name} に ${skill.power} ダメージ！`;
          this.battleMessage = msg;
          break;
        case "Defense":
          user.isDefencing = true;
          msg = `${user.name} は ぼうぎょ している！`;
          this.battleMessage = msg;
          break;
        case "Recovery":
          user.currentHp = Math.min(user.currentHp + skill.power, user.maxHp);
          msg = `${user.name} の HP が ${skill.power} かいふく した！`;
          this.battleMessage = msg;
          break;
        case "Special":
          this.applySpecialEffect(user, target, skill);
          break;
      }
      console.log(msg);
    },

    applySpecialEffect(user, target, skill) {
      let msg;
      if (Math.random() * 100 < skill.successRate) {
        switch (skill.effect) {
          case "attack":
            if (target.isDefencing){
              msg = `${target.name} は ぼうぎょ している！`;
              this.battleMessage = msg;
              target.isDefencing = false;
            } else {
              target.currentHp -= skill.power;
              msg = `${target.name} に ${skill.power} ダメージ！`;
              this.battleMessage = msg;
            }
            break;
          case "recovery":
            user.currentHp = Math.min(user.currentHp + skill.power, user.maxHp);
            msg = `${user.name} の HP が ${skill.power} かいふく した！`;
            this.battleMessage = msg;
            break;
          case "sleep":
            target.isSleeping = true;
            msg = `${target.name} は眠った！`;
            this.battleMessage = msg;
            break;
          case "confuse":
            target.isConfusing = true;
            msg = `${target.name} は混乱した！`;
            this.battleMessage = msg;
            break;
        }
      } else {
        msg = `わざは失敗した！`;
        this.battleMessage = msg;
      }
      console.log(msg);
    },

    async handleEnemyTurn() {
      let randomSkill;
      console.log("handleEnemyTurn");

      // 敵のHPが0以下なら勝敗判定フェーズへ
      if (this.opponentPokemon.currentHp <= 0) {
        this.gameState.currentPhase = GamePhase.END_GAME;
        return;
      }

      if (this.opponentPokemon.isSleeping) {
        this.battleMessage = `${this.opponentPokemon.name} は 眠っている！`;
        this.opponentPokemon.isSleeping = false;
        this.gameState.currentPhase = GamePhase.PLAYER_TURN;
        return;
      } else if (this.opponentPokemon.isConfusing) {
        this.battleMessage = `${this.opponentPokemon.name} は 混乱して自分を攻撃した！`;
        this.opponentPokemon.currentHp -= 20;
        this.opponentPokemon.isConfusing = false;
        this.gameState.currentPhase = GamePhase.PLAYER_TURN;
        return;
      } else {
        // 敵の技をランダムに選択
        randomSkill =
          this.opponentSkills[
            Math.floor(Math.random() * this.opponentSkills.length)
          ];
        this.battleMessage = `${this.opponentPokemon.name} は ${randomSkill.name} を使用！`;
      }

      console.log("てきのわざ", randomSkill);
      await this.wait(1000);

      this.applySkillEffect(
        this.opponentPokemon,
        this.playerPokemon,
        randomSkill
      );
      console.log("てきのわざEffected");

      await this.wait(1000);
      this.gameState.currentPhase = GamePhase.PLAYER_TURN;
      return;
    },

    wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    checkWinner() {
      console.log("checkWinner");

      if (this.playerPokemon.currentHp <= 0) {
        this.battleMessage = `${this.playerPokemon.name} は たおれた！`;
        this.gameState.currentPhase = GamePhase.END_GAME;
        return;
      } else if (this.opponentPokemon.currentHp <= 0) {
        this.battleMessage = `${this.opponentPokemon.name} は たおれた！`;
        this.gameState.currentPhase = GamePhase.END_GAME;
        return;
      }
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

    // requestAnimationFrame(this.gameLoop);
    this.gameState.currentPhase = GamePhase.PLAYER_TURN;
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
  watch: {
    "gameState.currentPhase": function (newPhase, oldPhase) {
      // currentPhaseが変更されたときに実行される処理
      if (newPhase === GamePhase.PLAYER_TURN) {
        this.handlePlayerTurn();
      } else if (newPhase === GamePhase.ENEMY_TURN) {
        this.handleEnemyTurn();
      } else if (newPhase === GamePhase.END_GAME) {
        this.checkWinner();
      }
    },
  },
};
</script>
