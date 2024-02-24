<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { ErrorRoot } from '~~/types/api/error';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetLecturerListData, GetLecturerDetailData } from '~~/types/api/admin-lecturer/GetLecturerList';
import { GetLocationRegencyList } from '~~/types/api/general/LocationRegency';
import { GetLocationCountryList } from '~~/types/api/general/LocationCountry';
import { StudyProgram } from '@/types/backoffice/backofficeTypes'
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { GroupExpertiseListData } from '~~/types/api/expertise-group/GetExpertiseGroup';
import { getExpertiseGroupList } from '~~/composables/api/expertise-group/getExpertiseGroup';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});

const limit = 20
const pagination = ref({
  page: 1,
  limit,
  prev: 1,
  next: 1,
  total_pages: 1,
  total_records: 0
})
const search: String = ''
const title = ref('Data Dosen')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: 'Data Dosen',
    disabled: true,
    href: '#'
  }
])
const expertises = ref(<GroupExpertiseListData[]>[])
const mode = ref('list')
const dialog = ref(false)
const valid = ref(true)
const lecturers = ref<GetLecturerListData[]>([])
async function getData(limit: number, page: number, search: String) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_lecturer.AdminLecturerHandler/GetList?limit=${limit}&page=${page}&search=${search}`, <any>{
            method: 'GET',
        })
        if (error.value) {
            let errorRoot = <ErrorRoot><unknown>error.value.data;
            if (!errorRoot.meta) {
                alert(errorRoot)
                return;
            }
            alert(errorRoot.meta.message)
            if (errorRoot.meta.status == 401) {
                const authUser = useAuthStorage();
                authUser.value = null;
                navigateTo({ name: 'login', path: '' })
                return;
            }
            return;
        }
        pagination.value =
        {
            next: _resp.value.pagination.next,
            prev: _resp.value.pagination.prev,
            total_pages: _resp.value.pagination.total_pages,
            total_records: _resp.value.pagination.total_records,
            limit: _resp.value.pagination.limit,
            page: _resp.value.pagination.page
        }
        lecturers.value = _resp.value.data
    } catch (error) {
        alert(error)
    }   
}
async function getDetail(id: String) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/lecturer/admin_lecturer.AdminLecturerHandler/GetDetail?id=${id}`, <any>{
            method: 'GET',
        })
        if (error.value) {
            let errorRoot = <ErrorRoot><unknown>error.value.data;
            if (!errorRoot.meta) {
                alert(errorRoot)
                return;
            }
            alert(errorRoot.meta.message)
            if (errorRoot.meta.status == 401) {
                const authUser = useAuthStorage();
                authUser.value = null;
                navigateTo({ name: 'login', path: '' })
                return;
            }
            return;
        }
        lecturerDetail.value = _resp.value.data
    } catch (error) {
        alert(error)
    }   
}
const dialogShow = ref(false)
const lecturerDetail = ref(<GetLecturerDetailData>{});
function showItem(item: any) {
  mode.value = 'show'
  getDetail(item.id)
  dialogShow.value = true
}
const labelProgramStudy = ref('')
const labelBirthRegency = ref('')
const labelBirthCountry = ref('')
const labelRegency = ref('')
const labelCountry = ref('')
async function editItem(item: any) {
    await getDetail(item.id)
    labelProgramStudy.value = lecturerDetail.value.study_program_name
    labelBirthRegency.value = lecturerDetail.value.birth_regency_name
    labelBirthCountry.value = lecturerDetail.value.birth_country_name
    labelRegency.value = lecturerDetail.value.regency_name
    labelCountry.value = lecturerDetail.value.country_name
    updateLecturer.value = lecturerDetail.value
    updateLecturer.value.birth_date = lecturerDetail.value.birth_date.substring(0, 10)
    updateLecturer.value.sk_cpns_date = lecturerDetail.value.sk_cpns_date.substring(0, 10)
    updateLecturer.value.tmt_cpns_date = lecturerDetail.value.tmt_cpns_date.substring(0, 10)
    updateLecturer.value.pre_position_date = lecturerDetail.value.pre_position_date.substring(0, 10)
    updateLecturer.value.sk_pns_date = lecturerDetail.value.sk_pns_date.substring(0, 10)
    updateLecturer.value.tmt_pns_date = lecturerDetail.value.tmt_pns_date.substring(0, 10)
    updateLecturer.value.pns_oath_date = lecturerDetail.value.pns_oath_date.substring(0, 10)
    updateLecturer.value.join_date = lecturerDetail.value.join_date.substring(0, 10)
    mode.value = 'edit'
    dialog.value = true
}
const lecturer = ref({
    id: "",
    id_national_lecturer: "",
    name: "",
    front_title: "",
    back_degree: "",
    study_program_id: "",
    study_program_name: "",
    id_number: "",
    birth_date: "",
    birth_regency_id: "",
    birth_regency_name: "",
    birth_country_id: "",
    birth_country_name: "",
    id_employee: "",
    stambuk: "",
    sex: "",
    blood_type: "",
    religion: "",
    marital_status: "",
    address: "",
    regency_id: "",
    regency_name: "",
    country_id: "",
    country_name: "",
    postal_code: "",
    phone_number: "",
    fax: "",
    mobile_phone_number: "",
    office_phone_number: "",
    employee_type: "",
    employee_status: "",
    sk_cpns_number: "",
    sk_cpns_date: "",
    tmt_cpns_date: "",
    cpns_category: "",
    cpns_duration_month: "",
    pre_position_date: "",
    sk_pns_number: "",
    sk_pns_date: "",
    tmt_pns_date: "",
    pns_category: "",
    pns_oath_date: "",
    join_date: "",
    end_date: "",
    taspen_number: "",
    former_instance: "",
    remarks: "",
    lecturer_number: "",
    academic_position: "",
    employment_status: "",
    expertise: "",
    highest_degree: "",
    instance_code: "",
    teaching_certificate_number: "",
    teaching_permit_number: "",
    status: "",
    resign_semester: "",
})
const createLecturer = ref({
    id_national_lecturer: "",
    name: "",
    front_title: "",
    back_degree: "",
    study_program_id: "",
    study_program_name: "",
    id_number: "",
    birth_date: "",
    birth_regency_id: "",
    birth_regency_name: "",
    birth_country_id: "",
    birth_country_name: "",
    id_employee: "",
    stambuk: "",
    sex: "",
    blood_type: "",
    religion: "",
    marital_status: "",
    address: "",
    regency_id: "",
    regency_name: "",
    country_id: "",
    country_name: "",
    postal_code: "",
    phone_number: "",
    fax: "",
    mobile_phone_number: "",
    office_phone_number: "",
    employee_type: "",
    employee_status: "",
    sk_cpns_number: "",
    sk_cpns_date: "",
    tmt_cpns_date: "",
    cpns_category: "",
    cpns_duration_month: "",
    pre_position_date: "",
    sk_pns_number: "",
    sk_pns_date: "",
    tmt_pns_date: "",
    pns_category: "",
    pns_oath_date: "",
    join_date: "",
    end_date: "",
    taspen_number: "",
    former_instance: "",
    remarks: "",
    lecturer_number: "",
    academic_position: "",
    employment_status: "",
    expertise: "",
    highest_degree: "",
    instance_code: "",
    teaching_certificate_number: "",
    teaching_permit_number: "",
    status: "",
    resign_semester: "",
})
const updateLecturer = ref({
    id: "",
    id_national_lecturer: "",
    name: "",
    front_title: "",
    back_degree: "",
    study_program_id: "",
    study_program_name: "",
    id_number: "",
    birth_date: "",
    birth_regency_id: "",
    birth_regency_name: "",
    birth_country_id: "",
    birth_country_name: "",
    id_employee: "",
    stambuk: "",
    sex: "",
    blood_type: "",
    religion: "",
    marital_status: "",
    address: "",
    regency_id: "",
    regency_name: "",
    country_id: "",
    country_name: "",
    postal_code: "",
    phone_number: "",
    fax: "",
    mobile_phone_number: "",
    office_phone_number: "",
    employee_type: "",
    employee_status: "",
    sk_cpns_number: "",
    sk_cpns_date: "",
    tmt_cpns_date: "",
    cpns_category: "",
    cpns_duration_month: "",
    pre_position_date: "",
    sk_pns_number: "",
    sk_pns_date: "",
    tmt_pns_date: "",
    pns_category: "",
    pns_oath_date: "",
    join_date: "",
    end_date: "",
    taspen_number: "",
    former_instance: "",
    remarks: "",
    lecturer_number: "",
    academic_position: "",
    employment_status: "",
    expertise: "",
    highest_degree: "",
    instance_code: "",
    teaching_certificate_number: "",
    teaching_permit_number: "",
    status: "",
    resign_semester: "",
})
async function create() {
    mode.value = 'create'
    dialog.value = true
    createLecturer.value = {
        id_national_lecturer: "",
        name: "",
        front_title: "",
        back_degree: "",
        study_program_id: "",
        study_program_name: "",
        id_number: "",
        birth_date: "",
        birth_regency_id: "",
        birth_regency_name: "",
        birth_country_id: "",
        birth_country_name: "",
        id_employee: "",
        stambuk: "",
        sex: "",
        blood_type: "",
        religion: "",
        marital_status: "",
        address: "",
        regency_id: "",
        regency_name: "",
        country_id: "",
        country_name: "",
        postal_code: "",
        phone_number: "",
        fax: "",
        mobile_phone_number: "",
        office_phone_number: "",
        employee_type: "",
        employee_status: "",
        sk_cpns_number: "",
        sk_cpns_date: "",
        tmt_cpns_date: "",
        cpns_category: "",
        cpns_duration_month: "",
        pre_position_date: "",
        sk_pns_number: "",
        sk_pns_date: "",
        tmt_pns_date: "",
        pns_category: "",
        pns_oath_date: "",
        join_date: "",
        end_date: "",
        taspen_number: "",
        former_instance: "",
        remarks: "",
        lecturer_number: "",
        academic_position: "",
        employment_status: "",
        expertise: "",
        highest_degree: "",
        instance_code: "",
        teaching_certificate_number: "",
        teaching_permit_number: "",
        status: "",
        resign_semester: "",
    }
}
function close() {
  dialog.value = false
  setTimeout(() => {
    createLecturer.value = {
        id_national_lecturer: "",
        name: "",
        front_title: "",
        back_degree: "",
        study_program_id: "",
        study_program_name: "",
        id_number: "",
        birth_date: "",
        birth_regency_id: "",
        birth_regency_name: "",
        birth_country_id: "",
        birth_country_name: "",
        id_employee: "",
        stambuk: "",
        sex: "",
        blood_type: "",
        religion: "",
        marital_status: "",
        address: "",
        regency_id: "",
        regency_name: "",
        country_id: "",
        country_name: "",
        postal_code: "",
        phone_number: "",
        fax: "",
        mobile_phone_number: "",
        office_phone_number: "",
        employee_type: "",
        employee_status: "",
        sk_cpns_number: "",
        sk_cpns_date: "",
        tmt_cpns_date: "",
        cpns_category: "",
        cpns_duration_month: "",
        pre_position_date: "",
        sk_pns_number: "",
        sk_pns_date: "",
        tmt_pns_date: "",
        pns_category: "",
        pns_oath_date: "",
        join_date: "",
        end_date: "",
        taspen_number: "",
        former_instance: "",
        remarks: "",
        lecturer_number: "",
        academic_position: "",
        employment_status: "",
        expertise: "",
        highest_degree: "",
        instance_code: "",
        teaching_certificate_number: "",
        teaching_permit_number: "",
        status: "",
        resign_semester: "",
    }
  }, 300)
}
async function save(){
    try {
        var createData = Object.assign({}, createLecturer.value);
        if (createData.birth_date) createData.birth_date = convertDateWithoutTimeToTimezoned(createData.birth_date)
        if (createData.sk_cpns_date) createData.sk_cpns_date = convertDateWithoutTimeToTimezoned(createData.sk_cpns_date)
        if (createData.tmt_cpns_date) createData.tmt_cpns_date = convertDateWithoutTimeToTimezoned(createData.tmt_cpns_date)
        if (createData.pre_position_date) createData.pre_position_date = convertDateWithoutTimeToTimezoned(createData.pre_position_date)
        if (createData.sk_pns_date) createData.sk_pns_date = convertDateWithoutTimeToTimezoned(createData.sk_pns_date)
        if (createData.tmt_pns_date) createData.tmt_pns_date = convertDateWithoutTimeToTimezoned(createData.tmt_pns_date)
        if (createData.pns_oath_date) createData.pns_oath_date = convertDateWithoutTimeToTimezoned(createData.pns_oath_date)
        if (createData.join_date) createData.join_date = convertDateWithoutTimeToTimezoned(createData.join_date)
            const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/lecturer/admin_lecturer.AdminLecturerHandler/Create`, <any>{
            method: 'POST',
            body: {
                id_national_lecturer: createData.id_national_lecturer,
                name: createData.name,
                front_title: createData.front_title,
                back_degree: createData.back_degree,
                study_program_id: createData.study_program_id,
                study_program_name: createData.study_program_name,
                id_number: createData.id_number,
                birth_date: createData.birth_date,
                birth_regency_id: parseFloat(createData.birth_regency_id),
                birth_regency_name: createData.birth_regency_name,
                birth_country_id: parseFloat(createData.birth_country_id),
                birth_country_name: createData.birth_country_name,
                id_employee: createData.id_employee,
                stambuk: createData.stambuk,
                sex: createData.sex,
                blood_type: createData.blood_type,
                religion: createData.religion,
                marital_status: createData.marital_status,
                address: createData.address,
                regency_id: parseFloat(createData.regency_id),
                regency_name: createData.regency_name,
                country_id: parseFloat(createData.country_id),
                country_name: createData.country_name,
                postal_code: createData.postal_code,
                phone_number: createData.phone_number,
                fax: createData.fax,
                mobile_phone_number: createData.mobile_phone_number,
                office_phone_number: createData.office_phone_number,
                employee_type: createData.employee_type,
                employee_status: createData.employee_status,
                sk_cpns_number: createData.sk_cpns_number,
                sk_cpns_date: createData.sk_cpns_date,
                tmt_cpns_date: createData.tmt_cpns_date,
                cpns_category: createData.cpns_category,
                cpns_duration_month: parseFloat(createData.cpns_duration_month),
                pre_position_date: createData.pre_position_date,
                sk_pns_number: createData.sk_pns_number,
                sk_pns_date: createData.sk_pns_date,
                tmt_pns_date: createData.tmt_pns_date,
                pns_category: createData.pns_category,
                pns_oath_date: createData.pns_oath_date,
                join_date: createData.join_date,
                end_date: createData.end_date,
                taspen_number: createData.taspen_number,
                former_instance: createData.former_instance,
                remarks: createData.remarks,
                lecturer_number: createData.lecturer_number,
                academic_position: createData.academic_position,
                employment_status: createData.employment_status,
                expertise: createData.expertise,
                highest_degree: createData.highest_degree,
                instance_code: createData.instance_code,
                teaching_certificate_number: createData.teaching_certificate_number,
                teaching_permit_number: createData.teaching_permit_number,
                status: createData.status,
                resign_semester: createData.resign_semester,
            },
        })
        if (error.value) {
            let errorRoot = <ErrorRoot><unknown>error.value.data;
            if (!errorRoot.meta) {
                alert(errorRoot)
                return;
            }
            alert(errorRoot.meta.message)
            if (errorRoot.meta.status == 401) {
                const authUser = useAuthStorage();
                authUser.value = null;
                navigateTo({ name: 'login', path: '' })
                return;
            }
            return;
        }
        close()
        getData(limit, 1, search)
        // return { response: data.value, error: null };
    } catch (error) {
        alert(error)
    }
}
async function update(){
    try {
        var updateData = Object.assign({}, updateLecturer.value);
        if (updateData.birth_date) updateData.birth_date = convertDateWithoutTimeToTimezoned(updateData.birth_date)
        if (updateData.sk_cpns_date) updateData.sk_cpns_date = convertDateWithoutTimeToTimezoned(updateData.sk_cpns_date)
        if (updateData.tmt_cpns_date) updateData.tmt_cpns_date = convertDateWithoutTimeToTimezoned(updateData.tmt_cpns_date)
        if (updateData.pre_position_date) updateData.pre_position_date = convertDateWithoutTimeToTimezoned(updateData.pre_position_date)
        if (updateData.sk_pns_date) updateData.sk_pns_date = convertDateWithoutTimeToTimezoned(updateData.sk_pns_date)
        if (updateData.tmt_pns_date) updateData.tmt_pns_date = convertDateWithoutTimeToTimezoned(updateData.tmt_pns_date)
        if (updateData.pns_oath_date) updateData.pns_oath_date = convertDateWithoutTimeToTimezoned(updateData.pns_oath_date)
        if (updateData.join_date) updateData.join_date = convertDateWithoutTimeToTimezoned(updateData.join_date)
            const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/lecturer/admin_lecturer.AdminLecturerHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: updateData.id,
                id_national_lecturer: updateData.id_national_lecturer,
                name: updateData.name,
                front_title: updateData.front_title,
                back_degree: updateData.back_degree,
                study_program_id: updateData.study_program_id,
                study_program_name: updateData.study_program_name,
                id_number: updateData.id_number,
                birth_date: updateData.birth_date,
                birth_regency_id: parseFloat(updateData.birth_regency_id),
                birth_regency_name: updateData.birth_regency_name,
                birth_country_id: parseFloat(updateData.birth_country_id),
                birth_country_name: updateData.birth_country_name,
                id_employee: updateData.id_employee,
                stambuk: updateData.stambuk,
                sex: updateData.sex,
                blood_type: updateData.blood_type,
                religion: updateData.religion,
                marital_status: updateData.marital_status,
                address: updateData.address,
                regency_id: parseFloat(updateData.regency_id),
                regency_name: updateData.regency_name,
                country_id: parseFloat(updateData.country_id),
                country_name: updateData.country_name,
                postal_code: updateData.postal_code,
                phone_number: updateData.phone_number,
                fax: updateData.fax,
                mobile_phone_number: updateData.mobile_phone_number,
                office_phone_number: updateData.office_phone_number,
                employee_type: updateData.employee_type,
                employee_status: updateData.employee_status,
                sk_cpns_number: updateData.sk_cpns_number,
                sk_cpns_date: updateData.sk_cpns_date,
                tmt_cpns_date: updateData.tmt_cpns_date,
                cpns_category: updateData.cpns_category,
                cpns_duration_month: parseFloat(updateData.cpns_duration_month),
                pre_position_date: updateData.pre_position_date,
                sk_pns_number: updateData.sk_pns_number,
                sk_pns_date: updateData.sk_pns_date,
                tmt_pns_date: updateData.tmt_pns_date,
                pns_category: updateData.pns_category,
                pns_oath_date: updateData.pns_oath_date,
                join_date: updateData.join_date,
                end_date: updateData.end_date,
                taspen_number: updateData.taspen_number,
                former_instance: updateData.former_instance,
                remarks: updateData.remarks,
                lecturer_number: updateData.lecturer_number,
                academic_position: updateData.academic_position,
                employment_status: updateData.employment_status,
                expertise: updateData.expertise,
                highest_degree: updateData.highest_degree,
                instance_code: updateData.instance_code,
                teaching_certificate_number: updateData.teaching_certificate_number,
                teaching_permit_number: updateData.teaching_permit_number,
                status: updateData.status,
                resign_semester: updateData.resign_semester,
            },
        })
        if (error.value) {
            let errorRoot = <ErrorRoot><unknown>error.value.data;
            if (!errorRoot.meta) {
                alert(errorRoot)
                return;
            }
            alert(errorRoot.meta.message)
            if (errorRoot.meta.status == 401) {
                const authUser = useAuthStorage();
                authUser.value = null;
                navigateTo({ name: 'login', path: '' })
                return;
            }
            return;
        }
        close()
        getData(limit, 1, search)
        // return { response: data.value, error: null };
    } catch (error) {
        alert(error)
    }
}
function deleteItem(item: any) {
  mode.value = 'delete'
  dialog.value = true
  lecturer.value = item
}
async function deleteData() {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/lecturer/admin_lecturer.AdminLecturerHandler/Delete`, <any>{
            method: 'Delete',
            body: {
                id: lecturer.value.id
            },
        })
        if (error.value) {
            let errorRoot = <ErrorRoot><unknown>error.value.data;
            if (!errorRoot.meta) {
                alert(errorRoot)
                return;
            }
            alert(errorRoot.meta.message)
            if (errorRoot.meta.status == 401) {
                const authUser = useAuthStorage();
                authUser.value = null;
                navigateTo({ name: 'login', path: '' })
                return;
            }
            return;
        }
    } catch (error) {
        alert(error)

    }

    close()
    getData(limit, 1, search)
}
onMounted(async () => {
    await getData(limit, 1, search)
    await getExpertiseGroup()
})
const studyProgram = ref<StudyProgram[] | undefined>()
async function getDataStudyProgram(limit: number, page: number, search: String) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_study_program.AdminStudyProgramHandler/GetList?limit=${limit}&page=${page}&search=${search}`, <any>{
        method: 'GET',
        })
        if (error.value) {
        let errorRoot = <ErrorRoot><unknown>error.value.data;
        if (!errorRoot.meta) {
            alert(errorRoot)
            return;
        }
        alert(errorRoot.meta.message)
        if (errorRoot.meta.status == 401) {
            const authUser = useAuthStorage();
            authUser.value = null;
            navigateTo({ name: 'login', path: '' })
            return;
        }
        return;
        }
        studyProgram.value = _resp.value?.data
    } catch (error) {
        alert(error)

    }
}
const birthRegency = ref<GetLocationRegencyList[] | undefined>()
async function getDataBirthRegency(limit: number, page: number, search: String) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/general/general_location.GeneralLocationHandler/GetListRegency?limit=${limit}&page=${page}&search=${search}`, <any>{
        method: 'GET',
        })
        if (error.value) {
        let errorRoot = <ErrorRoot><unknown>error.value.data;
        if (!errorRoot.meta) {
            alert(errorRoot)
            return;
        }
        alert(errorRoot.meta.message)
        if (errorRoot.meta.status == 401) {
            const authUser = useAuthStorage();
            authUser.value = null;
            navigateTo({ name: 'login', path: '' })
            return;
        }
        return;
        }
        birthRegency.value = _resp.value?.data
    } catch (error) {
        alert(error)
    }
}
const birthCountry = ref<GetLocationCountryList[] | undefined>()
async function getDataBirthCountry(limit: number, page: number, search: String) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/general/general_location.GeneralLocationHandler/GetListCountry?limit=${limit}&page=${page}&search=${search}`, <any>{
        method: 'GET',
        })
        if (error.value) {
        let errorRoot = <ErrorRoot><unknown>error.value.data;
        if (!errorRoot.meta) {
            alert(errorRoot)
            return;
        }
        alert(errorRoot.meta.message)
        if (errorRoot.meta.status == 401) {
            const authUser = useAuthStorage();
            authUser.value = null;
            navigateTo({ name: 'login', path: '' })
            return;
        }
        return;
        }
        birthCountry.value = _resp.value?.data
    } catch (error) {
        alert(error)
    }
}
const regency = ref<GetLocationRegencyList[] | undefined>()
async function getDataRegency(limit: number, page: number, search: String) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/general/general_location.GeneralLocationHandler/GetListRegency?limit=${limit}&page=${page}&search=${search}`, <any>{
        method: 'GET',
        })
        if (error.value) {
        let errorRoot = <ErrorRoot><unknown>error.value.data;
        if (!errorRoot.meta) {
            alert(errorRoot)
            return;
        }
        alert(errorRoot.meta.message)
        if (errorRoot.meta.status == 401) {
            const authUser = useAuthStorage();
            authUser.value = null;
            navigateTo({ name: 'login', path: '' })
            return;
        }
        return;
        }
        regency.value = _resp.value?.data
    } catch (error) {
        alert(error)
    }
}
const country = ref<GetLocationCountryList[] | undefined>()
async function getDataCountry(limit: number, page: number, search: String) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/general/general_location.GeneralLocationHandler/GetListCountry?limit=${limit}&page=${page}&search=${search}`, <any>{
        method: 'GET',
        })
        if (error.value) {
        let errorRoot = <ErrorRoot><unknown>error.value.data;
        if (!errorRoot.meta) {
            alert(errorRoot)
            return;
        }
        alert(errorRoot.meta.message)
        if (errorRoot.meta.status == 401) {
            const authUser = useAuthStorage();
            authUser.value = null;
            navigateTo({ name: 'login', path: '' })
            return;
        }
        return;
        }
        country.value = _resp.value?.data
    } catch (error) {
        alert(error)
    }
}
async function getExpertiseGroup() {
    try {
        const { response: resp, error } = await getExpertiseGroupList(1000, 1, '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            expertises.value = resp?.data
        }
    } catch (error) {
        alert(error)
        console.log(error)
    }
}
function getAutocompleteStudyProgram(data: any) {
  if (mode.value == 'create') {
    createLecturer.value.study_program_id = data.id
  } else if (mode.value == 'edit') {
    // updateStudyProgramData.value.dikti_study_program_id = data.id
    // updateStudyProgramData.value.study_level_name = data.study_level_name
    // updateStudyProgramData.value.study_level_short_name = data.study_level_short_name
  }
}
function getAutocompleteDataBirthDistrict(data: any) {
    if (mode.value == 'create') {
        createLecturer.value.birth_regency_id = data.id
    } else if (mode.value == 'edit') {
        // updateStudyProgramData.value.dikti_study_program_id = data.id
        // updateStudyProgramData.value.study_level_name = data.study_level_name
        // updateStudyProgramData.value.study_level_short_name = data.study_level_short_name
    }
}
function getAutocompleteDataBirthCountry(data: any) {
    if (mode.value == 'create') {
        createLecturer.value.birth_country_id = data.id
    } else if (mode.value == 'edit') {
        // updateStudyProgramData.value.dikti_study_program_id = data.id
        // updateStudyProgramData.value.study_level_name = data.study_level_name
        // updateStudyProgramData.value.study_level_short_name = data.study_level_short_name
    }
}
function getAutocompleteDataDistrict(data: any) {
    if (mode.value == 'create') {
        createLecturer.value.regency_id = data.id
    } else if (mode.value == 'edit') {
        // updateStudyProgramData.value.dikti_study_program_id = data.id
        // updateStudyProgramData.value.study_level_name = data.study_level_name
        // updateStudyProgramData.value.study_level_short_name = data.study_level_short_name
    }
}
function getAutocompleteDataCountry(data: any) {
    if (mode.value == 'create') {
        createLecturer.value.country_id = data.id
    } else if (mode.value == 'edit') {
        // updateStudyProgramData.value.dikti_study_program_id = data.id
        // updateStudyProgramData.value.study_level_name = data.study_level_name
        // updateStudyProgramData.value.study_level_short_name = data.study_level_short_name
    }
}

</script>

<template>
    <div>
        <div v-if="mode == 'delete'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                <VCard>
                    <VCardTitle class="pa-4 bg-secondary">
                    <span class="title text-white">hapus dosen {{ lecturer.name }}</span>
                    </VCardTitle>
                    <VCardText>
                    <VForm ref="form" v-model="valid" lazy-validation>
                        <VRow>
                        <VCardActions class="pa-4">
                            <VSpacer />
                            <VBtn color="error" @click="close">
                            Batal
                            </VBtn>
                            <VBtn color="secondary" :disabled="lecturer.name == ''" @click="deleteData">
                            Hapus
                            </VBtn>
                        </VCardActions>
                        </VRow>
                    </VForm>
                    </VCardText>
                </VCard>
                </VDialog>
            </VCol>
        </div>
        <div v-if="mode == 'create'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                <VCard>
                    <VCardTitle class="pa-4 bg-secondary">
                        <span class="title text-white">tambah {{title}}</span>
                    </VCardTitle>
                    <VCardText>
                        <VForm ref="form" v-model="valid" lazy-validation>
                            <VRow>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.id_national_lecturer" variant="outlined" hide-details label="*Nomor Induk Dosen Nasional (NIDN)" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.name" variant="outlined" hide-details label="*Nama Lengkap" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.front_title" variant="outlined" hide-details label="Gelar Depan" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.back_degree" variant="outlined" hide-details label="Gelar Belakang" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <Autocomplete @reload="(data: any) => getDataStudyProgram(20, 1, data.search)"
                                    :label="'*Pilih Program Studi'" @selected="(data: any) => getAutocompleteStudyProgram(data)"
                                    :options="studyProgram" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.id_number" variant="outlined" hide-details label="Nomor KTP" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="date" v-model="createLecturer.birth_date" variant="outlined" hide-details label="Tanggal Lahir" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <Autocomplete @reload="(data: any) => getDataBirthRegency(20, 1, data.search)"
                                    :label="'Kota Tempat Lahir'" @selected="(data: any) => getAutocompleteDataBirthDistrict(data)"
                                    :options="birthRegency" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <Autocomplete @reload="(data: any) => getDataBirthCountry(20, 1, data.search)"
                                    :label="'Negara Tempat Lahir'" @selected="(data: any) => getAutocompleteDataBirthCountry(data)"
                                    :options="birthCountry" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.id_employee" variant="outlined" hide-details label="Kartu Pegawai" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.stambuk" variant="outlined" hide-details label="Stambuk" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="createLecturer.blood_type" label="Golongan Darah" :items="['-', 'A', 'B', 'O', 'AB']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="createLecturer.religion" label="Agama" :items="['Islam', 'Kristen', 'Katholik', 'Hindu', 'Budha', 'Konghucu', 'Lainnya']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="createLecturer.marital_status" label="Status Nikah" :items="['Belum Kawin', 'Sudah Kawin', 'Janda / Duda', 'Suami/Istri Meninggal']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-textarea v-model="createLecturer.address" variant="outlined" hide-details label="Alamat Rumah"></v-textarea>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <Autocomplete @reload="(data: any) => getDataRegency(20, 1, data.search)"
                                    :label="'Kota'" @selected="(data: any) => getAutocompleteDataDistrict(data)"
                                    :options="regency" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <Autocomplete @reload="(data: any) => getDataCountry(20, 1, data.search)"
                                    :label="'Negara'" @selected="(data: any) => getAutocompleteDataCountry(data)"
                                    :options="country" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.postal_code" variant="outlined" hide-details label="Kode Pos" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="number" v-model="createLecturer.phone_number" variant="outlined" hide-details label="Telepon Rumah" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="number" v-model="createLecturer.fax" variant="outlined" hide-details label="Fax" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="number" v-model="createLecturer.mobile_phone_number" variant="outlined" hide-details label="Telepon Selular" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="number" v-model="createLecturer.office_phone_number" variant="outlined" hide-details label="Telepon Kantor" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="createLecturer.employee_type" label="Jenis Pegawai" :items="['Dosen']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="createLecturer.employee_status" label="Status Pegawai" :items="['GTT/PTT Kab/Kota', 'GTT/PTT Provinsi', 'GTY/PTY', 'Guru Bantu Pusat', 'Guru Honor Sekolah', 'Lainnya', 'NON PNS', 'PNS', 'PNS Depag', 'PNS Diperbantukan', 'POLRI', 'Tenaga Honor Sekolah', 'TNI']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.sk_cpns_number" variant="outlined" hide-details label="Nomor SK CPNS" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="date" v-model="createLecturer.sk_cpns_date" variant="outlined" hide-details label="Tanggal SK CPNS" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="date" v-model="createLecturer.tmt_cpns_date" variant="outlined" hide-details label="Terhitung Mulai Tanggal (TMT) CPNS" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="createLecturer.cpns_category" label="Golongan CPNS" :items="['1/a - Juru Muda', '1/b - Juru Muda Tingkat I', '1/c - Juru', '1/d - Juru Tingkat I', '2/a - Pengatur Muda', '2/b - Pengatur Muda Tingkat I', '2/c - Pengatur', '2/d - Pengatur Tingkat I', '3/a - Penata Muda', '3/b - Penata Muda Tingkat I', '3/c - Penata', '3/d - Penata Tingkat I', '4/a - Pembina', '4/b - Pembina Tingkat I', '4/c - Pembina Utama Muda', '4/d - Pembina Utama Madya', '4/e - Pembina Utama', 'E2 - ', 'F2 - ']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="number" v-model="createLecturer.cpns_duration_month" variant="outlined" hide-details label="Masa Kerja CPNS (/Bulan)" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="date" v-model="createLecturer.pre_position_date" variant="outlined" hide-details label="Pra Jabatan" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.sk_pns_number" variant="outlined" hide-details label="Nomor SK PNS" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="date" v-model="createLecturer.sk_pns_date" variant="outlined" hide-details label="Tanggal SK PNS" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="date" v-model="createLecturer.tmt_pns_date" variant="outlined" hide-details label="Terhitung Mulai Tanggal (TMT) PNS" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="createLecturer.pns_category" label="Golongan PNS" :items="['1/a - Juru Muda', '1/b - Juru Muda Tingkat I', '1/c - Juru', '1/d - Juru Tingkat I', '2/a - Pengatur Muda', '2/b - Pengatur Muda Tingkat I', '2/c - Pengatur', '2/d - Pengatur Tingkat I', '3/a - Penata Muda', '3/b - Penata Muda Tingkat I', '3/c - Penata', '3/d - Penata Tingkat I', '4/a - Pembina', '4/b - Pembina Tingkat I', '4/c - Pembina Utama Muda', '4/d - Pembina Utama Madya', '4/e - Pembina Utama', 'E2 - ', 'F2 - ']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="date" v-model="createLecturer.pns_oath_date" variant="outlined" hide-details label="Sumpah PNS" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="date" v-model="createLecturer.join_date" variant="outlined" hide-details label="Tanggal Masuk PT" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.highest_degree" variant="outlined" hide-details label="Gelar Akademik Tertinggi" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.teaching_permit_number" variant="outlined" hide-details label="No Surat Izin Mengajar" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.taspen_number" variant="outlined" hide-details label="Nomor Taspen" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.former_instance" variant="outlined" hide-details label="Instansi Asal" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-textarea v-model="createLecturer.remarks" variant="outlined" hide-details label="Catatan"></v-textarea>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.lecturer_number" variant="outlined" hide-details label="Nomor Dosen" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="createLecturer.academic_position" label="Jabatan Akademik" :items="['Asisten Ahli', 'Lektor', 'Lektor Kepala', 'Profesor']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="createLecturer.employment_status" label="Status Ikatan Kerja" :items="['Dosen Tetap', 'Dosen Tetap Badan Hukum', 'Dosen Tidak Tetap', 'P3K ASN', 'Dosen dengan Perjanjian Kerja', 'Instruktur']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="createLecturer.expertise" variant="outlined" hide-details :items="expertises" item-value="name" item-title="name" label="Kelompok Keahlian"></v-select>
                                    <!-- <v-text-field v-model="createLecturer.expertise" variant="outlined" hide-details label="Kelompok Keahlian" /> -->
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.instance_code" variant="outlined" hide-details label="Kode Instansi Induk" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.teaching_certificate_number" variant="outlined" hide-details label="Nomor Sertifikat Mengajar" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="createLecturer.status" label="Status Aktivitas Dosen" :items="['AKTIF', 'CUTI', 'Izin BELAJAR', 'KELUAR', 'ALMARHUM', 'TIDAK AKTIF', 'PENSIUN', 'TUGAS BELAJAR', 'TUGAS DI INSTANSI LAIN', 'LAINNYA', 'GANTI NIDN', 'HAPUS NIDN']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="createLecturer.resign_semester" variant="outlined" hide-details label="Semester Keluar" />
                                </VCol>
                                <VCardActions class="pa-4">
                                    <VSpacer />
                                    <VBtn color="error" @click="close">
                                    Batal
                                    </VBtn>
                                    <VBtn color="secondary" :disabled="createLecturer.id_national_lecturer == '' || createLecturer.name == ''" @click="save()">
                                    Simpan
                                    </VBtn>
                                </VCardActions>
                            </VRow>
                        </VForm>
                    </VCardText>
                </VCard>
                </VDialog>
            </VCol>
        </div>
        <div v-if="mode == 'edit'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                <VCard>
                    <VCardTitle class="pa-4 bg-secondary">
                        <span class="title text-white">tambah {{title}}</span>
                    </VCardTitle>
                    <VCardText>
                        <VForm ref="form" v-model="valid" lazy-validation>
                            <VRow>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.id_national_lecturer" variant="outlined" hide-details label="*Nomor Induk Dosen Nasional (NIDN)" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.name" variant="outlined" hide-details label="*Nama Lengkap" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.front_title" variant="outlined" hide-details label="Gelar Depan" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.back_degree" variant="outlined" hide-details label="Gelar Belakang" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <Autocomplete @reload="(data: any) => getDataStudyProgram(20, 1, data.search)"
                                    :label="'*Pilih Program Studi'" @selected="(data: any) => getAutocompleteStudyProgram(data)"
                                    :options="studyProgram" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.id_number" variant="outlined" hide-details label="Nomor KTP" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="date" v-model="updateLecturer.birth_date" variant="outlined" hide-details label="Tanggal Lahir" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <Autocomplete @reload="(data: any) => getDataBirthRegency(20, 1, data.search)"
                                    :label="'Kota Tempat Lahir'" @selected="(data: any) => getAutocompleteDataBirthDistrict(data)"
                                    :options="birthRegency" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <Autocomplete @reload="(data: any) => getDataBirthCountry(20, 1, data.search)"
                                    :label="'Negara Tempat Lahir'" @selected="(data: any) => getAutocompleteDataBirthCountry(data)"
                                    :options="birthCountry" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.id_employee" variant="outlined" hide-details label="Kartu Pegawai" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.stambuk" variant="outlined" hide-details label="Stambuk" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="updateLecturer.blood_type" label="Golongan Darah" :items="['-', 'A', 'B', 'O', 'AB']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="updateLecturer.religion" label="Agama" :items="['Islam', 'Kristen', 'Katholik', 'Hindu', 'Budha', 'Konghucu', 'Lainnya']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="updateLecturer.marital_status" label="Status Nikah" :items="['Belum Kawin', 'Sudah Kawin', 'Janda / Duda', 'Suami/Istri Meninggal']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-textarea v-model="updateLecturer.address" variant="outlined" hide-details label="Alamat Rumah"></v-textarea>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <Autocomplete @reload="(data: any) => getDataRegency(20, 1, data.search)"
                                    :label="'Kota'" @selected="(data: any) => getAutocompleteDataDistrict(data)"
                                    :options="regency" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <Autocomplete @reload="(data: any) => getDataCountry(20, 1, data.search)"
                                    :label="'Negara'" @selected="(data: any) => getAutocompleteDataCountry(data)"
                                    :options="country" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.postal_code" variant="outlined" hide-details label="Kode Pos" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="number" v-model="updateLecturer.phone_number" variant="outlined" hide-details label="Telepon Rumah" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="number" v-model="updateLecturer.fax" variant="outlined" hide-details label="Fax" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="number" v-model="updateLecturer.mobile_phone_number" variant="outlined" hide-details label="Telepon Selular" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="number" v-model="updateLecturer.office_phone_number" variant="outlined" hide-details label="Telepon Kantor" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="updateLecturer.employee_type" label="Jenis Pegawai" :items="['Dosen']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="updateLecturer.employee_status" label="Status Pegawai" :items="['GTT/PTT Kab/Kota', 'GTT/PTT Provinsi', 'GTY/PTY', 'Guru Bantu Pusat', 'Guru Honor Sekolah', 'Lainnya', 'NON PNS', 'PNS', 'PNS Depag', 'PNS Diperbantukan', 'POLRI', 'Tenaga Honor Sekolah', 'TNI']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.sk_cpns_number" variant="outlined" hide-details label="Nomor SK CPNS" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="date" v-model="updateLecturer.sk_cpns_date" variant="outlined" hide-details label="Tanggal SK CPNS" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="date" v-model="updateLecturer.tmt_cpns_date" variant="outlined" hide-details label="Terhitung Mulai Tanggal (TMT) CPNS" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="updateLecturer.cpns_category" label="Golongan CPNS" :items="['1/a - Juru Muda', '1/b - Juru Muda Tingkat I', '1/c - Juru', '1/d - Juru Tingkat I', '2/a - Pengatur Muda', '2/b - Pengatur Muda Tingkat I', '2/c - Pengatur', '2/d - Pengatur Tingkat I', '3/a - Penata Muda', '3/b - Penata Muda Tingkat I', '3/c - Penata', '3/d - Penata Tingkat I', '4/a - Pembina', '4/b - Pembina Tingkat I', '4/c - Pembina Utama Muda', '4/d - Pembina Utama Madya', '4/e - Pembina Utama', 'E2 - ', 'F2 - ']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="number" v-model="updateLecturer.cpns_duration_month" variant="outlined" hide-details label="Masa Kerja CPNS (/Bulan)" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="date" v-model="updateLecturer.pre_position_date" variant="outlined" hide-details label="Pra Jabatan" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.sk_pns_number" variant="outlined" hide-details label="Nomor SK PNS" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="date" v-model="updateLecturer.sk_pns_date" variant="outlined" hide-details label="Tanggal SK PNS" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="date" v-model="updateLecturer.tmt_pns_date" variant="outlined" hide-details label="Terhitung Mulai Tanggal (TMT) PNS" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="updateLecturer.pns_category" label="Golongan PNS" :items="['1/a - Juru Muda', '1/b - Juru Muda Tingkat I', '1/c - Juru', '1/d - Juru Tingkat I', '2/a - Pengatur Muda', '2/b - Pengatur Muda Tingkat I', '2/c - Pengatur', '2/d - Pengatur Tingkat I', '3/a - Penata Muda', '3/b - Penata Muda Tingkat I', '3/c - Penata', '3/d - Penata Tingkat I', '4/a - Pembina', '4/b - Pembina Tingkat I', '4/c - Pembina Utama Muda', '4/d - Pembina Utama Madya', '4/e - Pembina Utama', 'E2 - ', 'F2 - ']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="date" v-model="updateLecturer.pns_oath_date" variant="outlined" hide-details label="Sumpah PNS" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field type="date" v-model="updateLecturer.join_date" variant="outlined" hide-details label="Tanggal Masuk PT" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.highest_degree" variant="outlined" hide-details label="Gelar Akademik Tertinggi" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.teaching_permit_number" variant="outlined" hide-details label="No Surat Izin Mengajar" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.taspen_number" variant="outlined" hide-details label="Nomor Taspen" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.former_instance" variant="outlined" hide-details label="Instansi Asal" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-textarea v-model="updateLecturer.remarks" variant="outlined" hide-details label="Catatan"></v-textarea>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.lecturer_number" variant="outlined" hide-details label="Nomor Dosen" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="updateLecturer.academic_position" label="Jabatan Akademik" :items="['Asisten Ahli', 'Lektor', 'Lektor Kepala', 'Profesor']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="updateLecturer.employment_status" label="Status Ikatan Kerja" :items="['Dosen Tetap', 'Dosen Tetap Badan Hukum', 'Dosen Tidak Tetap', 'P3K ASN', 'Dosen dengan Perjanjian Kerja', 'Instruktur']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="updateLecturer.expertise" variant="outlined" hide-details :items="expertises" item-title="name" item-value="name" label="Kelompok Keahlian"></v-select>
                                    <!-- <v-text-field v-model="updateLecturer.expertise" variant="outlined" hide-details label="Kelompok Keahlian" /> -->
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.instance_code" variant="outlined" hide-details label="Kode Instansi Induk" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.teaching_certificate_number" variant="outlined" hide-details label="Nomor Sertifikat Mengajar" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-select v-model="updateLecturer.status" label="Status Aktivitas Dosen" :items="['AKTIF', 'CUTI', 'Izin BELAJAR', 'KELUAR', 'ALMARHUM', 'TIDAK AKTIF', 'PENSIUN', 'TUGAS BELAJAR', 'TUGAS DI INSTANSI LAIN', 'LAINNYA', 'GANTI NIDN', 'HAPUS NIDN']"></v-select>
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateLecturer.resign_semester" variant="outlined" hide-details label="Semester Keluar" />
                                </VCol>
                                <VCardActions class="pa-4">
                                    <VSpacer />
                                    <VBtn color="error" @click="close">
                                    Batal
                                    </VBtn>
                                    <VBtn color="secondary" :disabled="updateLecturer.id_national_lecturer == '' || updateLecturer.name == ''" @click="update()">
                                    Simpan
                                    </VBtn>
                                </VCardActions>
                            </VRow>
                        </VForm>
                    </VCardText>
                </VCard>
                </VDialog>
            </VCol>
        </div>
        <div v-if="mode == 'show'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialogShow" max-width="800">
                    <PagesAdminLecturerDetail :data="lecturerDetail" />
                </VDialog>
            </VCol>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="title">
            <VCol cols="12" lg="4" md="6" class="float-left">
                <v-text-field density="compact" label="Pencarian Data Dosen" hide-details variant="outlined" @input="getData(limit, pagination.page, $event.target.value)" />
            </VCol>
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VBtn color="primary" flat class="ml-auto" @click="create()">
                <VIcon class="mr-2">
                    mdi-account-multiple-plus
                </VIcon>Tambah Data Dosen
                </VBtn>
            </VCol>
        </SharedUiParentCard>
        <VTable class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIDN</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Gelar</th>
                    <th class="text-subtitle-1 font-weight-semibold">Prodi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Ikatan Kerja</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in lecturers">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.id_national_lecturer }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.front_title + item.back_degree }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td>{{ item.employment_status }}</td>
                    <td>{{ item.status }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <VTooltip text="Detail">
                                <template #activator="{ props }">
                                <VBtn icon flat v-bind="props" @click="showItem(item)">
                                    <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                </VBtn>
                                </template>
                            </VTooltip>
                            <VTooltip text="Ubah">
                                <template #activator="{ props }">
                                <VBtn icon flat v-bind="props" @click="editItem(item)">
                                    <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                </VBtn>
                                </template>
                            </VTooltip>
                            <VTooltip text="Hapus">
                                <template #activator="{ props }">
                                <VBtn icon flat v-bind="props" @click="deleteItem(item)">
                                    <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                                </VBtn>
                                </template>
                            </VTooltip>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                            :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                            :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(pagination.limit, pagination.prev, search)"
                            @jumpPage="(page: any) => getData(pagination.limit, page, search)"
                            @nextPage="getData(pagination.limit, pagination.next, search)" />
                    </td>
                </tr>
            </tfoot>
        </VTable>
    </div>
</template>