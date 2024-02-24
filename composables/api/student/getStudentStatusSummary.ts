import { ErrorRoot } from "~~/types/api/error";
import { GetStudentSummaryListRoot } from "~~/types/api/student/GetStudentStatusSummary";

export async function getStudentStatusSummary(semester_id: string)
    : Promise<{ response: GetStudentSummaryListRoot | null, error: ErrorRoot | null }> {
        let status = <string>''
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentSummaryListRoot>(() => `/api/v1/admin/student/admin_student.AdminStudentHandler/GetStatusSummary?semesterId=${semester_id}`, <any>{
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