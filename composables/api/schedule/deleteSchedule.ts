import { ErrorRoot } from "~~/types/api/error";
import { ResponseInsertSchedule } from "~~/types/api/schedule/ResponseInsertSchedule";

export async function deleteSchedule(id: string)
    : Promise<{ response: ResponseInsertSchedule | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<ResponseInsertSchedule>(() => `/api/v1/admin/schedule/admin_schedule.AdminScheduleHandler/Delete`, <any>{
            method: 'DELETE',
            body: {
                id: id
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