module.exports = {
  presets: [
    '@vue/app'
  ],
  "plugins": [
    [
      "babel-plugin-root-import",
      {
        "rootPathSuffix": "./",
        "rootPathPrefix": "~"
      }
    ]
  ]
}