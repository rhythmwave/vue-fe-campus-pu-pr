import { ErrorRoot } from "~~/types/api/error";
import { GetStudentClassRoot } from "~~/types/api/student-class/GetStudentClassList1";
import { GetStudentClassRequest } from "~~/types/api/student-class/GetStudentClassRequest1";

export async function getStudentClassList(limit: number, page: number, search: string, requestBody:GetStudentClassRequest)
    : Promise<{ response: GetStudentClassRoot | null, error: ErrorRoot | null }> {
    try {
        // var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentClassRoot>(() => `/api/v1/admin/admin_student_class.AdminStudentClassHandler/GetList?limit=${limit}&page=${page}&search=${search}&studyPlanId=${requestBody.studyPlanId}&studentId=${requestBody.studentId}&semesterId=${requestBody.semesterId}`, <any>{
            method: 'GET'
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