import { ErrorRoot } from "~~/types/api/error";
import { GetLecturerClassWorkSubmissionRoot } from "~~/types/api/lecturer-class-work/GetLecturerClassWorkSubmission";

export async function getLecturerClassWorkSubmissionList(limit: number, page: number, searchText: string, classWorkId: string)
    : Promise<{ response: GetLecturerClassWorkSubmissionRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLecturerClassWorkSubmissionRoot>(() => `/api/v1/lecturer/lecturer_class_work.LecturerClassWorkHandler/GetSubmission?limit=${limit}&page=${page}&search=${searchText}&classWorkId=${classWorkId}`, <any>{
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