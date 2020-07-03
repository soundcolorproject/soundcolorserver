
import * as React from 'react'
import { observer } from 'mobx-react'
import { IStoresToProps } from 'mobx-react/dist/types/IStoresToProps'
import { IValueMap } from 'mobx-react/dist/types/IValueMap'
import { useStores, MobxStoresProps } from './useStores'
import { logger } from '../../shared/logger'

type Injector<
  OutputProps extends IValueMap,
  InputProps extends IValueMap = {},
  Context extends IValueMap = {}
> = IStoresToProps<
  MobxStoresProps,
  InputProps,
  OutputProps,
  Context
>

const Foo: React.FunctionComponent<{}> = (a, b) => React.createElement('div')

/**
 * @deprecated
 */
export function injectAndObserve<OutputProps extends IValueMap, InputProps extends IValueMap, Context extends IValueMap = {}> (injector: Injector<OutputProps, InputProps, Context>, WrappedComponent: React.ComponentType<OutputProps & InputProps>) {
  if (!(WrappedComponent as any)['isMobxInjector']) {
    WrappedComponent = observer(WrappedComponent)
  }

  const name = WrappedComponent.displayName || WrappedComponent.name

  const OutputComponent: React.ComponentType<InputProps> = (inputProps: InputProps) => {
    const stores = useStores()
    const fullProps = React.useMemo(
      () => ({ ...inputProps, ...injector(stores, inputProps) }),
      Object.keys(inputProps).map(prop => inputProps[prop]),
    )

    logger.info(`Wrapped ${name} props:`)
    logger.info(fullProps)
    return React.createElement(WrappedComponent, fullProps)
  }

  OutputComponent.displayName = name

  return OutputComponent
}
