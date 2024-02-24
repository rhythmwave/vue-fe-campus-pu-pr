import { ErrorRoot } from "~~/types/api/error";
import { CreateGraduationSessionRequest, CreateGraduationSessionRoot } from "~~/types/api/graduation-session/CreateGraduationSession";

export async function createGraduationSession(body: CreateGraduationSessionRequest)
    : Promise<{ response: CreateGraduationSessionRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateGraduationSessionRoot>(() => `/api/v1/admin/graduation/admin_graduation_session.AdminGraduationSessionHandler/Create`, <any>{
            method: 'POST',
            body: {
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