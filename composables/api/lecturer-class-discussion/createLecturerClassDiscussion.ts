import { ErrorRoot } from "~~/types/api/error";
import { CreateLecturerClassDiscussionRequest, CreateLecturerClassDiscussionRoot } from "~~/types/api/lecturer-class-discussion/CreateLecturerClassDiscussion";

export async function createLecturerClassDiscussion(body: CreateLecturerClassDiscussionRequest)
    : Promise<{ response: CreateLecturerClassDiscussionRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateLecturerClassDiscussionRoot>(() => `/api/v1/lecturer/lecturer_class_discussion.LecturerClassDiscussionHandler/Create`, <any>{
            method: 'POST',
            body: {
                class_id: req.class_id,
                title: req.title,
                abstraction: req.abstraction,
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