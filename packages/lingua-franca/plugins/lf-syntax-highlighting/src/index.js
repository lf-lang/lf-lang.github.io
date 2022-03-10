
const highlight = require("./highlight")

module.exports = ({ markdownAST }, pluginOptions) => {
  import("unist-util-visit").then(unistUtilVisit => {
    const visit = unistUtilVisit.visit
    import("mdast-util-to-string").then(mdastUtilToString => {
      const toString = mdastUtilToString.toString
      let promises = []
      visit(markdownAST, "code", (node) => {
        node.type = "html"
        node.children = undefined
        promises.push(highlight.annotateCode(toString(node)).then(
          annotated => node.value = `<pre>${annotated}</pre>`
        ))
      })
      return Promise.all(promises).then(() => markdownAST)
    })
  })
}
