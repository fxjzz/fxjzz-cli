const getDeps = (answers) => {
  const { preset, eslintConfig } = answers;
  const DEPS_MAP = {
    Vue: {
      base: {
        eslint: "^8.36.0",
        "eslint-plugin-vue": "^9.9.0",
      },
      airbnb: {
        eslint: "^7.32.0 || ^8.2.0",
        "eslint-config-airbnb-base": "^15.0.0",
        "eslint-plugin-import": "^2.25.2",
        "eslint-plugin-vue": "^9.9.0",
      },
      xo: {
        eslint: ">=8.0.0",
        "eslint-config-xo": "^0.43.1",
        "eslint-plugin-vue": "^9.9.0",
        ...(answers.features.includes("TypeScript")
          ? {
              "@typescript-eslint/eslint-plugin": "^5.43.0",
              "eslint-config-xo-typescript": "^0.56.0",
              "@typescript-eslint/parser": ">=5.43.0",
            }
          : {}),
      },
      standard: {
        eslint: "^8.0.1",
        "eslint-config-standard": "^17.0.0",
        "eslint-plugin-import": "^2.25.2",
        "eslint-plugin-n": "^15.0.0",
        "eslint-plugin-promise": "^6.0.0",
        "eslint-plugin-vue": "^9.9.0",
        ...(answers.features.includes("TypeScript")
          ? {
              "@typescript-eslint/eslint-plugin": "^5.43.0",
              "eslint-config-standard-with-typescript": "^34.0.1",
            }
          : {}),
      },
    },
    React: {
      base: {
        eslint: "^8.36.0",
        "eslint-plugin-react": "^7.32.2",
        ...(answers.features.includes("TypeScript")
          ? {
              "@typescript-eslint/eslint-plugin": "^5.56.0",
              "@typescript-eslint/parser": "^5.56.0",
            }
          : {}),
      },
      airbnb: {
        eslint: "^7.32.0 || ^8.2.0",
        "eslint-config-airbnb": "^19.0.4",
        "eslint-plugin-import": "^2.25.3",
        "eslint-plugin-jsx-a11y": "^6.5.1",
        "eslint-plugin-react": "^7.28.0",
        "eslint-plugin-react-hooks": "^4.3.0",
      },
      xo: {
        eslint: ">=8.27.0",
        "eslint-config-xo": "^0.43.1",
        "eslint-plugin-react": "^7.32.2",
        ...(answers.features.includes("TypeScript")
          ? {
              "@typescript-eslint/eslint-plugin": ">=5.43.0",
              "@typescript-eslint/parser": ">=5.43.0",
              "eslint-config-xo-typescript": "^0.56.0",
            }
          : {}),
      },
      standard: {
        "eslint-config-standard": "^17.0.0",
        eslint: "^8.0.1",
        "eslint-plugin-import": "^2.25.2",
        "eslint-plugin-n": "^15.0.0",
        "eslint-plugin-promise": "^6.0.0",
        "eslint-plugin-react": "^7.32.2",
        ...(answers.features.includes("TypeScript")
          ? { "@typescript-eslint/eslint-plugin": "^5.43.0" }
          : {}),
      },
    },
  };
  const deps = {
    ...DEPS_MAP[preset][eslintConfig],
    //prettier配置
    ...{
      prettier: "^2.8.6",
      "eslint-config-prettier": "^8.8.0",
      "eslint-plugin-prettier": "^4.2.1",
      "vite-plugin-eslint": "^1.8.1",
    },
  };
  return deps;
};
export default getDeps;
