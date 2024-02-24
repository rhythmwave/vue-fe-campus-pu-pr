import { ErrorRoot } from "~~/types/api/error";
import { DeleteLecturerClassExamRequest, DeleteLecturerClassExamRoot } from "~~/types/api/lecturer-class-exam/DeleteLecturerClassExam";

export async function deleteLecturerClassExam(body: string[])
    : Promise<{ response: DeleteLecturerClassExamRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign([], body)
        const { data: data, pending, refresh, error } = await useAPIFetch<DeleteLecturerClassExamRoot>(() => `/api/v1/lecturer/lecturer_class_exam.LecturerClassExamHandler/Delete`, <any>{
            method: 'DELETE',
            body: {
                ids: req
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