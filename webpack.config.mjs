import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  context: resolve(__dirname, 'src'),
  entry: './server.ts',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: process.env.build === 'multi' ? './multiserver.bundle.js' : './server.bundle.js',
    clean: true,
  },
  target: 'node',
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.build': JSON.stringify(process.env.build),
    })
  ]
};
