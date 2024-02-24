import { ErrorRoot } from "~~/types/api/error";
import { CreateSupervisorRoleRequest, CreateSupervisorRoleRoot } from "~~/types/api/thesis/CreateSupervisorRole";

export async function createSupervisorRole(body: CreateSupervisorRoleRequest)
    : Promise<{ response: CreateSupervisorRoleRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateSupervisorRoleRoot>(() => `/api/v1/admin/thesis/admin_thesis_supervisor_role.AdminThesisSupervisorRoleHandler/Create`, <any>{
            method: 'POST',
            body: {
                name: req.name,
                sort: parseFloat(req.sort),
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