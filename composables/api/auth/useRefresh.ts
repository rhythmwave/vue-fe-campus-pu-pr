import { LoginRequest, LoginRoot } from "~~/types/api/auth/Login";

export const ApiAuthRefresh = async (token: string): Promise<LoginRoot> => {
    const { data: loginResponse, pending, refresh, error } = await useAPIFetch<LoginRoot>('/api/v1/general/general_auth.GeneralAuthHandler/RefreshToken', <any>{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: token,
      }
    })
    const authUser = useAuthStorage();
    if (error.value) {
      authUser.value = null;
      return <LoginRoot>error.value.data;
    }
    authUser.value = loginResponse.value?.data;
    return <LoginRoot>loginResponse.value;
  
  }