import { ErrorRoot } from "~~/types/api/error";
import { GetReportStudentClassGradeListRoot } from "~~/types/api/report/GetReportStudentClassGradeList";

export async function getReportStudentClassGradeList(semesterId: string, studyProgramId: string)
    : Promise<{ response: GetReportStudentClassGradeListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetReportStudentClassGradeListRoot>(() => `/api/v1/admin/report/admin_report.AdminReportHandler/StudentClassGrade?semesterId=${semesterId}&studyProgramId=${studyProgramId}`, <any>{
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