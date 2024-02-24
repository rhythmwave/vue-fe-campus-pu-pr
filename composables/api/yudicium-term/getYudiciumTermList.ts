import { ErrorRoot } from "~~/types/api/error";
import { GetYudiciumTermListRoot } from "~~/types/api/yudicium-term/GetYudiciumTermList";

export async function getYudiciumTermList(limit: number, page: number, searchText: string, curriculumId: string)
    : Promise<{ response: GetYudiciumTermListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetYudiciumTermListRoot>(() => `/api/v1/admin/admin_yudicium_term.AdminYudiciumTermHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&curriculumId=${curriculumId}`, <any>{
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