import { LoginData, LoginRequest, LoginRoot } from '~~/types/api/auth/Login'
import { useAuthStorage } from './useAuthStorage'

export const useAuth = () => {
  const authUser = useAuthStorage()

  const setUser = (user: any) => {
    authUser.value = user
  }

  const setCookie = (cookie: any) => {
    cookie.value = cookie
  }

  const login = async (
    loginRequest: LoginRequest,
  
  ) => {
    const { data: loginResponse, pending, refresh, error }  = await useAPIFetch<LoginRoot>('/api/v1/general_auth.GeneralAuthHandler/Login', <any>{
      method: 'POST',
      body: loginRequest,
    })

    if(error.value) return null;

    setUser(loginResponse.value?.data)

    return authUser
  }

  const logout = async () => {
    const data: any = await $fetch('/auth/logout', {
      method: 'POST'
    })

    setUser(data.user)
  }

  const me = async () => {
    if (!authUser.value) {
      try {
        const data: any = await $fetch('/auth/me', {
          headers: useRequestHeaders(['cookie']) as HeadersInit
        })

        setUser(data.user)
      } catch (error) {
        setCookie(null)
      }
    }

    return authUser
  }

  return {
    login,
    logout,
    me,
    setUser,
    value: authUser.value
  }
}
