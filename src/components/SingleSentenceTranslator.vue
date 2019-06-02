<template>
  <v-container>
    <v-layout row wrap justify-center>
      <v-flex xs12>
        <v-text-field
            v-model="srcSingle"
            :error-messages="srcSingleErrors"
            :label="translateSingleInputPlaceHolder"
            required
            @input="$v.srcSingle.$touch()"
            @blur="$v.srcSingle.$touch()"
        ></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-text-field
            v-model="translateSingleResult"
            :label="translateSingleResultPlaceHolder"
            readonly
        ></v-text-field>
      </v-flex>
      <transition name="fade">
        <v-flex xs12 v-show="srcSingleHasTag && translateSingleResult.length > 0">
          <v-text-field
              v-model="alignSingleResult"
              :label="translateSingleAlignPlaceHolder"
              readonly
          ></v-text-field>
        </v-flex>
      </transition>

      <v-flex xs6 lg2>
        <v-switch
            v-model="isSingleChToEn"
            :label="isSingleChToEnSwitch"
        ></v-switch>
      </v-flex>
      <v-flex xs6 lg2>
        <v-switch
            v-model="srcSingleHasTag"
            :label="srcSingleHasTagSwitch"
        ></v-switch>
      </v-flex>

      <v-flex xs12>
        <v-btn @click="translateSingle" color="success">翻译</v-btn>
        <transition name="fade">
          <v-btn
              @click="alignSingle"
              dark color="blue"
              v-show="srcSingleHasTag && translateSingleResult.length > 0"
          >
            对齐
          </v-btn>
        </transition>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import Vue from "vue";
  import {validationMixin} from "vuelidate";
  import {required, maxLength, minLength, sameAs} from "vuelidate/lib/validators";
  import config from "@/config.ts";
  import {get, post} from "@/helpers.ts";

  export default Vue.extend({
    name: "SingleSentenceTranslator",
    mixins: [validationMixin],
    validations: {
      srcSingle: {required, maxLength: maxLength(1024)},
    },
    data: () => ({
      // Single
      srcSingle: "",
      translateSingleResult: "",
      alignSingleResult: "",
      srcSingleHasTag: false,
      isSingleChToEn: false,
    }),
    computed: {
      // Single
      srcSingleHasTagSwitch() {
        if (this.srcSingleHasTag) {
          return "包含标签";
        } else {
          return "不包含标签";
        }
      },
      isSingleChToEnSwitch() {
        if (this.isSingleChToEn) {
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
        if (this.isSingleChToEn) {
          !this.$v.srcSingle!.maxLength && errors.push("The length of the sentence cannot exceed 1024");
          !this.$v.srcSingle!.required && errors.push("Please input a sentence");
        } else {
          !this.$v.srcSingle!.maxLength && errors.push("句子长度不能超过 1024");
          !this.$v.srcSingle!.required && errors.push("请输入单句");
        }
        return errors;
      },
      translateSingleInputPlaceHolder() {
        if (this.isSingleChToEn) {
          return "Please input a sentence";
        } else {
          return "输入单句";
        }
      },
      translateSingleResultPlaceHolder() {
        if (this.isSingleChToEn) {
          return "Translation result";
        } else {
          return "翻译结果";
        }
      },
      translateSingleAlignPlaceHolder() {
        if (this.isSingleChToEn) {
          return "Align result";
        } else {
          return "对齐结果";
        }
      },
      translateSingleAPI() {
        if (this.isSingleChToEn) {
          if (this.srcSingleHasTag) {
            return "translatecetag";
          } else {
            return "translatece";
          }
        } else {
          if (this.srcSingleHasTag) {
            return "translateectag";
          } else {
            return "translateec";
          }
        }
      },
      alignSingleAPI() {
        if (this.isSingleChToEn) {
          return "alignce";
        } else {
          return "alignec";
        }
      }
    },
    methods: {
      async translateSingle() {
        this.$v.$touch();
        if (this.$v.srcSingle!.$invalid) {
          return;
        } else {
          this.translateSingleResult = "";
          this.alignSingleResult = "";
          try {
            const response = await post<{
              result: boolean,
              code: number,
              msg: string,
              data: string,
            }>(config.baseUrl + this.translateSingleAPI,
              {
                input: this.srcSingle,
              });
            // console.log(response.parsedBody);
            if (response.parsedBody!.result) {
              this.showInfo(response.parsedBody!.msg);
              // console.log(response.parsedBody.data);
              this.translateSingleResult = response.parsedBody.data;
            } else {
              this.showError(response.parsedBody!.msg);
            }
          } catch (response) {
            this.showError("出错啦！详细信息：" + response);
          }
        }
      },
      async alignSingle() {
        this.$v.$touch();
        if (this.$v.srcSingle!.$invalid) {
          return;
        } else {
          try {
            const response = await post<{
              result: boolean,
              code: number,
              msg: string,
              data: string,
            }>(config.baseUrl + this.alignSingleAPI,
              {
                translation: this.translateSingleResult,
              });
            // console.log(response.parsedBody);
            if (response.parsedBody!.result) {
              this.showInfo(response.parsedBody!.msg);
              // console.log(response.parsedBody.data);
              this.alignSingleResult = response.parsedBody.data;
            } else {
              this.showError(response.parsedBody!.msg);
            }
          } catch (response) {
            this.showError("出错啦！详细信息：" + response);
          }
        }
      },
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
  .fade-enter-active, .fade-leave-active
    transition: opacity .5s

  .fade-enter, .fade-leave-to
    opacity: 0
</style>
