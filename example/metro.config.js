/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');
// const blacklist = require('metro-config/src/defaults/exclusionList');

const reactNativeLib = path.resolve(__dirname, '..');

module.exports = {
  watchFolders: [path.resolve(__dirname, 'node_modules'), reactNativeLib],
  // resolver: {
  //   blacklistRE: blacklist([
  //     // new RegExp(`${reactNativeLib}/node_modules/react-native/.*`),
  //     // new RegExp(`${reactNativeLib}/node_modules/react/.*`),
  //   ]),
  // },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
