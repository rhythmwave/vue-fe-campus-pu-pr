import { ErrorRoot } from "~~/types/api/error";
import { CreateLecturerClassDiscussionCommentRequest, CreateLecturerClassDiscussionCommentRoot } from "~~/types/api/lecturer-class-discussion/CreateLecturerClassDiscussionComment";

export async function createLecturerClassDiscussionComment(body: CreateLecturerClassDiscussionCommentRequest)
    : Promise<{ response: CreateLecturerClassDiscussionCommentRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateLecturerClassDiscussionCommentRoot>(() => `/api/v1/lecturer/lecturer_class_discussion.LecturerClassDiscussionHandler/CreateComment`, <any>{
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