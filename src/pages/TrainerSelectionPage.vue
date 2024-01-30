<template>
  <div>
    <h4>トレーナー選択</h4>
    <q-btn label="トップページに戻る" @click="goToStartPage" color="primary" />
    <div v-for="trainer in trainers" :key="trainer">
      <q-item-label>{{ trainer }}</q-item-label>
      <q-btn label="選択" @click="selectTrainer(trainer)" />
      <q-btn label="削除" color="negative" @click="deleteTrainer(trainer)" />
    </div>
  </div>
</template>

<script>
import { getTrainers,deleteTrainer } from "../services/trainerService";

export default {
  data() {
    return {
      trainers: [], // トレーナーリスト
    };
  },
  async created() {
    try {
      const trainerFiles = await getTrainers();
      this.trainers = trainerFiles.map(
        (file) => file.split("/")[1].split(".")[0]
      );
    } catch (error) {
      console.error("トレーナー情報の取得に失敗しました", error);
    }
  },
  methods: {
    selectTrainer(trainerName) {
      this.$router.push({ name: "TrainerInfoPage", params: { trainerName } });
    },
    async deleteTrainer(trainerName) {
      try {
        await deleteTrainer(trainerName);
        this.trainers = this.trainers.filter((t) => t !== trainerName);
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
