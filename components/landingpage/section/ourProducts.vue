<script setup lang="ts">
import { ref } from 'vue';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import { productsSlider } from '@/_mockApis/landingpage/lpPage';
import { curoselSettings } from '@/_mockApis/landingpage/curoselData';
</script>
<template>
    <v-container class="maxWidth">
        <v-row class="justify-center">
            <v-col cols="12" lg="8" sm="10" data-aos="fade-up" data-aos-duration="500">
                <div class="d-sm-flex align-center text-center justify-center">
                    <div class="d-flex flex-row-reverse justify-sm-start justify-center ml-sm-0 ml-3">
                        <v-avatar class="ml-n2 avtar-border" size="28">
                            <img src="/images/profile/user-3.jpg" height="28" alt="usericon" />
                        </v-avatar>
                        <v-avatar class="ml-n2 avtar-border" size="28">
                            <img src="/images/profile/user-2.jpg" height="28" alt="usericon" />
                        </v-avatar>
                        <v-avatar class="ml-n2 avtar-border" size="28">
                            <img src="/images/profile/user-1.jpg" height="28" alt="usericon" />
                        </v-avatar>
                    </div>
                    <h6 class="text-h6 ml-2 mt-2 mt-sm-0">52,589+</h6>
                    <h6 class="text-h6 ml-2">developers & agencies using our templates</h6>
                </div>
                <h2 class="text-center mt-4 sectionTitle font-weight-bold">
                    Production Ready & Developer Friendly Vuetify Nuxtjs Admin Template
                </h2>
            </v-col>
        </v-row>
        <div class="mt-sm-16 mt-10">
            <div class="pt-8 product-slider position-relative">
                <carousel :settings="curoselSettings" class="overflow-hidden ourproducts">
                    <slide v-for="images in productsSlider" :key="images.img">
                        <v-chip class="bg-textPrimary text-white chip-custom" size="large">{{ images.name }}</v-chip>
                        <div class="mt-n4">
                            <img :src="images.img" :alt="images.img" />
                        </div>
                        <v-btn
                            :href="images.link"
                            color="primary"
                            variant="outlined"
                            size="large"
                            class="my-8 font-weight-bold btn-custom-md"
                            flat
                            >Live preview</v-btn
                        >
                    </slide>
                    <template #addons>
                        <pagination />
                    </template>
                </carousel>
            </div>
        </div>
    </v-container>
</template>
