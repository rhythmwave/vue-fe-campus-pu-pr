import { ErrorRoot } from "~~/types/api/error";
import {  DeleteLecturerClassAnnouncementRoot } from "~~/types/api/lecturer-class-announcement/DeleteLecturerClassAnnouncement";
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils'

export async function deleteLecturerAnnouncement(body: string[])
    : Promise<{ response: DeleteLecturerClassAnnouncementRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<DeleteLecturerClassAnnouncementRoot>(() => `/api/v1/lecturer/lecturer_class_announcement.LecturerClassAnnouncementHandler/Delete`, <any>{
            method: 'DELETE',
            body: {
                ids: body
            },
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