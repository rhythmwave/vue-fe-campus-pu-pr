import { ErrorRoot } from "~~/types/api/error";
import { CreateGradeTypeRequest, CreateGradeTypeRoot } from "~~/types/api/grade-type/CreateGradeType";

export async function createGradeType(body: CreateGradeTypeRequest)
    : Promise<{ response: CreateGradeTypeRoot | null, error: ErrorRoot | null }> {
        var req = Object.assign({}, body)
    try {
        console.log("JSON.stringify(body)")
        console.log(JSON.stringify({
            code: req.code,
            end_date: req.end_date,
            english_label: req.english_label,
            grade_category: req.grade_category,
            grade_point:  Number(req.grade_point),
            grade_point_category: Number(req.grade_point_category),
            label: req.label,
            maximum_grade: Number(req.maximum_grade),
            minimum_grade: Number(req.minimum_grade),
            start_date: req.start_date,
            study_level_id: req.study_level_id,

        }))
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateGradeTypeRoot>(() => `/api/v1/admin/grade_type/admin_grade_type.AdminGradeTypeHandler/Create`, <any>{
            method: 'POST',
            body: {
                code: req.code,
                end_date: req.end_date,
                english_label: req.english_label,
                grade_category: req.grade_category,
                grade_point: Number(req.grade_point),
                grade_point_category: Number(req.grade_point_category),
                label: req.label,
                maximum_grade: Number(req.maximum_grade),
                minimum_grade: Number(req.minimum_grade),
                start_date: req.start_date,
                study_level_id: req.study_level_id,

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