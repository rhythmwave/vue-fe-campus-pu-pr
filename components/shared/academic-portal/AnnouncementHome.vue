
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
const props = defineProps({
    title: String,
    items: Array as any,
});
</script>

<template>
    <div>
        <h3>{{ title }}</h3>
        <v-divider :thickness="3" class="my-2"></v-divider>
        <h5 v-if="items.length==0">There are no announcement for this category</h5>
        <div v-for="item in items">
            <NuxtLink :href="item.link" class="text-decoration-none text--parent"  style="color:black;">
            <h5>{{ item.title }}</h5>
            </NuxtLink>
            <h6>{{moment(item.date).format("DD MMMM YYYY")}}</h6>
            <Vspace v-if="item.desc" space="3"/>
            <!-- <NuxtLink v-if="item.desc" href="#" class="text-decoration-none">
                <h5>{{ item.desc }} <span class="font-italic"  style="color:green;">selengkapnya</span></h5>
            </NuxtLink> -->
            <Vspace space="3"/>
        </div>
        
        <v-divider :thickness="3" class="my-2"></v-divider>
    </div>
</template>

<style lang="scss">
</style>
