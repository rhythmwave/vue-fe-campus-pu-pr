import { ErrorRoot } from "~~/types/api/error";
import { DeleteLecturerStudyProgramRequest, DeleteLecturerStudyProgramRoot } from "~~/types/api/lecturer-study-program/DeleteLecturerStudyProgram";

export async function deleteLecturerStudyProgram(body: DeleteLecturerStudyProgramRequest)
    : Promise<{ response: DeleteLecturerStudyProgramRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<DeleteLecturerStudyProgramRoot>(() => `api/v1/admin/lecturer-study-program/lecturerStudyProgram.LecturerStudyProgramHandler/Delete`, <any>{
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