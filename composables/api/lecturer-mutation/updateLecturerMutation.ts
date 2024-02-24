import { ErrorRoot } from "~~/types/api/error";
import { UpdateLecturerMutationRequest, UpdateLecturerMutationRoot } from "~~/types/api/lecturer-mutation/UpdateLecturerMutation";

export async function updateLecturerMutation(body: UpdateLecturerMutationRequest)
    : Promise<{ response: UpdateLecturerMutationRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateLecturerMutationRoot>(() => `api/v1/admin/lecturer-mutation/lecturerMutation.LecturerMutationHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                name: req.name,
                age: Number(req.age)
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