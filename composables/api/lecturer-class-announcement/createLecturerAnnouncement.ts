import { ErrorRoot } from "~~/types/api/error";
import {  CreateLecturerClassAnnouncementRequest, CreateLecturerClassAnnouncementRoot } from "~~/types/api/lecturer-class-announcement/CreateLecturerClassAnnouncement";
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils'

export async function createLecturerAnnouncement(body: CreateLecturerClassAnnouncementRequest)
    : Promise<{ response: CreateLecturerClassAnnouncementRoot | null, error: ErrorRoot | null }> {
    try {
        let req = <CreateLecturerClassAnnouncementRequest>{
            class_id: body.class_id,
            title: body.title,
            content: body.content,
            file_path: body.file_path,
            file_path_type: body.file_path_type,
            start_time: body.start_time ? convertDateWithoutTimeToTimezoned(body.start_time) : '',
            end_time: body.start_time ? convertDateWithoutTimeToTimezoned(body.end_time) : '',
        }
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateLecturerClassAnnouncementRoot>(() => `/api/v1/lecturer/lecturer_class_announcement.LecturerClassAnnouncementHandler/Create`, <any>{
            method: 'POST',
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