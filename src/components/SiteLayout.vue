<template>
  <div style="height: 100%; min-height: 100%; position: relative;">
    <div class="g-doc">
      <div class="g-bd">
        <header-layout></header-layout>

        <div class="index">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </div>

    <footer-layout></footer-layout>
  </div>
</template>

<script>
import HeaderLayout from "@/components/Header/HeaderLayout.vue";
import FooterLayout from "@/components/Footer/FooterLayout.vue";

export default {
  name: "SiteLayout",
  components: {
    HeaderLayout,
    FooterLayout
  }
};
</script>
