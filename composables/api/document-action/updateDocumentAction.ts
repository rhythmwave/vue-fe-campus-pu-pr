import { ErrorRoot } from "~~/types/api/error";
import { UpdateDocumentActionRequest, UpdateDocumentActionRoot } from "~~/types/api/document-action/UpdateDocumentAction";

export async function updateDocumentAction(body: UpdateDocumentActionRequest)
    : Promise<{ response: UpdateDocumentActionRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateDocumentActionRoot>(() => `/api/v1/admin/officer/admin_document_action.AdminDocumentActionHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                action: req.action,
                english_action: req.english_action,
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