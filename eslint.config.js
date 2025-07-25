import antfu from '@antfu/eslint-config'

export default await antfu({
  typescript: true,
  ignores: ['**/*.md'],
})
