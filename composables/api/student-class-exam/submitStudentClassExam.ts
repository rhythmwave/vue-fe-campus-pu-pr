import { ErrorRoot } from "~~/types/api/error";
import { SubmitStudentClassExamRequest, SubmitStudentClassExamRoot } from "~~/types/api/student-class-exam/SubmitStudentClassExam";

export async function submitStudentClassExam(body: SubmitStudentClassExamRequest)
    : Promise<{ response: SubmitStudentClassExamRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<SubmitStudentClassExamRoot>(() => `/api/v1/student/student_class_exam.StudentClassExamHandler/Submit`, <any>{
            method: 'POST',
            body: {
                class_exam_id: req.class_exam_id,
                file_path: req.file_path,
                file_path_type: req.file_path_type,
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