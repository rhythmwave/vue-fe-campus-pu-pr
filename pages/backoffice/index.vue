<script setup lang="ts">
import type { topCards } from '@/types/backoffice/backofficeTypes';
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

import toga_icon from "~/assets/img/toga.png"
import male_icon from "~/assets/img/male.png"
import female_icon from "~/assets/img/female.png"
import lecturer from "~/assets/img/lecturer.png"
import { BoldIcon } from "vue-tabler-icons";
import card_icon1 from "/images/svgs/icon-user-male.svg"
import card_icon2 from "/images/svgs/icon-briefcase.svg"
import card_icon3 from "/images/svgs/icon-mailbox.svg"
import card_icon4 from "/images/svgs/icon-favorites.svg"
import card_icon5 from "/images/svgs/icon-speech-bubble.svg"
import card_icon6 from "/images/svgs/icon-connect.svg"
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';


definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});

const page = ref({ title: 'Beranda' });
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoofice'
    },
    {
        text: 'Dashboard',
        disabled: true,
        href: '#'
    }
]);

const topCardsData: topCards[] = [
    {
        link: "#",
        img: toga_icon,
        title: "JUMLAH MAHASISWA AKTIF",
        subTitle: "",
        number: "3,685",
        bgcolor: "lightprimary",
        bgsubcolor: "",
        textcolor: "primary"
    },
    {
        link: "#",
        img: male_icon,
        title: "JUMLAH MAHASISWA LAKI-LAKI",
        subTitle: "(AKTIF, NON AKTIF, CUTI)",
        number: "256",
        bgcolor: "lightwarning",
        bgsubcolor: "",
        textcolor: "warning"
    },
    {
        link: "#",
        img: female_icon,
        title: "JUMLAH MAHASISWA PEREMPUAN",
        subTitle: "(AKTIF, NON AKTIF, CUTI)",
        number: "932",
        bgcolor: "lightsecondary",
        bgsubcolor: "",
        textcolor: "secondary"
    },
    {
        link: "#",
        img: lecturer,
        title: "JUMLAH DOSEN AKTIF",
        subTitle: "",
        number: "348",
        bgcolor: "lighterror",
        bgsubcolor: "",
        textcolor: "error"
    },
]

const topSubCardsData: topCards[] = [
{
        link: "#",
        img: "mdi-file",
        title: "JML DATA (KRS, UKOM, MBKM) DI SEMESTER AKTIF",
        subTitle: "",
        number: "308.000",
        bgcolor: "lightprimary",
        bgsubcolor: "#5e87ff",
        textcolor: "primary"
    },
    {
        link: "#",
        img: "mdi-file-account",
        title: "JML MHS YANG BELUM KRS DI SEMESTER AKTIF",
        subTitle: "(Aktif, Non Aktif, Cuti)",
        number: "123.000",
        bgcolor: "lightwarning",
        bgsubcolor: "#ffb028",
        textcolor: "warning"
    },
    {
        link: "#",
        img: "mdi-star",
        title: "IPS TERTINGGI",
        subTitle: "(Aktif, Non Aktif, Cuti)",
        number: "3.80",
        bgcolor: "lightsecondary",
        bgsubcolor: "#49beff",
        textcolor: "secondary"
    },
    {
        link: "#",
        img: "mdi-star-circle",
        title: "IPK TERTINGGI",
        subTitle: "",
        number: "4.00",
        bgcolor: "lighterror",
        bgsubcolor: "#fa896b",
        textcolor: "error"
    },
]

const chartOptions = computed(() => {
    return {
        chart: {
            height: 350,
            type: 'line',
            fontFamily: `inherit`,
            zoom: {
                type: 'x',
                enabled: true
            },
            toolbar: {
                show: false
            },
            shadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 1
            }
        },
        colors: [getPrimary.value, getSecondary.value],
        markers: {
            size: 1
        },
        xaxis: {
            categories: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
            title: {
                text: 'Bulan'
            }
        },
        grid: {
            show: false
        },
        dataLabels: {
            enabled: true
        },
        stroke: {
            curve: 'straight',
            width: '2'
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5
        },
        tooltip: {
            theme: 'dark',
            x: {
                format: 'dd/MM/yy HH:mm'
            }
        }
    };
});

const lineChart = {
    series: [
        {
            name: 'Laki-laki',
            data: [28, 29, 33, 36, 32, 32, 33, 27, 19, 90, 121, 33]
        },
        {
            name: 'Perempuan',
            data: [12, 11, 14, 18, 17, 13, 13, 13, 14, 19, 290, 121]
        }
    ]
};

