import { ErrorRoot } from "~~/types/api/error";
import { GetDocumentTypeListRoot } from "~~/types/api/document-type/GetDocumentTypeList";

export async function getDocumentTypeList(limit: number, page: number, searchText: string)
    : Promise<{ response: GetDocumentTypeListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetDocumentTypeListRoot>(() => `/api/v1/admin/admin_document_type.AdminDocumentTypeHandler/GetList?limit=${limit}&page=${page}&search=${searchText}`, <any>{
            method: 'GET',
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