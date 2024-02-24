import { ErrorRoot } from "~~/types/api/error";
import { EditThesisRequest, EditThesisRoot } from "~~/types/api/thesis/EditThesis";
import { convertDateWithoutTimeToTimezoned } from  '~~/utils/helpers/date-utils'

export async function updateThesis(body: EditThesisRequest)
    : Promise<{ response: EditThesisRoot | null, error: ErrorRoot | null }> {
        let req = <EditThesisRequest>{
            id: body.id,
            student_id: body.student_id,
            topic: body.topic,
            status: body.status,
            title: body.title,
            english_title: body.english_title,
            start_semester_id: body.start_semester_id,
            start_date: convertDateWithoutTimeToTimezoned(body.start_date),
            remarks: body.remarks,
            is_joint_thesis: body.is_joint_thesis,
            proposal_seminar_date: convertDateWithoutTimeToTimezoned(body.proposal_seminar_date),
            proposal_certificate_number: body.proposal_certificate_number,
            proposal_certificate_date: convertDateWithoutTimeToTimezoned(body.proposal_certificate_date),
            files: body.files,
            thesis_supervisors: body.thesis_supervisors,
        }
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<EditThesisRoot>(() => `/api/v1/admin/thesis/admin_thesis.AdminThesisHandler/Update`, <any>{
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