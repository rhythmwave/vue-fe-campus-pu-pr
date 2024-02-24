import { ErrorRoot } from "~~/types/api/error";
import { GetLecturerAcademicGuidanceStudentListRoot } from "~~/types/api/lecturer-academic-guidance/GetLecturerAcademicGuidanceStudentList";

export async function getLecturerAcademicGuidanceStudentList(limit: number, page: number, searchText: string, semesterId: string)
    : Promise<{ response: GetLecturerAcademicGuidanceStudentListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLecturerAcademicGuidanceStudentListRoot>(() => `/api/v1/lecturer/lecturer_academic_guidance.LecturerAcademicGuidanceHandler/GetListStudent?limit=${limit}&page=${page}&search=${searchText}&semesterId=${semesterId}`, <any>{
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