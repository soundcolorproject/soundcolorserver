
import { inject, observer } from 'mobx-react'
import { IStoresToProps } from 'mobx-react/dist/types/IStoresToProps'
import { IValueMap } from 'mobx-react/dist/types/IValueMap'
import { MobxProviderProps } from './MobxProvider'

type Injector<
  OutputProps extends IValueMap,
  InputProps extends IValueMap = {},
  Context extends IValueMap = {}
> = IStoresToProps<
  MobxProviderProps,
  InputProps,
  OutputProps,
  Context
>

export function injectAndObserve<OutputProps extends IValueMap, InputProps extends IValueMap, Context extends IValueMap = {}> (injector: Injector<OutputProps, InputProps, Context>, component: React.ComponentType<OutputProps & InputProps>) {
  return inject(injector)(observer(component)) as React.ComponentType<InputProps>
}
