import * as core from '@actions/core'
import * as github from '@actions/github'

async function run() {
  const token = core.getInput("repo-token", { required: true })
  const pullNumber = getPullNumber(core.getInput("pull-number", { required: false }))
  const client = github.getOctokit(token)

  if (pullNumber === undefined) {
    core.setFailed('No issue specified')
    return
  }

  const { data: issueData } = await client.pulls.get({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: pullNumber,
  })

  console.log (issueData)

}

function getPullNumber(pullNumber: string) {
  if (pullNumber) {
    return Number(pullNumber)
  }
  return github.context.payload.pull_request?.number
}

run()