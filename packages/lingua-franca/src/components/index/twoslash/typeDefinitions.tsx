// twoslash: { themes: ["min-dark", "../../../packages/lingua-franca/src/components/index/twoslash/homepage"] }
// @noErrors
// @esModuleInterop
import express from "express"
const app = express()

app.get("/", function (req, res) {
  res.sen
//       ^|
})

app.listen(3000)
