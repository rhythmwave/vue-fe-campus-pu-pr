import { ErrorRoot } from "~~/types/api/error";
import { GetLecturerAcademicGuidanceListRoot } from "~~/types/api/lecturer-academic-guidance/GetLecturerAcademicGuidanceList";

export async function getLecturerAcademicGuidanceList(semesterId: string)
    : Promise<{ response: GetLecturerAcademicGuidanceListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLecturerAcademicGuidanceListRoot>(() => `/api/v1/lecturer/lecturer_academic_guidance.LecturerAcademicGuidanceHandler/GetSessionList?semesterId=${semesterId}`, <any>{
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