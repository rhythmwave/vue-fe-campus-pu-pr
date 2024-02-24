import { ErrorRoot } from "~~/types/api/error";
import { CreateStudentThesisRequest, CreateStudentThesisRoot } from "~~/types/api/student-thesis/CreateStudentThesis";

export async function createStudentThesis(body: CreateStudentThesisRequest)
    : Promise<{ response: CreateStudentThesisRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateStudentThesisRoot>(() => `/api/v1/student/student_thesis.StudentThesisHandler/Create`, <any>{
            method: 'POST',
            body: {
                topic: req.topic,
                title: req.title,
                english_title: req.english_title,
                remarks: req.remarks,
                is_joint_thesis: req.is_joint_thesis,
                file_path: req.file_path,
                file_path_type: req.file_path_type,
                file_description: req.file_description,
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