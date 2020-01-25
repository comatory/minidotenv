import fs from 'fs'
import path from 'path'

interface Options {
  path?: string,
  inject?: boolean,
  env?: ProcessEnv,
}

interface ConfigObject {
  [key: string]: string | number
}

interface ProcessEnv {
  [key: string]: string
}

const loadEnvFile = (inPath: string): string | null => {
  return fs.readFileSync(inPath, { encoding: 'utf8' })
}

const parseEnvFileContents = (contents: string): ConfigObject => {
  // NOTE: Detect new lines
  const lines = contents.split('\n')

  return lines.reduce((configObject, line) => {
    // NOTE: Split lines with `=` into key/value pairs
    const [ key, value ] = line.split('=')

    // NOTE: Very simple parsing, basically just allow to accept
    // numbers (incl. floats) or strings
    const parsedValue = Number(value) || String(value)

    return {
      ...configObject,
      [key]: parsedValue,
    }
  }, {})
}

const injectConfigIntoProcess = (
  configObject: ConfigObject,
  env: NodeJS.ProcessEnv | ProcessEnv
): void => {
  Object.keys(configObject).forEach((key) => {
    env[key] = String(configObject[key])
  })
}

const miniDotenv = (options: Options = {}): (key: string) => string | number | undefined => {
  const envFilePath = options.path || path.join(process.cwd(), '.env')
  const inject = Boolean(options.inject)
  const env = options.env || process.env

  try {
    const envFileContents = loadEnvFile(envFilePath)
    const configObject = envFileContents ?
      parseEnvFileContents(envFileContents) :
      {}

    if (inject && env) {
      injectConfigIntoProcess(configObject, env)
    }

    return (key: string): string | number => {
      return configObject[key]
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`No env file found at ${envFilePath}`)
      return () => undefined
    }
    throw err
  }
}

export = miniDotenv
