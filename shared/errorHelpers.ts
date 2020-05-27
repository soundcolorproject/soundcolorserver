
export function errorString (err: any): string {
  if (typeof err === 'string') {
    return err
  } else if (err instanceof Error) {
    return err.stack || err.message
  } else {
    try {
      return JSON.stringify(err)
    } catch (e) {
      return err.toString()
    }
  }
}
