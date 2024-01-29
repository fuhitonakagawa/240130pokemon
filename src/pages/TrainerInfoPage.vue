<template>
  <h4>トレーナー情報画面</h4>
  <div class="trainer-info-page q-pa-md">
    <q-card v-if="trainer">
      <q-card-section>
        <div class="text-h6">{{ trainer.name }}</div>
        <div v-for="pokemon in trainer.pokemons" :key="pokemon.name" class="q-mb-md">
          <q-img :src="pokemon.image" :alt="pokemon.name" />
          <div>{{ pokemon.name }}</div>
          <q-input filled v-model="pokemon.nickname" label="ニックネーム" />
          <q-btn label="ニックネーム保存" @click="saveNickname(pokemon)" />
        </div>
      </q-card-section>
    </q-card>
    <q-btn color="primary" @click="goToPokemonCatchPage">ポケモンゲット</q-btn>
  </div>
</template>

<script>
import { fetchTrainerInfo, updateTrainer } from '../services/trainerService';
import { getPokemonInfo } from '../services/pokemonService';

export default {
  data() {
    return {
      trainer: null
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
        console.error('Error:', error);
      }
    },
    async saveNickname(pokemon) {
      try {
        // ポケモンのニックネームを更新
        const updatedTrainerData = { ...this.trainer };
        const pokemonIndex = this.trainer.pokemons.findIndex(p => p.name === pokemon.name);
        if (pokemonIndex !== -1) {
          updatedTrainerData.pokemons[pokemonIndex].nickname = pokemon.nickname;
        }

        // 更新されたトレーナーデータを送信
        await updateTrainer(this.trainer.id, updatedTrainerData);
        this.trainer = updatedTrainerData; // ローカルのトレーナーデータを更新
      } catch (error) {
        console.error('ニックネームの保存に失敗しました:', error);
      }
    },
    goToPokemonCatchPage() {
      this.$router.push({ name: 'PokemonCatchPage' });
    }
  }
};
</script>
