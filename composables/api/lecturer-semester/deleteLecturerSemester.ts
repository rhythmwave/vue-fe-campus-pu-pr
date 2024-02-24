import { ErrorRoot } from "~~/types/api/error";
import { DeleteLecturerSemesterRequest, DeleteLecturerSemesterRoot } from "~~/types/api/lecturer-semester/DeleteLecturerSemester";

export async function deleteLecturerSemester(body: DeleteLecturerSemesterRequest)
    : Promise<{ response: DeleteLecturerSemesterRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<DeleteLecturerSemesterRoot>(() => `api/v1/admin/lecturer-semester/lecturerSemester.LecturerSemesterHandler/Delete`, <any>{
            method: 'DELETE',
            body: {
                id: req.id
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