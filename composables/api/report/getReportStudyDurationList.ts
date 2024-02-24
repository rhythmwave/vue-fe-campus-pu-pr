import { ErrorRoot } from "~~/types/api/error";
import { GetReportStudyDurationListRequest, GetReportStudyDurationListRoot } from "~~/types/api/report/GetReportStudyDurationList";

export async function getReportStudyDurationList(request: GetReportStudyDurationListRequest)
    : Promise<{ response: GetReportStudyDurationListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetReportStudyDurationListRoot>(() => `/api/v1/admin/report/admin_report.AdminReportHandler/StudyDurationDistribution?studyProgramId=${request.study_program_id}&graduationYearFrom=${request.graduation_year_from}&graduationYearTo=${request.graduation_year_to}`, <any>{
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