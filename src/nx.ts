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
      core.info(`Attempting to run command: ${cmd}`)
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
  type,
  workspace
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
GetNxAffectedProps): Record<string, any> {
  const inputBase = base && `--base=${base}`
  const inputHead = head && `--head=${head}`
  const inputType = type && `--type=${type}`

  const args = [inputBase, inputHead, inputType].filter(Boolean).join(' ')
  const commands = [
    // https://nx.dev/nx-api/nx/documents/show
    // `./node_modules/.bin/nx print-affected ${args}`,
    // `nx  print-affected ${args}`,
    `npx nx show projects --affected --json ${args}`
  ]

  core.info(`Command: ${commands.join('\n')}`)
  core.info(`args: ${args}`)

  const result = executeNxCommands({commands, workspace})

  if (!result) {
    core.info('Looks like no changes were found...')
    return {}
  }

  return JSON.parse(result)
}
