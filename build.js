import esbuild from 'esbuild';
const options = {
  entryPoints: ['src/index.js'],
  outfile: 'dist/jcode-ble.js',
  bundle: true,
  format: 'esm',
};

if(process.env.mode === 'production') {
  esbuild.buildSync({minify: false, ...options});
} else {
  esbuild.serve({
    servedir: 'examples',
  }, {
    ...options,
    outfile: 'examples/jcode-ble.js',
  }).then((server) => {
    console.log(`Server is running at ${server.host}:${server.port}`);
  });
}