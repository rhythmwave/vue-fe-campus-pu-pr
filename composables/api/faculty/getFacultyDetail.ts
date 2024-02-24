import { ErrorRoot } from "~~/types/api/error";
import { GetFacultyDetailRoot } from "~~/types/api/faculty/GetFacultyDetail";

export async function getFacultyDetail(id: string)
    : Promise<{ response: GetFacultyDetailRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetFacultyDetailRoot>(() => `api/v1/admin/faculty/faculty.FacultyHandler/GetList?id=${id}`, <any>{
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