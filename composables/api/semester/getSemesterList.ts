import { ErrorRoot } from "~~/types/api/error";
import { GetSemesterListRoot } from "~~/types/api/semester/GetSemesterList";

export async function getSemesterList(limit: number, page: number, studyProgramId: string, excludingSemesterId: string)
    : Promise<{ response: GetSemesterListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetSemesterListRoot>(() => `/api/v1/admin/admin_semester.AdminSemesterHandler/GetList?limit=${limit}&page=${page}&studyProgramId=${studyProgramId}&excludingSemesterId=${excludingSemesterId}`, <any>{
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