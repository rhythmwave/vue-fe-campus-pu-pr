import { ErrorRoot } from "~~/types/api/error";
import {  GetLecturerClassAnnouncementRoot } from "~~/types/api/lecturer-class-announcement/GetLecturerClassAnnouncement";

export async function getLecturerClassAnnouncement(limit: number, page: number, search: string, classId: string)
    : Promise<{ response: GetLecturerClassAnnouncementRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLecturerClassAnnouncementRoot>(() => `/api/v1/lecturer/lecturer_class_announcement.LecturerClassAnnouncementHandler/GetList?page=${page}&limit=${limit}&search=${search}&classId=${classId}`, <any>{
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