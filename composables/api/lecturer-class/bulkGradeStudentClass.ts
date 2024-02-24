import { ErrorRoot } from "~~/types/api/error";
import { BulkGradeStudentClassRequest, BulkGradeStudentClassRoot } from "~~/types/api/lecturer-class/BulkGradeStudentClass";

export async function bulkGradeStudentClass(body: BulkGradeStudentClassRequest)
    : Promise<{ response: BulkGradeStudentClassRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<BulkGradeStudentClassRoot>(() => `/api/v1/lecturer/lecturer_class.LecturerClassHandler/BulkGradeStudentClass`, <any>{
            method: 'POST',
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