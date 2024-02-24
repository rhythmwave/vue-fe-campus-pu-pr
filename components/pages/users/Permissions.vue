<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import { GetRoleListPermission, GetRoleListStudyProgram } from '~~/types/api/role/GetRoleList';

const emit = defineEmits(['close'])

const props = defineProps({
    permissions: Array as any,
    study_programs:Array as any,
});

</script>
<template>
    <v-card>
        <v-card-title>Hak Akses</v-card-title>
        <v-divider></v-divider>
        <v-row>
            <v-col cols="6">
                <v-card-title>Hak Akses Prodi</v-card-title>
                <v-card-text v-if="study_programs.length == 0">
                    <v-col cols="6" sm="12" md="6" lg="6" >
                        <v-label text="Tidak ada data"></v-label>
                    </v-col >
                </v-card-text>
                <v-card-text v-if="study_programs.length !=0">
                    <v-col cols="6" sm="12" md="6" lg="6" v-for="itm in <GetRoleListStudyProgram[]> study_programs">
                        <v-label :text="itm.name"></v-label>
                    </v-col >
                </v-card-text>
            </v-col>
            <v-col cols="6">
                <v-card-title>Hak Akses Modul</v-card-title>
                <v-card-text v-if="permissions.length == 0">
                    <v-col cols="6" sm="12" md="6" lg="6" >
                        <v-label text="Tidak ada data"></v-label>
                    </v-col >
                </v-card-text>
                <v-card-text v-if="permissions.length !=0">
                    <v-col cols="6" sm="12" md="6" lg="6" v-for="itm in <GetRoleListPermission[]> permissions">
                        <v-label :text="itm.name"></v-label>
                    </v-col >
                </v-card-text>
            </v-col>
        </v-row>
        
        <v-divider></v-divider>
        <v-card-actions>
        <v-btn color="error" text @click="$emit('close')">
            Tutup
        </v-btn>
        </v-card-actions>
    </v-card>
</template>