import { ErrorRoot } from "~~/types/api/error";
import { DeleteExpertiseGroupRoot } from "~~/types/api/expertise-group/DeleteExpertiseGroup";

export async function deleteExpertiseGroup(id: string)
    : Promise<{ response: DeleteExpertiseGroupRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<DeleteExpertiseGroupRoot>(() => `/api/v1/admin/reference_data/admin_expertise_group.AdminExpertiseGroupHandler/Delete`, <any>{
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