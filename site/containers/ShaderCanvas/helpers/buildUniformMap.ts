
export type UniformType =
  | 'float'
  | 'vec2'
  | 'vec3'
  | 'vec4'
  | 'int'
  | 'int vec2'
  | 'int vec3'
  | 'int vec4'

export type UniformMap = { [name: string]: UniformType }

export interface BuiltUniform<T extends number[]> {
  location: WebGLUniformLocation
  setValue: (value: T) => void
}

export type UniformSetter<T extends number[]> = T extends number[] ? {
  (value: T): void
  readonly current: Readonly<T>
} : never
export type ArgForUniform<T extends UniformType> =
  T extends 'float' ? [number] :
  T extends 'vec2' ? [number, number] :
  T extends 'vec3' ? [number, number, number] :
  T extends 'vec4' ? [number, number, number, number] :
  T extends 'int' ? [number] :
  T extends 'int vec2' ? [number, number] :
  T extends 'int vec3' ? [number, number, number] :
  T extends 'int vec4' ? [number, number, number, number] :
  never

export type BuiltUniformFrom<T extends UniformType> =
  T extends string ? UniformSetter<ArgForUniform<T>> : never

export type BuiltUniformMap<T extends UniformMap> = T extends object ? {
  [name in keyof T]: BuiltUniformFrom<T[name]>
} : never

type GLUniformFunctionFor<T extends UniformType> =
  T extends 'float' ? 'uniform1f' :
  T extends 'vec2' ? 'uniform2f' :
  T extends 'vec3' ? 'uniform3f' :
  T extends 'vec4' ? 'uniform4f' :
  T extends 'int' ? 'uniform1i' :
  T extends 'int vec2' ? 'uniform2i' :
  T extends 'int vec3' ? 'uniform3i' :
  T extends 'int vec4' ? 'uniform4i' :
  never

const uniformFnMap: { [name in UniformType]: GLUniformFunctionFor<name> } = {
  float: 'uniform1f',
  vec2: 'uniform2f',
  vec3: 'uniform3f',
  vec4: 'uniform4f',
  int: 'uniform1i',
  'int vec2': 'uniform2i',
  'int vec3': 'uniform3i',
  'int vec4': 'uniform4i',
}

function getUniformFnFor<T extends UniformType> (type: T): GLUniformFunctionFor<T> {
  return uniformFnMap[type] as string as GLUniformFunctionFor<T>
}

const defaultValues: { [name in UniformType]: ArgForUniform<name> } = {
  float: Object.freeze([0]) as ArgForUniform<'float'>,
  vec2: Object.freeze([0, 0]) as ArgForUniform<'vec2'>,
  vec3: Object.freeze([0, 0, 0]) as ArgForUniform<'vec3'>,
  vec4: Object.freeze([0, 0, 0, 0]) as ArgForUniform<'vec4'>,
  int: Object.freeze([0]) as ArgForUniform<'int'>,
  'int vec2': Object.freeze([0, 0]) as ArgForUniform<'int vec2'>,
  'int vec3': Object.freeze([0, 0, 0]) as ArgForUniform<'int vec3'>,
  'int vec4': Object.freeze([0, 0, 0, 0]) as ArgForUniform<'int vec4'>,
}

function defaultValueFor<T extends UniformType> (type: T): ArgForUniform<T> {
  return defaultValues[type] as any as ArgForUniform<T>
}

export function buildUniformMap<T extends UniformMap> (gl: WebGLRenderingContext, program: WebGLProgram, map?: T): BuiltUniformMap<T> {
  if (!map) {
    return {} as BuiltUniformMap<T>
  }

  return Object.entries(map)
    .map(buildUniform(gl, program))
    .reduce(uniformsToMap, {} as BuiltUniformMap<T>)
}

const uniformsToMap = <T extends UniformMap>(
  prev: BuiltUniformMap<T>,
  [name, setter]: [string, BuiltUniformFrom<T[keyof T]>],
) => ({
  ...prev,
  [name]: setter,
})

export const buildUniform = (gl: WebGLRenderingContext, program: WebGLProgram) => <T extends UniformType>([name, type]: [string, T]) => {
  const location = gl.getUniformLocation(program, name)
  const setterName = getUniformFnFor(type)
  let current = defaultValueFor(type)

  const setter = ((value: ArgForUniform<T>) => {
    current = Object.freeze([...value]) as ArgForUniform<T>
    gl[setterName](location, ...(value as ArgForUniform<'vec4'>))
  }) as BuiltUniformFrom<T>

  Object.defineProperty(setter, 'current', {
    get: () => current,
  })

  return [name, setter]
}
