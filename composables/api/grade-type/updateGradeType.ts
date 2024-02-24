import { ErrorRoot } from "~~/types/api/error";
import { UpdateGradeTypeRequest, UpdateGradeTypeRoot } from "~~/types/api/grade-type/UpdateGradeType";

export async function updateGradeType(body: UpdateGradeTypeRequest)
    : Promise<{ response: UpdateGradeTypeRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateGradeTypeRoot>(() => `/api/v1/admin/grade_type/admin_grade_type.AdminGradeTypeHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
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