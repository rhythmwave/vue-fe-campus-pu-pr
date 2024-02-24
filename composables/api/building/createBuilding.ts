import { ErrorRoot } from "~~/types/api/error";
import { CreateBuildingRequest, CreateBuildingRoot } from "~~/types/api/building/CreateBuilding";

export async function createBuilding(body: CreateBuildingRequest)
    : Promise<{ response: CreateBuildingRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateBuildingRoot>(() => `/api/v1/admin/space/admin_building.AdminBuildingHandler/Create`, <any>{
            method: 'POST',
            body: {
                name: req.name,
                code: req.code,
                faculty_id: req.faculty_id,
                major_id: req.major_id,
                
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