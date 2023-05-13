import * as core from '@actions/core'
import {ExecuteNxCommandProps, GetNxAffectedProps} from './interfaces'
import {execSync} from 'child_process'

const executeNxCommands = ({
  commands,
  workspace
}: ExecuteNxCommandProps): string | null => {
  let cmdSuccessful = false
  let result: string | null = null

  for (const cmd of commands) {
    try {
      core.debug(`Attempting to run command: ${cmd}`)
      result = execSync(cmd, {cwd: workspace}).toString()
      cmdSuccessful = true
      break
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      core.debug(`Command failed: ${(err as any).message}`)
    }
  }

  if (!cmdSuccessful) {
    throw Error(
      'Could not run NX cli...Did you install it globally and in your project? Also, try adding this npm script: "nx":"nx"'
    )
  }

  return result
}

export function getNxAffected({
  base,
  head,
  workspace
}: GetNxAffectedProps): Record<string, any> {
  const args = `${base ? `--base=${base}` : ''} ${head ? `--head=${head}` : ''}`
  const commands = [
    `./node_modules/.bin/nx print-affected ${args}`,
    `nx  print-affected ${args}`,
    `npx nx print-affected ${args}`
  ]
  const result = executeNxCommands({commands, workspace})

  if (!result) {
    core.info('Looks like no changes were found...')
    return {}
  }

  return JSON.parse(result)
}
