# copy-issue-labels github action

Motivation for creating this action was to copy labels from linked issues to the issue / PR which triggered workflow.

## Example workflow

This workflow will copy labels from the linked issue for the opened PR.

Github issues can link other issues and this linking is done automatically whenever PR mentions one of the keywords for automated workflows. [See documentation](https://docs.github.com/en/free-pro-team@latest/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)

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
        uses: michalvankodev/copy-issue-labels@v1.2.1
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

Because GitHub API doesn't provide information about linked issues this workflow will parse the information from the `body` of the issue.

## Custom keywords

You can provide custom keywords which will be picked up by the parser.

These keywords will not override github specified keywords.

```yml
steps:
  - name: copy-labels
    uses: michalvankodev/copy-issue-labels@v1.2.1
    with:
      repo-token: ${{ secrets.GITHUB_TOKEN }}
      custom-keywords: |
        solves
        references
```

## Parse from title

You can provide from-title = true to parse the issue numbers from title

```yml
steps:
  - name: copy-labels
    uses: michalvankodev/copy-issue-labels@v1.2.1
    with:
      repo-token: ${{ secrets.GITHUB_TOKEN }}
      from-title: true
```

## Include-Exclude labels

You can provide an inclusion/exclusion list to filter linked issue labels before copying them to the PR

```yml
steps:
  - name: copy-labels
    uses: michalvankodev/copy-issue-labels@v1.3.0
    with:
      repo-token: ${{ secrets.GITHUB_TOKEN }}
      labels-to-copy: |
        documentation
        enhancement
      labels-to-exclude: |
        untriaged
        triaged
```


## Development

The deployed code is stored in the repository as that's how github action runner is able to run the action with _runners_.

1. Don't forget to first build the action before releasing new version
  `npm run build`

2. Commit
3. Create a new git tag: `git tag -a -m "Feature added" v1.x.y`
4. Publish `git push --follow-tags`
