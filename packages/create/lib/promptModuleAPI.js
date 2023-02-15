class promptModuleAPI {
  constructor(creator) {
    this.creator = creator
  }

  //注入feature
  injectFeature(feature) {
    this.creator.featurePrompt.choices?.push(feature)
  }

  injectPrompt(prompt) {
    this.creator.injectPrompts.push(prompt)
  }

  onPromptComplete(cb) {
    this.creator.promptCompleteCbs.push(cb)
  }
}

export default promptModuleAPI