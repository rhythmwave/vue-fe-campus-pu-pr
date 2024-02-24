import { ErrorRoot } from "~~/types/api/error";
import { CreateYudiciumTermRequest, CreateYudiciumTermRoot } from "~~/types/api/yudicium-term/CreateYudiciumTerm";

export async function createYudiciumTerm(body: CreateYudiciumTermRequest)
    : Promise<{ response: CreateYudiciumTermRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateYudiciumTermRoot>(() => `/api/v1/admin/graduation/admin_yudicium_term.AdminYudiciumTermHandler/Create`, <any>{
            method: 'POST',
            body: {
                curriculum_id: req.curriculum_id,
                term: req.term,
                remarks: req.remarks,
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