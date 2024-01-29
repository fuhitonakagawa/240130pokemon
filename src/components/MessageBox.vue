<template>
  <q-dialog v-model="internalVisible">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
        <p>{{ message }}</p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="閉じる" color="primary" @click="close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    message: String,
    modelValue: Boolean // 'visible' を 'modelValue' に変更
  },
  computed: {
    internalVisible: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:modelValue', false);
    }
  }
};
</script>