const lineChartSecond = {
    series: [
        {
            name: 'Jumlah Mahasiswa Lulus',
            data: [28, 29, 33, 36, 32, 32, 33, 27, 19, 90, 121, 33]
        }
    ]
};

</script>

<template>
    <v-row>
      <v-col cols="12">
          <BackofficeBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-row>
          <v-col cols="12" lg="3" md="4" sm="12" v-for="card in topCardsData" :key="card.title">
              <NuxtLink
                style="min-height: 205px;"
                :to="card.link"
                :class="'text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6  bg-' + card.bgcolor"
              >
                  <div :class="'bg-' + card.bgcolor">
                        <div style="width: 30%; display: block; margin-left: auto; margin-right: auto;">
                            <img :src="card.img" alt="icon" class="center" style="width: 100%" />
                        </div>
                        <div :class="'text-subtitle-1 text-capitalize font-weight-bold mt-3 text-' + card.textcolor" v-text="card.title"></div>
                        <div :class="'text-subtitle-2 text-' + card.textcolor" v-text="card.subTitle"></div>
                        <!-- <div v-if="card.subTitle" :class="'text-subtitle-2 text-' + card.textcolor" v-text="card.subTitle"></div>
                        <div v-else="card.subTitle" style="margin-top:20px"></div> -->
                        <h4 :class="'text-h4 mt-1 text-' + card.textcolor" v-text="card.number"></h4>
                  </div>
              </NuxtLink>
          </v-col>
      </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12" lg="3" md="4" sm="12" v-for="card in topSubCardsData" :key="card.title">
                <NuxtLink
                  :to="card.link"
                  :class="'text-decoration-none d-flex text-center rounded-md pa-6  bg-' + card.bgcolor"
                  style="min-height: 110px; padding: 10px !important"
                >
                <div :class="'position-relative bg-' + card.bgcolor" style="width: 100%">
                    <div :style="`width: 30%; height: 100%; float: left; background-color:`+ card.bgsubcolor+`; padding-top: 33px; padding-left: 10%; display: flex;`">
                        <v-icon :icon="card.img" style="color:white"></v-icon>
                    </div>
                    <div style="width: 70%; float: left">
                        <div :class="'text-subtitle-2 font-weight-bold mt-3 text-' + card.textcolor" v-text="card.title"></div>
                        <h4 :class="'text-h4 mt-1 text-' + card.textcolor" v-text="card.number"></h4>
                    </div>
                    <!-- <img :src="card.img" alt="icon" /> -->
                  <!-- <div :class="'position-absolute bg-'+card.textcolor" style="left: -24px; top: -24px; padding: 12.5px;  border-radius: 8px;">
                    <img :src="card.img" alt="icon" />
                  </div>
                  <div :class="'text-subtitle-1 font-weight-bold text-' + card.textcolor" v-text="card.title" style="adding-left: 60px; position: absolute; width: 200px; top: -15px; left: 50px;"></div>
                  <h4 :class="'text-h4 text-' + card.textcolor" v-text="card.number" style="position: absolute; width: 100%; text-align: right; left: 10px; top: 20px;
                  "></h4> -->
                </div>
              </NuxtLink>
          </v-col>
      </v-row>
      </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <v-col cols="12">
                <BackofficeBreadcrumb title="Grafik Trend Jumlah Mahasiswa Aktif"></BackofficeBreadcrumb>
            </v-col>
            <UiParentCard title="Grafik Trend Jumlah Mahasiswa Aktif">
                <div style="width: 22px; position: absolute; height: 77.7%; text-align: center; background: rgb(250, 235, 215); left: 15px;">
                    <b style="position: absolute; display: flex; transform: rotate(90deg); top: 50%; left: -10px;">JUMLAH</b>
                </div>
                <apexchart type="line" height="350" :options="chartOptions" :series="lineChart.series"> </apexchart>
                <div style="text-align: center; background: rgb(250 235 215)"><b>BULAN</b></div>
            </UiParentCard>
      </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <v-col cols="12">
                <BackofficeBreadcrumb title="Grafik Trend Jumlah Mahasiswa Lulus"></BackofficeBreadcrumb>
            </v-col>
            <UiParentCard title="Grafik Trend Jumlah Mahasiswa Lulus">
                <div style="width: 22px; position: absolute; height: 77.7%; text-align: center; background: rgb(250, 235, 215); left: 15px;">
                    <b style="position: absolute; display: flex; transform: rotate(90deg); top: 50%; left: -10px;">JUMLAH</b>
                </div>
                <apexchart type="line" height="350" :options="chartOptions" :series="lineChartSecond.series"> </apexchart>
                <div style="text-align: center; background: rgb(250 235 215)"><b>BULAN</b></div>
            </UiParentCard>
      </v-col>
    </v-row>
</template>