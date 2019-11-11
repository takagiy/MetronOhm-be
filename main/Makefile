SRCDIR := ./src
ASSETDIR := ./assets
DISTDIR := ./dist

SRC := $(shell find $(SRCDIR) -type f -name "*.ts")
ASSET := $(shell find $(ASSETDIR) -type f -name "*.json")

DISTSRC := $(SRC:%.ts=$(DISTDIR)/%.js)
DISTASSET := $(ASSET:%=$(DISTDIR)/%)

DIST := $(DISTSRC) $(DISTASSET)

.PHONY: all clean

all: $(DIST)

$(DIST): $(DISTDIR)/intermediate $(SRC)

$(DISTDIR)/intermediate: $(SRC) $(ASSET) node_modules
	npm run build
	touch $(DISTDIR)/intermediate

node_modules:
	npm install

clean:
	rm -rf $(DISTDIR)
