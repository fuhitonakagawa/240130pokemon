<template>
  <div class="pokemon-catch-page q-pa-md">
    <h4>ポケモンゲット</h4>
    <q-row v-for="pokemon in pokemons" :key="pokemon.name">
      <!-- ポケモンの画像 -->
      <q-col cols="4">
        <q-img
          :src="pokemon.image"
          :alt="pokemon.name"
          class="pokemon-image"
          no-ratio
        />
      </q-col>
      <!-- ポケモンの名前 -->
      <q-col cols="4" class="pokemon-name">
        {{ pokemon.name }}
      </q-col>
      <!-- ゲットボタン -->
      <q-col cols="4">
        <q-btn label="ゲット" @click="getPokemons(pokemon)" />
      </q-col>
    </q-row>
    <MessageBox
      :title="msgBoxTitle"
      :message="msgBoxMessage"
      v-model:modelValue="showMsgBox"
    />
  </div>
</template>

<style>
.pokemon-image {
  height: 300px;
  width: 300px;
}
</style>

<script>
import { getPokemons } from "../services/pokemonService";
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
    };
  },
  async created() {
    this.pokemons = await getPokemons();
    this.trainerName = this.$route.params.trainerName; // URLからトレーナー名を取得
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
  },
};
</script>
