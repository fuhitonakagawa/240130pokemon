<template>
  <q-dialog v-model="internalVisible">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
        <p>{{ message }}</p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="いいえ" color="primary" @click="decline" />
        <q-btn flat label="はい" color="negative" @click="accept" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    message: String,
    modelValue: Boolean,
  },
  computed: {
    internalVisible: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  methods: {
    accept() {
      this.$emit("confirm");
      this.close();
    },
    decline() {
      this.close();
    },
    close() {
      this.$emit("update:modelValue", false);
    },
  },
};
</script>
