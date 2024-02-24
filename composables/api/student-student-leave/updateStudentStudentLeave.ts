import { ErrorRoot } from "~~/types/api/error";
import { UpdateStudentStudentLeaveRequest, UpdateStudentStudentLeaveRoot } from "~~/types/api/student-student-leave/UpdateStudentStudentLeave";

export async function updateStudentStudentLeave(body: UpdateStudentStudentLeaveRequest)
    : Promise<{ response: UpdateStudentStudentLeaveRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateStudentStudentLeaveRoot>(() => `/api/v1/student/student_student_leave.StudentStudentLeaveHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                purpose: req.purpose,
                remarks: req.remarks,
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