SRCDIR := ./src
ASSETDIR := ./assets
DISTDIR := ./dist

SRC := $(shell find $(SRCDIR) -type f -name "*.ts")
ASSET := $(shell find $(ASSETDIR) -type f -name "*.json")

DISTSRC := $(SRC:%.ts=$(DISTDIR)/%.js)
DISTASSET := $(ASSET:%=$(DISTDIR)/%)

DIST := $(DISTSRC) $(DISTASSET)

BINDIR := $(DISTDIR)/bin

BINWIN := $(BINDIR)/windows/MetronOhm.exe

BINMAC := $(BINDIR)/mac/MetronOhm

BINLINUX := $(BINDIR)/linux/MetronOhm

ENTRY := $(DISTDIR)/src/otoge/index.js

.PHONY: all bin js clean

js: $(DIST)

all: js bin

$(DIST): $(DISTDIR)/intermediate $(SRC)

$(DISTDIR)/intermediate: $(SRC) $(ASSET) node_modules
	npm run build
	touch $(DISTDIR)/intermediate

node_modules:
	npm install

clean:
	rm -rf $(DISTDIR)

bin: $(BINWIN) $(BINMAC) $(BINLINUX)

$(BINWIN): $(ENTRY)
	npx nexe $< --output $@ --target 'windows-x86-12.12.0'

$(BINMAC): $(ENTRY)
	npx nexe $< --output $@ --target 'mac-x64-12.12.0'

$(BINLINUX): $(ENTRY)
	npx nexe $< --output $@ --target 'linux-x86-12.12.0'
