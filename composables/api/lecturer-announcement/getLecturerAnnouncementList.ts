import { ErrorRoot } from "~~/types/api/error";
import { GetLecturerAnnouncementListRoot } from "~~/types/api/lecturer-announcement/GetLecturerAnnouncementList";

export async function getLecturerAnnouncementList(limit: number, page: number, searchText: string, type: string)
    : Promise<{ response: GetLecturerAnnouncementListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLecturerAnnouncementListRoot>(() => `/api/v1/lecturer/lecturer_announcement.LecturerAnnouncementHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&type=${type}`, <any>{
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