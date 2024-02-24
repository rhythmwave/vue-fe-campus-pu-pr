import { ErrorRoot } from "~~/types/api/error";
import { ApplyGraduationRequest, ApplyGraduationRoot } from "~~/types/api/graduation/ApplyGraduation";

export async function applyGraduation(body: ApplyGraduationRequest)
    : Promise<{ response: ApplyGraduationRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<ApplyGraduationRoot>(() => `/api/v1/admin/graduation/admin_graduation.AdminGraduationHandler/Apply`, <any>{
            method: 'POST',
            body: {
                student_id: req.student_id,
                application_date: req.application_date,
                graduation_session_id: req.graduation_session_id,
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