**Indocker** is a very simple tool that lets you execute commands/scripts inside a [Docker](https://docker.com) container.

### Why
One of the less obvious uses of [Docker](https://docker.com) containers is not as a service package, but as a tool. Let me explain.

Imagine you are working on the next cool thing and all your great code build without a hiccup on your machine, but then you push it and the automated build fails. You dig in and it turns out, that the tools you're using to build locally are not installed on the build server, or even worse, there is some version mismatch.

One way to go would be to try and install the correct versions on the build box. Then have everyone in the team synchronize their dev boxes, so they do not run into the same problem. And every time you need a change in the build environment you and your team will need to do this again.

If only there was a way to wrap your build environment in a nice package, that can be versioned and distributed as a single entity. Enter [Docker](https://docker.com). Just create an image with everything you need and use it as a build environment, that is exactly the same every time for everyone.

Unfortunately, this is easier said, than done. Building the image aside, when using the image, figuring out all the correct volume mappings, working folder, user settings, etc. can be rather tedious. And this is the motivation behind **indocker** - it will help you run inside a (tool) container by providing sensible defaults for this particular type of use.

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
### Example
To run *make* in *myorg/my-build-img* with current directory mounted inside the container and set as a working directory:
```sh
  indocker -i myorg/my-build-img make
```

### Usage
For a list of all options do:
```sh
  indocker --help
```
