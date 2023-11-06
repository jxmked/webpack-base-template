import url from 'url';
import path from 'path';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import InterpolateHtmlPlugin from 'interpolate-html-plugin';
import GA4WebpackPlugin from 'ga4-webpack-plugin';
import packageJson from './package.json' assert { type: 'json' };
import webpack from 'webpack';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HTMLMinifier from 'html-minifier';

/**
 *
 * NOTE:
 * Search for "// REPLACE" to  check
 * all parameter that might require
 * to change per project.
 *
 * NOTE:
 * Make sure that package.json does exists and
 * has valid keys-values
 *
 * Btw, this is my personal Webpack config.
 * Best for lazy like me.
 * */
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let devMode = process.env['NODE' + '_ENV'] !== 'production';
const CONFIG = {
  output: {
    name: '[name].[contenthash]',
    chunk: '[id].[contenthash]',
    dir: 'dist' // Do not include './' or '/'
  },
  input: {
    entry: './src/index.ts', // Typescript only
    dir: 'src'
  },

  // Changing this during runtime will not going to parse it.
  // Restart the webpack to load
  env: {
    APP_VERSION: packageJson.version
  },
  windowResizeable: false,

  // Manifesting and information

  // For site.webmanifest
  appName: 'Webpack Base Template', // REPLACE
  shortAppName: 'Base Template', // REPLACE
  description: packageJson.description,
  colors: {
    background: '#3a3a3c',
    theme: '#272738' // also injected into html
  },
  icons: {
    src: path.resolve('src/assets/icon.png'),
    sizes: [96, 128, 256, 512]
  },
  appType: 'app'
};

/**
 * Production Plugins
 * */
const prodPlugins = [
  new WebpackPwaManifest({
    name: CONFIG.appName,
    short_name: CONFIG.shortAppName,
    description: CONFIG.description,
    orientation: 'portrait',
    start_url: '.',
    display: 'standalone',
    background_color: CONFIG.colors.background,
    theme_color: CONFIG.colors.theme,
    icons: [
      {
        src: CONFIG.icons.src,
        sizes: CONFIG.icons.sizes,
        purpose: 'maskable'
      }
    ],

    // Asset config
    fingerprints: false, // Remove hashed in filename
    publicPath: './', // Make sure the url starts with
    inject: true, // Insert html tag <link rel="manifest" ... />
    filename: 'site.webmanifest'
  }),
  new WebpackManifestPlugin({
    basePath: '',

    // Replace with your repository name
    publicPath: 'webpack-base-template/', // REPLACE
    fileName: 'asset-manifest.json'
  })
];

/**
 * Handle App Repository Url
 * */
const APP_REPOSITORY = packageJson.repository.url.replace(/^git\+/i, '');

