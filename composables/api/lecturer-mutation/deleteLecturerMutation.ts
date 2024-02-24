import { ErrorRoot } from "~~/types/api/error";
import { DeleteLecturerMutationRequest, DeleteLecturerMutationRoot } from "~~/types/api/lecturer-mutation/DeleteLecturerMutation";

export async function deleteLecturerMutation(body: DeleteLecturerMutationRequest)
    : Promise<{ response: DeleteLecturerMutationRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<DeleteLecturerMutationRoot>(() => `api/v1/admin/lecturer-mutation/lecturerMutation.LecturerMutationHandler/Delete`, <any>{
            method: 'DELETE',
            body: {
                id: req.id
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