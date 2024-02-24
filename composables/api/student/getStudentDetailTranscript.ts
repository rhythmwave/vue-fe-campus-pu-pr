import { ErrorRoot } from "~~/types/api/error";
import { GetStudentTranscriptRoot } from "~~/types/api/student/GetStudentTranscript";

export async function getStudentTranscript(studentId: string)
    : Promise<{ response: GetStudentTranscriptRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentTranscriptRoot>(() => `/api/v1/admin/transcript/admin_transcript.AdminTranscriptHandler/GetDetail?studentId=${studentId}`, <any>{
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