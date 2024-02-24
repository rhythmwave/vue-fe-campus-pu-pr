import { ErrorRoot } from "~~/types/api/error";
import { CreateCuriculumRequest, CreateCuriculumRoot } from "~~/types/api/curiculum/CreateCuriculum";

export async function createCuriculum(body: CreateCuriculumRequest)
    : Promise<{ response: CreateCuriculumRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateCuriculumRoot>(() => `/api/v1/admin/curriculum/admin_curriculum.AdminCurriculumHandler/Create`, <any>{
            method: 'POST',
            body: {
                study_program_id: req.study_program_id,
                name: req.name,
                year: req.year,
                rector_decision_number: req.rector_decision_number,
                rector_decision_date: req.rector_decision_date,
                aggreeing_party: req.aggreeing_party,
                aggreement_date: req.aggreement_date,
                ideal_study_period: req.ideal_study_period,
                maximum_study_period: req.maximum_study_period,
                remarks: req.remarks,
                is_active: req.is_active,
                final_score_determinant: req.final_score_determinant,
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