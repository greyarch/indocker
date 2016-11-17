**Indocker** is a very simple tool that lets you execute commands/scripts inside a [Docker](https://docker.com) container.

### Dependencies
You'll need to have [Docker installed](https://www.docker.com/products/docker) on your system.

### Installation
With npm:
```sh
  npm i -g indocker
```
With yarn:
```sh
  yarn global add indocker
```
### Usage
Let's say you want to build a project, but do not want to install all sorts of build tools. Instead you'll create a build image with all the tools you need and in your project dir do:
```sh
  indocker -i myorg/my-build-img make
```
For a list of all options do:
```sh
  indocker --help
```
