# copy-issue-labels github action

Motivation for creating this action was to copy labels from linked issues to the issue / PR which triggered workflow.

## Example workflow

This workflow will copy labels from the linked issue for the opened PR.

Github issues can link other issues and this linkin is done automatically whenever PR mentions one of the keywords for automated workflows. [See documentation](https://docs.github.com/en/free-pro-team@latest/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)

```yml
on: 
  pull_request:
    types: [opened]

jobs:
  copy-labels:
    runs-on: ubuntu-latest
    name: Copy labels from linked issues
    steps:
      - name: copy-labels
        uses: michalvankodev/copy-issue-labels@v1
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

There is also support for different workflows to trigger sync of the labels with `issue-number` parameter

```yml
    steps:
      - name: copy-labels
        uses: michalvankodev/copy-issue-labels@v0.2.12
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.inputs.issue }}
```