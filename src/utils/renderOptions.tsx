import { BLOCKS } from "@contentful/rich-text-types"
import type { Block, Inline } from "@contentful/rich-text-types"
import type { Options } from "@contentful/rich-text-html-renderer"

export const renderOptions: Partial<Options> = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (
      node: Block | Inline
    ) => `<img src=https://${node.data.target.fields.file.url}
          height=${node.data.target.fields.file.details.image.height}
          width=${node.data.target.fields.file.details.image.width}
          alt=${node.data.target.fields.description} />`,
  },
}
