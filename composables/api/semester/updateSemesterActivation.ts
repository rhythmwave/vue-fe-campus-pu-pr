import { ErrorRoot } from "~~/types/api/error";
import { UpdateSemesterActivationRequest, UpdateSemesterActivationRoot } from "~~/types/api/semester/UpdateSemesterActivation";

export async function updateSemesterActivation(body: UpdateSemesterActivationRequest)
    : Promise<{ response: UpdateSemesterActivationRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateSemesterActivationRoot>(() => `/api/v1/admin/semester/admin_semester.AdminSemesterHandler/UpdateActivation`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                is_active: req.is_active,
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