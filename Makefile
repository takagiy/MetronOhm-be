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

## package information
PKGVER := $(shell node -p -e 'require("./package.json").version' | sed -e 's/\./-/g')

## zipped releases
ZIPWIN_REL := MetronOhm-64bit-windows-$(PKGVER).zip
ZIPMAC_REL := MetronOhm-64bit-mac-$(PKGVER).zip
ZIPLINUX_REL := MetronOhm-64bit-linux-$(PKGVER).zip
ZIPDIR := $(DISTDIR)/releases
ZIPWIN := $(ZIPDIR)/$(ZIPWIN_REL)
ZIPMAC := $(ZIPDIR)/$(ZIPMAC_REL)
ZIPLINUX := $(ZIPDIR)/$(ZIPLINUX_REL)

## directories to be zipped
ZIPDIRWIN_REL := $(ZIPWIN_REL:%.zip=%)
ZIPDIRMAC_REL := $(ZIPMAC_REL:%.zip=%)
ZIPDIRLINUX_REL := $(ZIPLINUX_REL:%.zip=%)
ZIPDIRWIN := $(ZIPDIR)/$(ZIPDIRWIN_REL)
ZIPDIRMAC := $(ZIPDIR)/$(ZIPDIRMAC_REL)
ZIPDIRLINUX := $(ZIPDIR)/$(ZIPDIRLINUX_REL)

.PHONY: all js bin bin.platform zip clean run

all: js bin zip

js: $(DISTSRC) $(DISTASSET)

bin: $(BINWIN) $(BINMAC) $(BINLINUX)

zip: $(ZIPWIN) $(ZIPMAC) $(ZIPLINUX)

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
	npx nexe $< --output $@ --target 'windows-x64-10.16.0' --resource $(DISTASSETDIR)

$(BINMAC): $(ENTRY) $(DISTSRC) $(DISTASSET) node_modules
	npx nexe $< --output $@ --target 'mac-x64-12.12.0' --resource $(DISTASSETDIR)

$(BINLINUX): $(ENTRY) $(DISTSRC) $(DISTASSET) node_modules
	npx nexe $< --output $@ --target 'linux-x64-12.12.0' --resource $(DISTASSETDIR)

$(ZIPWIN): $(BINWIN) LICENSE etc/external_LICENSE.txt external/ffi-libs/windows/node_modules/ffi/build/Release/ffi_bindings.node external/ffi-libs/windows/node_modules/ref/build/Release/binding.node
	mkdir -p $(ZIPDIRWIN)
	cp $(BINWIN) $(ZIPDIRWIN)
	cp LICENSE $(ZIPDIRWIN)/LICENSE.txt
	cp etc/external_LICENSE.txt $(ZIPDIRWIN)
	cp -r external/ffi-libs/windows/node_modules $(ZIPDIRWIN)
	cd $(ZIPDIR) && zip $(ZIPWIN_REL) $$(find $(ZIPDIRWIN_REL) -type f)

$(ZIPMAC): $(BINMAC) LICENSE etc/external_LICENSE.txt
	mkdir -p $(ZIPDIRMAC)
	cp $(BINMAC) $(ZIPDIRMAC)
	cp LICENSE $(ZIPDIRMAC)/LICENSE.txt
	cp etc/external_LICENSE.txt $(ZIPDIRMAC)
	cd $(ZIPDIR) && zip $(ZIPMAC_REL) $(ZIPDIRMAC_REL)/*

$(ZIPLINUX): $(BINLINUX) LICENSE etc/external_LICENSE.txt
	mkdir -p $(ZIPDIRLINUX)
	cp $(BINLINUX) $(ZIPDIRLINUX)
	cp LICENSE $(ZIPDIRLINUX)/LICENSE.txt
	cp etc/external_LICENSE.txt $(ZIPDIRLINUX)
	cd $(ZIPDIR) && zip $(ZIPLINUX_REL) $(ZIPDIRLINUX_REL)/*

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
