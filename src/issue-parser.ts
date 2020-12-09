const referenceRegExp = /(close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved) #(\d+)/gi

export function parseReferencedIssues(body: string): number[] {
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
