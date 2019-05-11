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
        <v-container>
          <v-layout row wrap justify-center>
            <v-flex xs12>
              <v-text-field
                  v-model="srcSingle"
                  :error-messages="srcSingleErrors"
                  label="输入单句"
                  required
                  @input="$v.srcSingle.$touch()"
                  @blur="$v.srcSingle.$touch()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                  v-model="translateSingleResult"
                  label="翻译结果"
                  readonly
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                  v-model="alignSingleResult"
                  label="对齐结果"
                  readonly
              ></v-text-field>
            </v-flex>
            <v-flex xs6 lg2>
              <v-switch
                  v-model="srcSingleHasTag"
                  :label="srcSingleHasTagSwitch"
              ></v-switch>
            </v-flex>
            <v-flex xs6 lg2>
              <v-switch
                  v-model="isChToEn"
                  :label="isChToEnSwitch"
              ></v-switch>
            </v-flex>

            <v-flex xs12>
              <v-btn @click="translateSingle" color="success">翻译</v-btn>
              <v-btn @click="alignSingle" dark color="blue">对齐</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-tab-item>

      <v-tab ripple>页面翻译</v-tab>
      <v-tab-item>2</v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
  import Vue from "vue";
  import {validationMixin} from "vuelidate";
  import {required, maxLength, minLength, sameAs} from "vuelidate/lib/validators";
  import config from "@/config.ts";
  import {post} from "@/helpers.ts";

  export default Vue.extend({
    mixins: [validationMixin],
    name: "translate",
    validations: {
      srcSingle: {required, maxLength: maxLength(1024)},
    },
    data: () => ({
      srcSingle: "",
      translateSingleResult: "",
      alignSingleResult: "",
      srcSingleHasTag: false,
      isChToEn: false,
    }),
    computed: {
      srcSingleHasTagSwitch() {
        if (this.srcSingleHasTag) {
          return "包含标签";
        } else {
          return "不包含标签";
        }
      },
      isChToEnSwitch() {
        if (this.isChToEn) {
          return "中译英";
        } else {
          return "英译中";
        }
      },
      srcSingleErrors() {
        const errors: any[] = [];
        if (!this.$v.srcSingle!.$dirty) {
          return errors;
        }
        !this.$v.srcSingle!.maxLength && errors.push("句子长度不能超过 1024");
        !this.$v.srcSingle!.required && errors.push("请输入单句");
        return errors;
      },
    },
    methods: {
      async translateSingle() {
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        } else {
          const response = await post<{
            result: boolean,
            code: number,
            msg: string,
            data: string,
          }>(config.baseUrl + "translate",
            {
              input: this.srcSingle,
            });
          // console.log(response.parsedBody);
          if (response.parsedBody!.result) {
            this.showInfo(response.parsedBody!.msg);
            console.log(response.parsedBody.data);
            this.translateSingleResult = response.parsedBody.data;
          } else {
            this.showError(response.parsedBody!.msg);
          }
        }
      },
      async alignSingle() {
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        } else {
          const response = await post<{
            result: boolean,
            code: number,
            msg: string,
            data: string,
          }>(config.baseUrl + "align",
            {
              translation: this.translateSingleResult,
            });
          // console.log(response.parsedBody);
          if (response.parsedBody!.result) {
            this.showInfo(response.parsedBody!.msg);
            console.log(response.parsedBody.data);
            this.alignSingleResult = response.parsedBody.data;
          } else {
            this.showError(response.parsedBody!.msg);
          }
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
