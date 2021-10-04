const keywords = [
  'close',
  'closes',
  'closed',
  'fix',
  'fixes',
  'fixed',
  'resolve',
  'resolves',
  'resolved',
]

export function createReferenceRegExp(customKeywords: string[] = []) {
  return new RegExp(
    `(${keywords.concat(customKeywords).join('|')}) #(\\d+)`,
    'gi'
  )
}

export function parseReferencedIssues(
  body: string,
  referenceRegExp: RegExp
): number[] {
  const found = []
  let match
  while ((match = referenceRegExp.exec(body))) {
    found.push(Number(match[2]))
  }
  return uniq(found)
}

export function uniq<T>(arr: T[]) {
  return arr.filter((v, i, a) => a.indexOf(v) === i)
}
