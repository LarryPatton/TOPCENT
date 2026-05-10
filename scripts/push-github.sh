#!/usr/bin/env bash
set -euo pipefail

# 一键：add → commit → push
# 用法：
#   ./scripts/push-github.sh "你的提交说明"
#   ./scripts/push-github.sh            # 不传则自动生成提交说明
#
# 说明：
# - 默认推送当前分支到 origin
# - 如果没有任何改动，会直接退出

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

if ! command -v git >/dev/null 2>&1; then
  echo "未找到 git，请先安装 Git。"
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "当前目录不是 Git 仓库：$REPO_ROOT"
  exit 1
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
MSG="${1:-}"
if [[ -z "$MSG" ]]; then
  TS="$(date '+%Y-%m-%d %H:%M:%S')"
  MSG="chore: auto push ${TS}"
fi

# 没有改动就退出
if [[ -z "$(git status --porcelain)" ]]; then
  echo "工作区没有改动，无需提交。"
  exit 0
fi

echo "当前分支：$BRANCH"
echo "准备提交信息：$MSG"

git add -A

# 没有可提交内容就退出（例如只有被忽略的文件变化）
if git diff --cached --quiet; then
  echo "没有可提交的变更（可能都被 .gitignore 忽略了）。"
  exit 0
fi

git commit -m "$MSG"

echo "开始推送到 origin/$BRANCH ..."
git push origin "$BRANCH"
echo "完成。"

