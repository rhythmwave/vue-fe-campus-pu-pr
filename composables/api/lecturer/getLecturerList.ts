import { ErrorRoot } from "~~/types/api/error";
import { GetLecturerListRoot } from "~~/types/api/lecturer/GetLecturerList";

export async function getLecturerList(limit: number, page: number, searchText: string, studyProgramId: any, idNationalLecturer: any, employmentStatus: any, academicGuidanceSemesterId:any, hasAuthentication: any, classId: any, excludeLectureDate: any, excludeStartTIme: any, excludeEndTime: any)
    : Promise<{ response: GetLecturerListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLecturerListRoot>(() => `/api/v1/admin/admin_lecturer.AdminLecturerHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&idNationalLecturer=${idNationalLecturer}&studyProgramId=${studyProgramId}&employmentStatus=${employmentStatus}&academicGuidanceSemesterId=${academicGuidanceSemesterId}&hasAuthentication=${hasAuthentication}&classId=${classId}&excludeLectureDate=${excludeLectureDate}&excludeStartTIme=${excludeStartTIme}&excludeEndTime=${excludeEndTime}`, <any>{
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