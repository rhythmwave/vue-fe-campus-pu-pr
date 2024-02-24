import { ErrorRoot } from "~~/types/api/error";
import { GetExamSupervisorRoleListRoot } from "~~/types/api/class-participant/GetExamSupervisorRole";

export async function getExamSupervisorRoleList(limit: number, page: number, searchText: string)
    : Promise<{ response: GetExamSupervisorRoleListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetExamSupervisorRoleListRoot>(() => `/api/v1/admin/admin_exam_supervisor_role.AdminExamSupervisorRoleHandler/GetList?limit=${limit}&page=${page}&search=${searchText}`, <any>{
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