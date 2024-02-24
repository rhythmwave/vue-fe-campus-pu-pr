import { ErrorRoot } from "~~/types/api/error";
import { GetActiveSemesterRoot } from "~~/types/api/semester/GetActiveSemester";

export async function getActiveSemester()
    : Promise<{ response: GetActiveSemesterRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetActiveSemesterRoot>(() => `/api/v1/admin/semester/admin_semester.AdminSemesterHandler/GetActive`, <any>{
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