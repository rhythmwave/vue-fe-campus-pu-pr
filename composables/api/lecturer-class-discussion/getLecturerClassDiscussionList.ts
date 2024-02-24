import { ErrorRoot } from "~~/types/api/error";
import { GetLecturerClassDiscussionListRoot } from "~~/types/api/lecturer-class-discussion/GetLecturerClassDiscussionList";

export async function getLecturerClassDiscussionList(limit: number, page: number, searchText: string, classId:string)
    : Promise<{ response: GetLecturerClassDiscussionListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLecturerClassDiscussionListRoot>(() => `/api/v1/lecturer/lecturer_class_discussion.LecturerClassDiscussionHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&classId=${classId}`, <any>{
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