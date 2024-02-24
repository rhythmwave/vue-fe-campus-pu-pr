import { ErrorRoot } from "~~/types/api/error";
import { DeleteGradeTypeRequest, DeleteGradeTypeRoot } from "~~/types/api/grade-type/DeleteGradeType";

export async function deleteGradeType(body: DeleteGradeTypeRequest)
    : Promise<{ response: DeleteGradeTypeRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<DeleteGradeTypeRoot>(() => `/api/v1/admin/grade_type/admin_grade_type.AdminGradeTypeHandler/Delete`, <any>{
            method: 'Delete',
            body: req,
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