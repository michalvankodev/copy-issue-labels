import { parseReferencedIssues } from './issue-parser'

describe('parse connected issues from issue body', () => {
  it('should parse connected issues from issue body', () => {
    const body = `
      closes #1

      This is basic issue comment
    `
    expect(parseReferencedIssues(body)).toEqual([1])
  })

  it('should parse multiple issues', () => {
    const body = `
      fix #11
      close #12 resolves #34
    `
    expect(parseReferencedIssues(body)).toEqual([11, 12, 34])
  })

  it('should react on every github keyword', () => {
    const body = `
      close #1
      closes #2
      closed #3
      fix #4
      fixes #5
      fixed #6
      resolve #7
      resolves #8
      resolved #9
    `
    expect(parseReferencedIssues(body)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('should not react on keywords when there is not hastag', () => {
    const body = `
      close 123
    `
    expect(parseReferencedIssues(body)).toEqual([])
  })

  it('should not react on hashtags without keywords', () => {
    const body = `
      hellou #123
    `
    expect(parseReferencedIssues(body)).toEqual([])
  })

  it('should return unique values', () => {
    const body = `
      close #2 fix #2
    `
    expect(parseReferencedIssues(body)).toEqual([2])
  })
})
