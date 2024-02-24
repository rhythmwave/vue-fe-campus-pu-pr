import { ErrorRoot } from "~~/types/api/error";
import { UpdateAdminStudyProgramDegreeRequest, UpdateAdminStudyProgramDegreeRoot } from "~~/types/api/admin-study-program/UpdateAdminStudyProgramDegree";

export async function updateAdminStudyProgramDegree(body: UpdateAdminStudyProgramDegreeRequest)
    : Promise<{ response: UpdateAdminStudyProgramDegreeRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateAdminStudyProgramDegreeRoot>(() => `/api/v1/admin/graduation/admin_study_program.AdminStudyProgramHandler/UpdateDegree`, <any>{
            method: 'PATCH',
            body: {
                study_program_id: req.study_program_id,
                degree: req.degree,
                short_degree: req.short_degree,
                english_degree: req.english_degree,
            },
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