<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon @click="showDrawer = !showDrawer"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>NMT-HTML</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-for="item in items"
             :key="item.title"
             :to="item.link"
             flat
             class="hidden-sm-and-down"
      >
        {{ item.title }}
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer
        app absolute temporary
        v-model="showDrawer"
    >
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              NMT-HTML
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list dense class="pt-0">
        <v-list-tile
            v-for="item in items"
            :key="item.title"
            :to="item.link"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
  import HelloWorld from "./components/HelloWorld.vue";
  import Vue from "vue";

  export default Vue.extend({
    name: "App",
    components: {
      HelloWorld
    },
    data() {
      return {
        showDrawer: false,
        items: [
          {title: "主页", link: "/home", icon: "dashboard"},
          {title: "注册", link: "/auth/register", icon: "assignment_ind"},
          {title: "登录", link: "/auth/login", icon: "account_circle"},
          {title: "关于", link: "/about", icon: "question_answer"}
        ],
      };
    }
  });
</script>
