import { ErrorRoot } from "~~/types/api/error";
import { GetReportStudentSchoolProvinceListRoot } from "~~/types/api/report/GetReportStudentSchoolProvinceList";

export async function getReportStudentSchoolProvinceList(studyProgramId: string,studentForceFrom:any,studentForceTo:any,)
    : Promise<{ response: GetReportStudentSchoolProvinceListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetReportStudentSchoolProvinceListRoot>(() => `/api/v1/admin/report/admin_report.AdminReportHandler/StudentSchoolProvince?studyProgramId=${studyProgramId}&studentForceFrom=${studentForceFrom}&studentForceTo=${studentForceTo}`, <any>{
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