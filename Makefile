include config.mk

HOMEDIR = $(shell pwd)

pushall: sync
	git push origin main

sync:
	rsync -a $(HOMEDIR)/ $(USER)@$(SERVER):$(APPDIR) --exclude node_modules/ \
    --exclude .git \
		--omit-dir-times --no-perms
