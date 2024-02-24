import { ErrorRoot } from "~~/types/api/error";
import { GetThesisSupervisorLogRoot } from "~~/types/api/thesis/GetThesisSupervisorLog";

export async function getThesisSupervisorLog(limit: number, page: number, search: string, idNationalLecturer: string, semesterId: string)
    : Promise<{ response: GetThesisSupervisorLogRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetThesisSupervisorLogRoot>(() => `api/v1/admin/thesis/admin_thesis.AdminThesisHandler/GetThesisSupervisorLog?limit=${limit}&page=${page}&search=${search}&idNationalLecturer=${idNationalLecturer}&semesterId=${semesterId}`, <any>{
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