import { ErrorRoot } from "~~/types/api/error";
import { GetLecturerLeaveListRoot } from "~~/types/api/lecturer-leave/GetLecturerLeaveList";

export async function getLecturerLeaveList(limit: number, page: number, searchText: string, idNationalLecturer: string, studyProgramId: string, semesterId: string, isActive: boolean)
    : Promise<{ response: GetLecturerLeaveListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLecturerLeaveListRoot>(() => `/api/v1/admin/admin_lecturer_leave.AdminLecturerLeaveHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&idNationalLecturer=${idNationalLecturer}&studyProgramId=${studyProgramId}&semesterId=${semesterId}&isActive=${isActive}`, <any>{
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