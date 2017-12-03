PDF    = $(shell find input -name "*.pdf")
TXT    = $(PDF:%.pdf=%.txt)
NGRAMS = ngrams.json

all: $(NGRAMS)

%.txt: %.pdf
	pdftotext $<
	
input/website/fetched:
	wget --directory-prefix input/website/ --no-host-directories --no-parent --mirror \
	    -R png,gif,jpg,pdf \
	    --include-directories lore,personal-lore,game-lore,canonn-lore,codex,news \
	    https://canonn.science/ || true
	touch input/website/fetched
	
input/website.txt: input/website/fetched
	find input/website/ -name "*.html" -print0 | xargs -0 -n 1 lynx --dump --nolist > input/website.txt

$(NGRAMS): $(TXT) input/website.txt input/manual.txt
	node ../../lib/tools/fitness input/*.txt > $(NGRAMS).new
	mv $(NGRAMS).new $(NGRAMS)
