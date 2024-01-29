<template>
  <div>
    <h4>スタートページ</h4>
    <div class="start-page q-pa-md">
      <q-btn color="primary" label="はじめから" @click="startNewGame" />
      <q-btn color="secondary" label="つづきから" @click="continueGame" />
    </div>
  </div>
</template>


<script>
export default {
  methods: {
    startNewGame() {
      // トレーナー作成画面へ遷移
      this.$router.push({ name: 'TrainerCreationPage' });
    },
    continueGame() {
      // トレーナー選択画面へ遷移
      this.$router.push({ name: 'TrainerSelectionPage' });
    },
  },
};
</script>
