import { ErrorRoot } from "~~/types/api/error";
import { CreateClassroomRequest } from "~~/types/api/classroom/CreateClassroomRequest";
import { ResponseInsertClassroom } from "~~/types/api/classroom/ResponseInsertClassroom";

export async function deleteClassroom(id: string)
    : Promise<{ response: ResponseInsertClassroom | null, error: ErrorRoot | null }> {
    try {
        // var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<ResponseInsertClassroom>(() => `/api/v1/admin/schedule/admin_class.AdminClassHandler/Delete`, <any>{
            method: 'DELETE',
            body: {
                id: id,
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