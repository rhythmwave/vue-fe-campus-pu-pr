import { useFetch } from '#app'
import { LoginData } from '~~/types/api/auth/Login';

type useFetchType = typeof useFetch

// wrap useFetch with configuration needed to talk to our API
export const useAPIFetch: useFetchType = (path, options = {}) => {
  const config = useRuntimeConfig()

  const user = <LoginData>useAuth().value;
  let token = user == null ? '' : 'Bearer ' + user.access_token;

  // modify options as needed
  // console.log("options.headers")
  // console.log(options.headers)
  options.baseURL = config.public.baseUrl;
  
  if (!options.headers) {
    options.headers = {
      Accept: 'application/json',
      Authorization: token,
    }
  }
  // ]
  return useFetch(path, options)
}
