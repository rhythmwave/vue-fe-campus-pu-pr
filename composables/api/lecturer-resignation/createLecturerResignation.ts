import { ErrorRoot } from "~~/types/api/error";
import { CreateLecturerResignationRequest, CreateLecturerResignationRoot } from "~~/types/api/lecturer-resignation/CreateLecturerResignation";

export async function createLecturerResignation(body: CreateLecturerResignationRequest)
    : Promise<{ response: CreateLecturerResignationRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateLecturerResignationRoot>(() => `/api/v1/admin/lecturer/admin_lecturer_resignation.AdminLecturerResignationHandler/Create`, <any>{
            method: 'POST',
            body: {
                lecturer_id: req.lecturer_id,
                semester_id: req.semester_id,
                resign_date: req.resign_date,
                resignation_number: req.resignation_number,
                purpose: req.purpose,
                remarks: req.remarks,
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