import { ErrorRoot } from "~~/types/api/error";
import { UpdateLecturerClassDiscussionRequest, UpdateLecturerClassDiscussionRoot } from "~~/types/api/lecturer-class-discussion/UpdateLecturerClassDiscussion";

export async function updateLecturerClassDiscussion(body: UpdateLecturerClassDiscussionRequest)
    : Promise<{ response: UpdateLecturerClassDiscussionRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateLecturerClassDiscussionRoot>(() => `/api/v1/lecturer/lecturer_class_discussion.LecturerClassDiscussionHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
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