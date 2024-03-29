import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'main.ts',
  output: {
    dir: './build',
    sourcemap: 'inline',
    format: 'cjs',
    exports: 'default'
  },
  external: ['obsidian', 'electron'],
  plugins: [
    typescript(),
    nodeResolve({browser: true}),
    commonjs({
	    include: "node_modules/**",
    }),
  ]
};