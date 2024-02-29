include config.mk

HOMEDIR = $(shell pwd)

pushall: sync
	git push origin master

build:
	./node_modules/.bin/rollup -c

run:
	./node_modules/.bin/rollup -c -w

prettier:
	prettier --single-quote --write "**/*.js"

sync:
	scp index.html $(USER)@$(SERVER):$(APPDIR)
	scp index.js $(USER)@$(SERVER):$(APPDIR)
	scp app.css $(USER)@$(SERVER):$(APPDIR)
	scp ext/tesseract.min.js $(USER)@$(SERVER):$(APPDIR)/ext

deploy:
	npm version patch && make build && git commit -a -m"Build." && make pushall
