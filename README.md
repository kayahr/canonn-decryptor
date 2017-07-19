Canonn Decryptor
================

The [Canonn Decryptor] is a tool for decrypting the mysteries of the [Elite: Dangerous] universe. Currently the
following converters are supported:

* [Base64] (Decoder only)
* [Caesar cipher] (Decoder and encoder)
* [Keyword cipher] (Decoder and encoder)
* [Morse code] (Decoder and encoder)
* [Number-to-ASCII] (Decoder only)
* [Roman numerals] (Decoder and encoder)


Build
-----

After cloning the repository run `npm install` to download the dependencies and compile the project.
Obviously [Node.js] is required for this.


Development
-----------

It is recommended to edit the project with [Visual Studio Code]. After running `npm install` once you can open
the project root in the IDE and then press `Ctrl-Shift-B` to compile the project and enable compile-on-save. From then
on TypeScript file changes are automatically compiled to JavaScript.

If you already have a local web server which can serve the project files then simply open the `index.html` file
in your browser. This index file is meant to be used during development. It loads all JavaScript files through
[SystemJS] so no packaging is needed.

If you don't have a local web server then run `npm start` to serve the project on `http://localhost:8080/`


Testing
-------

Run `npm test` to check the TypeScript and CSS files and to run the unit tests.

Within Visual Studio Code you can press `F5` to run the unit tests in the debugger.


Deployment
----------

For deployment run `npm run package` to bundle all JavaScript files into a single file and copy all files
necessary for the deployment into the `dist` directory. Deploy the content of this directory to your web
server.


Links
-----

* [Canonn Research Group](http://canonn.science/)


[Canonn Decryptor]: https://kayahr.github.io/canonn-decryptor/
[Elite: Dangerous]: https://www.elitedangerous.com/
[Caesar cipher]: https://en.wikipedia.org/wiki/Caesar_cipher
[Keyword cipher]: https://en.wikipedia.org/wiki/Keyword_cipher
[Morse code]: https://en.wikipedia.org/wiki/Morse_code
[Number-to-ASCII]: https://en.wikipedia.org/wiki/ASCII
[Roman numerals]: https://en.wikipedia.org/wiki/Roman_numerals
[Node.js]: https://nodejs.org/
[SystemJS]: https://github.com/systemjs/systemjs
[Visual Studio Code]: https://code.visualstudio.com/
