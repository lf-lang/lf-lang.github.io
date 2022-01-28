import { defineMessages } from "react-intl"
import { navCopy } from "./nav"
import { docCopy } from "./documentation"
import { indexCopy as index2Copy } from "./index2"
import { comCopy } from "./community"
import { handbookCopy } from "./handbook"
import { footerCopy } from "./footer"

export const messages = {
  ...navCopy,
  ...docCopy,
  ...comCopy,
  ...handbookCopy,
  ...index2Copy,
  ...footerCopy
}

export const lang = defineMessages(messages)

export type Copy = typeof lang
