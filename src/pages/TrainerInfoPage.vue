<template>
  <h4>トレーナー情報画面</h4>
  <div class="trainer-info-page q-pa-md">
    <q-btn color="primary" @click="goToPokemonCatchPage">ポケモンゲット</q-btn>
    <q-card v-if="trainer">
      <q-card-section>
        <div class="text-h6">{{ trainer.name }}</div>
        <div
          v-if="trainer.pokemons && trainer.pokemons.length > 0"
          class="pokemon-container"
        >
          <div
            v-for="(pokemon, index) in trainer.pokemons"
            :key="pokemon.name"
            class="pokemon-item"
          >
            <q-img
              :src="pokemon.image"
              :alt="pokemon.name"
              class="pokemon-image"
            />
            <div>
              <h3>{{ pokemon.nickname || pokemon.name }}</h3>
            </div>
            <q-input
              filled
              v-model="tempNicknames[index]"
              label="ニックネーム"
            />
            <q-btn
              label="ニックネーム保存"
              @click="saveNickname(pokemon, index)"
            />
          </div>
        </div>
        <div v-else>ポケモンを持っていません。</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style>
.pokemon-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.pokemon-item {
  flex: 1 1 300px;
  margin: 10px;
  max-width: 300px; /* Limit the maximum width */
}

.pokemon-image {
  height: 300px;
  width: 300px;
}
</style>

<script>
import { fetchTrainerInfo, updateTrainer } from "../services/trainerService";
import { getPokemonInfo } from "../services/pokemonService";

export default {
  data() {
    return {
      trainer: null,
      tempNicknames: [], // 一時的なニックネームを保持するオブジェクト
    };
  },
  async created() {
    await this.loadTrainerData();
  },
  methods: {
    async loadTrainerData() {
      try {
        const trainerName = this.$route.params.trainerName;
        const trainerData = await fetchTrainerInfo(trainerName);

        const pokemonsWithImages = await Promise.all(
          trainerData.pokemons.map(async (pokemon) => {
            const pokemonInfo = await getPokemonInfo(pokemon.name);
            return { ...pokemon, image: pokemonInfo.image };
          })
        );

        this.trainer = { ...trainerData, pokemons: pokemonsWithImages };
        // tempNicknamesの初期化
        this.trainer.pokemons.forEach((pokemon) => {
          this.tempNicknames[pokemon.name] = pokemon.nickname || "";
        });
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async saveNickname(pokemon, index) {
      try {
        const newNickname = this.tempNicknames[index];
        console.log("new: " + newNickname);
        if (newNickname !== undefined) {
          // トレーナーデータの取得
          const trainerData = await fetchTrainerInfo(this.trainer.name);

          // 更新するポケモンのニックネームを変更
          const pokemonIndex = trainerData.pokemons.findIndex(
            (p) => p.name === pokemon.name
          );
          if (pokemonIndex !== -1) {
            trainerData.pokemons[pokemonIndex].nickname = newNickname;
          }

          // トレーナーデータをサーバーに送信
          await updateTrainer(this.trainer.name, trainerData);

          // 一時的なニックネームをクリア
          this.tempNicknames[index] = "";

          // 画面を更新
          this.loadTrainerData();
        }
      } catch (error) {
        console.error("ニックネームの保存に失敗しました:", error);
      }
    },
    goToPokemonCatchPage() {
      this.$router.push({ name: "PokemonCatchPage" });
    },
  },
};
</script>
