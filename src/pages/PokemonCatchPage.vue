<template>
  <div class="pokemon-catch-page q-pa-md">
    <h4>ポケモンゲット</h4>
    <q-pagination
      v-model="currentPage"
      :max="maxPages"
      @update:modelValue="fetchPokemons"
    />
    <div v-if="isLoading" class="q-pa-md">
      <q-spinner color="primary" size="50px" />
    </div>
    <div v-else class="pokemon-container">
      <div v-for="pokemon in pokemons" :key="pokemon.name" class="pokemon-item">
        <q-card class="pokemon-card">
          <q-card-section>
            <div class="text-center">
              <q-img
                :src="pokemon.image"
                :alt="pokemon.name"
                class="pokemon-image"
              />
              <div class="q-mt-md">{{ pokemon.name }}</div>
              <q-btn label="ゲット" @click="getPokemons(pokemon)" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <MessageBox
      :title="msgBoxTitle"
      :message="msgBoxMessage"
      v-model:modelValue="showMsgBox"
    />
  </div>
</template>

<style>
.pokemon-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.pokemon-item {
  flex: 1 1 300px; /* フレックスアイテムの基本サイズを300pxに設定 */
  margin: 10px;
}

.pokemon-card {
  max-width: 300px; /* カードの最大幅を設定 */
}

.pokemon-image {
  height: 300px;
  width: 300px;
}
</style>

<script>
import { getPokemons, getTotalPages } from "../services/pokemonService";
import { updateTrainer, fetchTrainerInfo } from "../services/trainerService";
import MessageBox from "src/components/MessageBox.vue";

export default {
  components: {
    MessageBox,
  },
  data() {
    return {
      pokemons: [],
      trainer: null, // トレーナー情報を保持するためのデータ
      trainerName: "",
      showMsgBox: false,
      msgBoxTitle: "",
      msgBoxMessage: "",
      currentPage: 1,
      maxPages: 0,
      limit: 100,
      isLoading: false,
    };
  },
  async created() {
    this.maxPages = await getTotalPages(this.limit);
    this.fetchPokemons(this.currentPage);
    this.trainerName = this.$route.params.trainerName;
    await this.loadTrainerData();
  },
  methods: {
    showMessage(title, message) {
      this.msgBoxTitle = title;
      this.msgBoxMessage = message;
      this.showMsgBox = true;
    },
    async loadTrainerData() {
      try {
        this.trainer = await fetchTrainerInfo(this.trainerName);
      } catch (error) {
        console.error("トレーナー情報の取得に失敗しました:", error);
      }
    },
    async getPokemons(pokemon) {
      // 既にポケモンがトレーナーのリストに存在するかチェック
      if (this.trainer.pokemons.some((p) => p.name === pokemon.name)) {
        this.showMessage("エラー", "このポケモンは既に持っています！");
        return;
      }
      // トレーナー情報にポケモンを追加
      this.trainer.pokemons.push({ name: pokemon.name, image: pokemon.image });

      // トレーナー情報を更新
      try {
        await updateTrainer(this.trainer.name, this.trainer);
        this.$router.push({
          name: "TrainerInfoPage",
          params: { trainerName: this.trainer.name },
        });
      } catch (error) {
        console.error("ポケモンの取得に失敗しました:", error);
      }
    },
    async fetchPokemons(page) {
      this.isLoading = true;
      this.pokemons = await getPokemons(page, this.limit);
      this.isLoading = false;
    },
  },
};
</script>
