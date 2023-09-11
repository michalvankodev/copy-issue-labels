import * as core from '@actions/core'
import * as github from '@actions/github'
import {
  createReferenceRegExp,
  parseReferencedIssues,
  uniq,
} from './issue-parser'

function getInputAsArray(name: string, options?: core.InputOptions): string[] {
  return core
    .getInput(name, options)
    .split('\n')
    .map((s) => s.trim())
    .filter((x) => x !== '')
}

function getBooleanInput(name: string, options?: core.InputOptions, defaultValue: boolean = false): boolean {
  try {
    return core.getBooleanInput(name, options)
  } catch (ex) {
    return defaultValue
  }
}

async function run() {
  const token = core.getInput('repo-token', { required: true })
  const customKeywords = getInputAsArray('custom-keywords', { required: false })
  const labelsToInclude = getInputAsArray('labels-to-include', { required: false });
  const labelsToExclude = getInputAsArray('labels-to-exclude', { required: false });
  const fromTitle = getBooleanInput('from-title', { required: false })

  const issueNumber = getIssueNumber(
    core.getInput('issue-number', { required: false })
  )
  if (issueNumber === undefined) {
    core.setFailed('No issue specified')
    return
  }

  const client = github.getOctokit(token)

  const { data: issueData } = await client.issues.get({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: issueNumber,
  })

  const referenceRegExp = createReferenceRegExp(customKeywords)

  const connectedIssuesFromBody = parseReferencedIssues(
    issueData.body ?? '',
    referenceRegExp
  )

  const connectedIssuesFromTitle = fromTitle ? parseReferencedIssues(
    issueData.title ?? '',
    referenceRegExp
  ) : []
  // the same issue may come from both title and body. we should use uniq to dedupe them.
  const connectedIssues = uniq([...connectedIssuesFromBody, ...connectedIssuesFromTitle])

  const connectedLabelsResponses = await Promise.all(
    connectedIssues.map(async (connectedIssue) =>
      client.issues.listLabelsOnIssue({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: connectedIssue,
      })
    )
  )

  const labels = uniq(
    connectedLabelsResponses.reduce<string[]>((acc, response) => {
      const issueLabels = response.data.map((label) => label.name);
      // Filter out unwanted labels and keep only the ones that are needed
      const filteredLabels = issueLabels.filter(label => {
          if (labelsToInclude.length > 0 && !labelsToInclude.includes(label)) {
              // Label not in `labelsToInclude`
              return false;
          }
          if (labelsToExclude.length > 0 && labelsToExclude.includes(label)) {
              // Label in `labelsToExclude`
              return false;
          }
          return true;
      });
      
      return [...acc, ...filteredLabels]
    }, [])
  )

  labels.length > 0 && await client.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: issueNumber,
    labels,
  })
}

function getIssueNumber(pullNumber: string) {
  if (pullNumber) {
    return Number(pullNumber)
  }
  return github.context.payload.pull_request?.number
}

run()
