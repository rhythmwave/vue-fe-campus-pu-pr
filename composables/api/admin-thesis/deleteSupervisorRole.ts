import { ErrorRoot } from "~~/types/api/error";
import { DeleteSupervisorRoleRoot } from "~~/types/api/thesis/DeleteSupervisorRole";

export async function deleteSupervisorRole(id: string)
    : Promise<{ response: DeleteSupervisorRoleRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<DeleteSupervisorRoleRoot>(() => `/api/v1/admin/thesis/admin_thesis_supervisor_role.AdminThesisSupervisorRoleHandler/Delete`, <any>{
            method: 'DELETE',
            body: {
                id: id,
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