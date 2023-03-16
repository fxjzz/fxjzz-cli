const preprocessorVersion = {
  sass: "^1.59.3",
  less: "^4.1.3",
  stylus: "^0.59.0",
};

export default (api, options, answers) => {
  const preprocessor = answers.cssPreprocessor;
  api.extendPackage({
    devDependencies: {
      [preprocessor]: preprocessorVersion[preprocessor],
    },
  });
};
