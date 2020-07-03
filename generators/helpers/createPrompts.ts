
import { Question } from 'yeoman-generator'

type PromptDefinition = Pick<Question, Exclude<keyof Question, 'name'>>

type PromptMap<T> = {
  [k in keyof T]: PromptDefinition
}

export function createPrompts<T> (map: PromptMap<T>) {
  const prompts: Question[] = []

  Object.keys(map).forEach(name => {
    prompts.push({
      ...map[name],
      name,
    })
  })

  return prompts
}
