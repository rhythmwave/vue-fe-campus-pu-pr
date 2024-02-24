import { ErrorRoot } from "~~/types/api/error";
import { GetStudentAnnouncementListRoot } from "~~/types/api/student-announcement/GetStudentAnnouncementList";

export async function getStudentAnnouncementList(limit: number, page: number, searchText: string, type:string)
    : Promise<{ response: GetStudentAnnouncementListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentAnnouncementListRoot>(() => `/api/v1/student/student_announcement.StudentAnnouncementHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&type=${type}`, <any>{
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