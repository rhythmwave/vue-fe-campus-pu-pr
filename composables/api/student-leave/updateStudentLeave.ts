import { ErrorRoot } from "~~/types/api/error";
import { UpdateStudentLeaveRequest, UpdateStudentLeaveRoot } from "~~/types/api/student-leave/UpdateStudentLeave";
import { convertDateWithoutTimeToTimezoned } from "~~/utils/helpers/date-utils"

export async function updateStudentLeave(body: UpdateStudentLeaveRequest)
    : Promise<{ response: UpdateStudentLeaveRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateStudentLeaveRoot>(() => `/api/v1/admin/student/admin_student_leave.AdminStudentLeaveHandler/Update`, <any>{
            method: 'PATCH',
            body: body,
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