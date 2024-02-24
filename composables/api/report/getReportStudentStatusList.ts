import { ErrorRoot } from "~~/types/api/error";
import { GetReportStudentStatusListRoot } from "~~/types/api/report/GetReportStudentStatusList";

export async function getReportStudentStatusList(semesterId: string)
    : Promise<{ response: GetReportStudentStatusListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetReportStudentStatusListRoot>(() => `/api/v1/admin/report/admin_report.AdminReportHandler/StudentStatus?semesterId=${semesterId}`, <any>{
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