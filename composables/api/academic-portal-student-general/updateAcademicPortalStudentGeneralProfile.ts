import { UpdateAcademicPortalStudentGeneralProfileRequest, UpdateAcademicPortalStudentGeneralProfileRoot } from "~~/types/api/academic-portal-student-general/UpdateAcademicPortalStudentGeneralProfile";
import { ErrorRoot } from "~~/types/api/error";
export async function updateAcademicPortalStudentGeneralProfile(body: UpdateAcademicPortalStudentGeneralProfileRequest)
    : Promise<{ response: UpdateAcademicPortalStudentGeneralProfileRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateAcademicPortalStudentGeneralProfileRoot>(() => `/api/v1/student/student_general.StudentGeneralHandler/UpdateProfile`, <any>{
            method: 'PATCH',
            body: {

                profile_photo_path: req.profile_photo_path,
                profile_photo_path_type: req.profile_photo_path_type,
                sex: req.sex,
                birth_regency_id: req.birth_regency_id,
                blood_type: req.blood_type,
                height: req.height,
                weight: req.weight,
                is_color_blind: req.is_color_blind,
                use_glasses: req.use_glasses,
                has_complete_teeth: req.has_complete_teeth,
                id_number: req.id_number,
                npwp_number: req.npwp_number,
                nisn_number: req.nisn_number,
                religion: req.religion,
                marital_status: req.marital_status,
                nationality: req.nationality,
                village_id: req.village_id,
                rt: req.rt,
                rw: req.rw,
                postal_code: req.postal_code,
                address: req.address,
                phone_number: req.phone_number,
                mobile_phone_number: req.mobile_phone_number,
                email: req.email,
                transportation_mean: req.transportation_mean,
                is_kps_recipient: req.is_kps_recipient,
                fund_source: req.fund_source,
                is_scholarship_grantee: req.is_scholarship_grantee,
                total_brother: req.total_brother,
                total_sister: req.total_sister,
                work_type: req.work_type,
                work_place: req.work_place,
                work_address: req.work_address,
                assurance_number: req.assurance_number,
                hobby: req.hobby,
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