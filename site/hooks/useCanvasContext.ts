
import { useMemo, useRef } from 'react'

export type ContextType = '2d' | 'bitmaprenderer' | 'webgl' | 'webgl2'
interface CanvasContextMapping {
  '2d': CanvasRenderingContext2D
  'bitmaprenderer': ImageBitmapRenderingContext
  'webgl': WebGLRenderingContext
  'webgl2': WebGL2RenderingContext
}

export function useCanvasContext<Type extends ContextType> (type: Type): [React.RefObject<HTMLCanvasElement>, CanvasContextMapping[Type] | null] {
  const ref = useRef<HTMLCanvasElement>(null)
  const context = useMemo(() => {
    if (!ref.current) {
      return null
    }
    return ref.current.getContext(type) as CanvasContextMapping[Type] | null
  }, [ref.current])

  return [ref, context]
}
