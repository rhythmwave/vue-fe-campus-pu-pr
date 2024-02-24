import { ErrorRoot } from "~~/types/api/error";
import { ConvertStudentMbkmRequest, ConvertStudentMbkmRoot } from "~~/types/api/student/ConvertStudentMbkm";

export async function convertStudentMbkm(body: ConvertStudentMbkmRequest)
    : Promise<{ response: ConvertStudentMbkmRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<ConvertStudentMbkmRoot>(() => `/api/v1/admin/student/admin_student.AdminStudentHandler/ConvertGrade`, <any>{
            method: 'PATCH',
            body: body,
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