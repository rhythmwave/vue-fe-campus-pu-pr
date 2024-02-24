import { ErrorRoot } from "~~/types/api/error";
import { GetClassroomListDataRoot } from "~~/types/api/classroom/GetClassroomList";

export async function copyClassroom(from_semester_id: string, to_semester_id: string)
    : Promise<{ response: GetClassroomListDataRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetClassroomListDataRoot>(() => `/api/v1/admin/schedule/admin_class.AdminClassHandler/Duplicate`, <any>{
            method: 'POST',
            body: {
                from_semester_id: from_semester_id,
                to_semester_id: to_semester_id,
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
        }
        return { response: data.value, error: null };
    } catch (error) {
        return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
    }
}