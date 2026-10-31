## 一、项目规范与验收标准

- Before adding complexity for a speculative or vanishingly unlikely race or security edge case, explain the concrete failure mode, likelihood, and complexity cost to the user and get their buy-in. Do not silently expand scope for theoretical robustness
- 前端、排版、设计、PPT、PDF 等项目，都要不断通过渲染和查看来验收，不断调整排版和句式，直到排版优美，各种元素和谐

## 二、最终消息风格

- 回复紧凑，避免不必要的换行

## 三、数据安全

- 删除文件或程序时，优先使用包管理器，其次是移到回收站，不要使用 rm
- 未经用户明确授权，禁止执行 commit 或 push，授权仅单次

## 四、资源管理

- 将 skills 统一存放在 `~/.agents`

## 五、工具使用

### 1. 工具路由

- 包管理器 apt ≈ brew > pnpm > npm > uv > scoop > winget
- 学术搜索优先使用 paper-search
- GitHub 交互优先使用 gh
- 环境中已经有以下常见软件，请优先使用他们：
  - 文件：rg、fd、fzf、file、7zip、clamav
  - 数据处理：jq、yq、dasel、sqlite(3)
  - 多媒体：ffmpeg、imagemagick、yt-dlp、mediainfo
  - 网络：curl、aria2(c)、iperf3、tshark
  - 开发：go-task、clang、lldb、llvm、cmake、hyperfine、tmux
- 其他工具优先使用 npx(node) 或 uv(x)，要善用它们的生态，非高危工具直接使用即可，无需授权
- 在 windows 中
  - 请优先使用 bash 而非 powershell
  - microsoft-coreutils 已安装，已包含大部分 unix like 工具
  - tmux 改为 psmux，语法基本无差异

### 2. fd（文件搜索增强）

- fd 指 sharkdp/fd，是 find 的性能更好的现代替代品；查找文件和目录时优先使用它
- 基本语法：`fd [OPTIONS] [pattern] [path]...`
- 默认从当前目录递归搜索，pattern 默认按 Rust regex syntax 匹配文件名
- 默认跳过隐藏路径和被忽略路径

```bash
# 当前目录或指定目录中查找
fd 'pattern'
fd 'pattern' 'src/'
# 只查找文件；只查找目录；按扩展名查找
fd -t f 'pattern'
fd -t d 'pattern'
fd -e 'rs'
# 使用 glob / 匹配完整路径
fd -g '*.test.ts'
fd -p 'src/.*/test_.*\.py'
# 包含隐藏路径 / 被忽略路径
fd -H 'pattern'
fd -I 'pattern'
# 与 rg 组合搜索内容；对每个结果执行命令
fd -e 'rs' -X rg -n 'TODO|FIXME'
fd -e 'json' -x jq empty
# 查看更多选项
fd --help
```

### 3. fzf（模糊筛选增强）

基本语法：`命令 | fzf --filter='QUERY'`

```bash
# 在文件列表中模糊筛选
fd -t f | fzf --filter='README'
# 在文件中模糊筛选
cat file.txt | fzf --filter='QUERY'
```

### 4. tmux（会话、交互、调试增强）

- 会话 id 命名统一规范：`pi-<项目>-<会话ID>-<任务>`，例如 `pi-sqlite_v3-9766127e-source_download`
  - 使用 `PI_SESSION_ID` 区分 Pi 会话，取末尾 8 位。

```bash
# 项目 ID
project_id="${PWD##*/}"
# 会话 ID
pi_session_id="${PI_SESSION_ID:-manual}"
# 最终会话名
tmux_session_id="pi-${project_id}-${pi_session_id: -8}-task_name"

# 查看会话列表
tmux list-sessions
# 启动会话
tmux new-session -d -s "$tmux_session_id" 'python -i'
# 发送命令(C-m 模拟回车)
tmux send-keys -t "$tmux_session_id" 'print(2 + 2)' C-m
# 查看输出
tmux capture-pane -p -t "$tmux_session_id"
# 结束会话
tmux kill-session -t "$tmux_session_id"
# ...
```

### 5. clamav（安全增强）

- 网络下载的二进制文件，请用 clamav 扫描
- 如：`freshclam && clamscan -ir ~/Downloads`
