/**
 * Server Actions自動登録チェックスクリプト
 *
 * features配下のactionsディレクトリを走査し、
 * lib/actions/index.tsに登録されていないactionsを検出します。
 *
 * 使用方法:
 * npm run check-actions
 *
 * または package.json の scripts に追加:
 * "check-actions": "tsx scripts/check-actions.ts"
 */

import * as fs from 'fs';
import * as path from 'path';

const FEATURES_DIR = path.join(process.cwd(), 'features');
const ACTIONS_INDEX = path.join(process.cwd(), 'lib', 'actions', 'index.ts');

interface ActionModule {
  feature: string;
  actionFile: string;
  fullPath: string;
}

/**
 * features配下のすべてのactionsディレクトリを検索
 */
function findAllActionModules(): ActionModule[] {
  const modules: ActionModule[] = [];

  if (!fs.existsSync(FEATURES_DIR)) {
    return modules;
  }

  const features = fs.readdirSync(FEATURES_DIR);

  for (const feature of features) {
    const featurePath = path.join(FEATURES_DIR, feature);
    const stat = fs.statSync(featurePath);

    if (!stat.isDirectory()) continue;

    const actionsDir = path.join(featurePath, 'actions');

    if (fs.existsSync(actionsDir)) {
      const actionFiles = fs
        .readdirSync(actionsDir)
        .filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts'));

      for (const file of actionFiles) {
        modules.push({
          feature,
          actionFile: file.replace('.ts', ''),
          fullPath: `@/features/${feature}/actions/${file.replace('.ts', '')}`,
        });
      }
    }
  }

  return modules;
}

/**
 * lib/actions/index.tsの内容を読み込み
 */
function readActionsIndex(): string {
  if (!fs.existsSync(ACTIONS_INDEX)) {
    throw new Error(`Actions index file not found: ${ACTIONS_INDEX}`);
  }
  return fs.readFileSync(ACTIONS_INDEX, 'utf-8');
}

/**
 * チェック実行
 */
function checkActions() {
  console.log('🔍 Checking Server Actions registration...\n');

  const allModules = findAllActionModules();
  const indexContent = readActionsIndex();

  const unregistered: ActionModule[] = [];
  const registered: ActionModule[] = [];

  for (const mod of allModules) {
    // インポート文が存在するかチェック
    const importPattern = new RegExp(`from ['"]${mod.fullPath}['"]`, 'g');

    if (importPattern.test(indexContent)) {
      registered.push(mod);
    } else {
      unregistered.push(mod);
    }
  }

  // 結果表示
  console.log(`✅ Registered: ${registered.length} action modules`);
  registered.forEach((m) => {
    console.log(`   - ${m.feature}/${m.actionFile}`);
  });

  if (unregistered.length > 0) {
    console.log(`\n⚠️  Unregistered: ${unregistered.length} action modules`);
    unregistered.forEach((m) => {
      console.log(`   - ${m.feature}/${m.actionFile}`);
    });

    console.log(
      '\n📝 To register these actions, add them to lib/actions/index.ts:',
    );
    console.log('\n```typescript');

    // グループ化して表示
    const byFeature = unregistered.reduce((acc, m) => {
      if (!acc[m.feature]) acc[m.feature] = [];
      acc[m.feature].push(m);
      return acc;
    }, {} as Record<string, ActionModule[]>);

    for (const [feature, modules] of Object.entries(byFeature)) {
      console.log(`// ${feature} actions`);
      for (const m of modules) {
        console.log(
          `import * as ${feature}${m.actionFile}Actions from '${m.fullPath}';`,
        );
      }
      console.log('');
    }

    console.log('export const actions = {');
    for (const [feature, modules] of Object.entries(byFeature)) {
      const actionVars = modules
        .map((m) => `${feature}${m.actionFile}Actions`)
        .join(', ');
      console.log(
        `  ${feature}: createAutoErrorProxy(mergeActions(${actionVars})),`,
      );
    }
    console.log('};');
    console.log('```\n');

    process.exit(1);
  }

  console.log('\n✨ All Server Actions are properly registered!');
}

// 実行
checkActions();
