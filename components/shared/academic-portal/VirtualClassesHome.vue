
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
        <Vspace space="2"/>
        <h5 v-if="items.length==0">No data..</h5>
        <div v-for="item in items">
            <NuxtLink :href="item.link" class="text-decoration-none text--parent"  style="color:black;">
            <h5 style="color:black;">{{ item.title }}</h5>
            </NuxtLink>
            <!-- <NuxtLink v-if="item.desc" href="#" class="text-decoration-none" style="color:black;">
                <h6>{{ item.desc }} <span class="font-italic"  style="color:green;">selengkapnya</span></h6>
            </NuxtLink> -->
            <h6  style="color:green;">{{moment(item.date).format("DD MMMM YYYY, HH:mm:ss")}}</h6>
            <Vspace space="3"/>
        </div>
        
        <v-divider :thickness="3" class="my-2"></v-divider>
    </div>
</template>

<style lang="scss">
</style>
