Canonn Decryptor
================

The [Canonn Decryptor] is a tool for decrypting the mysteries of the [Elite: Dangerous] universe. Currently the following converters are supported:

* [Affine cipher] (With automatic cracking)
* [Atbash cipher]
* [Base64]
* [Caesar cipher] (With automatic rotation cracking)
* [Keyword cipher] (With automatic keyword cracking)
* [Morse code]
* [Number-to-ASCII]
* [One-time pad]
* [Polybius square]
* Reverse text
* [Roman numerals]
* [Vigenère cipher]


Build
-----

After cloning the repository run `npm install` to download the dependencies, compile the project and package the application. Obviously [Node.js] is required for this.


Development
-----------

Run `npm start` to start a development web server on localhost and open the provided URL in your browser.


Testing
-------

Use `npm test` to run the tests.


Deployment
----------

For deployment copy the content of the `lib/package` directory to your web server, after running `npm install` to package the application.


Links
-----

* [Canonn Research Group](http://canonn.science/)


[Canonn Decryptor]: https://kayahr.github.io/canonn-decryptor/
[Elite: Dangerous]: https://www.elitedangerous.com/
[Affine cipher]: https://en.wikipedia.org/wiki/Affine_cipher
[Atbash cipher]: https://en.wikipedia.org/wiki/Atbash
[Caesar cipher]: https://en.wikipedia.org/wiki/Caesar_cipher
[Keyword cipher]: https://en.wikipedia.org/wiki/Keyword_cipher
[Morse code]: https://en.wikipedia.org/wiki/Morse_code
[Number-to-ASCII]: https://en.wikipedia.org/wiki/ASCII
[One-time pad]: https://en.wikipedia.org/wiki/One-time_pad
[Polybius square]: https://en.wikipedia.org/wiki/Polybius_square
[Roman numerals]: https://en.wikipedia.org/wiki/Roman_numerals
[Vigenère cipher]: https://en.wikipedia.org/wiki/Vigenère_cipher
[Base64]: https://en.wikipedia.org/wiki/Base64
[Node.js]: https://nodejs.org/
[SystemJS]: https://github.com/systemjs/systemjs
[Visual Studio Code]: https://code.visualstudio.com/
