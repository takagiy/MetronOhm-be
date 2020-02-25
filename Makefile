## directories
SRCDIR := ./src
ASSETDIR := ./assets
DISTDIR := ./dist
DISTSRCDIR := $(DISTDIR)/$(SRCDIR)
DISTASSETDIR := $(DISTDIR)/$(ASSETDIR)

## sources
SRC := $(shell find $(SRCDIR) -type f -name "*.ts")
ASSET := $(shell find $(ASSETDIR) -type f -name "*.json")

## distributions
DISTSRC := $(SRC:%.ts=$(DISTDIR)/%.js)
DISTASSET := $(ASSET:%=$(DISTDIR)/%)
ENTRY := $(DISTSRCDIR)/otoge/index.js

## binary distributions
BINDIR := $(DISTDIR)/bin
BINWIN := $(BINDIR)/windows/MetronOhm.exe
BINMAC := $(BINDIR)/mac/MetronOhm
BINLINUX := $(BINDIR)/linux/MetronOhm

.PHONY: all js bin bin.platform clean run

all: js bin

js: $(DISTSRC) $(DISTASSET)

bin: $(BINWIN) $(BINMAC) $(BINLINUX)

clean:
	rm -rf $(DISTDIR)

etc/external_LICENSE.txt : script/generate_external_licenses_notice.js node_modules
	mkdir -p etc
	npm run genExtCopyright

$(DISTSRC) : $(SRC) node_modules
	npm run build

$(DISTASSET) : $(ASSET)
	cp -Rf $(ASSETDIR)/. $(DISTASSETDIR)

node_modules:
	npm install

$(BINWIN): $(ENTRY) $(DISTSRC) $(DISTASSET) node_modules
	npx nexe $< --output $@ --target 'windows-x86-12.12.0' --resource $(DISTASSETDIR)

$(BINMAC): $(ENTRY) $(DISTSRC) $(DISTASSET) node_modules
	npx nexe $< --output $@ --target 'mac-x64-12.12.0' --resource $(DISTASSETDIR)

$(BINLINUX): $(ENTRY) $(DISTSRC) $(DISTASSET) node_modules
	npx nexe $< --output $@ --target 'linux-x86-12.12.0' --resource $(DISTASSETDIR)

SYSNAME := $(shell uname -s || echo "unknown")

ifeq ($(SYSNAME), Linux)
PLATFORM := linux
BINMAIN := $(BINLINUX)
else ifeq ($(SYSNAME), Darwin)
PLATFORM := mac
BINMAIN := $(BINMAC)
else
PLATFORM := unknown
BINMAIN := $(BINWIN) $(BINMAC) $(BINLINUX)
endif

ifeq ($(PLATFORM), unknown)
$(warning Detect the platform, unknown.)
else
$(info Detect the platform, $(PLATFORM).)
endif

bin.platform: $(BINMAIN)

run: $(BINMAIN)
ifeq ($(PLATFORM), unknown)
	@echo Cannot detect the platform.
	@echo 'Execute the binary "$(BINDIR)/<platform>/MetronOhm[.exe]" manually.'
else
	$(BINMAIN)
endif
