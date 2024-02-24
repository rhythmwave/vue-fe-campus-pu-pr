import { ErrorRoot } from "~~/types/api/error";
import { UpdateGraduationSessionRequest, UpdateGraduationSessionRoot } from "~~/types/api/graduation-session/UpdateGraduationSession";

export async function updateGraduationSession(body: UpdateGraduationSessionRequest)
    : Promise<{ response: UpdateGraduationSessionRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateGraduationSessionRoot>(() => `/api/v1/admin/graduation/admin_graduation_session.AdminGraduationSessionHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                session_year: Number(req.session_year),
                session_number: Number(req.session_number),
                session_date: req.session_date,
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