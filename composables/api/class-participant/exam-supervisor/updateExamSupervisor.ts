import { ErrorRoot } from "~~/types/api/error";
import { UpdateExamSupervisor, UpdateExamSupervisorRoot } from "~~/types/api/class-participant/UpdateExamSupervisor";
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';

export async function updateExamSupervisor(body: UpdateExamSupervisor)
    : Promise<{ response: UpdateExamSupervisorRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        console.log(req.birth_date)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateExamSupervisorRoot>(() => `/api/v1/admin/student_class/admin_exam_supervisor.AdminExamSupervisorHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                id_national_lecturer: req.id_national_lecturer,
                name: req.name,
                front_title: req.front_title,
                back_degree: req.back_degree,
                study_program_id: req.study_program_id,
                id_number: req.id_number,
                birth_date: req.birth_date ? convertDateWithoutTimeToTimezoned(req.birth_date) : '',
                birth_regency_id: Number(req.birth_regency_id),
                sex: req.sex,
                blood_type: req.blood_type,
                religion: req.religion,
                marital_status: req.marital_status,
                address: req.address,
                regency_id: Number(req.regency_id),
                postal_code: req.postal_code,
                phone_number: req.phone_number,
                fax: req.fax,
                mobile_phone_number: req.mobile_phone_number,
                office_phone_number: req.office_phone_number,
                employee_type: req.employee_type,
                employee_status: req.employee_status,
                sk_cpns_number: req.sk_cpns_number,
                sk_cpns_date: req.sk_cpns_date ? convertDateWithoutTimeToTimezoned(req.sk_cpns_date) : '',
                tmt_cpns_date: req.tmt_cpns_date ? convertDateWithoutTimeToTimezoned(req.tmt_cpns_date) : '',
                cpns_category: req.cpns_category,
                cpns_duration_month: Number(req.cpns_duration_month),
                pre_position_date: req.pre_position_date ? convertDateWithoutTimeToTimezoned(req.pre_position_date) : '',
                sk_pns_number: req.sk_pns_number,
                sk_pns_date: req.sk_pns_date ? convertDateWithoutTimeToTimezoned(req.sk_pns_date) : '',
                tmt_pns_date: req.tmt_pns_date ? convertDateWithoutTimeToTimezoned(req.tmt_pns_date) : '',
                pns_category: req.pns_category,
                pns_oath_date: req.pns_oath_date ? convertDateWithoutTimeToTimezoned(req.pns_oath_date) : '',
                join_date: req.join_date ? convertDateWithoutTimeToTimezoned(req.join_date) : '',
                end_date: req.end_date ? convertDateWithoutTimeToTimezoned(req.end_date) : '',
                taspen_number: req.taspen_number,
                former_instance: req.former_instance,
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