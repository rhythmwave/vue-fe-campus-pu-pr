import { ErrorRoot } from "~~/types/api/error";
import { DoYudiciumRequest, DoYudiciumRoot } from "~~/types/api/yudicium/DoYudicium";

export async function doYudicium(body: DoYudiciumRequest)
    : Promise<{ response: DoYudiciumRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        var studentIds = Object.assign([], body.student_ids)
        const { data: data, pending, refresh, error } = await useAPIFetch<DoYudiciumRoot>(() => `/api/v1/admin/graduation/admin_yudicium.AdminYudiciumHandler/Do`, <any>{
            method: 'POST',
            body: {
                yudicium_session_id: req.yudicium_session_id,
                yudicium_number: req.yudicium_number,
                yudicium_date: req.yudicium_date,
                with_thesis: studentIds,
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