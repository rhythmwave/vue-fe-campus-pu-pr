import { ErrorRoot } from "~~/types/api/error";
import { CreateStudentStudentLeaveRequest, CreateStudentStudentLeaveRoot } from "~~/types/api/student-student-leave/CreateStudentStudentLeave";

export async function createStudentStudentLeave(body: CreateStudentStudentLeaveRequest)
    : Promise<{ response: CreateStudentStudentLeaveRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateStudentStudentLeaveRoot>(() => `/api/v1/student/student_student_leave.StudentStudentLeaveHandler/Create`, <any>{
            method: 'POST',
            body: {
                purpose: req.purpose,
                remarks: req.remarks,
                start_date: req.start_date,
                total_leave_duration_semester: Number(req.total_leave_duration_semester),
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