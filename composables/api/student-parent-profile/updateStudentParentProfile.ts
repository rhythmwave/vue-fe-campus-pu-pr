import { ErrorRoot } from "~~/types/api/error";
import { UpdateStudentParentProfileRequest, UpdateStudentParentProfileRoot } from "~~/types/api/student-parent-profile/UpdateStudentParentProfile";

export async function updateStudentParentProfile(body: UpdateStudentParentProfileRequest)
    : Promise<{ response: UpdateStudentParentProfileRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateStudentParentProfileRoot>(() => `/api/v1/student/student_general.StudentGeneralHandler/UpdateParentProfile`, <any>{
            method: 'PATCH',
            body: {

                father_id_number: req.father_id_number,
                father_name: req.father_name,
                father_birth_date: req.father_birth_date,
                father_death_date: req.father_death_date,
                father_final_academic_background: req.father_final_academic_background,
                father_occupation: req.father_occupation,
                mother_id_number: req.mother_id_number,
                mother_name: req.mother_name,
                mother_birth_date: req.mother_birth_date,
                mother_death_date: req.mother_death_date,
                mother_final_academic_background: req.mother_final_academic_background,
                mother_occupation: req.mother_occupation,
                parent_religion: req.parent_religion,
                parent_nationality: req.parent_nationality,
                parent_address: req.parent_address,
                father_work_address: req.father_work_address,
                parent_regency_id: Number(req.parent_regency_id),
                parent_postal_code: req.parent_postal_code,
                parent_phone_number: req.parent_phone_number,
                parent_email: req.parent_email,
                is_financially_capable: req.is_financially_capable,
                parent_income: Number(req.parent_income),
                total_dependent: Number(req.total_dependent),
                guardian_name: req.guardian_name,
                guardian_birth_date: req.guardian_birth_date,
                guardian_death_date: req.guardian_death_date,
                guardian_address: req.guardian_address,
                guardian_regency_id: Number(req.guardian_regency_id),
                guardian_postal_code: req.guardian_postal_code,
                guardian_phone_number: req.guardian_phone_number,
                guardian_email: req.guardian_email,
                guardian_final_academic_background: req.guardian_final_academic_background,
                guardian_occupation: req.guardian_occupation,
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