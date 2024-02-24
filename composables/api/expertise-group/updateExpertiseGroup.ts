import { ErrorRoot } from "~~/types/api/error";
import { UpdateExpertiseGroupRequest, UpdateExpertiseGroupRoot } from "~~/types/api/expertise-group/UpdateExpertiseGroup";

export async function updateExpertiseGroup(body: UpdateExpertiseGroupRequest)
    : Promise<{ response: UpdateExpertiseGroupRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateExpertiseGroupRoot>(() => `/api/v1/admin/reference_data/admin_expertise_group.AdminExpertiseGroupHandler/Update`, <any>{
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