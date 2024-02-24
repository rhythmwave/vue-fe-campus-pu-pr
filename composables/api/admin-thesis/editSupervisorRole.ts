import { ErrorRoot } from "~~/types/api/error";
import { EditSupervisorRoleRequest, EditSupervisorRoleRoot } from "~~/types/api/thesis/EditSupervisorRole";

export async function editSupervisorRole(body: EditSupervisorRoleRequest)
    : Promise<{ response: EditSupervisorRoleRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<EditSupervisorRoleRoot>(() => `/api/v1/admin/thesis/admin_thesis_supervisor_role.AdminThesisSupervisorRoleHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
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