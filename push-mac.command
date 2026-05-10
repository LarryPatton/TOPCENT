#!/usr/bin/env bash
set -euo pipefail

# macOS：双击运行（Terminal 会自动打开）
# 作用：提示输入提交说明，然后自动 add/commit/push

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

echo "仓库路径：$REPO_ROOT"
read -r -p "请输入提交说明（可留空自动生成）： " MSG

if [[ -z "${MSG:-}" ]]; then
  ./scripts/push-github.sh
else
  ./scripts/push-github.sh "$MSG"
fi

echo
read -r -p "已完成。按回车关闭窗口..." _

