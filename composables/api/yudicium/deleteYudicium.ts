import { ErrorRoot } from "~~/types/api/error";
import { DeleteYudiciumRequest, DeleteYudiciumRoot } from "~~/types/api/yudicium/DeleteYudicium";

export async function deleteYudicium(body: DeleteYudiciumRequest)
    : Promise<{ response: DeleteYudiciumRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<DeleteYudiciumRoot>(() => `api/v1/admin/yudicium/yudicium.YudiciumHandler/Delete`, <any>{
            method: 'DELETE',
            body: {
                id: req.id
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