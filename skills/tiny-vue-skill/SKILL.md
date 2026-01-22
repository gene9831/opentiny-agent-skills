---
name: tinyvue-develop-helper
description: TinyVue 组件库代码助手用于生成代码和实施指导，需要TinyVue组件库开发应用或修改，添加需求时使用。本技能提供严格的 API 约束，文档和示例的查找流程和代码规范。
license: MIT
metadata:
  author: opentiny
  version: "0.1.0"
---

# TinyVue 组件库开发助手

该技能包提供了`TinyVue组件库` 的所有组件的目录，以及组件库的开发文档，组件的API,和组件的demo 等知识，方便用户**快速生成准确的代码**, 请根据下面的指令获取信息。

## 什么时候使用

- 使用TinyVue组件库开发的项目时
- 配置TinyVue项目的主题，国际化时
- 使用TinyVue的图标库时
- 编写符合TinyVue的最佳开发实践的代码时

## 资源文件和文件夹说明

- ./menus.js : 存放所有TinyVue所有组件的名称。
- ./webdocs: 存放TinyVue工程配置的说明文档。
- ./apis : 存放每一个组件的api文档，包含：属性，事件，插槽和一些类型信息
- ./demos: 存放每一个组件的示例

## 使用方法

使用该技能时，先判断开发任务的目的，再阅读下面正确的文档进行索引查询。请严格遵循工程文档的规范和组件的API规范进行开发，严禁使用其它开源库的信息来猜测TinyVue组件库的用法。

| Rule                                        | Description                                                                      |
| ------------------------------------------- | -------------------------------------------------------------------------------- |
| [project-setting](rules/project-setting.md) | TinyVue工程配置的说明文档,比如快速安装，引用组件和国际化配置，主题配置和深色模式 |
| [component-use](rules/component-use.md)     | TinyVue组件的使用指南，如何查找组件的API,示例源码                                |
