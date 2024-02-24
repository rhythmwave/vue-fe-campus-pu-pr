import { ErrorRoot } from "~~/types/api/error";
import { CreateStudentClassDiscussionCommentRequest, CreateStudentClassDiscussionCommentRoot } from "~~/types/api/student-class-discussion/CreateStudentClassDiscussionComment";

export async function createStudentClassDiscussionComment(body: CreateStudentClassDiscussionCommentRequest)
    : Promise<{ response: CreateStudentClassDiscussionCommentRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateStudentClassDiscussionCommentRoot>(() => `/api/v1/student/student_class_discussion.StudentClassDiscussionHandler/CreateComment`, <any>{
            method: 'POST',
            body: {
                class_discussion_id: req.class_discussion_id,
                comment: req.comment,
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