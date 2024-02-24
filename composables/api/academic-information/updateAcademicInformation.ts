import { ErrorRoot } from "~~/types/api/error";
import { UpdateAcademicInformationRoot, UpdateAcademicInformationRequest } from "~~/types/api/academic-information/UpdateAcademicInformation";
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';

export async function updateAcademicInformation(req: UpdateAcademicInformationRequest)
    : Promise<{ response: UpdateAcademicInformationRoot | null, error: ErrorRoot | null }> {
    try {
        let request = <UpdateAcademicInformationRequest>{
            id: req.id,
            type: req.type,
            title: req.title,
            announcement_date: req.announcement_date ? convertDateWithoutTimeToTimezoned(req.announcement_date) : '',
            file_path: req.file_path,
            file_path_type: req.file_path_type,
            file_title: req.file_title,
            content: req.content,
            for_lecturer: req.for_lecturer,
            for_student: req.for_student,
            study_program_ids: req.study_program_ids,
        }
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateAcademicInformationRoot>(() => `/api/v1/admin/reference_data/admin_announcement.AdminAnnouncementHandler/Update`, <any>{
            method: 'PATCH',
            body: request
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