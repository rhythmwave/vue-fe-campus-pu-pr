import { ErrorRoot } from "~~/types/api/error";
import { GetThesisRoot } from "~~/types/api/thesis/GetThesis";

export async function getThesis(limit: number, page: number, search: string, studyProgramId: string, nimNumber: string, startSemesterId: string, status: string, supervisorLecturerId: string)
    : Promise<{ response: GetThesisRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetThesisRoot>(() => `api/v1/admin/admin_thesis.AdminThesisHandler/GetList?limit=${limit}&page=${page}&search=${search}&studyProgramId=${studyProgramId}&nimNumber=${nimNumber}&startSemesterId=${startSemesterId}&status=${status}&supervisorLecturerId=${supervisorLecturerId}`, <any>{
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