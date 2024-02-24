import { ErrorRoot } from "~~/types/api/error";
import { CreateThesisRequest, CreateThesisRoot } from "~~/types/api/thesis/CreateThesis";
import { convertDateWithoutTimeToTimezoned } from  '~~/utils/helpers/date-utils'
export async function createThesis(body: CreateThesisRequest)
    : Promise<{ response: CreateThesisRoot | null, error: ErrorRoot | null }> {
        let req = <CreateThesisRequest>{
            student_id: body.student_id,
            topic: body.topic,
            status: body.status,
            title: body.title,
            english_title: body.english_title,
            start_semester_id: body.start_semester_id,
            start_date: convertDateWithoutTimeToTimezoned(body.start_date),
            remarks: body.remarks,
            is_joint_thesis: body.is_joint_thesis,
            file_path: body.file_path,
            file_path_type: body.file_path_type,
            file_description: body.file_description,
            proposal_seminar_date: convertDateWithoutTimeToTimezoned(body.proposal_seminar_date),
            proposal_certificate_number: body.proposal_certificate_number,
            proposal_certificate_date: convertDateWithoutTimeToTimezoned(body.proposal_certificate_date),
            thesis_supervisors: body.thesis_supervisors,
        }
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateThesisRoot>(() => `/api/v1/admin/thesis/admin_thesis.AdminThesisHandler/Create`, <any>{
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