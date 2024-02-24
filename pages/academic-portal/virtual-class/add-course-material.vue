<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { Editor, EditorContent, useEditor } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { ErrorRoot } from '~~/types/api/error';
import EditorMenubar from '@/components/forms/plugins/editor/EditorMenubar.vue';
import { GetLecturerSemesterListData } from '~~/types/api/lecturer-semester/GetLecturerSemesterList';
import { getLecturerSemesterList } from '~~/composables/api/lecturer-semester/getLecturerSemesterList';
import { GetLecturerAssignedClassListData } from '~~/types/api/lecturer-class/GetLecturerAssignedClassList';
import { getLecturerAssignedClassList } from '~~/composables/api/lecturer-class/getLecturerAssignedClassList';
import { createClassMaterial } from '~~/composables/api/class-material/createClassMaterial';
import { CreateClassMaterialRequest } from '~~/types/api/class-material/CreateClassMaterial';
import { createFile } from '~~/composables/api/file/createFile';
import { CreateFileRequest } from '~~/types/api/file/CreateFile';

definePageMeta(<PageMeta>{
    layout: "academic-portal",
    middleware: ['check-auth'],
});
const title = ref('Tambah Materi Kuliah Baru')
const mode = ref('list')
const dialog = ref(false)
const createClassMaterialRequest = ref(<CreateClassMaterialRequest>{})
const breadcrumbs = ref([
    {
        text: 'Virtual Class',
        disabled: true,
        href: '#'
    },
    {
        text: 'Materi Kuliah',
        disabled: false,
        href: '/academic-portal/virtual-class/course-material'
    },
    {
        text: 'Tambah Baru',
        disabled: true,
        href: '#'
    }
]);

const idKelas = ref('');
const idSemester = ref('');
const lecturerSemesters = ref<GetLecturerSemesterListData[]>([]);
const lecturerAssignedClasses = ref(<GetLecturerAssignedClassListData[]>([]));
const editor = useEditor({
    content: '',
    extensions: [
        StarterKit,
    ],
    onUpdate({editor}){
        createClassMaterialRequest.value.abstraction = editor.getHTML()
    }
})

async function getLecturerSemesterData() {
    try {
        const { response: resp, error: error } = await getLecturerSemesterList(100, 1, "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lecturerSemesters.value = resp?.data
            lecturerSemesters.value.forEach((s) => {
                s.semester_type_year = s.semester_start_year + " " + s.semester_type
            });
        }
    } catch (error) {
        alert(error)
    }
}

async function getLecturerAssignedClassData(semesterId: string) {
    try {
        const { response: resp, error: error } = await getLecturerAssignedClassList(semesterId)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lecturerAssignedClasses.value = resp?.data
            lecturerAssignedClasses.value.forEach((s) => {
                s.name = s.subject_code + ' - ' + s.subject_name + ' - ' + s.name
            })
        }
    } catch (error) {
        alert(error)
    }
}

async function lecturerSemesterOnChange(id: any) {
    idSemester.value = id
    await getLecturerAssignedClassData(id)
}

async function uploadAction(e: any){
    let file = e.target.files[0]
    if(file){
        const reader = new FileReader();
        reader.onload = async () => {
          const base64String = reader.result
          let reqUpload = await createFile({file:base64String!.toString().split(',')[1]})
          if(reqUpload.error == null){
            if(reqUpload.response){
                createClassMaterialRequest.value.file_path = reqUpload.response.data.path
                createClassMaterialRequest.value.file_path_type = reqUpload.response.data.path_type
            }
          }
        };
        reader.readAsDataURL(file);
    }
    // let uploadReq = await uploadFileMateri(formData)
    // createClassMaterialRequest.value.file_path = uploadReq.path
    // createClassMaterialRequest.value.file_path_type = uploadReq.mimetype
}

async function lecturerClassOnChange(id: string) {
    idKelas.value = id
}


function show() {
    mode.value = 'show'
}

async function create() {
    let createRequest = await createClassMaterial(createClassMaterialRequest.value)
    if(createRequest.response != null){
        return navigateTo('/academic-portal/virtual-class/course-material')
    }
}
function close() {
    dialog.value = false
}
onMounted(async () => {
    getLecturerSemesterData()
})
</script>
<template>
    <div v-if="mode == 'create'">
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="800">
                <PagesAcademicPortalVirtualClassAssignmentsCreate @close="close" />
            </v-dialog>
        </v-col>
    </div>
    <v-col cols="12">
        <AcademicBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
    </v-col>
    <v-row>
        <v-col cols="12">
            <UiParentCard :title="'Materi Baru'">
                <v-row>
                    <v-col cols="2" lg="2" md="2" sm="2">
                        <v-label>SEMESTER</v-label>
                    </v-col>
                    <v-col cols="12" lg="10">
                        <v-autocomplete :items="lecturerSemesters" item-title="semester_type_year" item-value="id"
                            color="primary" variant="outlined" hide-details :label="'Pilih Semester'"
                            @update:model-value="(sl: any) => lecturerSemesterOnChange(sl)"></v-autocomplete>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4" lg="" md="2" sm="2">
                        <v-label>MATA KULIAH</v-label>
                    </v-col>
                    <v-col cols="12" lg="10">
                        <v-autocomplete v-model="createClassMaterialRequest.class_id" :items="lecturerAssignedClasses"
                            item-title="name"
                            item-value="id" color="primary" variant="outlined" hide-details :label="'Pilih Kelas'"
                            @update:model-value="(id: string) => lecturerClassOnChange(id)" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="2" lg="2" md="2" sm="2">
                        <v-label>JUDUL</v-label>
                    </v-col>
                    <v-col cols="12" lg="10">
                        <v-text-field v-model="createClassMaterialRequest.title" label="Judul"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="2" lg="2" md="2" sm="2">
                        <v-label>FILE MATERI</v-label>
                    </v-col>
                    <v-col cols="12" lg="10">
                        <v-file-input @change="uploadAction" label="Pilih File Materi"></v-file-input>
                        (Ukuran file maksimal 5MB. Tipe file : PDF, JPG, RAR, ZIP)
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="2" lg="2" md="2" sm="2">
                        <v-label>ABSTRAKSI</v-label>
                    </v-col>
                    <v-col cols="12" lg="10">
                        <div v-if="editor">
                            <EditorMenubar :editor="editor" />
                        </div>
                        <editor-content :editor="editor" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="2" lg="2" md="2" sm="2">
                        <v-label>STATUS</v-label>
                    </v-col>
                    <v-col cols="12" lg="10">
                        <v-autocomplete id="status"
                            :items="[{ 'label': 'Aktif', 'value': true }, { 'label': 'Tidak Aktif', 'value': false }]"
                            item-title="label" item-value="value" color="primary" variant="outlined" hide-details
                            :label="'Status'" v-model="createClassMaterialRequest.is_active"></v-autocomplete>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="text-center">
                        <v-btn color="primary" @click="create">
                            <v-icon class="mr-2">
                                mdi-plus
                            </v-icon>Simpan
                        </v-btn>
                        <v-btn color="primary" flat class="ml-2" @click="create">
                            Batal
                        </v-btn>
                    </v-col>
                </v-row>
            </UiParentCard>
        </v-col>
    </v-row>
</template>
