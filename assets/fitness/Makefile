PDF    = $(shell find input -name "*.pdf")
TXT    = $(PDF:%.pdf=%.txt)

all: ngrams.json

%.txt: %.pdf
	pdftotext "$<"

input/website/fetched:
	wget --directory-prefix input/website/ --no-host-directories --no-parent --mirror \
	    -R png,gif,jpg,pdf \
	    --include-directories lore,personal-lore,game-lore,canonn-lore,codex,news \
	    https://canonn.science/ || true
	touch input/website/fetched

input/website.txt: input/website/fetched
	find input/website/ -name "*.html" -print0 | xargs -0 -n 1 lynx --dump --verbose --nolist -hiddenlinks=ignore -display_charset=utf-8 > input/website.txt

input/books.txt: $(TXT)
	cat $(TXT) > input/books.txt

input/galaxy_populated.json.gz:
	wget -O input/galaxy_populated.json.gz https://downloads.spansh.co.uk/galaxy_populated.json.gz

input/galaxy_stations.json.gz:
	wget -O input/galaxy_stations.json.gz https://downloads.spansh.co.uk/galaxy_stations.json.gz

input/galaxy.json.gz:
	wget -O input/galaxy.json.gz https://downloads.spansh.co.uk/galaxy.json.gz

input/systems.txt: input/galaxy.json.gz
	node ../../lib/tools/extract-galaxy.js input/galaxy.json.gz input/systems.txt input/bodies.txt input/stations.txt

input/stations_populated.txt: input/galaxy_populated.json.gz
	node ../../lib/tools/extract-galaxy.js input/galaxy_populated.json.gz input/systems_populated.txt input/bodies_populated.txt input/stations_populated.txt

input/systems-without-proc-gen.txt: input/systems.txt
	echo "Generating systems-without-proc-gen.txt"
	cat input/systems.txt | sed -E 's/[[:space:]]+[A-Z]{1,3}-[A-Z][[:space:]]+[a-h][0-9]+(-[0-9]+)?$//' | sort -u -S 60% --parallel 8 > input/systems-without-proc-gen.txt

ngrams.json: Makefile input/books.txt input/website.txt input/systems-without-proc-gen.txt input/stations_populated.txt
	node ../../lib/tools/fitness input/books.txt input/website.txt input/systems-without-proc-gen.txt input/stations_populated.txt input/bodies_populated.txt > ngrams.json.new
	mv ngrams.json.new ngrams.json
