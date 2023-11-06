import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import { babel } from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import commonjs from "@rollup/plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import copy from "rollup-plugin-copy";
import replace from "@rollup/plugin-replace";

const extensions = [".ts", ".tsx"];

const indexConfig = {
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    resolve({ extensions, browser: true }),
    commonjs(),
    uglify(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: ["solid", "@babel/preset-typescript"],
      extensions,
    }),
    postcss({
      plugins: [autoprefixer(), tailwindcss()],
      extract: false,
      modules: false,
      autoModules: false,
      minimize: true,
      inject: false,
    }),
    typescript(),
    typescriptPaths({ preserveExtensions: true }),
    terser({ output: { comments: false } }),
    copy({
      targets: [
        { src: 'src/*.html', dest: 'dist/' },
      ]
    }),
    /* If you want to see the live app */
    process.env.NODE_ENV === 'development' && serve({
      open: false,
      verbose: true,
      contentBase: ["dist"],
      host: "localhost",
      port: 5678,
      allowCrossOrigin: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    }),
    process.env.NODE_ENV === 'development' && livereload({ watch: "dist" }),
  ],
};

const configs = [
  {
    ...indexConfig,
    input: "./src/web.ts",
    output: {
      file: "dist/web.js",
      format: "es",
    },
  },
];

export default configs;
