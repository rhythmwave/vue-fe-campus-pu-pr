import { GetClassMaterialListRoot } from "~~/types/api/class-material/GetClassMaterialList";
import { ErrorRoot } from "~~/types/api/error";


export async function getClassMaterialList(limit: number, page: number, search: string, classId: string)
    : Promise<{ response: GetClassMaterialListRoot | null, error: ErrorRoot | null }> {
    try {
        // var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<GetClassMaterialListRoot>(() => `/api/v1/admin/admin_class_material.AdminClassMaterialHandler/GetList?page=${page}&limit=${limit}&search=${search}&classId=${classId}`, <any>{
            method: 'GET'
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
        }
        return { response: data.value, error: null };
    } catch (error) {
        return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
    }
}