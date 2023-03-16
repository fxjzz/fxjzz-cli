export default (api, opts, answers) => {
  const hasTypeScript = answers.features?.includes("TypeScript");

  if (answers.preset === "React") {
    if (hasTypeScript) {
      api.render("./template/template-react-ts", { plugin: "cli-service" });
    } else {
      api.render("./template/template-react", {
        plugin: "cli-service",
        data: {
          name: "fxjzz_cli",
        },
      });
    }

    api.extendPackage({
      scripts: {
        dev: "vite",
        build: hasTypeScript ? "vue-tsc && vite build" : "vite build",
        preview: "vite preview",
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
      },
      devDependencies: {
        "@types/react": "^18.0.27",
        "@types/react-dom": "^18.0.10",
        "@vitejs/plugin-react": "^3.1.0",
        vite: "^4.1.0",
      },
    });
  } else if (answers.preset === "Vue") {
    if (hasTypeScript) {
      api.render("./template/template-vue-ts", { plugin: "cli-service" });
    } else {
      api.render("./template/template-vue", { plugin: "cli-service" });
    }
    api.extendPackage({
      scripts: {
        dev: "vite",
        build: hasTypeScript ? "vue-tsc && vite build" : "vite build",
        preview: "vite preview",
      },
      dependencies: {
        vue: "^3.2.45",
      },
      devDependencies: {
        "@vitejs/plugin-vue": "^4.0.0",
        vite: "^4.1.0",
      },
    });
  }
};
