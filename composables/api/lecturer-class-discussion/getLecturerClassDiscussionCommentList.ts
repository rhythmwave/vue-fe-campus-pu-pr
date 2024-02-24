import { ErrorRoot } from "~~/types/api/error";
import { GetLecturerClassDiscussionCommentListRoot } from "~~/types/api/lecturer-class-discussion/GetLecturerClassDiscussionCommentList";

export async function getLecturerClassDiscussionCommentList(limit: number, page: number,  classDiscussionId:string)
    : Promise<{ response: GetLecturerClassDiscussionCommentListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLecturerClassDiscussionCommentListRoot>(() => `/api/v1/lecturer/lecturer_class_discussion.LecturerClassDiscussionHandler/GetComment?limit=${limit}&page=${page}&classDiscussionId=${classDiscussionId}`, <any>{
            method: 'GET',
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