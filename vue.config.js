module.exports = {
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    }
  },

  runtimeCompiler: true,
  productionSourceMap: false,

  css: {
    extract: false
  },

  pwa: {
    name: "AbitOnline",
    themeColor: "#008081"
  }
};
