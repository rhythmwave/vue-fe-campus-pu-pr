import { ErrorRoot } from "~~/types/api/error";
import { UpdateBuildingRequest, UpdateBuildingRoot } from "~~/types/api/building/UpdateBuilding";

export async function updateBuilding(body: UpdateBuildingRequest)
    : Promise<{ response: UpdateBuildingRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateBuildingRoot>(() => `/api/v1/admin/space/admin_building.AdminBuildingHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                code: req.code,
                faculty_id: req.faculty_id,
                major_id: req.major_id,
                name: req.name
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