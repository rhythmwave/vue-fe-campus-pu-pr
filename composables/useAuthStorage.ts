import { useStorage, StorageSerializers } from '@vueuse/core'

export const useAuthStorage = () => {
  return useStorage('user', null, undefined, { serializer: StorageSerializers.object })
  // return useState<UserWithoutPassword | null>('user', () => null)
}
