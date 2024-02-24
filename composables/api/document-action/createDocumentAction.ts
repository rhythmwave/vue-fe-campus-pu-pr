import { ErrorRoot } from "~~/types/api/error";
import { CreateDocumentActionRequest, CreateDocumentActionRoot } from "~~/types/api/document-action/CreateDocumentAction";

export async function createDocumentAction(body: CreateDocumentActionRequest)
    : Promise<{ response: CreateDocumentActionRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateDocumentActionRoot>(() => `/api/v1/admin/officer/admin_document_action.AdminDocumentActionHandler/Create`, <any>{
            method: 'POST',
            body: {
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