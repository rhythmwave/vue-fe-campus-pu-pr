import { ErrorRoot } from "~~/types/api/error";
import { UpdateGradeComponentRequest, UpdateGradeComponentRoot } from "~~/types/api/grade-component/UpdateGradeComponent";

export async function updateGradeComponent(body: UpdateGradeComponentRequest)
    : Promise<{ response: UpdateGradeComponentRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateGradeComponentRoot>(() => `/api/v1/admin/grade_component/admin_grade_component.AdminGradeComponentHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                name: req.name,
                is_active: req.is_active,
                study_program_id: req.study_program_id,
                subject_category_id: req.subject_category_id,
            },
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