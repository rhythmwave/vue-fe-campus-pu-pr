<script setup lang="ts">
import { ref } from 'vue'
/* import tabler icons */
import { Menu2Icon } from 'vue-tabler-icons'
const Lpart = ref(false)

function toggleLpart () {
  Lpart.value = !Lpart.value
}
</script>

<template>
  <!---/Left chat list -->
  <div class="d-flex mainbox">
    <div class="left-part" :class="Lpart ? 'showLeftPart' : 'HideLeftPart'">
      <perfect-scrollbar class="h-100">
        <slot name="leftpart" />
      </perfect-scrollbar>
    </div>

    <!---right chat conversation -->
    <div class="right-part">
      <div v-if="Lpart" class="boxoverlay" @click="toggleLpart" />
      <div class="toggleLeft hidden-md-and-up">
        <v-btn icon size="small" @click="toggleLpart">
          <Menu2Icon aria-setsize="30" />
        </v-btn>
      </div>

      <slot name="rightpart" />
    </div>

    <!---right chat conversation -->
  </div>
</template>

<style lang="scss">
.mainbox {
  position: relative;
  overflow: hidden;
}
.left-part {
  width:320px;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  height: calc(100vh - 200px);
  transition: 0.1s ease-in;
  flex-shrink: 0;
}
.v-theme--light {
  .left-part {
    background: white;
  }
}
.v-theme--dark {
  .left-part {
    background: #2b2b2b;
  }
}
.right-part {
  width: 100%;
  position: relative;
  height: calc(100vh - 200px);
}
// .toggleLeft {
//   position: absolute;
//   right: 15px;
//   top: 15px;
// }
.h-100 {
  height: calc(100vh - 200px);
}
@media (max-width: 960px) {
  .left-part {
    position: absolute;
    left: -330px;
    &.showLeftPart {
      left: 0;
      z-index: 2;
      box-shadow: 2px 1px 20px rgba(0, 0, 0, 0.1);
    }
  }
  .boxoverlay {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 1;
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
