import { ErrorRoot } from "~~/types/api/error";
import { GetStudentSkpiListRoot } from "~~/types/api/student-skpi/GetStudentSkpiList";

export async function getStudentSkpiList(limit: number, page: number, searchText: string)
    : Promise<{ response: GetStudentSkpiListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentSkpiListRoot>(() => `api/v1/admin/student-skpi/studentSkpi.StudentSkpiHandler/GetList?limit=${limit}&page=${page}&search=${searchText}`, <any>{
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