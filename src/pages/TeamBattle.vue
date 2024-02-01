<template>
  <div>
    <h4>Battle Screen</h4>
    <q-btn label="トレーナー情報に戻る" @click="goToInfoPage" color="primary" />
    <div class="message-box">
      <h5>{{ battleMessage }}</h5>
    </div>
    <div class="battle-page">
      <div class="team opponent-team">
        <!-- Opponent's Pokémon Team -->
        <div
          v-for="(pokemon, index) in opponentTeam"
          :key="'opponent-' + index"
          class="opponent-pokemon pokemon-info"
        >
          <img
            :src="pokemon.frontImage"
            :alt="`Back of ${pokemon.name}`"
            :class="{ img: true, hopping: activePokemonName === pokemon.name }"
          />
          <div class="pokemon-details">
            <h5>{{ pokemon.name }}</h5>
            <div class="pokemon-hp">
              <span>{{ pokemon.currentHp }} / {{ pokemon.maxHp }}</span>
              <div
                class="hp-bar"
                :style="{ width: this.pokemonHpWidth(pokemon) }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="team player-team">
        <!-- Player's Pokémon Team -->
        <div
          v-for="(pokemon, index) in playerTeam"
          :key="'player-' + index"
          class="player-pokemon pokemon-info"
        >
          <img
            :src="pokemon.backImage"
            :alt="`Back of ${pokemon.name}`"
            :class="{ img: true, hopping: activePokemonName === pokemon.name }"
          />
          <div class="pokemon-details">
            <h5>{{ pokemon.name }}</h5>
            <div class="pokemon-hp">
              <span>{{ pokemon.currentHp }} / {{ pokemon.maxHp }}</span>
              <div
                class="hp-bar"
                :style="{ width: this.pokemonHpWidth(pokemon) }"
              ></div>
            </div>
            <div class="skills">
              <button
                v-for="skill in pokemon.skills"
                :key="skill.name"
                @click="selectSkill(pokemon.name, skill)"
                v-show="
                  buttonVisible &&
                  pokemon.isAlive &&
                  (!selectedSkills[pokemon.name] ||
                    selectedSkills[pokemon.name].name === skill.name)
                "
                class="skill-button"
              >
                {{ skill.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.battle-page {
  display: flex;
  justify-content: space-around; /* チームを画面の左右に配置 */
}

.team {
  display: flex;
  flex-direction: column; /* チーム内のポケモンを縦に並べる */
  align-items: center;
  width: 45%; /* チームの幅を画面の45%に設定 */
}

.pokemon-info {
  display: flex; /* 画像とポケモンの詳細情報を横に並べる */
  margin-bottom: 10px; /* ポケモン間の間隔 */
  align-items: center;
  width: 100%;
}

.pokemon-details {
  display: flex;
  flex-direction: column; /* 名前、HPバー、技ボタンを縦に並べる */
  justify-content: center;
  width: 100%;
  margin-left: 10px; /* 画像との間隔 */
}

.pokemon-hp {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #ccc; /* グレーの背景バー */
  border-radius: 5px;
  overflow: hidden;
  max-width: 100%; /* HPバーの最大幅を親要素の45%に設定 */
}

.hp-bar {
  background-color: rgb(9, 133, 9);
  height: 10px;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.skills {
  display: flex; /* 技ボタンを横に並べる */
  flex-direction: row; /* 横方向に並べる */
  gap: 10px; /* ボタン間の間隔 */
}

@keyframes hop {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.hopping {
  animation: hop 0.5s ease-in-out infinite;
}

h5 {
  margin: 0;
}

.img {
  width: 150px;
  height: 150px;
}

.message-box {
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 20px;
  background-color: white;
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
  props: ["pokemons"],
  data() {
    return {
      // Battle data
      battleMessage: "",
      playerTeam: [], // プレイヤーチームのポケモンリスト
      opponentTeam: [], // 対戦相手チームのポケモンリスト
      selectedSkills: {},
      allSkillSelected: false,
      gameState: {
        currentPhase: null,
      },
      buttonVisible: false,
      activePokemonName: null,
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

    async getRandomOpponentNames(count) {
      const opponentNames = [];
      for (let i = 0; i < count; i++) {
        const randomId = Math.floor(Math.random() * 500) + 1; // 1から500の間でランダムなIDを生成
        try {
          const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${randomId}`
          );
          opponentNames.push(response.data.name); // ランダムに選択されたポケモンの名前をリストに追加
        } catch (error) {
          console.error("Error fetching random opponent pokemon info:", error);
        }
      }
      return opponentNames; // 選択されたポケモンの名前のリストを返す
    },

    async loadPokemonSkills(pokemonType) {
      return getSkillsForType(pokemonType);
    },

    // ################################
    // ### バトルロジック
    // ################################

    // 技選択ステートの初期メッセージ表示
    promptSkillSelection() {
      this.battleMessage = "すべての技ボタンを選択してください。";
    },

    selectSkill(pokemonName, skill) {
      if (
        !this.playerTeam
          .concat(this.opponentTeam)
          .find((p) => p.name === pokemonName && p.isAlive)
      ) {
        return; // ポケモンが生存していない場合は技を選択できない
      }
      this.selectedSkills[pokemonName] = skill;
      // 技が選択されたら、そのポケモンの他の技ボタンを非表示にする
      // 技選択の完了をチェック
      this.checkAllSkillsSelected();
    },

    // 技選択の完了をチェックし、全員が選択したら行動順へ移行
    checkAllSkillsSelected() {
      console.log(this.selectedSkills);
      const totalAlivePokemons = this.playerTeam.filter(
        (p) => p.isAlive
      ).length;
      const selectedSkillsCount = Object.keys(this.selectedSkills).length;

      if (selectedSkillsCount === totalAlivePokemons) {
        console.log("ALL SKILLS SELECTED");
        this.gameState.currentPhase = GamePhase.EXECUTE_SKILL; // 技選択完了後は行動実行フェーズへ
      }
    },

    // 対戦相手の技をランダムに選択
    selectOpponentSkills() {
      this.opponentTeam.forEach((pokemon) => {
        if (pokemon.isAlive) {
          // 生存しているポケモンのみ処理
          const randomIndex = Math.floor(Math.random() * pokemon.skills.length);
          const randomSkill = pokemon.skills[randomIndex];
          this.selectedSkills[pokemon.name] = randomSkill;
        }
      });
    },

    async executeTurns() {
      this.battleMessage = "行動開始！";

      // 生存しているポケモンのみを対象にする
      const alivePokemons = [...this.playerTeam, ...this.opponentTeam].filter(
        (pokemon) => pokemon.isAlive
      );

      // ポケモンの行動順をランダムに決定
      const actionOrder = alivePokemons.sort(() => 0.5 - Math.random());

      console.log(actionOrder);

      await this.wait(1000);

      // 行動順に沿って技の効果を実行
      for (const pokemon of actionOrder) {
        if (!pokemon.isAlive) {
          return;
        }
        if (pokemon.isSleeping) {
          this.battleMessage = `${pokemon.name} は眠っている！\n`;
          pokemon.isSleeping = false;
          await this.wait(1000);
          continue;
        }
        if (pokemon.isConfusing) {
          this.battleMessage = `${pokemon.name} は混乱して自分をこうげきした！\n`;
          pokemon.isConfusing = false;
          pokemon.currentHp -= 20;
          await this.wait(1000);
          continue;
        }

        this.activePokemonName = pokemon.name; // アクティブなポケモンを設定
        const skill = this.selectedSkills[pokemon.name];
        if (!skill) {
          // 対戦相手のポケモンの技をランダムに決定
          const randomIndex = Math.floor(Math.random() * pokemon.skills.length);
          const randomSkill = pokemon.skills[randomIndex];
          this.selectedSkills[pokemon.name] = randomSkill;
        }
        const userTeam = this.playerTeam.includes(pokemon)
          ? this.playerTeam
          : this.opponentTeam;
        const targetTeam = this.playerTeam.includes(pokemon)
          ? this.opponentTeam
          : this.playerTeam;
        await this.applySkillEffect(
          pokemon,
          userTeam,
          targetTeam,
          this.selectedSkills[pokemon.name]
        );

        // HPが0以下のポケモンのisAliveフラグを更新し、倒れたメッセージを表示
        // [...this.playerTeam, ...this.opponentTeam].forEach((p) => {
        //   if (p.currentHp <= 0 && p.isAlive) {
        //     p.isAlive = false;
        //     this.battleMessage = `${p.name} は倒れた！\n`;
        //     await this.wait(1000);
        //   }
        // });
        for (const p of [...this.playerTeam, ...this.opponentTeam]) {
          if (p.currentHp <= 0 && p.isAlive) {
            p.isAlive = false;
            this.battleMessage = `${p.name} は倒れた！\n`; // メッセージを追加
            await this.wait(1000); // 1秒待機
          }
        }

        this.activePokemonName = ""; // アクティブなポケモンをリセット

        // チームメンバが全て倒れたら、ゲーム終了
        if (
          !this.playerTeam.some((p) => p.isAlive) ||
          !this.opponentTeam.some((p) => p.isAlive)
        ) {
          this.gameState.currentPhase = GamePhase.END_GAME;
          return; // ループから抜け出し、ゲーム終了処理を実行
        }
      }

      // 全てのポケモンのフラグをリセット
      [...this.playerTeam, ...this.opponentTeam].forEach((p) => {
        p.isDefencing = false;
        p.isSleeping = false;
        p.isConfusing = false;
      });

      // 全ての行動が完了した後、次のフェーズへ移行
      if (this.gameState.currentPhase !== GamePhase.END_GAME) {
        this.gameState.currentPhase = GamePhase.SELECT_SKILL; // 次のターンへ
      }
    },

    async applySkillEffect(user, userTeam, targetTeam, skill) {
      let msg = "";

      msg = `${user.name} の ${skill.name}！`;
      this.battleMessage = msg;
      await this.wait(1000);

      // Attack: 攻撃技
      if (skill.category === "Attack") {
        if (skill.isAoe) {
          // 全体攻撃
          targetTeam.forEach((pokemon) => {
            if (pokemon.isAlive) {
              pokemon.currentHp -= skill.power;
              msg += `${pokemon.name} に ${skill.power} ダメージ！\n`;
            }
          });
        } else {
          // 単体攻撃
          const aliveTargets = targetTeam.filter((pokemon) => pokemon.isAlive);
          const randomTarget =
            aliveTargets[Math.floor(Math.random() * aliveTargets.length)];
          randomTarget.currentHp -= skill.power;
          msg = `${randomTarget.name} に ${skill.power} ダメージ！`;
        }
      }

      // Defence: 防御技
      else if (skill.category === "Defence") {
        user.isDefencing = true;
        msg = `${user.name} は ぼうぎょ した！`;
      }

      // Recovery: 回復技
      else if (skill.category === "Recovery") {
        if (skill.isAoe) {
          // 味方全体を回復
          userTeam.forEach((pokemon) => {
            if (pokemon.isAlive) {
              pokemon.currentHp = Math.min(
                pokemon.currentHp + skill.power,
                pokemon.maxHp
              );
              msg += `${pokemon.name} の HP が ${skill.power} かいふく した！\n`;
            }
          });
        } else {
          // 単体回復
          user.currentHp = Math.min(user.currentHp + skill.power, user.maxHp);
          msg = `${user.name} の HP が ${skill.power} かいふく した！`;
        }
      }

      // 特殊効果の適用
      if (skill.category === "Special") {
        if (skill.isAoe) {
          // 全体技の場合、各対象に対して成功率を判定
          targetTeam.forEach((target) => {
            if (target.isAlive) {
              msg += this.applyEffectToTarget(user, target, skill);
            }
          });
        } else {
          // 単体技の場合、ランダムに選択された対象に対して成功率を判定
          const aliveTargets = targetTeam.filter((pokemon) => pokemon.isAlive);
          const randomTarget =
            aliveTargets[Math.floor(Math.random() * aliveTargets.length)];
          msg += this.applyEffectToTarget(user, randomTarget, skill);
        }
      }

      this.battleMessage = msg;
      await this.wait(1000);
    },

    applyEffectToTarget(user, target, skill) {
      let msg = "";
      if (Math.random() * 100 < skill.successRate) {
        switch (skill.effect) {
          case "attack":
            if (target.isDefencing) {
              msg = `${target.name} は ぼうぎょ している！`;
              target.isDefencing = false;
            } else {
              target.currentHp -= skill.power;
              msg = `${target.name} に ${skill.power} ダメージ！`;
            }
            break;
          case "recovery":
            user.currentHp = Math.min(user.currentHp + skill.power, user.maxHp);
            msg = `${user.name} の HP が ${skill.power} かいふく した！`;
            break;
          case "sleep":
            target.isSleeping = true;
            msg = `${target.name} は眠った！`;
            break;
          case "confuse":
            target.isConfusing = true;
            msg = `${target.name} は混乱した！`;
            break;
        }
      } else {
        msg = `${target.name} には効果がなかった！`;
      }
      return msg;
    },

    wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    checkWinner() {
      console.log("checkWinner");

      // 全てのポケモンの生存状態をチェックし、勝利チームを判定
      const playerTeamAlive = this.playerTeam.some(
        (pokemon) => pokemon.isAlive
      );
      const opponentTeamAlive = this.opponentTeam.some(
        (pokemon) => pokemon.isAlive
      );

      if (playerTeamAlive && !opponentTeamAlive) {
        // プレイヤーチームが勝利
        this.battleMessage = "プレイヤーチームの勝利！";
      } else if (!playerTeamAlive && opponentTeamAlive) {
        // 対戦相手チームが勝利
        this.battleMessage = "相手チームの勝利！";
      }
      return;
    },

    // チームの初期化を行うメソッド
    async initializeTeam(pokemonNames) {
      const team = [];
      for (const name of pokemonNames) {
        const pokemonInfo = await this.getPokemonInfo(name);
        const skills = await this.loadPokemonSkills(pokemonInfo.type);
        team.push({
          name: pokemonInfo.name,
          maxHp: 200, // 仮の値
          currentHp: 200, // 仮の値
          backImage: pokemonInfo.image, // 仮のプロパティ名
          frontImage: pokemonInfo.image, // 仮のプロパティ名
          isDefencing: false,
          isSleeping: false,
          isConfusing: false,
          isAlive: true,
          skills: skills,
        });
      }
      return team;
    },

    pokemonHpWidth(pokemon) {
      const width = (pokemon.currentHp / pokemon.maxHp) * 100;
      return `${Math.max(0, width)}%`;
    },
  },

  async created() {
    this.battleMessage = "相手ポケモンを取得中です";
    const pokemonNames = JSON.parse(this.$route.query.pokemonNames);

    // プレイヤーチームの初期化
    this.playerTeam = await this.initializeTeam(pokemonNames);

    // 対戦相手チームのポケモン名をランダムに選択
    const opponentNames = await this.getRandomOpponentNames(
      this.playerTeam.length
    );

    // 対戦相手チームの初期化
    this.opponentTeam = await this.initializeTeam(opponentNames);

    this.battleMessage = "バトルスタート！";

    await this.wait(1000);
    this.gameState.currentPhase = GamePhase.SELECT_SKILL;
  },

  computed: {},
  watch: {
    "gameState.currentPhase": function (newPhase, oldPhase) {
      switch (newPhase) {
        case GamePhase.SELECT_SKILL:
          this.buttonVisible = true;
          this.selectedSkills = {};
          // 技選択ステートの処理
          this.promptSkillSelection();
          break;
        case GamePhase.EXECUTE_SKILL:
          this.buttonVisible = false;
          // 行動ステートの処理
          this.executeTurns();
          break;
        case GamePhase.END_GAME:
          // 勝敗決定ステートの処理
          this.checkWinner();
          break;
      }
    },
  },
};
</script>
