<template>
  <h4>トレーナー情報画面</h4>
  <div class="trainer-info-page q-pa-md">
    <q-btn label="トップページに戻る" @click="goToStartPage" color="primary" />
    <q-btn color="primary" @click="goToPokemonCatchPage">ポケモンゲット</q-btn>
    <div v-if="isLoading">
      <!-- ローディングインジケーターを表示 -->
      <q-spinner color="primary" size="50px" />
    </div>
    <div v-else>
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
            <q-btn
              label="削除"
              color="negative"
              @click="removePokemon(pokemon.name)"
            />
            <q-btn
              label="バトル"
              color="positive"
              @click="goToBattle(pokemon)"
            />
          </div>
        </div>
        <div v-else>ポケモンを持っていません。</div>
      </q-card-section>
    </q-card>
    </div>
  </div>
  <!-- <div>
    <confirm-dialog
      :model-value="showDialog"
      title="削除確認"
      message="このポケモンを削除してもよろしいですか？"
      @confirm="confirmRemovePokemon"
      @update:modelValue="showDialog = $event"
    />
  </div> -->
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
// import ConfirmDialog from "src/components/ConfirmDialog.vue";


export default {
  // components: {
  //   ConfirmDialog,
  // },
  data() {
    return {
      trainer: null,
      tempNicknames: [], // 一時的なニックネームを保持するオブジェクト
      isLoading: false,
      // showDialog: false,
      // currentPokemonName: null, // 確認ダイアログで選択されたポケモン名
    };
  },
  async created() {
    await this.loadTrainerData();
    this.isLoading = false;
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
    async removePokemon(pokemonName) {
      try {
        // Filter out the Pokémon to be removed
        this.trainer.pokemons = this.trainer.pokemons.filter(
          (p) => p.name !== pokemonName
        );

        // Update the trainer data on the server
        await updateTrainer(this.trainer.name, this.trainer);

        // Optionally, reload trainer data or handle UI update
        this.loadTrainerData();
      } catch (error) {
        console.error("Error removing pokemon:", error);
      }
    },
    goToPokemonCatchPage() {
      this.$router.push({ name: "PokemonCatchPage" });
    },
    goToStartPage() {
      this.$router.push({ name: "StartPage" });
    },
    goToBattle(pokemonName) {
      this.$router.push({
        name: "BattlePage",
        params: { trainerName: this.trainerName, pokemonName: pokemonName.name, pokemonNickname: pokemonName.nickname},
      });
    },
  },
};
</script>
