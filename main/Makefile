.PHONY: all run

all: dist

dist: node_modules src
	npm run build

run: dist
	npm start

node_modules:
	npm install

clean:
	rm -rf dist

CLEAN:
	rm -rf dist
	rm -rf node_modules
