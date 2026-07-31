const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'util/' || moduleName.startsWith('util/')) {
    const cleanName = moduleName.replace(/^util\//, 'util');
    return context.resolveRequest(context, cleanName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
