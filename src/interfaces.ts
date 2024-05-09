export interface GetNxAffectedProps {
  base?: string
  head?: string
  type?: string
  workspace: string
}

export interface ExecuteNxCommandProps {
  commands: string[]
  workspace: string
}
