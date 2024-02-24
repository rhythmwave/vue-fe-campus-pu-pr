import { ErrorRoot } from "~~/types/api/error";
import { GetAdminClassExamDetailRoot } from "~~/types/api/admin-class-exam/GetAdminClassExamDetail";

export async function getAdminClassExamDetail(id: string)
    : Promise<{ response: GetAdminClassExamDetailRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetAdminClassExamDetailRoot>(() => `api/v1/admin/admin-class-exam/adminClassExam.AdminClassExamHandler/GetList?id=${id}`, <any>{
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