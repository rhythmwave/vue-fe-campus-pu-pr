import { ErrorRoot } from "~~/types/api/error";
import { GetStudentActivityListRoot } from "~~/types/api/student-activity/GetStudentActivityList";

export async function getStudentActivityList(limit: number, page: number, searchText: string, activityType: string, studyProgramId: string, semesterId: string)
    : Promise<{ response: GetStudentActivityListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentActivityListRoot>(() => `/api/v1/admin/admin_student_activity.AdminStudentActivityHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&activityType=${activityType}&studyProgramId=${studyProgramId}&semesterId=${semesterId}`, <any>{
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
            return { response: null, error: errorRoot };
        }
        return { response: data.value, error: null };
    } catch (error) {
        return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
    }
}