export default function (env, config) {
  if (process.env['NODE' + '_ENV'] === void 0) {
    // From flag '--mode'
    devMode = config.mode !== 'production';
    CONFIG.env['NODE_ENV'] = config.mode;
  } else {
    CONFIG.env['NODE_ENV'] = process.env['NODE' + '_ENV'];
  }

  console.log('DEV MODE: ' + String(devMode) + '\n');

  if (devMode) {
    CONFIG.output.name = '[name]';
    CONFIG.output.chunk = '[id]';
    prodPlugins.splice(0, prodPlugins.length);
  }
  const DateToday = new Date().toISOString().substring(0, 10);
  const current_year = new Date().getFullYear();

  CONFIG.env.appName = CONFIG.appName;
  CONFIG.env.shortName = CONFIG.shortAppName;
  CONFIG.env.description = CONFIG.description;

  return {
    entry: CONFIG.input.entry,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(jpe?g|png|gif|svg|webp)$/,
          loader: 'file-loader'
        },
        {
          test: /\.(wav|mp3|mp4|avi|ogg)$/i,
          loader: 'file-loader'
        },
        {
          test: /\.((s[ca]|c)ss)$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.scss', '.sass', '.css']
    },

    output: {
      filename: CONFIG.output.name + '.js',
      chunkFilename: CONFIG.output.chunk + '.js',
      path: path.resolve(__dirname, './' + CONFIG.output.dir),
      clean: true
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': Object.fromEntries(
          Object.entries(CONFIG.env).map((x) => [x[0], JSON.stringify(x[1])])
        )
      }),

      // Use your own Google Measurement ID.
      // If you doesn't have one, please remove this plugin

      // I will keep this here because I am pretty sure
      // I am the only who will use this WebpackConfig
      new GA4WebpackPlugin({
        id: 'G-TFPC622JKX', // REPLACE
        inject: !devMode, // Only inject in build mode
        callPageView: true
      }),

      new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        server: {
          baseDir: [CONFIG.output.dir]
        },

        files: ['./' + CONFIG.output.dir + '/*'],
        notify: false,
        ui: false, // Web UI for BrowserSyncPlugin
        open: false // Open browser after initiation
      }),

      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './' + path.join(CONFIG.input.dir, 'index.html'),
        //   manifest: './src/site.webmanifest',
        showErrors: devMode, // Include html error on emitted file
        lang: 'en',
        meta: {
          'viewport':
            'width=device-width, initial-scale=1, shrink-to-fit=no' +
            (CONFIG.windowResizeable ? '' : ',user-scalable=no'),
          'robots': 'index,follow',
          'referrer': 'origin',
          'charset': { charset: 'UTF-8' },
          'http-equiv': {
            'http-equiv': 'Content-Type',
            'content': 'text/html; charset=UTF-8'
          },
          'http-equiv-IE': {
            'http-equiv': 'X-UA-Compatible',
            'content': 'IE=edge'
          },
          'color-scheme': 'light dark',
          'description': packageJson.description,

          // Extended
          'version': packageJson.version,
          'author': packageJson.author,
          'dc.creator': packageJson.author,
          'keywords': packageJson.keywords.join(','),

          // Open Graph
          'og:title': {
            property: 'og:title',
            content: CONFIG.appName
          },
          'og:description': {
            property: 'og:description',
            content: packageJson.description
          },
          'og:url': {
            property: 'og:url',
            content: packageJson.homepage
          },
          'og:type': {
            property: 'og:type',
            content: 'website'
          },
          'og:site_name': {
            property: 'og:site_name',
            content: 'jxmked page' // REPLACE
          },
          'og:image:url': {
            property: 'og:image:url',
            // REPLACE
            content:
              'https://raw.githubusercontent.com/jxmked/resources/xio/assets/icons/light/Windows/Square310x310Logo.scale-400.png'
          },
          'og:image:width': {
            property: 'og:image:width',
            content: '1240' // REPLACE
          },
          'og:image:height': {
            property: 'og:image:height',
            content: '1240' // REPLACE
          },
          'og:image:alt': {
            property: 'og:image:alt',
            content: 'Logo'
          },
          'apple-meta-00': {
            name: 'apple-touch-fullscreen',
            content: 'no'
          },
          'apple-meta-01': {
            name: 'apple-mobile-web-app-capable',
            content: 'yes'
          },
          'apple-meta-02': {
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black-translucent'
          },
          'apple-meta-03': {
            name: 'apple-touch-icon',
            content: './favicon.ico'
          },
          'apple-meta-04': {
            name: 'apple-mobile-web-app-title',
            content: CONFIG.appName
          },
          'apple-meta-05': {
            name: 'apple-mobile-web-app-capable',
            content: 'yes'
          },
          'tel-meta': {
            name: 'format-detection',
            content: 'telephone=no'
          },
          'twitter:card': {
            name: 'twitter:card',
            content: 'app'
          },
          'twitter:title': {
            name: 'twitter:title',
            content: CONFIG.appName
          },
          'twitter:description': {
            name: 'twitter:description',
            content: packageJson.description
          },
          'twitter:image': {
            name: 'twitter:image',
            // REPLACE
            content:
              'https://raw.githubusercontent.com/jxmked/resources/xio/assets/icons/light/Windows/Square310x310Logo.scale-400.png'
          },
          'geo.country': {
            name: 'geo.country',
            content: 'PH'
          },
          'date': {
            name: 'date',
            content: DateToday
          },
          'dcterms.created': {
            name: 'dcterms.created',
            content: DateToday
          },
          'dcterms.modified': {
            name: 'dcterms.modified',
            content: DateToday
          }
        }
      }),

      new MiniCssExtractPlugin({
        filename: CONFIG.output.name + '.css',
        chunkFilename: CONFIG.output.chunk + '.css'
      }),

      new InterpolateHtmlPlugin({
        CDN: '',
        PUBLIC_URL: '',
        TITLE: CONFIG.appName,
        APP_VERSION: packageJson.version,
        APP_MODE: devMode ? 'development' : 'production',
        BASE_URL: packageJson.homepage,
        CURRENT_YEAR: current_year,
        CURRENT_DATE: DateToday,
        APP_REPOSITORY: APP_REPOSITORY,
        APP_TITLE_LENGTH: CONFIG.appName.length
      }),

      new CopyPlugin({
        patterns: [
          {
            from: 'public/',
            transform: {
              transformer(content, absoluteFrom) {
                if (!absoluteFrom.endsWith('.html')) return content;

                content = new Buffer(content).toString('utf8');

                const minified = HTMLMinifier.minify(content, {
                  html5: true,
                  keepClosingSlash: true,
                  minifyCSS: true,
                  quoteCharacter: '"',
                  removeComments: true,
                  minifyJS: true,
                  removeTagWhitespace: true,
                  caseSensitive: true
                });

                return Buffer.from(minified);
              }
            }
          }
        ]
      })
    ].concat(prodPlugins)
  };
}
