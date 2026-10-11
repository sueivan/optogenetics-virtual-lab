# 光遗传学虚拟实验教学平台 V0.1.4

仓库建议名称：`optogenetics-virtual-lab`

这是一个面向医学、护理、药学及生命科学本科教学的纯前端网站。核心不是普通科普介绍，而是交互式神经元光刺激实验：学生可选择 ChR2、NpHR、ArchT，调整波长、光强、脉冲频率和刺激时长，观察教学模型预测的膜电位变化。

V0.1.4 扩充医学应用案例，加入学习与记忆、帕金森病、视网膜疾病三项分层说明，并补充可点击的高质量期刊来源。

## 文件结构

```text
optogenetics-virtual-lab-v0.1/
├── index.html
├── styles.css
├── app.js
├── manifest.webmanifest
├── LICENSE_NOTICE.md
└── README.md
```

## 本地使用

直接双击 `index.html` 即可打开。若浏览器限制本地脚本，可在文件夹内启动一个本地服务器：

```bash
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## 上传 GitHub Pages

1. 新建 GitHub 仓库，建议命名为 `optogenetics-virtual-lab`。
2. 上传本文件夹内所有文件，不要只上传 ZIP。
3. 进入仓库 `Settings` → `Pages`。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/root`。
6. 保存后等待 1-3 分钟。

发布后网址通常是：

```text
https://sueivan.github.io/optogenetics-virtual-lab/
```

## 教学定位

- 可用于课堂导入、实验课预习、课后复习。
- 适合讲解光敏蛋白、光刺激参数、膜电位变化和医学转化边界。
- 不用于真实实验数据分析，不用于临床诊断、治疗建议或医疗器械用途。

## 后续版本建议

- V0.2：加入实验记录导出、学生填写观察结论、教师评分表。
- V0.3：加入病例卡片，如视网膜疾病、帕金森病、记忆环路。
- V0.4：加入中英文双语切换和课堂题库扩展。
- V0.5：加入可选 3D 神经元或脑区环路示意。

## 开发署名

软件开发：苏裕盛 教授／医学博士
