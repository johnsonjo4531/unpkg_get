# unpkg_get

- [unpkg_get](#unpkgget)
	- [What](#what)
	- [Why](#why)
	- [Where](#where)
	- [How](#how)
		- [Basic Usage:](#basic-usage)
		- [Import Maps Usage:](#import-maps-usage)
	- [Install](#install)
	- [Todo](#todo)

##  What

A command line program to get a es2015 module from unpkg and installs it and all it's dependencies into an `unpkg.com` folder.

## Why

Because, you want to use your es2015 modules directly in the browser with no transpiling
step other than to the current flavor of JavaScript which install
conveniently already provided by unpkg.

## Where

Main package is [`unpkg_get.ts`](./unpkg_get.ts)

##  How

### Basic Usage:

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

notice how the option below is `importmapping` instead of deno's regular `importmap`

```bash
$ unpkg_get -A --importmapping=lit-element-importmap.json lit-element
```

the above requires the following import map for which describes `lit-html`'s location 
which is the only dependency of `lit-element`.

```json
{
  "imports": {
    "lit-html": "https://unpkg.com/lit-html@1.1.1/lit-html.js",
    "lit-html/": "https://unpkg.com/lit-html@1.1.1/"
  }
}
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

generally it will pull down the files that work and even the files
that errored into a `./deno_modules` folder which will get copied to the
`./unpkg.com` folder. Usually the file will error because you haven't specified
it in your import maps.

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

  - Search all dependencies and rename imports to match/mirror those in importmap file.
    - This only matters as long as browsers don't support import maps, otherwise if they do support import maps just use a second import map for the browser to access the local file systemß.
