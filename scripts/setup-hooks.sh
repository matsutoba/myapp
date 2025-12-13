#!/bin/bash

# ローカル開発用 Git hooks のセットアップ
# リポジトリをクローン後に実行してください: bash scripts/setup-hooks.sh
#
# このスクリプトは以下の hooks をセットアップします：
# - pre-commit: コミット前にリンティングを実行
# - pre-push: 保護されたブランチへの push 前にテストを実行

set -e

echo "Git hooks をセットアップしています..."

# .git/hooks ディレクトリが存在しない場合は作成
mkdir -p .git/hooks

# .githooks から .git/hooks に hooks をコピー
for hook in .githooks/*; do
    if [ -f "$hook" ]; then
        filename=$(basename "$hook")
        cp "$hook" ".git/hooks/$filename"
        chmod +x ".git/hooks/$filename"
        echo "✅ インストール完了: $filename"
    fi
done

# Git のカスタム hooks パスを設定（代替方法）
git config core.hooksPath .githooks

echo "✅ Git hooks のセットアップが完了しました！"
echo ""
echo "利用可能な hooks："
echo "  • pre-commit: 'git commit' 時に実行（リント チェック）"
echo "  • pre-push: 'git push' 時に実行（テスト スイート）"
echo ""
echo "次のステップ："
echo "1. Hooks は .git/hooks/ で有効になっています"
echo "2. コミットを作成して pre-commit hook をテスト"
echo "3. 変更を push して pre-push hook をテスト"
echo "3. Test by running: git push (on feature branch to avoid blocking main)"
