import { ErrorRoot } from "~~/types/api/error";
import { CreateStudentActivityExaminer, CreateStudentActivityMentor, CreateStudentActivityParticipant, CreateStudentActivityRequest, CreateStudentActivityRoot } from "~~/types/api/student-activity/CreateStudentActivity";

export async function createStudentActivity(body: CreateStudentActivityRequest)
    : Promise<{ response: CreateStudentActivityRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        var participants: CreateStudentActivityParticipant[] = [];
        var mentors: CreateStudentActivityMentor[] = [];
        var examiners: CreateStudentActivityExaminer[] = [];
        for (let index = 0; index < req.participants.length; index++) {
            let data = <CreateStudentActivityParticipant>{
                student_id: req.participants[index].student_id,
                role: req.participants[index].role,
            }
            participants.push(data)
        }
        for (let index = 0; index < req.mentors.length; index++) {
            let data = <CreateStudentActivityMentor>{
                lecturer_id: req.mentors[index].lecturer_id,
                activity_category: req.mentors[index].activity_category,
                sort: Number(req.mentors[index].sort),
            }
            mentors.push(data)
        }
        for (let index = 0; index < req.examiners.length; index++) {
            let data = <CreateStudentActivityExaminer>{
                lecturer_id: req.examiners[index].lecturer_id,
                activity_category: req.examiners[index].activity_category,
                sort: Number(req.examiners[index].sort),
            }
            examiners.push(data)
        }
        
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateStudentActivityRoot>(() => `/api/v1/admin/student_activity/admin_student_activity.AdminStudentActivityHandler/Create`, <any>{
            method: 'POST',
            body: {
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