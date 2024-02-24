import { ErrorRoot } from "~~/types/api/error";
import { GetReportGpaDistributionListRequest, GetReportGpaDistributionListRoot } from "~~/types/api/report/GetReportGpaDistributionList";

export async function getReportGpaDistributionList(request: GetReportGpaDistributionListRequest)
    : Promise<{ response: GetReportGpaDistributionListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetReportGpaDistributionListRoot>(() => `/api/v1/admin/report/admin_report.AdminReportHandler/GpaDistribution?studyProgramId=${request.study_program_id}&graduationYearFrom=${request.graduation_year_from}&graduationYearTo=${request.graduation_year_to}`, <any>{
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