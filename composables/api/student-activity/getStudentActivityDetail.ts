import { ErrorRoot } from "~~/types/api/error";
import { GetStudentActivityDetailRoot } from "~~/types/api/student-activity/GetStudentActivityDetail";

export async function getStudentActivityDetail(id: string)
    : Promise<{ response: GetStudentActivityDetailRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentActivityDetailRoot>(() => `/api/v1/admin/student_activity/admin_student_activity.AdminStudentActivityHandler/GetDetail?id=${id}`, <any>{
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