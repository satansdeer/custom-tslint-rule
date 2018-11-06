import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "import statement forbidden";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new NoImportsWalker(sourceFile, this.getOptions())
    );
  }
}

// The walker takes care of all the work.
class NoImportsWalker extends Lint.RuleWalker {
  public visitImportDeclaration(node: ts.ImportDeclaration) {
    const isNotAllowedPackage = this.getOptions().some(packageName => {
      const text = node.moduleSpecifier.getText().replace(/'|"/g, "");
      return text === packageName;
    });

    if (isNotAllowedPackage) {
      this.addFailureAtNode(node, Rule.FAILURE_STRING);
    }

    super.visitImportDeclaration(node);
  }
}
