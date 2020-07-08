
default: build

build: $(shell find ./generators ../helpers -type f -iregex '.*\.\(tsx?\|p?css\)')
	@echo 'The following file(s) have modifications:'
	@echo '$?'
	@echo
	npm run build
	@touch build
