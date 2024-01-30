<template>
  <h4>トレーナー情報画面</h4>
  <div class="trainer-info-page q-pa-md">
    <q-card v-if="trainer">
      <q-card-section>
        <div class="text-h6">{{ trainer.name }}</div>
        <div v-if="trainer.pokemons && trainer.pokemons.length > 0">
          <div
            v-for="pokemon in trainer.pokemons"
            :key="pokemon.name"
            class="q-mb-md"
          >
            <q-img
              :src="pokemon.image"
              :alt="pokemon.name"
              class="pokemon-image"
            />
            <div>
              <h3>{{ pokemon.nickname || pokemon.name }}</h3>
            </div>
            <q-input filled v-model="pokemon.nickname" label="ニックネーム" />
            <!-- <q-input
              filled
              :value="tempNicknames[pokemon.name]"
              @input="tempNicknames[pokemon.name] = $event"
              label="ニックネーム"
            /> -->
            <q-btn label="ニックネーム保存" @click="saveNickname(pokemon)" />
          </div>
        </div>
        <div v-else>ポケモンを持っていません。</div>
      </q-card-section>
    </q-card>
    <q-btn color="primary" @click="goToPokemonCatchPage">ポケモンゲット</q-btn>
  </div>
</template>

<style>
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
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async saveNickname(pokemon) {
      try {
        // トレーナーデータの取得
        const trainerData = await fetchTrainerInfo(this.trainer.name);

        // 更新するポケモンの名前を変更
        const pokemonIndex = trainerData.pokemons.findIndex(
          (p) => p.name === pokemon.name
        );
        if (pokemonIndex !== -1) {
          trainerData.pokemons[pokemonIndex].nickname = pokemon.nickname;
        }

        // トレーナーデータをサーバーに送信
        await updateTrainer(this.trainer.name, trainerData);

        // 画面を更新
        this.loadTrainerData();
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
