import { ErrorRoot } from "~~/types/api/error";
import { GetStudentListRequest, GetStudentListRoot } from "~~/types/api/student/GetStudentList";

export async function getStudentList(limit: number, page: number, requestBody: GetStudentListRequest)
    : Promise<{ response: GetStudentListRoot | null, error: ErrorRoot | null }> {
        let status = <string>''
        if(requestBody.status.length > 0){
            requestBody.status.forEach(function(item, index){
                status += '&status='+item
            })
        }
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentListRoot>(() => `/api/v1/admin/admin_student.AdminStudentHandler/GetList?limit=${limit}&page=${page}&studyProgramId=${requestBody.studyProgramId}&studentForceFrom=${requestBody.studentForceFrom}&studentForceTo=${requestBody.studentForceTo}&nimNumberFrom=${requestBody.nimNumberFrom}&nimNumberTo=${requestBody.nimNumberTo}&name=${requestBody.name}&address=${requestBody.address}&regencyId${requestBody.regencyId}&getAcademicGuidance=${requestBody.getAcademicGuidance}&hasAuthentication=${requestBody.hasAuthentication}&studyPlanSemesterId=${requestBody.studyPlanSemesterId}&studyPlanIsApproved=${requestBody.studyPlanIsApproved}&studyPlanIsSubmitted=${requestBody.studyPlanIsSubmitted}&hasStudyPlan=${requestBody.hasStudyPlan}&statusSemesterId=${requestBody.statusSemesterId}&isRegistered=${requestBody.isRegistered}&hasPaid=${requestBody.hasPaid}${status}&isGraduateEligible=${requestBody.isGraduateEligible}&isThesisEligible=${requestBody.isThesisEligible}&yudiciumSessionId=${requestBody.yudiciumSessionId}`, <any>{
            method: 'GET',
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