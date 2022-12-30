const path = require(`path`);

const alias = (prefix = `src`) => ({
  '@': `${prefix}/`,
  '@pages': `${prefix}/pages`,
  '@components': `${prefix}/components`,
  '@shared': `${prefix}/shared`,
  '@actions': `${prefix}/shared/actions`,
  '@constants': `${prefix}/shared/constants`,
  '@hooks': `${prefix}/shared/hooks`,
  '@reducers': `${prefix}/shared/reducers`,
  '@selectors': `${prefix}/shared/selectors`,
  '@services': `${prefix}/shared/services`,
  '@utils': `${prefix}/shared/utils`,
  '@popup': `${prefix}/popup`,
  '@home': `${prefix}/pages/Home`,
});

const resolvedAliases = Object.fromEntries(Object.entries(alias()).map(([key, value]) => [key, path.resolve(__dirname, value)]));

// CRA utilizes webpack for building the application. In this file, we override the existing settings with a new entry.
// This entry will take the contents from ./src/chromeServices/DOMEvaluator.ts and build it separately from the rest
// into the output file static/js/[name].js, where the name is content, the key where we provided the source file.
module.exports = {
  webpack: {
    alias: resolvedAliases,
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    configure: (webpackConfig, { env, paths }) => ({
      ...webpackConfig,
      entry: {
        main: [env === 'development' && require.resolve('react-dev-utils/webpackHotDevClient'), paths.appIndexJs].filter(Boolean),
        content: './src/content/index.js',
      },
      output: {
        ...webpackConfig.output,
        filename: 'static/js/[name].js',
      },
      optimization: {
        ...webpackConfig.optimization,
        runtimeChunk: false,
      },
    }),
  },
};
