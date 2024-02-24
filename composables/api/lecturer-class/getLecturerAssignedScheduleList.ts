import { ErrorRoot } from "~~/types/api/error";
import {  GetLecturerAssignedScheduleListRoot } from "~~/types/api/lecturer-class/GetLecturerAssignedScheduleList";

export async function getLecturerAssignedScheduleList(classId: string)
    : Promise<{ response: GetLecturerAssignedScheduleListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLecturerAssignedScheduleListRoot>(() => `api/v1/lecturer/lecturer_class.LecturerClassHandler/GetAssignedSchedule?classId=${classId}`, <any>{
            method: 'GET',
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