import { ErrorRoot } from "~~/types/api/error";
import { GetStudentPaymentLogRoot } from "~~/types/api/student/GetStudentPaymentLog";

export async function getStudentPaymentLogList(studentId: string)
    : Promise<{ response: GetStudentPaymentLogRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentPaymentLogRoot>(() => `/api/v1/admin/registration_status/admin_student.AdminStudentHandler/GetPaymentLog?studentId=${studentId}`, <any>{
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