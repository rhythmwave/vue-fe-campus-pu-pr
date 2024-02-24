import { ErrorRoot } from "~~/types/api/error";
import { UpdateLecturerLeaveRequest, UpdateLecturerLeaveRoot } from "~~/types/api/lecturer-leave/UpdateLecturerLeave";

export async function updateLecturerLeave(body: UpdateLecturerLeaveRequest)
    : Promise<{ response: UpdateLecturerLeaveRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateLecturerLeaveRoot>(() => `/api/v1/admin/lecturer/admin_lecturer_leave.AdminLecturerLeaveHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                permit_number: req.permit_number,
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