import { ErrorRoot } from "~~/types/api/error";
import {  UpdateLecturerClassAnnouncementRequest, UpdateLecturerClassAnnouncementRoot } from "~~/types/api/lecturer-class-announcement/UpdateLecturerClassAnnouncement";
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils'

export async function updateLecturerAnnouncement(body: UpdateLecturerClassAnnouncementRequest)
    : Promise<{ response: UpdateLecturerClassAnnouncementRoot | null, error: ErrorRoot | null }> {
    try {
        let req = <UpdateLecturerClassAnnouncementRequest>{
            id: body.id,
            class_id: body.class_id,
            title: body.title,
            content: body.content,
            file_path: body.file_path,
            file_path_type: body.file_path_type,
            start_time: body.start_time ? convertDateWithoutTimeToTimezoned(body.start_time) : '',
            end_time: body.end_time ? convertDateWithoutTimeToTimezoned(body.end_time) : '',
        }
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateLecturerClassAnnouncementRoot>(() => `/api/v1/lecturer/lecturer_class_announcement.LecturerClassAnnouncementHandler/Update`, <any>{
            method: 'PATCH',
            body: req,
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