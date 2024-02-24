import { ErrorRoot } from "~~/types/api/error";
import { GetStudentLeaveRequest, GetStudentLeaveRoot } from "~~/types/api/student-leave/GetStudentLeave";

export async function getStudentLeaveRequestList(limit: number, page: number, search: string, requestBody:GetStudentLeaveRequest)
    : Promise<{ response: GetStudentLeaveRoot | null, error: ErrorRoot | null }> {
    try {
        // var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentLeaveRoot>(() => `/api/v1/admin/student/admin_student_leave.AdminStudentLeaveHandler/GetListRequests?limit=${limit}&page=${page}&search=${search}&studyProgramId=${requestBody.studyProgramId}&isApproved=${requestBody.isApproved}`, <any>{
            method: 'GET'
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
        }
        return { response: data.value, error: null };
    } catch (error) {
        return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
    }
}