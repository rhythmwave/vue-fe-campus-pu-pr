
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetClassEventListData } from '~~/types/api/class-event/GetClassEventList';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { PaginationModel } from '~~/types/api/pagination';
import { getClassEventList } from '~~/composables/api/class-event/getClassEventList';
import { NuxtLink } from '~~/.nuxt/components';
import { LoginData } from '~~/types/api/auth/Login';
import { GetLecturerClassDiscussionCommentListData } from '~~/types/api/lecturer-class-discussion/GetLecturerClassDiscussionCommentList';
import { GetStudentClassDiscussionCommentListData } from '~~/types/api/student-class-discussion/GetStudentClassDiscussionCommentList';
import { getLecturerClassDiscussionCommentList } from '~~/composables/api/lecturer-class-discussion/getLecturerClassDiscussionCommentList';
import { getStudentClassDiscussionCommentList } from '~~/composables/api/student-class-discussion/getStudentClassDiscussionCommentList';
import { TrashIcon } from 'vue-tabler-icons';
import { createLecturerClassDiscussionComment } from '~~/composables/api/lecturer-class-discussion/createLecturerClassDiscussionComment';
import { CreateLecturerClassDiscussionCommentRequest } from '~~/types/api/lecturer-class-discussion/CreateLecturerClassDiscussionComment';
import { CreateStudentClassDiscussionCommentRequest } from '~~/types/api/student-class-discussion/CreateStudentClassDiscussionComment';
import { createStudentClassDiscussionComment } from '~~/composables/api/student-class-discussion/createStudentClassDiscussionComment';
import { deleteLecturerClassDiscussionComment } from '~~/composables/api/lecturer-class-discussion/deleteLecturerClassDiscussionComment';
import { DeleteLecturerClassDiscussionCommentRequest } from '~~/types/api/lecturer-class-discussion/DeleteLecturerClassDiscussionComment';
import { deleteStudentClassDiscussionComment } from '~~/composables/api/student-class-discussion/deleteStudentClassDiscussionComment';
import { DeleteStudentClassDiscussionCommentRequest } from '~~/types/api/student-class-discussion/DeleteStudentClassDiscussionComment';

const props = defineProps({
    classDiscussionCommentId: String,
    title: String,
});

const limit = 20
const search = ref('')
const msg = ref('')
const pagination = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})

let userData = ref(<LoginData>{});
onMounted(async () => {
    const user = useAuth()
    if (user.value) {
        userData.value = <LoginData>user.value;
        if (userData.value.app_type == "lecturer") {
            await lecturerMounted()
        } else if (userData.value.app_type == "student") {
            await studentMounted()
        }
    } else {
        return navigateTo({ name: 'login', path: '' })
    }
})
// onMounted(async () => {
//     await getData(limit, 1)
// });

async function lecturerMounted() {
    await getLecturerClassDiscussionCommentData(pagination.value.limit, 1);
}

async function studentMounted() {
    await getStudentClassDiscussionCommentData(pagination.value.limit, 1);
}

const lecturerClassDiscussionComments = ref<GetLecturerClassDiscussionCommentListData[]>([])
async function getLecturerClassDiscussionCommentData(limit: number, page: number) {
    try {
        const { response: resp, error: error } = await getLecturerClassDiscussionCommentList(limit, page, <string>props.classDiscussionCommentId)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lecturerClassDiscussionComments.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}

const studentClassDiscussionComments = ref<GetStudentClassDiscussionCommentListData[]>([])
async function getStudentClassDiscussionCommentData(limit: number, page: number) {
    try {
        const { response: resp, error: error } = await getStudentClassDiscussionCommentList(limit, page, <string>props.classDiscussionCommentId)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentClassDiscussionComments.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}

// const lecturerClassDiscussionComments = ref(<any>{})
async function createLecturerClassDiscussionCommentData() {
    try {
        const { response: resp, error: error } = await createLecturerClassDiscussionComment(
            <CreateLecturerClassDiscussionCommentRequest>{
                class_discussion_id: props.classDiscussionCommentId,
                comment: msg.value,
            }
        )
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            // lecturerClassDiscussionComments.value = resp?.data
            getLecturerClassDiscussionCommentData(pagination.value.limit, 1)
        }
    } catch (error) {
        alert(error)
    }
}

// const studentClassDiscussionComments = ref(<any>{})
async function createStudentClassDiscussionCommentData() {
    try {
        const { response: resp, error: error } = await createStudentClassDiscussionComment(
            <CreateStudentClassDiscussionCommentRequest>{
                class_discussion_id: props.classDiscussionCommentId,
                comment: msg.value,
            }
        )
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            // studentClassDiscussionComments.value = resp?.data
            getStudentClassDiscussionCommentData(pagination.value.limit, 1)
        }
    } catch (error) {
        alert(error)
    }
}


// const lecturerClassDiscussionComments = ref(<any>{})
async function deleteLecturerClassDiscussionCommentData(id: string) {
    try {
        const { response: resp, error: error } = await deleteLecturerClassDiscussionComment(
            <DeleteLecturerClassDiscussionCommentRequest>{
                id: id,
            })
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            // lecturerClassDiscussionComments.value = resp?.data
            getLecturerClassDiscussionCommentData(pagination.value.limit, 1)
        }
    } catch (error) {
        alert(error)
    }
}

// const studentClassDiscussionComments = ref(<any>{})
async function deleteStudentClassDiscussionCommentData(id: string) {
    try {
        const { response: resp, error: error } = await deleteStudentClassDiscussionComment(
            <DeleteStudentClassDiscussionCommentRequest>{
                id: id,
            }
        )
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            // studentClassDiscussionComments.value = resp?.data
            getStudentClassDiscussionCommentData(pagination.value.limit, 1)
        }
    } catch (error) {
        alert(error)
    }
}

