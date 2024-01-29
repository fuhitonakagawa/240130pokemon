<template>
  <div>
    <h1>トレーナー選択</h1>
    <div v-for="trainer in trainers" :key="trainer">
      <q-item-label>{{ trainer }}</q-item-label>
      <q-btn label="選択" @click="selectTrainer(trainer)" />
    </div>
  </div>
</template>

<script>
import { getTrainers } from '../services/trainerService';

export default {
  data() {
    return {
      trainers: [] // トレーナーリスト
    };
  },
  async created() {
    try {
      const trainerFiles = await getTrainers();
      this.trainers = trainerFiles.map(file => file.split('/')[1].split('.')[0]);
    } catch (error) {
      console.error('トレーナー情報の取得に失敗しました', error);
    }
  },
  methods: {
    selectTrainer(trainerName) {
      this.$router.push({ name: 'TrainerInfoPage', params: { trainerName } });
    }
  }
};
</script>
