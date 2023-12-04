import { SKIP, visit } from "unist-util-visit";
import { Node } from "unist";

const getImportMDXASTChild = (file: string, variable: string) => ({
  type: "mdxjsEsm",
  value: `import ${variable} from '${file}';`,
  data: {
    estree: {
      type: "Program",
      body: [
        {
          type: "ImportDeclaration",
          specifiers: [
            {
              type: "ImportDefaultSpecifier",
              local: {
                type: "Identifier",
                name: `${variable}`,
              },
            },
          ],
          source: {
            type: "Literal",
            value: `${file}`,
            raw: `'${file}'`,
          },
        },
      ],
      sourceType: "module",
      comments: [],
    },
  },
});

const getStaticCodeBlock = (targetToExpression: [string, string][]) => {
  const rv = {
    type: "mdxJsxFlowElement",
    name: "NoSelectorTargetCodeBlock",
    attributes: [],
    children: [],
    data: {
      _mdxExplicitJsx: true,
    },
  };

  targetToExpression.forEach(([target, exp]) => {
    rv.attributes.push(
      {
        type: "mdxJsxAttribute",
        name: `${target}`,
        value: {
          type: "mdxJsxAttributeValueExpression",
          value: `${exp}`,
          data: {
            estree: {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "Identifier",
                    name: `${exp}`,
                  },
                },
              ],
              sourceType: "module",
              comments: [],
            },
          },
        },
      } as never, // This looks like a disaster! But otherwise TS will complain lmao
    );
  });

  return rv;
};

export const TransformDynamicLFFileImportToStatic = (options) => {
  const transformer = async (
    ast: Node & { children: Node[] },
    filename: any,
  ) => {
    let number = 1;
    visit(
      ast,
      {
        type: "mdxJsxFlowElement",
        name: "DynamicMultiTargetCodeblock",
      },
      (
        node: {
          attributes: Record<"type" | "name" | "value", unknown>[];
        } & Record<string, unknown>,
      ) => {
        let lf_source_name: string | null = null;
        const supplied_sources: string[] = [];

        node.attributes.forEach((value) => {
          if (value.name === "file") {
            lf_source_name = value.value as string;
          } else {
            supplied_sources.push(value.name as string);
          }
        });

        if (lf_source_name == null) {
          return SKIP;
        }

        const sourceToExpAndFilepath = supplied_sources.map(
          (target): [string, string, string] => [
            target,
            `__import_lf_file_${target}_${number}_${lf_source_name}`,
            `./codes/${target}/${lf_source_name}.lf`,
          ],
        );

        sourceToExpAndFilepath.forEach(([_, exp, path]) => {
          // First, add import statements
          ast.children.unshift(getImportMDXASTChild(path, exp));
        });

        // Then, get what node is supposed to be
        const newNode = getStaticCodeBlock(
          sourceToExpAndFilepath.map(([target, exp, _]) => [target, exp]),
        );
        // Modify node
        Object.entries(newNode).forEach(([key, value]) => {
          node[key] = value;
        });

        ++number;
      },
    );
  };
  return transformer;
};
