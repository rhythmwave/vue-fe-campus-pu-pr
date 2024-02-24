import { ErrorRoot } from "~~/types/api/error";
import { CreateLaboratoryRequest, CreateLaboratoryRoot } from "~~/types/api/laboratory/CreateLaboratory";

export async function createLaboratory(body: CreateLaboratoryRequest)
    : Promise<{ response: CreateLaboratoryRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateLaboratoryRoot>(() => `/api/v1/admin/space/admin_room.AdminRoomHandler/Create`, <any>{
            method: 'POST',
            body: {
                building_id: req.building_id,
                code: req.code,
                name: req.name,
                capacity: req.capacity,
                exam_capacity: req.exam_capacity,
                is_usable: req.is_usable,
                area: req.area,
                phone_number: req.phone_number,
                facility: req.facility,
                remarks: req.remarks,
                purpose: req.purpose,
                owner: req.owner,
                location: req.location,
                study_program_id: req.study_program_id,
                is_laboratory: true
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