# 富文本组件使用

> 富文本采用的CKEditor 4，[文档地址>>>](https://ckeditor.com/docs/ckeditor4/latest/)

## 可传入的props
- `v-modal`: 富文本的数据内容
- `config`: 富文本原有配置
- `need-bottom-tools`: 底部工具，中英标点互转等
- `readonly`: 是否禁用
- `upload-image-config`: 图片上传的一些配置

## 组件示例
```html
<!-- removeButtons：删除一些不需要的工具按钮 -->
<CK-editor
    v-model="formModel.content"
    :readonly="isReadOnly"
    :config="{
        removeButtons: ['Paste', 'PasteText', 'PasteFromWord']
    }"
    @on-uploaded="_getContent"
></CK-editor>
```

## 一些参数
- `fullPage: true`: 禁止删除html、body等标签
- `autoParagraph: false`: 禁止自动添加p标签

# 富文本所有按钮中英对照
- 源码 ==> Source
- 保存 ==> Save
- 新建 ==> NewPage
- 预览 ==> Preview
- 打印 ==> Print
- 模版 ==> Templates
- 剪切 ==> Cut
- 复制 ==> Copy
- 粘贴 ==> Paste
- 粘贴为无格式文本 ==> PasteText
- 从 MS Word 粘贴 ==> PasteFromWord
- 撤消 ==> Undo
- 重做 ==> Redo
- 查找 ==> Find
- 替换 ==> Replace
- 全选 ==> SelectAll
- 即时拼写检查 ==> Scayt
- 表单 ==> Form
- 复选框 ==> Checkbox
- 单选按钮 ==> Radio
- 单行文本 ==> TextField
- 多行文本 ==> Textarea
- 列表/菜单 ==> Select
- 按钮 ==> Button
- 图像按钮 ==> ImageButton
- 隐藏域 ==> HiddenField
- 加粗 ==> Bold
- 倾斜 ==> Italic
- 下划线 ==> Underline
- 删除线 ==> Strike
- 下标 ==> Subscript
- 上标 ==> Superscript
- 格式刷 ==> CopyFormatting
- 清除格式 ==> RemoveFormat
- 编号列表 ==> NumberedList
- 项目列表 ==> BulletedList
- 减少缩进量 ==> Outdent
- 增加缩进量 ==> Indent
- 块引用 ==> Blockquote
- 创建 DIV 容器 ==> CreateDiv
- 左对齐 ==> JustifyLeft
- 居中 ==> JustifyCenter
- 右对齐 ==> JustifyRight
- 两端对齐 ==> JustifyBlock
- 文字方向为从左至右 ==> BidiLtr
- 文字方向为从右至左 ==> BidiRtl
- 设置语言 ==> Language
- 插入/编辑超链接 ==> Link
- 取消超链接 ==> Unlink
- 插入/编辑锚点链接 ==> Anchor
- 图像 ==> Image
- Flash ==> Flash
- 表格 ==> Table
- 插入水平线 ==> HorizontalRule
- 表情符 ==> Smiley
- 插入特殊符号 ==> SpecialChar
- 插入打印分页符 ==> PageBreak
- IFrame ==> Iframe
- 样式 ==> Styles
- 格式 ==> Format
- 字体 ==> Font
- 大小 ==> FontSize
- 文本颜色 ==> TextColor
- 背景颜色 ==> BGColor
- 全屏 ==> Maximize
- 显示区块 ==> ShowBlocks
- 关于 CKEditor 4 ==> About
