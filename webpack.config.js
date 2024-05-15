module.exports = {
  target: 'web',
  resolve: {
    fallback: {
      "child_process": false,
      "fs": false,
      "path": false,
      "net": false,
      "tls": false,
      "assert": false
    }
  }
};
