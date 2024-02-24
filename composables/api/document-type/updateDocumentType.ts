import { ErrorRoot } from "~~/types/api/error";
import { UpdateDocumentTypeRequest, UpdateDocumentTypeRoot } from "~~/types/api/document-type/UpdateDocumentType";

export async function updateDocumentType(body: UpdateDocumentTypeRequest)
    : Promise<{ response: UpdateDocumentTypeRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateDocumentTypeRoot>(() => `/api/v1/admin/officer/admin_document_type.AdminDocumentTypeHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                name: req.name,
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