import * as core from '@actions/core'
import {getNxAffected} from './nx'

export async function run(workspace = '.'): Promise<void> {
  try {
    const {GITHUB_WORKSPACE = workspace} = process.env
    const base = core.getInput('base')
    const head = core.getInput('head')
    const type = core.getInput('type')

    core.info(`using dir: ${GITHUB_WORKSPACE}`)
    core.info(`input base: ${base}`)
    core.info(`input head: ${head}`)
    core.info(`input type: ${type}`)

    const projects = getNxAffected({
      base,
      head,
      type,
      workspace: GITHUB_WORKSPACE
    })

    core.info(`Result: ${projects}`)
    core.setOutput('affected', projects)
    core.setOutput('hasAffected', projects.length > 0)
    core.info(
      `Affected projects: ${projects.length > 0 ? projects.join() : 'none'}`
    )
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    core.setFailed((error as any).message)
  }
}

run()
