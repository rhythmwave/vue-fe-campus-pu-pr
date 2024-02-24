import { ErrorRoot } from "~~/types/api/error";
import { UpdateStudentStatusRequest, UpdateStudentStatusRoot } from "~~/types/api/student/UpdateStudentStatus";
import { convertDateWithoutTimeToTimezoned } from "~~/utils/helpers/date-utils"

export async function updateStudentStatus(body: UpdateStudentStatusRequest)
    : Promise<{ response: UpdateStudentStatusRoot | null, error: ErrorRoot | null }> {
    try {
        let req = <UpdateStudentStatusRequest>{
            student_ids: body.student_ids,
            status: body.status,
            status_date: body.status_date ? convertDateWithoutTimeToTimezoned(body.status_date) : '',
            status_reference_number: body.status_reference_number,
            status_purpose: body.status_purpose,
            status_remarks: body.status_remarks,
        }
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateStudentStatusRoot>(() => `/api/v1/admin/student/admin_student.AdminStudentHandler/BulkUpdateStatus`, <any>{
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