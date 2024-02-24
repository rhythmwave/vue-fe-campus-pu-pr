import { ErrorRoot } from "~~/types/api/error";
import { GetClassroomListDataRoot } from "~~/types/api/classroom/GetClassroomList";

export async function getClassroomList(limit: number, page: number, searchText: string, study_program_id: string, semester_id: string, is_active: boolean, subject_id: string, is_mbkm: boolean)
    : Promise<{ response: GetClassroomListDataRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetClassroomListDataRoot>(() => `/api/v1/admin/admin_class.AdminClassHandler/GetList?limit=${limit}&page=${page}&sortBy=s.name&sort=ASC&search=${searchText}&studyProgramId=${study_program_id}&semesterId=${semester_id}&isActive=${is_active}&subjectId=${subject_id}&isMbkm=${is_mbkm}`, <any>{
            method: 'GET',
        })
        if (error.value) {
            let errorRoot = <ErrorRoot><unknown>error.value.data;
            if (!errorRoot.meta) {
                return { response: null, error: errorRoot };
            }
            if (errorRoot.meta.status == 401) {
                const authUser = useAuthStorage();
                authUser.value = null;
                navigateTo({ name: 'login', path: '' })
                return { response: null, error: errorRoot };
            }
        }
        return { response: data.value, error: null };
    } catch (error) {
        return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
    }
}