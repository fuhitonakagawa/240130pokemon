<template>
  <div>
    <h4>トレーナー選択</h4>
    <q-btn label="トップページに戻る" @click="goToStartPage" color="primary" />
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

export default {
  data() {
    return {
      trainers: [], // トレーナーリスト
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
        window.location.reload();
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
