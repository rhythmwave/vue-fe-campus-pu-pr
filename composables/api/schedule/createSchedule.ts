import { ErrorRoot } from "~~/types/api/error";
import { CreateScheduleRequest } from "~~/types/api/schedule/CreateScheduleRequest";
import { ResponseInsertSchedule } from "~~/types/api/schedule/ResponseInsertSchedule";

export async function createSchedule(body: CreateScheduleRequest)
    : Promise<{ response: ResponseInsertSchedule | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<ResponseInsertSchedule>(() => `/api/v1/admin/student_class/admin_lecture.AdminLectureHandler/BulkCreate`, <any>{
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