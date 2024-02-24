import { ErrorRoot } from "~~/types/api/error";
import { CreateStudentLeaveRequest, CreateStudentLeaveRoot } from "~~/types/api/student-leave/CreateStudentLeave";
import { convertDateWithoutTimeToTimezoned } from "~~/utils/helpers/date-utils"

export async function createStudentLeave(body: CreateStudentLeaveRequest)
    : Promise<{ response: CreateStudentLeaveRoot | null, error: ErrorRoot | null }> {
        let req = <CreateStudentLeaveRequest>{
            student_id: body.student_id,
            total_leave_duration_semester: body.total_leave_duration_semester,
            start_date: convertDateWithoutTimeToTimezoned(body.start_date),
            permit_number: body.permit_number,
            purpose: body.purpose,
            remarks: body.remarks,
        }
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateStudentLeaveRoot>(() => `/api/v1/admin/student/admin_student_leave.AdminStudentLeaveHandler/Create`, <any>{
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