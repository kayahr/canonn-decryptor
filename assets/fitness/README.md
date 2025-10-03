# fitness

This directory contains the ngrams database used to create an englishness score for text, to crack encrypted text. The database is created from text extracted from PDFs and HTML pages.

## Requirements

* make
* lynx
* wget
* pdftotext

## Rebuild

* Put PDF documents (For example all Elite E-Books) you want to use as source into the `input` directory.
* Run `make`. This can take a very long time. It performs these steps:
    * Extracts all texts from the found PDF files.
    * Mirrors the Canonn website and extracts all texts from it.
    * Downloads the current galaxy JSON dumps and creates a list of system, body and station names.
    * Re-creates the ngrams database from all the texts.
