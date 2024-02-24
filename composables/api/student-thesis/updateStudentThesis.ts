import { ErrorRoot } from "~~/types/api/error";
import { UpdateStudentThesisRequest, UpdateStudentThesisRoot } from "~~/types/api/student-thesis/UpdateStudentThesis";

export async function updateStudentThesis(body: UpdateStudentThesisRequest)
    : Promise<{ response: UpdateStudentThesisRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        var reqFiles = <any>[]
        body.files.forEach(f => {
            reqFiles.push(Object.assign({}, f))
        });
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateStudentThesisRoot>(() => `/api/v1/student/student_thesis.StudentThesisHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                topic: req.topic,
                title: req.title,
                english_title: req.english_title,
                remarks: req.remarks,
                is_joint_thesis: req.is_joint_thesis,
                status: req.status,
                files: reqFiles,
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