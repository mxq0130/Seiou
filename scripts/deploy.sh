#!/bin/bash
# ============================================
# boke 博客 - 一键部署脚本
# 适用于 1Panel + PM2 部署环境
# 使用方式:
#   chmod +x scripts/deploy.sh
#   ./scripts/deploy.sh
# ============================================

set -e  # 遇到错误立即停止

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
echo_ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
echo_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
echo_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 项目根目录（脚本在 scripts/ 目录中，需要回到上级）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo_info "项目目录: ${PROJECT_DIR}"
echo_info "开始部署..."

# ----- 1. 拉取最新代码 -----
echo ""
echo_info "步骤 1/5: 拉取最新代码..."
cd "${PROJECT_DIR}"
if git rev-parse --git-dir > /dev/null 2>&1; then
    git pull origin main || echo_warn "Git pull 失败（可能是网络问题或非 git 部署），跳过"
else
    echo_warn "非 Git 仓库，跳过拉取"
fi

# ----- 2. 安装 API 依赖 -----
echo ""
echo_info "步骤 2/5: 安装 API 服务依赖..."
cd "${PROJECT_DIR}/apps/server"
npm install --production
npx prisma generate
echo_ok "API 依赖安装完成"

# ----- 3. 安装并构建管理后台 -----
echo ""
echo_info "步骤 3/5: 构建管理后台..."
cd "${PROJECT_DIR}/apps/admin"
npm install
npm run build
echo_ok "管理后台构建完成 → apps/admin/dist/"

# ----- 4. 安装并构建博客前端（SSR 模式） -----
echo ""
echo_info "步骤 4/5: 构建博客前端（SSR 模式）..."
cd "${PROJECT_DIR}/apps/blog"
npm install
npm run build
echo_ok "博客前端构建完成 → apps/blog/dist/"

# ----- 5. 重启 PM2 进程 -----
echo ""
echo_info "步骤 5/5: 重启 PM2 进程..."

# 检查 PM2 是否安装
if ! command -v pm2 &> /dev/null; then
    echo_error "PM2 未安装！请先安装: npm install -g pm2"
    exit 1
fi

# 重启 API 服务
cd "${PROJECT_DIR}/apps/server"
if pm2 list | grep -q "boke-api"; then
    pm2 restart boke-api
    echo_ok "boke-api 已重启"
else
    pm2 start npm --name "boke-api" -- run start
    echo_ok "boke-api 已启动"
fi

# 重启博客 SSR 服务
cd "${PROJECT_DIR}/apps/blog"
if pm2 list | grep -q "boke-blog"; then
    pm2 restart boke-blog
    echo_ok "boke-blog 已重启"
else
    pm2 start npm --name "boke-blog" -- run start
    echo_ok "boke-blog 已启动"
fi

# 保存 PM2 进程列表（开机自启）
pm2 save

# ----- 完成 -----
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 部署完成！${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  博客前端:  http://127.0.0.1:4321"
echo "  API 服务:  http://127.0.0.1:3000/api/v1/health"
echo "  管理后台:  通过 Nginx /admin 访问"
echo ""
echo "  验证命令:"
echo "    curl http://127.0.0.1:4321/"
echo "    curl http://127.0.0.1:3000/api/v1/health"
echo "    pm2 status"
echo "    pm2 logs"
echo ""
echo "  如需首次初始化数据库，运行:"
echo "    cd apps/server && npm run db:seed"
echo ""
