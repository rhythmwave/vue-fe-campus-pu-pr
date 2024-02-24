import { ErrorRoot } from "~~/types/api/error";
import { GetStudentAcademicGuidanceSessionListRoot } from "~~/types/api/student-academic-guidance/GetStudentAcademicGuidanceSessionList";

export async function getStudentAcademicGuidanceSessionList(academicGuidanceId: string)
    : Promise<{ response: GetStudentAcademicGuidanceSessionListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentAcademicGuidanceSessionListRoot>(() => `/api/v1/student/student_academic_guidance.StudentAcademicGuidanceHandler/GetSessionList?academicGuidanceId=${academicGuidanceId}`, <any>{
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