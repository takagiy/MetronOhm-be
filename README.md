# MetronOhm-be🎶 - An otoge backend
MetronOhm-be is the backend part of the otoge *MetronOhm* that is exhibited at the NITAC college festival 2019 by the students of 4E.

## Releases
See [releases](https://github.com/takagiy/MetronOhm-be/releases) for binary distributions.

## License
Copyright(c) Yuki Takagi 2020   
Distributed under the MIT License. (See [LICENSE](./LICENSE))

## Requirements
To play
* *the frontend*

To build from sources (optional)
* `node`
* `npm`
* `make` (optional)

## Usage
Download the binary distribution from [releases](https://github.com/takagiy/MetronOhm-be/releases)
and then execute it to start the backend.
Alternatively, you have the another choice to [build the binary from sources.](#building-from-sources)

## Building from sources
*[There are pre-compiled binaries too that need not to be built.](https://github.com/takagiy/MetronOhm-be/releases)*   
Build the executable and start the backend as follows.

```console
make run
```

### Optional targets

Compiling this project without the execution will be done with the following command.

```console
make js
```

Binaries will be generated with the following command.

```console
make bin
```

If you want to generate only the binary that is available in your system,
you can use the following command.

```console
make bin.platform
```
