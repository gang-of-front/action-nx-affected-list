import * as core from '@actions/core'
import {getNxAffected} from './nx'

export async function run(workspace = '.'): Promise<void> {
  try {
    const {GITHUB_WORKSPACE = workspace} = process.env
    const base = core.getInput('base')
    const head = core.getInput('head')

    core.info(`using dir: ${GITHUB_WORKSPACE}`)

    const apps = getNxAffected({
      base,
      head,
      type: 'apps',
      workspace: GITHUB_WORKSPACE
    })
    core.setOutput('affectedApps', apps)
    core.setOutput('hasAffectedApps', apps.length > 0)
    core.info(`Affected apps: ${apps.length > 0 ? apps.join() : 'none'}`)
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    core.setFailed((error as any).message)
  }
}

run()
