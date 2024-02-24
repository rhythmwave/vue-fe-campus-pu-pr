import { ErrorRoot } from "~~/types/api/error";
import { CreateExpertiseGroupRequest, CreateExpertiseGroupRoot } from "~~/types/api/expertise-group/CreateExpertiseGroup";

export async function createExpertiseGroup(body: CreateExpertiseGroupRequest)
    : Promise<{ response: CreateExpertiseGroupRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateExpertiseGroupRoot>(() => `/api/v1/admin/reference_data/admin_expertise_group.AdminExpertiseGroupHandler/Create`, <any>{
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