import { ErrorRoot } from "~~/types/api/error";
import { SubmitStudentClassWorkRequest, SubmitStudentClassWorkRoot } from "~~/types/api/student-class-work/SubmitStudentClassWork";

export async function submitStudentClassWork(body: SubmitStudentClassWorkRequest)
    : Promise<{ response: SubmitStudentClassWorkRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<SubmitStudentClassWorkRoot>(() => `/api/v1/student/student_class_work.StudentClassWorkHandler/Submit`, <any>{
            method: 'POST',
            body: {
                class_work_id: body.class_work_id,
                file_path: body.file_path,
                file_path_type: body.file_path_type,
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