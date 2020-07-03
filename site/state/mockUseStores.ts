
import * as useStoresModule from './useStores'

export function mockUseStores () {
  const useStoresSpy
    : jest.SpyInstance<DeepPartial<useStoresModule.MobxStoresProps>, []>
    = jest.spyOn(useStoresModule, 'useStores')

  return useStoresSpy
}
