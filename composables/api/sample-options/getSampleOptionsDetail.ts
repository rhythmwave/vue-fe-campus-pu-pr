import { ErrorRoot } from "~~/types/api/error";
import { GetSampleOptionsDetailRoot } from "~~/types/api/sampleOptions-options/GetSampleOptionsDetail";

export async function getSampleOptionsDetail(id: string)
    : Promise<{ response: GetSampleOptionsDetailRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetSampleOptionsDetailRoot>(() => `api/v1/admin/sampleOptions-options/sampleOptions.SampleOptionsHandler/GetList?id=${id}`, <any>{
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