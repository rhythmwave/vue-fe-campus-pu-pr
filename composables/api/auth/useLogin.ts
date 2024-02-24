import { useStorage, StorageSerializers } from '@vueuse/core'
import { LoginData, LoginRequest, LoginRoot } from '~~/types/api/auth/Login';

export const ApiAuthLogin = async (loginRequest: LoginRequest): Promise<LoginRoot> => {
  const { data: loginResponse, pending, refresh, error } = await useAPIFetch<LoginRoot>('/api/v1/general_auth.GeneralAuthHandler/Login', <any>{
    method: 'POST',
    body: loginRequest,
  })
  if (error.value) {
    return <LoginRoot>error.value.data;
  }
  const authUser = useAuthStorage();
  authUser.value = loginResponse.value?.data;
  return <LoginRoot>loginResponse.value;

}
