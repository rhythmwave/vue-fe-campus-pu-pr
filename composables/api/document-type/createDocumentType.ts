import { ErrorRoot } from "~~/types/api/error";
import { CreateDocumentTypeRequest, CreateDocumentTypeRoot } from "~~/types/api/document-type/CreateDocumentType";

export async function createDocumentType(body: CreateDocumentTypeRequest)
    : Promise<{ response: CreateDocumentTypeRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateDocumentTypeRoot>(() => `/api/v1/admin/officer/admin_document_type.AdminDocumentTypeHandler/Create`, <any>{
            method: 'POST',
            body: {
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