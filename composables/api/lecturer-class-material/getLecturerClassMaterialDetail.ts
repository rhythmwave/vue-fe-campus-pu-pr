import { ErrorRoot } from "~~/types/api/error";
import { GetLecturerClassMaterialDetailRoot } from "~~/types/api/lecturer-class-material/GetLecturerClassMaterialDetail";

export async function getLecturerClassMaterialDetail(id: string)
    : Promise<{ response: GetLecturerClassMaterialDetailRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLecturerClassMaterialDetailRoot>(() => `api/v1/admin/lecturer-class-material/lecturerClassMaterial.LecturerClassMaterialHandler/GetList?id=${id}`, <any>{
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