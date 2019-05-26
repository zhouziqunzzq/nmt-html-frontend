<template>
  <v-container>
    <v-tabs
        color="cyan"
        dark
        slider-color="yellow"
        grow
    >
      <v-tab ripple>单句翻译</v-tab>
      <v-tab-item>
        <SingleSentenceTranslator/>
      </v-tab-item>

      <v-tab ripple>页面翻译</v-tab>
      <v-tab-item>
        <PageTranslator/>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
  import Vue from "vue";
  import SingleSentenceTranslator from "@/components/SingleSentenceTranslator.vue";
  import PageTranslator from "@/components/PageTranslator.vue";

  export default Vue.extend({
    name: "translate",
    components: {
      SingleSentenceTranslator,
      PageTranslator
    },
    data: () => ({
      //
    }),
    computed: {
      //
    },
    methods: {
      //
      showInfo(msg: string) {
        this.$store.dispatch("showInfo", msg);
      },
      showError(msg: string) {
        this.$store.dispatch("showError", msg);
      },
    },
  });
</script>

<style scoped lang="stylus">

</style>
