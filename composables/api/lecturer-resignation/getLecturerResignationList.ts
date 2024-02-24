import { ErrorRoot } from "~~/types/api/error";
import { GetLecturerResignationListRoot } from "~~/types/api/lecturer-resignation/GetLecturerResignationList";

export async function getLecturerResignationList(limit: number, page: number, searchText: string, studyProgramId: string, idNationalLecturer: string, semesterId: string)
    : Promise<{ response: GetLecturerResignationListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLecturerResignationListRoot>(() => `/api/v1/admin/admin_lecturer_resignation.AdminLecturerResignationHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&idNationalLecturer=${idNationalLecturer}&studyProgramId=${studyProgramId}&semesterId=${semesterId}`, <any>{
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