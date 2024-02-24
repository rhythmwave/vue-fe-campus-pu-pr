import { ErrorRoot } from "~~/types/api/error";
import { GetAcademicInformationListRoot } from "~~/types/api/academic-information/GetAcademicInformation";

export async function getAcademicInformationList(limit: number, page: number, search: string, type: string)
    : Promise<{ response: GetAcademicInformationListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetAcademicInformationListRoot>(() => `/api/v1/admin/admin_announcement.AdminAnnouncementHandler/GetList?limit=${limit}&page=${page}&search=${search}&type=${type}`, <any>{
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