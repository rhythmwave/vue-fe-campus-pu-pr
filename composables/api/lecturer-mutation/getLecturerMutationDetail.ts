import { ErrorRoot } from "~~/types/api/error";
import { GetLecturerMutationDetailRoot } from "~~/types/api/lecturer-mutation/GetLecturerMutationDetail";

export async function getLecturerMutationDetail(id: string)
    : Promise<{ response: GetLecturerMutationDetailRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLecturerMutationDetailRoot>(() => `api/v1/admin/lecturer-mutation/lecturerMutation.LecturerMutationHandler/GetList?id=${id}`, <any>{
            method: 'GET',
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