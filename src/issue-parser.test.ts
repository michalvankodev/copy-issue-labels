import { createReferenceRegExp, parseReferencedIssues } from './issue-parser'

describe('parse connected issues from issue body', () => {
  const referenceRegExpNoCustomKeywords = createReferenceRegExp()
  it('should parse connected issues from issue body', () => {
    const body = `
      closes #1

      This is basic issue comment
    `
    expect(
      parseReferencedIssues(body, referenceRegExpNoCustomKeywords)
    ).toEqual([1])
  })

  it('should parse multiple issues', () => {
    const body = `
      fix #11
      close #12 resolves #34
    `
    expect(
      parseReferencedIssues(body, referenceRegExpNoCustomKeywords)
    ).toEqual([11, 12, 34])
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
    expect(
      parseReferencedIssues(body, referenceRegExpNoCustomKeywords)
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('should not react on keywords when there is not hastag', () => {
    const body = `
      close 123
    `
    expect(
      parseReferencedIssues(body, referenceRegExpNoCustomKeywords)
    ).toEqual([])
  })

  it('should not react on hashtags without keywords', () => {
    const body = `
      hellou #123
    `
    expect(
      parseReferencedIssues(body, referenceRegExpNoCustomKeywords)
    ).toEqual([])
  })

  it('should return unique values', () => {
    const body = `
      close #2 fix #2
    `
    expect(
      parseReferencedIssues(body, referenceRegExpNoCustomKeywords)
    ).toEqual([2])
  })
})

describe('parse connected issues with custom keywords from issue', () => {
  const referenceRegExpWithCustomKeywords = createReferenceRegExp([
    'solves',
    'references',
  ])
  it('should parse connected issues from issue body with custom keyword', () => {
    const body = `
      solves #1

      This is basic issue comment
    `
    expect(
      parseReferencedIssues(body, referenceRegExpWithCustomKeywords)
    ).toEqual([1])
  })

  it('should parse multiple issues with custom and regular keywords', () => {
    const body = `
      fix #11
      close #12 solves #34
    `
    expect(
      parseReferencedIssues(body, referenceRegExpWithCustomKeywords)
    ).toEqual([11, 12, 34])
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
    expect(
      parseReferencedIssues(body, referenceRegExpWithCustomKeywords)
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('should not react on keywords when there is not hastag', () => {
    const body = `
      solves 123
    `
    expect(
      parseReferencedIssues(body, referenceRegExpWithCustomKeywords)
    ).toEqual([])
  })

  it('should not react on hashtags without keywords', () => {
    const body = `
      hellou #123
    `
    expect(
      parseReferencedIssues(body, referenceRegExpWithCustomKeywords)
    ).toEqual([])
  })

  it('should return unique values', () => {
    const body = `
      solves #2 references #2
    `
    expect(
      parseReferencedIssues(body, referenceRegExpWithCustomKeywords)
    ).toEqual([2])
  })
})
