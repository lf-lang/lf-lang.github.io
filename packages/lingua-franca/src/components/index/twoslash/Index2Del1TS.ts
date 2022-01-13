// twoslash: { themes: ["../../../packages/lingua-franca/lib/themes/typescript-beta-light"] }
// @noErrors
type Result = "pass" | "fail"

function verify(result: Result) {
  if (result === "pass") {
    console.log("Passed")
  } else {
    console.log("Failed")
  }
}
