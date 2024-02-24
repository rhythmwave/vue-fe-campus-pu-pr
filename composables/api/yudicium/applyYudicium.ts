import { ErrorRoot } from "~~/types/api/error";
import { ApplyYudiciumRequest, ApplyYudiciumRoot } from "~~/types/api/yudicium/ApplyYudicium";

export async function applyYudicium(body: ApplyYudiciumRequest)
    : Promise<{ response: ApplyYudiciumRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<ApplyYudiciumRoot>(() => `/api/v1/admin/graduation/admin_yudicium.AdminYudiciumHandler/Apply`, <any>{
            method: 'POST',
            body: {
                student_id: req.student_id,
                application_date: req.application_date,
                with_thesis: req.with_thesis,
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