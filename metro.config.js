// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// config.resolver.extraNodeModules = {
//   ...config.resolver.extraNodeModules,
//   react: require.resolve('react'),
//   'react/jsx-runtime': require.resolve('react/jsx-runtime'),
//   'react-dom': require.resolve('react-dom'),
// };


module.exports = config;
