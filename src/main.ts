import * as core from '@actions/core'
import {getNxAffected} from './nx'

export async function run(workspace = '.'): Promise<void> {
  try {
    const {GITHUB_WORKSPACE = workspace} = process.env
    const base = core.getInput('base')
    const head = core.getInput('head')

    core.info(`using dir: ${GITHUB_WORKSPACE}`)

    const result = getNxAffected({
      base,
      head,
      type: 'apps',
      workspace: GITHUB_WORKSPACE
    })

    const {projects} = result

    core.debug(`Result: ${result}`)
    core.debug(`Result projects: ${projects}`)
    core.setOutput('affectedProjects', projects)
    core.setOutput('hasAffectedProjects', projects.length > 0)
    core.info(`Affected projects: ${projects.length > 0 ? projects.join() : 'none'}`)
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    core.setFailed((error as any).message)
  }
}

run()
