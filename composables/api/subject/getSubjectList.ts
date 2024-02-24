import { ErrorRoot } from "~~/types/api/error";
import { GetSubjectListRoot } from "~~/types/api/subject/GetSubjectList";

export async function getSubjectList(limit: number, page: number, searchText: string, curiculumIds: string[], prerequisiteOfSubjectId: string, equivalentToCurriculumId: string, semesterPackage: any, classSemesterId: any, isThesis: any, isMbkm: any)
    : Promise<{ response: GetSubjectListRoot | null, error: ErrorRoot | null }> {
    let curiculums = '';
    if (curiculumIds) {
        if (curiculumIds.length != 0) {
            curiculums = '';
            curiculumIds.forEach((c: string) => {
                curiculums += ("&curriculumId=" + c)
            })
        }
    }
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetSubjectListRoot>(() => `/api/v1/admin/admin_subject.AdminSubjectHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&prerequisiteOfSubjectId=${prerequisiteOfSubjectId}&equivalentToCurriculumId=${equivalentToCurriculumId}&curriculumId=${curiculums}&semesterPackage=${semesterPackage}&classSemesterId=${classSemesterId}&isThesis=${isThesis}&isMbkm=${isMbkm}`, <any>{
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