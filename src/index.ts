import * as core from '@actions/core'
import * as github from '@actions/github'

async function run() {
  const token = core.getInput("repo-token", { required: true })
  const issueNumber = getIssueNumber(core.getInput("issue-number", { required: false }))
  const client = github.getOctokit(token)

  if (issueNumber === undefined) {
    core.setFailed('No issue specified')
    return
  }

  const { data: issueData } = await client.issues.listEvents({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: issueNumber,
  })

  console.log (issueData)

}

function getIssueNumber(pullNumber: string) {
  if (pullNumber) {
    return Number(pullNumber)
  }
  return github.context.payload.pull_request?.number
}

run()