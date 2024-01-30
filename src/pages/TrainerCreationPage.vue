<template>
  <div>
    <h4>トレーナー作成</h4>
    <q-input v-model="trainerName" label="トレーナー名" />
    <q-btn label="作成" @click="createTrainer" />
    <MessageBox
      :title="msgBoxTitle"
      :message="msgBoxMessage"
      v-model:modelValue="showMsgBox"
    />
  </div>
</template>

<script>
import { createTrainer } from "../services/trainerService";
import MessageBox from "/src/components/MessageBox.vue";

export default {
  components: {
    MessageBox,
  },
  data() {
    return {
      trainerName: "",
      pokemons: [],
      showMsgBox: false,
      msgBoxTitle: "",
      msgBoxMessage: "",
    };
  },
  methods: {
    async createTrainer() {
      if (!this.trainerName) {
        this.showMessage("エラー", "トレーナー名を入力してください");
        return;
      }

      try {
        await createTrainer({
          name: this.trainerName,
          pokemons: this.pokemons,
        });
        this.$router.push({
          name: "TrainerInfoPage",
          params: { trainerName: this.trainerName },
        });
      } catch (error) {
        this.showMessage("エラー", "トレーナーの作成に失敗しました");
      }
    },
    showMessage(title, message) {
      this.msgBoxTitle = title;
      this.msgBoxMessage = message;
      this.showMsgBox = true;
    },
    goToStartPage() {
      this.$router.push({ name: "StartPage" });
    },
  },
};
</script>
