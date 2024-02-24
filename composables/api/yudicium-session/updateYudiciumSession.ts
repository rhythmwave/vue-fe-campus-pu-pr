import { ErrorRoot } from "~~/types/api/error";
import { UpdateYudiciumSessionRequest, UpdateYudiciumSessionRoot } from "~~/types/api/yudicium-session/UpdateYudiciumSession";

export async function updateYudiciumSession(body: UpdateYudiciumSessionRequest)
    : Promise<{ response: UpdateYudiciumSessionRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateYudiciumSessionRoot>(() => `/api/v1/admin/graduation/admin_yudicium_session.AdminYudiciumSessionHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                semester_id: req.semester_id,
                name: req.name,
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