/**
 * ESLint Custom Rule: 未登録Server Actionsの検出
 *
 * このルールは、features配下のServer Actionsが
 * lib/actions/index.tsに登録されているかをチェックします。
 *
 * 使用方法:
 * eslint.config.mjsに以下を追加:
 * ```javascript
 * import checkActionsRule from './scripts/eslint-check-actions-rule.mjs';
 *
 * export default [
 *   {
 *     plugins: {
 *       'custom': {
 *         rules: {
 *           'check-actions-registration': checkActionsRule,
 *         },
 *       },
 *     },
 *     rules: {
 *       'custom/check-actions-registration': 'error',
 *     },
 *   },
 * ];
 * ```
 */

import fs from 'fs';
import path from 'path';

/**
 * @type {import('eslint').Rule.RuleModule}
 */
const checkActionsRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ensure all Server Actions in features/*/actions are registered in lib/actions/index.ts',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      unregisteredAction:
        'Server Action "{{actionFile}}" in feature "{{feature}}" is not registered in lib/actions/index.ts',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // lib/actions/index.tsファイルのみをチェック
    if (
      !filename.endsWith('lib/actions/index.ts') &&
      !filename.endsWith('lib/actions/index.tsx')
    ) {
      return {};
    }

    return {
      Program(node) {
        const sourceCode = context.getSourceCode();
        const text = sourceCode.getText();

        // プロジェクトルートディレクトリを取得
        const projectRoot = findProjectRoot(filename);
        if (!projectRoot) return;

        const featuresDir = path.join(projectRoot, 'features');
        if (!fs.existsSync(featuresDir)) return;

        // すべてのactionモジュールを検索
        const allModules = findAllActionModules(featuresDir);

        // 未登録のactionsを検出
        for (const mod of allModules) {
          const importPattern = new RegExp(
            'from [\'"`]@/features/' +
              mod.feature +
              '/actions/' +
              mod.actionFile +
              '[\'"`]',
            'g',
          );

          if (!importPattern.test(text)) {
            context.report({
              node,
              messageId: 'unregisteredAction',
              data: {
                feature: mod.feature,
                actionFile: mod.actionFile,
              },
            });
          }
        }
      },
    };
  },
};

/**
 * プロジェクトルートディレクトリを検索
 */
function findProjectRoot(startPath) {
  let currentDir = path.dirname(startPath);

  while (currentDir !== path.dirname(currentDir)) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  return null;
}

/**
 * features配下のすべてのactionモジュールを検索
 */
function findAllActionModules(featuresDir) {
  const modules = [];
  const features = fs.readdirSync(featuresDir);

  for (const feature of features) {
    const featurePath = path.join(featuresDir, feature);

    try {
      const stat = fs.statSync(featurePath);
      if (!stat.isDirectory()) continue;

      const actionsDir = path.join(featurePath, 'actions');

      if (fs.existsSync(actionsDir)) {
        const actionFiles = fs
          .readdirSync(actionsDir)
          .filter(
            (file) =>
              file.endsWith('.ts') &&
              !file.endsWith('.test.ts') &&
              !file.endsWith('.d.ts'),
          );

        for (const file of actionFiles) {
          modules.push({
            feature,
            actionFile: file.replace('.ts', ''),
          });
        }
      }
    } catch {
      // ディレクトリアクセスエラーは無視
      continue;
    }
  }

  return modules;
}

export default checkActionsRule;
