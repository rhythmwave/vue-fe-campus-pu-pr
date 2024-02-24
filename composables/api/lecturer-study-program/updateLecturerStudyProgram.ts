import { ErrorRoot } from "~~/types/api/error";
import { UpdateLecturerStudyProgramRequest, UpdateLecturerStudyProgramRoot } from "~~/types/api/lecturer-study-program/UpdateLecturerStudyProgram";

export async function updateLecturerStudyProgram(body: UpdateLecturerStudyProgramRequest)
    : Promise<{ response: UpdateLecturerStudyProgramRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateLecturerStudyProgramRoot>(() => `api/v1/admin/lecturer-study-program/lecturerStudyProgram.LecturerStudyProgramHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                name: req.name,
                age: Number(req.age)
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