async function addItemAndClear(item: string) {
    console.log(item);
    if (item.length === 0) {
        return;
    }
    // store.sendMsg(store.chatContent, msg.value);
    if (userData.value.app_type == "lecturer") {
        await createLecturerClassDiscussionCommentData()
    } else {
        await createStudentClassDiscussionCommentData()
    }
    msg.value = '';
}
</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Diskusi</span>
        </v-card-title>
        <!-- <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Program Studi" :value="adminStudyProgram.name" />
                <PagesStudyProgramsDetailItem title="Semester" :value="semesterCurrent.semester_type_year" />
                <PagesStudyProgramsDetailItem title="Nama Kelas" :value="detailAdminClass.name" />
            </tbody>
        </v-table> -->
        <!-- <v-row>
            <v-col cols="12" class="mt-5 pl-5 pr-5">
                <UiParentCard title="Pencarian">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-text-field density="compact" v-model="search" label="Pencarian Agenda Kelas" hide-details
                                variant="outlined" @input="getData(limit, 1)"></v-text-field>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row> -->
        <div class="pa-5">
            <strong>{{ props.title }}</strong>
            <br /><br />
            <v-row>
                <v-col cols="12">
                    <v-card elevation="10" v-if="userData.app_type == 'lecturer'"
                        v-for="d in lecturerClassDiscussionComments">
                        <v-card-item>
                            <div class="d-flex align-center">
                                <v-avatar rounded="md" size="70">
                                    <img contain src="/images/profile/user-1.jpg" height="70" />
                                </v-avatar>
                                <div class="pl-5">
                                    <h5 class="text-h5" v-if="d.lecturer_name">{{ d.lecturer_name }}</h5>
                                    <h5 class="text-h5" v-if="d.student_name">{{ d.student_name }}</h5>
                                    <!-- <h6 class="text-subtitle-1 textSecondary mt-2">22 March, 2022</h6> -->
                                    <h6 class="text-subtitle-1 textSecondary mt-2">{{ d.lecturer_name ? 'Dosen' :
                                        'Mahasiswa' }}
                                    </h6>
                                </div>
                            </div>
                            <div class="d-flex align-center justify-space-between mt-8 mb-sm-3 mb-0">
                                <div class="ml-2 d-flex flex-row-reverse">
                                    <!-- <v-avatar v-for="card in userCardData" :key="card.img" size="45"
                                        class="ml-n2 avtar-border">
                                        <img :src="card.img" alt="usericon" height="45" />
                                    </v-avatar> -->
                                    {{ d.comment }}
                                </div>
                                <div v-if="d.self_comment">
                                    <v-btn class="rounded-md bg-lightprimary d-block" size="40"
                                        @click="deleteLecturerClassDiscussionCommentData(d.id)">
                                        <v-avatar size="40" class=" text-error">
                                            <TrashIcon size="22" />
                                        </v-avatar>
                                    </v-btn>
                                </div>
                            </div>
                        </v-card-item>
                    </v-card>
                    <v-card elevation="10" v-if="userData.app_type == 'student'"
                        v-for="d in studentClassDiscussionComments">
                        <v-card-item>
                            <div class="d-flex align-center">
                                <v-avatar rounded="md" size="70">
                                    <img contain src="/images/profile/user-1.jpg" height="70" />
                                </v-avatar>
                                <div class="pl-5">
                                    <h5 class="text-h5" v-if="d.lecturer_name">{{ d.lecturer_name }}</h5>
                                    <h5 class="text-h5" v-if="d.student_name">{{ d.student_name }}</h5>
                                    <!-- <h6 class="text-subtitle-1 textSecondary mt-2">22 March, 2022</h6> -->
                                    <h6 class="text-subtitle-1 textSecondary mt-2">{{ d.lecturer_name ? 'Dosen' :
                                        'Mahasiswa' }}
                                    </h6>
                                </div>
                            </div>
                            <div class="d-flex align-center justify-space-between mt-8 mb-sm-3 mb-0">
                                <div class="ml-2 d-flex flex-row-reverse">
                                    <!-- <v-avatar v-for="card in userCardData" :key="card.img" size="45"
                                        class="ml-n2 avtar-border">
                                        <img :src="card.img" alt="usericon" height="45" />
                                    </v-avatar> -->
                                    {{ d.comment }}
                                </div>
                                <div v-if="d.self_comment">
                                    <v-btn class="rounded-md bg-lightprimary d-block" size="40"
                                        @click="deleteStudentClassDiscussionCommentData(d.id)">
                                        <v-avatar size="40" class=" text-error">
                                            <TrashIcon size="22" />
                                        </v-avatar>
                                    </v-btn>
                                </div>
                            </div>
                        </v-card-item>
                    </v-card>
                </v-col>
                <v-col cols="12">
                    <v-card>
                        <form class="d-flex align-center" @submit.prevent="addItemAndClear(msg)">
                            <v-text-field variant="solo" hide-details v-model="msg" color="primary" class="shadow-none"
                                density="compact" placeholder="Tulis Komentar"></v-text-field>
                            <v-btn icon variant="text" type="submit" class="text-medium-emphasis text-primary"
                                :disabled="!msg">
                                <SendIcon size="20" />
                            </v-btn>
                        </form>
                    </v-card>

                </v-col>
            </v-row>
        </div>
    </v-card>
</template>

<style lang="scss"></style>
