<template>
  <div>
    <h4>トレーナー選択</h4>
    <q-btn label="トップページに戻る" @click="goToStartPage" color="primary" />
    <div v-if="isLoading">
      <!-- ローディングインジケーターを表示 -->
      <q-spinner color="primary" size="50px" />
    </div>
    <div v-else>
    <div v-for="trainer in trainers" :key="trainer.name" class="q-my-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ trainer.name }}</div>
          <div class="pokemon-container">
            <q-img
              v-for="pokemon in trainer.pokemons"
              :key="pokemon.name"
              :src="pokemon.image"
              :alt="pokemon.name"
              class="pokemon-image"
            />
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn label="選択" @click="selectTrainer(trainer.name)" />
          <q-btn
            label="削除"
            color="negative"
            @click="deleteTrainer(trainer.name)"
          />
        </q-card-actions>
      </q-card>
    </div>
    </div>
    <confirm-dialog
      :model-value="showDialog"
      title="削除確認"
      message="このトレーナーを削除してもよろしいですか？"
      @confirm="confirmDeleteTrainer"
      @update:modelValue="showDialog = $event"
    />
  </div>
</template>

<style>
.pokemon-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.pokemon-image {
  height: 100px;
  width: 100px;
  margin-right: 10px;
}

.pokemon-image:last-child {
  margin-right: 0;
}
</style>

<script>
import {
  getTrainers,
  deleteTrainer,
  fetchTrainerInfo,
} from "../services/trainerService";
import ConfirmDialog from "src/components/ConfirmDialog.vue";

export default {
  components: {
    ConfirmDialog,
  },
  data() {
    return {
      trainers: [], // トレーナーリスト
      showDialog: false, // 確認ダイアログの表示フラグ
      currentTrainerName: null, // 確認ダイアログで選択されたトレーナー名
      isLoading: true, // ローディングインジケーターの表示フラグ
    };
  },
  async created() {
    try {
      const trainerFiles = await getTrainers();
      const trainerNames = trainerFiles.map(
        (file) => file.split("/")[1].split(".")[0]
      );

      this.trainers = await Promise.all(
        trainerNames.map(async (name) => {
          const trainerInfo = await fetchTrainerInfo(name);
          return {
            name: name,
            pokemons: trainerInfo.pokemons,
          };
        })
      );

      this.isLoading = false;
    } catch (error) {
      console.error("トレーナー情報の取得に失敗しました", error);
    }
  },
  methods: {
    selectTrainer(trainerName) {
      this.$router.push({ name: "TrainerInfoPage", params: { trainerName } });
    },
    deleteTrainer(trainerName) {
      this.currentTrainerName = trainerName; // 削除するトレーナー名をセット
      this.showDialog = true; // 確認ダイアログを表示
    },
    async confirmDeleteTrainer() {
      try {
        await deleteTrainer(this.currentTrainerName); // 確認後に削除
        this.trainers = this.trainers.filter(
          (trainer) => trainer.name !== this.currentTrainerName
        );
        this.showDialog = false; // ダイアログを閉じる
        this.currentTrainerName = null; // 現在選択されているトレーナー名をリセット
        // ここでリロードする代わりにVueのリアクティブシステムを利用する
      } catch (error) {
        console.error("Failed to delete trainer:", error);
      }
    },
    goToStartPage() {
      this.$router.push({ name: "StartPage" });
    },
  },
};
</script>
