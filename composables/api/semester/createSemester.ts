import { ErrorRoot } from "~~/types/api/error";
import { CreateSemesterRequest, CreateSemesterRoot, Curriculum } from "~~/types/api/semester/CreateSemester";

export async function createSemester(body: CreateSemesterRequest)
    : Promise<{ response: CreateSemesterRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateSemesterRoot>(() => `/api/v1/admin/semester/admin_semester.AdminSemesterHandler/Create`, <any>{
            method: 'POST',
            body: {
                semester_start_year: Number(req.semester_start_year), //number
                semester_type: req.semester_type, //string
                start_date: req.start_date, //string
                end_date: req.end_date, //string
                study_plan_input_start_date: req.study_plan_input_start_date, //string
                study_plan_input_end_date: req.study_plan_input_end_date, //string
                study_plan_approval_start_date: req.study_plan_approval_start_date, //string
                study_plan_approval_end_date: req.study_plan_approval_end_date, //string
                reference_semester_id: req.reference_semester_id, //string
                check_minimum_gpa: req.check_minimum_gpa, //boolean
                check_passed_credit: req.check_passed_credit, //boolean
                default_credit: Number(req.default_credit), //number
                midterm_start_date: req.midterm_start_date,
                midterm_end_date: req.midterm_end_date,
                endterm_start_date: req.endterm_start_date,
                endterm_end_date: req.endterm_end_date,
                grading_start_date: req.grading_start_date,
                grading_end_date: req.grading_end_date,
                curriculums: req.curriculums, //Curriculum[]

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