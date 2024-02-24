import { ErrorRoot } from "~~/types/api/error";
import { UpdateLaboratoryRequest, UpdateLaboratoryRoot } from "~~/types/api/laboratory/UpdateLaboratory";

export async function updateLaboratory(body: UpdateLaboratoryRequest)
    : Promise<{ response: UpdateLaboratoryRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateLaboratoryRoot>(() => `/api/v1/admin/space/admin_room.AdminRoomHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                code: req.code,
                name: req.name,
                capacity: req.capacity,
                exam_capacity: req.exam_capacity,
                purpose: req.purpose,
                is_usable: req.is_usable,
                area: req.area,
                phone_number: req.phone_number,
                facility: req.facility,
                remarks: req.remarks,
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