import { ErrorRoot } from "~~/types/api/error";
import { BulkDeleteClassMaterialRequest, BulkDeleteClassMaterialRoot } from "~~/types/api/class-material/BulkDeleteClassMaterial";

export async function bulkDeleteClassMaterial(body: BulkDeleteClassMaterialRequest)
    : Promise<{ response: BulkDeleteClassMaterialRoot| null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<BulkDeleteClassMaterialRoot>(() => `/api/v1/lecturer/lecturer_class_material.LecturerClassMaterialHandler/BulkDelete`, <any>{
            method: 'DELETE',
            body: {
                ids: body.ids,
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