import { ErrorRoot } from "~~/types/api/error";
import { GetYudiciumStudentListRequest, GetYudiciumStudentListRoot } from "~~/types/api/yudicium/GetYudiciumStudentList";

export async function getYudiciumStudentList(limit: number, page: number, req: GetYudiciumStudentListRequest)
    : Promise<{ response: GetYudiciumStudentListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetYudiciumStudentListRoot>(() => `/api/v1/admin/graduation/admin_yudicium.AdminYudiciumHandler/GetListStudent?limit=${limit}&page=${page}&search=${req.name}&studyProgramId=${req.studyProgramId}&nimNumberFrom=${req.nimNumberFrom}&nimNumberTo=${req.nimNumberTo}&studentForceFrom=${req.studentForceFrom}&studentForceTo=${req.studentForceTo}&semesterId=${req.semesterId}`, <any>{
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