import { ErrorRoot } from "~~/types/api/error";
import { GetStudentClassDiscussionListRoot } from "~~/types/api/student-class-discussion/GetStudentClassDiscussionList";

export async function getStudentClassDiscussionList(limit: number, page: number, classId: string)
    : Promise<{ response: GetStudentClassDiscussionListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentClassDiscussionListRoot>(() => `/api/v1/student/student_class_discussion.StudentClassDiscussionHandler/GetList?limit=${limit}&page=${page}&classId=${classId}`, <any>{
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