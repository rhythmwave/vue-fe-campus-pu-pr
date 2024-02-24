import { ErrorRoot } from "~~/types/api/error";
import { CreateLecturerMutationRequest, CreateLecturerMutationRoot } from "~~/types/api/lecturer-mutation/CreateLecturerMutation";

export async function createLecturerMutation(body: CreateLecturerMutationRequest)
    : Promise<{ response: CreateLecturerMutationRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateLecturerMutationRoot>(() => `/api/v1/admin/lecturer/admin_lecturer_mutation.AdminLecturerMutationHandler/Create`, <any>{
            method: 'POST',
            body: {
                lecturer_id: req.lecturer_id,
                semester_id: req.semester_id,
                mutation_date: req.mutation_date,
                decision_number: req.decision_number,
                destination: req.destination,
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