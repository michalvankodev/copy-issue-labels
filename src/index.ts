import * as core from '@actions/core'
import * as github from '@actions/github'

async function run() {
  const token = core.getInput("repo-token", { required: true })
  const issueId = getIssueId(core.getInput("issueToLabel", { required: false }))
  const client = github.getOctokit(token)

  const { data: issueData } = await client.issues.get({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: Number(issueId),
  })

  console.log (issueData)

}

function getIssueId(issueToLabel: string) {
  if (issueToLabel) {
    return Number(issueToLabel)
  }
  return github.context.payload.issue?.number
}

run()