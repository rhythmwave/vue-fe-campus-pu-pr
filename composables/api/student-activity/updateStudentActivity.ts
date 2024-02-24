import { ErrorRoot } from "~~/types/api/error";
import { UpdateStudentActivityExaminer, UpdateStudentActivityMentor, UpdateStudentActivityParticipant, UpdateStudentActivityRequest, UpdateStudentActivityRoot } from "~~/types/api/student-activity/UpdateStudentActivity";

export async function updateStudentActivity(body: UpdateStudentActivityRequest)
    : Promise<{ response: UpdateStudentActivityRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        var participants: UpdateStudentActivityParticipant[] = [];
        req.participants.forEach((p) => {
            participants.push(Object.assign({}, p))
        })
        var mentors: UpdateStudentActivityMentor[] = [];
        req.mentors.forEach((m) => {
            mentors.push(Object.assign({}, m))
        })
        var examiners: UpdateStudentActivityExaminer[] = [];
        req.examiners.forEach((e) => {
            examiners.push(Object.assign({}, e))
        })
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateStudentActivityRoot>(() => `/api/v1/admin/student_activity/admin_student_activity.AdminStudentActivityHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                study_program_id: req.study_program_id,
                semester_id: req.semester_id,
                activity_type: req.activity_type,
                title: req.title,
                location: req.location,
                decision_number: req.decision_number,
                decision_date: req.decision_date,
                is_group_activity: req.is_group_activity,
                remarks: req.remarks,
                participants: participants,
                mentors: mentors,
                examiners: examiners,
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