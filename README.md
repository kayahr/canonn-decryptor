Canonn Decryptor
================

The [Canonn Decryptor] is a tool for decrypting the mysteries of the [Elite: Dangerous] universe. Currently the
following converters are supported:

* [Atbash cipher]
* [Base64]
* [Caesar cipher] (With automatic rotation cracking)
* [Keyword cipher] (With automatic keyword cracking)
* [Morse code]
* [Number-to-ASCII]
* [One-time pad]
* Reverse text
* [Roman numerals]
* [Vigenère cipher]


Build
-----

After cloning the repository run `npm install` to download the dependencies and compile the project.
Obviously [Node.js] is required for this.


Development
-----------

It is recommended to edit the project with [Visual Studio Code].

Run `npm start` to serve the project on localhost.


Testing
-------

Run `npm test` to check the TypeScript and CSS files and to run the unit tests.

Within Visual Studio Code you can press `Ctrl-Shift-T` to run the unit tests.


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
[Atbash cipher]: https://en.wikipedia.org/wiki/Atbash
[Caesar cipher]: https://en.wikipedia.org/wiki/Caesar_cipher
[Keyword cipher]: https://en.wikipedia.org/wiki/Keyword_cipher
[Morse code]: https://en.wikipedia.org/wiki/Morse_code
[Number-to-ASCII]: https://en.wikipedia.org/wiki/ASCII
[One-time pad]: https://en.wikipedia.org/wiki/One-time_pad
[Roman numerals]: https://en.wikipedia.org/wiki/Roman_numerals
[Vigenère cipher]: https://en.wikipedia.org/wiki/Vigenère_cipher
[Base64]: https://en.wikipedia.org/wiki/Base64
[Node.js]: https://nodejs.org/
[SystemJS]: https://github.com/systemjs/systemjs
[Visual Studio Code]: https://code.visualstudio.com/
