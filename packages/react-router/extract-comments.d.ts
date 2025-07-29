declare module 'extract-comments' {
  function extractComments(content: string): Array<{
    value?: string
    raw?: string
  }>
  export { extractComments }
}
