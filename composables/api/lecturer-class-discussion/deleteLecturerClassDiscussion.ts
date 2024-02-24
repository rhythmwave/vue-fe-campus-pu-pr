import { ErrorRoot } from "~~/types/api/error";
import { DeleteLecturerClassDiscussionRequest, DeleteLecturerClassDiscussionRoot } from "~~/types/api/lecturer-class-discussion/DeleteLecturerClassDiscussion";

export async function deleteLecturerClassDiscussion(body: string)
    : Promise<{ response: DeleteLecturerClassDiscussionRoot | null, error: ErrorRoot | null }> {
    try {
        var req = body
        const { data: data, pending, refresh, error } = await useAPIFetch<DeleteLecturerClassDiscussionRoot>(() => `/api/v1/lecturer/lecturer_class_discussion.LecturerClassDiscussionHandler/Delete`, <any>{
            method: 'DELETE',
            body: {
                id: req
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