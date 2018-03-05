import buble from 'rollup-plugin-buble'

export default {
  input: 'index.js',
  output: [
    {
      file: 'dist/onmount.js',
      format: 'umd',
      name: 'onmount'
    },
    {
      file: 'dist/onmount.es.js',
      format: 'es'
    }
  ],
  plugins: [
    buble()
  ]
}
