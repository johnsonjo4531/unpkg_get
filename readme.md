# unpkg_get

- [unpkg_get](#unpkgget)
	- [What](#what)
	- [Why](#why)
	- [Where](#where)
	- [How](#how)
		- [Basic Usage:](#basic-usage)
		- [Import Maps Usage:](#import-maps-usage)
			- [Required Manual Configuration](#required-manual-configuration)
			- [Error Handling](#error-handling)
	- [Install](#install)
	- [Todo](#todo)

##  What

A command line program to get an es2015 module from unpkg and install it and all its dependencies into an `unpkg.com` folder. Basically, it's a simple wrapper around `deno fetch` that copies the unpkg.com directory and all its sub-directories and moves it to the current working directory.

## Why

Because, you may want to use others es2015 modules directly in the browser with no transpiling
step other than to the current flavor of JavaScript which is hopefully already provided by those who upload to unpkg.

## Where

Main module is [`unpkg_get.ts`](./unpkg_get.ts)

##  How

### Basic Usage:

If your module has dependencies from npm you should see the import maps usage section otherwise this basic usage should work:

```bash
$ unpkg_get -A @webcomponents/custom-elements
```

This installs all dependencies deno style, but with the output
directory starting from `./unpkg.com` and gives the following directory structure:

```bash
$ tree ./unpkg.com
./unpkg.com
└── @webcomponents
    ├── custom-elements.headers.json
    └── custom-elements@1.2.4
        └── custom-elements.min.js

2 directories, 2 files
```

### Import Maps Usage:

More regularly your module from unpkg will have other dependencies from npm that you can get from unpkg.com. The below requires the following import map which describes `lit-html`'s location on unpkg. `lit-html` is the only dependency of `lit-element` which makes this a little easier.

```json
{
  "imports": {
    "lit-html": "https://unpkg.com/lit-html@1.1.1/lit-html.js",
    "lit-html/": "https://unpkg.com/lit-html@1.1.1/"
  }
}
```

notice how the option below is `importmapping` instead of deno's regular `importmap`

```bash
$ unpkg_get -A --importmapping=lit-element-importmap.json lit-element
```

which gives the following directory structure:

```bash
$ tree ./unpkg.com/
./unpkg.com/
├── lit-element.headers.json
├── lit-element@2.2.1
│   ├── lib
│   │   ├── css-tag.js
│   │   ├── decorators.js
│   │   └── updating-element.js
│   └── lit-element.js
└── lit-html@1.1.1
    ├── lib
    │   ├── default-template-processor.js
    │   ├── directive.js
    │   ├── dom.js
    │   ├── modify-template.js
    │   ├── part.js
    │   ├── parts.js
    │   ├── render.js
    │   ├── shady-render.js
    │   ├── template-factory.js
    │   ├── template-instance.js
    │   ├── template-result.js
    │   └── template.js
    └── lit-html.js

4 directories, 18 files
```

#### Required Manual Configuration

Note that sadly the import maps usage requires manual renaming of bare imports to relative imports which you could do with a find and replace. This is a [todo](#todo) item and will hopefully be fixed sometime in the future.

#### Error Handling

Generally it will pull down the files that work and even the files
that errored into a `./deno_modules` folder for which the subpath `./deno_modules/deps/https/unpkg.com` 
will get copied to the `./unpkg.com` folder. Usually the `unpkg_get` script will error because you haven't specified
all the bare imports in your import maps (bare imports are non-relative imports where relative imports are imports which start with `.`, `./`, or `../`). You can check the files that have been pulled down for bare imports that haven't been added to an import map.

##  Install

First [install deno](https://github.com/denoland/deno_install) if you don't have it

Then install [deno_installer](https://github.com/denoland/deno_std/tree/master/installer) if you don't already have it.

```bash
deno -A https://deno.land/std/installer/mod.ts deno_installer https://deno.land/std/installer/mod.ts -A
```

Then install unpkg_get:

```bash
deno_installer -A unpkg_get https://raw.githubusercontent.com/johnsonjo4531/unpkg_get/master/unpkg_get.ts -A
```

and then you're ready to follow the above instructions!


## Todo

  1. Search all dependencies and rename bare imports to use relative imports to the local file system according to the path shown in the importmap. This only matters as long as browsers don't support import maps, otherwise if they do support import maps just use a second import map for the browser to access the server's local file system.
