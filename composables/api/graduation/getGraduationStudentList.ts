import { ErrorRoot } from "~~/types/api/error";
import { GetGraduationStudentListRequest, GetGraduationStudentListRoot } from "~~/types/api/graduation/GetGraduationStudentList";

export async function getGraduationStudentList(limit: number, page: number, req: GetGraduationStudentListRequest)
    : Promise<{ response: GetGraduationStudentListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetGraduationStudentListRoot>(() => `/api/v1/admin/graduation/admin_graduation.AdminGraduationHandler/GetListStudent?limit=${limit}&page=${page}&studyProgramId=${req.studyProgramId}&graduationSessionId=${req.graduationSessionId}`, <any>{
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