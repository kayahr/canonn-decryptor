PDF    = $(shell find input -name "*.pdf")
TXT    = $(PDF:%.pdf=%.txt)
NGRAMS = ngrams.json

all: $(NGRAMS)

%.txt: %.pdf
	pdftotext $<

input/codex:
	wget --directory-prefix input --no-host-directories --no-parent --mirror -R png,gif,jpg,pdf https://canonn.science/codex/
	
input/codex.txt: input/codex
	find input/codex/ -name "*.html" -print0 | xargs -0 -n 1 lynx --dump --nolist > input/codex.txt

$(NGRAMS): $(TXT) input/codex.txt input/manual.txt
	node ../../lib/tools/fitness input/*.txt > $(NGRAMS).new
	mv $(NGRAMS).new $(NGRAMS)
