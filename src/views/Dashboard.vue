<template>
  <v-container>
    <h1>{{user.username}}</h1>
    <form>
      <v-btn @click="logout" color="success">注销</v-btn>
    </form>
  </v-container>
</template>

<script lang="ts">
  import Vue from "vue";
  import config from "@/config.ts";
  import {get, post} from "@/helpers.ts";
  import {mapState} from "vuex";

  export default Vue.extend({
    name: "register",
    data: () => ({
      //
    }),
    computed: {
      ...mapState([
        "user",
      ]),
    },
    methods: {
      async logout() {
        const response = await get<{
          result: boolean,
          code: number,
          msg: string,
          data: any,
        }>(config.baseUrl + "auth/logout");
        // console.log(response.parsedBody);
        if (response.parsedBody.result) {
          this.$store.dispatch('logout');
          this.showInfo(response.parsedBody.msg);
          this.$router.push("/auth/login");
        } else {
          this.showError(response.parsedBody.msg);
        }
      },
      showInfo(msg: string) {
        this.$store.dispatch("showInfo", msg);
      },
      showError(msg: string) {
        this.$store.dispatch("showError", msg);
      },
    }
  });
</script>

<style scoped lang="stylus">

</style>
