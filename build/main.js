/**
 * CryptoJS core components.
 */
var CryptoJS = CryptoJS || (function (Math, undefined) {
        /**
         * CryptoJS namespace.
         */
        var C = {};

        /**
         * Library namespace.
         */
        var C_lib = C.lib = {};

        /**
         * Base object for prototypal inheritance.
         */
        var Base = C_lib.Base = (function () {
            function F() {}

            return {
                /**
                 * Creates a new object that inherits from this object.
                 *
                 * @param {Object} overrides Properties to copy into the new object.
                 *
                 * @return {Object} The new object.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
                 */
                extend: function (overrides) {
                    // Spawn
                    F.prototype = this;
                    var subtype = new F();

                    // Augment
                    if (overrides) {
                        subtype.mixIn(overrides);
                    }

                    // Reference supertype
                    subtype.$super = this;

                    return subtype;
                },

                /**
                 * Extends this object and runs the init method.
                 * Arguments to create() will be passed to init().
                 *
                 * @return {Object} The new object.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var instance = MyType.create();
                 */
                create: function () {
                    var instance = this.extend();
                    instance.init.apply(instance, arguments);

                    return instance;
                },

                /**
                 * Initializes a newly created object.
                 * Override this method to add some logic when your objects are created.
                 *
                 * @example
                 *
                 *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
                 */
                init: function () {
                },

                /**
                 * Copies properties into this object.
                 *
                 * @param {Object} properties The properties to mix in.
                 *
                 * @example
                 *
                 *     MyType.mixIn({
             *         field: 'value'
             *     });
                 */
                mixIn: function (properties) {
                    for (var propertyName in properties) {
                        if (properties.hasOwnProperty(propertyName)) {
                            this[propertyName] = properties[propertyName];
                        }
                    }

                    // IE won't copy toString using the loop above
                    if (properties.hasOwnProperty('toString')) {
                        this.toString = properties.toString;
                    }
                },

                /**
                 * Creates a copy of this object.
                 *
                 * @return {Object} The clone.
                 *
                 * @example
                 *
                 *     var clone = instance.clone();
                 */
                clone: function () {
                    return this.$super.extend(this);
                }
            };
        }());

        /**
         * An array of 32-bit words.
         *
         * @property {Array} words The array of 32-bit words.
         * @property {number} sigBytes The number of significant bytes in this word array.
         */
        var WordArray = C_lib.WordArray = Base.extend({
            /**
             * Initializes a newly created word array.
             *
             * @param {Array} words (Optional) An array of 32-bit words.
             * @param {number} sigBytes (Optional) The number of significant bytes in the words.
             *
             * @example
             *
             *     var wordArray = CryptoJS.lib.WordArray.create();
             *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
             *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
             */
            init: function (words, sigBytes) {
                words = this.words = words || [];

                if (sigBytes != undefined) {
                    this.sigBytes = sigBytes;
                } else {
                    this.sigBytes = words.length * 4;
                }
            },

            left: function (bytes) {
                var l=bytes/4;
                var words=[];
                for (var i=0; i<l; i++) {
                    words[i]=this.words[i];
                }
                return WordArray.create(words,bytes);
            },

            /**
             * Converts this word array to a string.
             *
             * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
             *
             * @return {string} The stringified word array.
             *
             * @example
             *
             *     var string = wordArray + '';
             *     var string = wordArray.toString();
             *     var string = wordArray.toString(CryptoJS.enc.Utf8);
             */
            toString: function (encoder) {
                return (encoder || Hex).stringify(this);
            },

            /**
             * Concatenates a word array to this word array.
             *
             * @param {WordArray} wordArray The word array to append.
             *
             * @return {WordArray} This word array.
             *
             * @example
             *
             *     wordArray1.concat(wordArray2);
             */
            concat: function (wordArray) {
                // Shortcuts
                var thisWords = this.words;
                var thatWords = wordArray.words;
                var thisSigBytes = this.sigBytes;
                var thatSigBytes = wordArray.sigBytes;

                // Clamp excess bits
                this.clamp();

                // Concat
                if (thisSigBytes % 4) {
                    // Copy one byte at a time
                    for (var i = 0; i < thatSigBytes; i++) {
                        var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                        thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                    }
                } else if (thatWords.length > 0xffff) {
                    // Copy one word at a time
                    for (var i = 0; i < thatSigBytes; i += 4) {
                        thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
                    }
                } else {
                    // Copy all words at once
                    thisWords.push.apply(thisWords, thatWords);
                }
                this.sigBytes += thatSigBytes;

                // Chainable
                return this;
            },

            /**
             * Removes insignificant bits.
             *
             * @example
             *
             *     wordArray.clamp();
             */
            clamp: function () {
                // Shortcuts
                var words = this.words;
                var sigBytes = this.sigBytes;

                // Clamp
                words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
                words.length = Math.ceil(sigBytes / 4);
            },

            /**
             * Creates a copy of this word array.
             *
             * @return {WordArray} The clone.
             *
             * @example
             *
             *     var clone = wordArray.clone();
             */
            clone: function () {
                var clone = Base.clone.call(this);
                clone.words = this.words.slice(0);

                return clone;
            },

            /**
             * Creates a word array filled with random bytes.
             *
             * @param {number} nBytes The number of random bytes to generate.
             *
             * @return {WordArray} The random word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.lib.WordArray.random(16);
             */
            random: function (nBytes) {
                var words = [];
                for (var i = 0; i < nBytes; i += 4) {
                    words.push((Math.random() * 0x100000000) | 0);
                }

                return WordArray.create(words, nBytes);
            }
        });

        /**
         * Encoder namespace.
         */
        var C_enc = C.enc = {};

        /**
         * Hex encoding strategy.
         */
        var Hex = C_enc.Hex = {
            /**
             * Converts a word array to a hex string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The hex string.
             *
             * @static
             *
             * @example
             *
             *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
             */
            stringify: function (wordArray) {
                // Shortcuts
                var words = wordArray.words;
                var sigBytes = wordArray.sigBytes;

                // Convert
                var hexChars = [];
                for (var i = 0; i < sigBytes; i++) {
                    var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    hexChars.push((bite >>> 4).toString(16));
                    hexChars.push((bite & 0x0f).toString(16));
                }

                return hexChars.join('');
            },

            /**
             * Converts a hex string to a word array.
             *
             * @param {string} hexStr The hex string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
             */
            parse: function (hexStr) {
                // Shortcut
                var hexStrLength = hexStr.length;

                // Convert
                var words = [];
                for (var i = 0; i < hexStrLength; i += 2) {
                    words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
                }

                return WordArray.create(words, hexStrLength / 2);
            }
        };

        /**
         * Latin1 encoding strategy.
         */
        var Latin1 = C_enc.Latin1 = {
            /**
             * Converts a word array to a Latin1 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The Latin1 string.
             *
             * @static
             *
             * @example
             *
             *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
             */
            stringify: function (wordArray) {
                // Shortcuts
                var words = wordArray.words;
                var sigBytes = wordArray.sigBytes;

                // Convert
                var latin1Chars = [];
                for (var i = 0; i < sigBytes; i++) {
                    var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    latin1Chars.push(String.fromCharCode(bite));
                }

                return latin1Chars.join('');
            },

            /**
             * Converts a Latin1 string to a word array.
             *
             * @param {string} latin1Str The Latin1 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
             */
            parse: function (latin1Str) {
                // Shortcut
                var latin1StrLength = latin1Str.length;

                // Convert
                var words = [];
                for (var i = 0; i < latin1StrLength; i++) {
                    words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
                }

                return WordArray.create(words, latin1StrLength);
            }
        };

        /**
         * UTF-8 encoding strategy.
         */
        var Utf8 = C_enc.Utf8 = {
            /**
             * Converts a word array to a UTF-8 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-8 string.
             *
             * @static
             *
             * @example
             *
             *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
             */
            stringify: function (wordArray) {
                try {
                    return decodeURIComponent(escape(Latin1.stringify(wordArray)));
                } catch (e) {
                    throw new Error('Malformed UTF-8 data');
                }
            },

            /**
             * Converts a UTF-8 string to a word array.
             *
             * @param {string} utf8Str The UTF-8 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
             */
            parse: function (utf8Str) {
                return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
            }
        };

        /**
         * Abstract buffered block algorithm template.
         *
         * The property blockSize must be implemented in a concrete subtype.
         *
         * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
         */
        var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
            /**
             * Resets this block algorithm's data buffer to its initial state.
             *
             * @example
             *
             *     bufferedBlockAlgorithm.reset();
             */
            reset: function () {
                // Initial values
                this._data = WordArray.create();
                this._nDataBytes = 0;
            },

            /**
             * Adds new data to this block algorithm's buffer.
             *
             * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
             *
             * @example
             *
             *     bufferedBlockAlgorithm._append('data');
             *     bufferedBlockAlgorithm._append(wordArray);
             */
            _append: function (data) {
                // Convert string to WordArray, else assume WordArray already
                if (typeof data == 'string') {
                    data = Utf8.parse(data);
                }

                // Append
                this._data.concat(data);
                this._nDataBytes += data.sigBytes;
            },

            /**
             * Processes available data blocks.
             *
             * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
             *
             * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
             *
             * @return {WordArray} The processed data.
             *
             * @example
             *
             *     var processedData = bufferedBlockAlgorithm._process();
             *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
             */
            _process: function (doFlush) {
                // Shortcuts
                var data = this._data;
                var dataWords = data.words;
                var dataSigBytes = data.sigBytes;
                var blockSize = this.blockSize;
                var blockSizeBytes = blockSize * 4;

                // Count blocks ready
                var nBlocksReady = dataSigBytes / blockSizeBytes;
                if (doFlush) {
                    // Round up to include partial blocks
                    nBlocksReady = Math.ceil(nBlocksReady);
                } else {
                    // Round down to include only full blocks,
                    // less the number of blocks that must remain in the buffer
                    nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
                }

                // Count words ready
                var nWordsReady = nBlocksReady * blockSize;

                // Count bytes ready
                var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

                // Process blocks
                if (nWordsReady) {
                    for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                        // Perform concrete-algorithm logic
                        this._doProcessBlock(dataWords, offset);
                    }

                    // Remove processed words
                    var processedWords = dataWords.splice(0, nWordsReady);
                    data.sigBytes -= nBytesReady;
                }

                // Return processed words
                return WordArray.create(processedWords, nBytesReady);
            },

            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = bufferedBlockAlgorithm.clone();
             */
            clone: function () {
                var clone = Base.clone.call(this);
                clone._data = this._data.clone();

                return clone;
            },

            _minBufferSize: 0
        });

        /**
         * Abstract hasher template.
         *
         * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
         */
        var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
            /**
             * Configuration options.
             */
            // cfg: Base.extend(),

            /**
             * Initializes a newly created hasher.
             *
             * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
             *
             * @example
             *
             *     var hasher = CryptoJS.algo.SHA256.create();
             */
            init: function (cfg) {
                // Apply config defaults
                // this.cfg = this.cfg.extend(cfg);

                // Set initial values
                this.reset();
            },

            /**
             * Resets this hasher to its initial state.
             *
             * @example
             *
             *     hasher.reset();
             */
            reset: function () {
                // Reset data buffer
                BufferedBlockAlgorithm.reset.call(this);

                // Perform concrete-hasher logic
                this._doReset();
            },

            /**
             * Updates this hasher with a message.
             *
             * @param {WordArray|string} messageUpdate The message to append.
             *
             * @return {Hasher} This hasher.
             *
             * @example
             *
             *     hasher.update('message');
             *     hasher.update(wordArray);
             */
            update: function (messageUpdate) {
                // Append
                this._append(messageUpdate);

                // Update the hash
                this._process();

                // Chainable
                return this;
            },

            /**
             * Finalizes the hash computation.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} messageUpdate (Optional) A final message update.
             *
             * @return {WordArray} The hash.
             *
             * @example
             *
             *     var hash = hasher.finalize();
             *     var hash = hasher.finalize('message');
             *     var hash = hasher.finalize(wordArray);
             */
            finalize: function (messageUpdate) {
                // Final message update
                if (messageUpdate) {
                    this._append(messageUpdate);
                }

                // Perform concrete-hasher logic
                this._doFinalize();

                return this._hash;
            },

            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = hasher.clone();
             */
            clone: function () {
                var clone = BufferedBlockAlgorithm.clone.call(this);
                clone._hash = this._hash.clone();

                return clone;
            },

            blockSize: 512/32,

            /**
             * Creates a shortcut function to a hasher's object interface.
             *
             * @param {Hasher} hasher The hasher to create a helper for.
             *
             * @return {Function} The shortcut function.
             *
             * @static
             *
             * @example
             *
             *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
             */
            _createHelper: function (hasher) {
                return function (message, cfg) {
                    return hasher.create(cfg).finalize(message);
                };
            },

            /**
             * Creates a shortcut function to the HMAC's object interface.
             *
             * @param {Hasher} hasher The hasher to use in this HMAC helper.
             *
             * @return {Function} The shortcut function.
             *
             * @static
             *
             * @example
             *
             *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
             */
            _createHmacHelper: function (hasher) {
                return function (message, key) {
                    return C_algo.HMAC.create(hasher, key).finalize(message);
                };
            }
        });

        /**
         * Algorithm namespace.
         */
        var C_algo = C.algo = {};

        return C;
    }(Math));
/**
 * Cipher core components.
 */
CryptoJS.lib.Cipher || (function (undefined) {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var WordArray = C_lib.WordArray;
    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
    var C_enc = C.enc;
    var Utf8 = C_enc.Utf8;
    var Base64 = C_enc.Base64;
    var C_algo = C.algo;
    var EvpKDF = C_algo.EvpKDF;

    /**
     * Abstract base cipher template.
     *
     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
     */
    var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         *
         * @property {WordArray} iv The IV to use for this operation.
         */
        cfg: Base.extend(),

        /**
         * Creates this cipher in encryption mode.
         *
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {Cipher} A cipher instance.
         *
         * @static
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
         */
        createEncryptor: function (key, cfg) {
            return this.create(this._ENC_XFORM_MODE, key, cfg);
        },

        /**
         * Creates this cipher in decryption mode.
         *
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {Cipher} A cipher instance.
         *
         * @static
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
         */
        createDecryptor: function (key, cfg) {
            return this.create(this._DEC_XFORM_MODE, key, cfg);
        },

        /**
         * Initializes a newly created cipher.
         *
         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
         */
        init: function (xformMode, key, cfg) {
            // Apply config defaults
            this.cfg = this.cfg.extend(cfg);

            // Store transform mode and key
            this._xformMode = xformMode;
            this._key = key;

            // Set initial values
            this.reset();
        },

        /**
         * Resets this cipher to its initial state.
         *
         * @example
         *
         *     cipher.reset();
         */
        reset: function () {
            // Reset data buffer
            BufferedBlockAlgorithm.reset.call(this);

            // Perform concrete-cipher logic
            this._doReset();
        },

        /**
         * Adds data to be encrypted or decrypted.
         *
         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
         *
         * @return {WordArray} The data after processing.
         *
         * @example
         *
         *     var encrypted = cipher.process('data');
         *     var encrypted = cipher.process(wordArray);
         */
        process: function (dataUpdate) {
            // Append
            this._append(dataUpdate);

            // Process available blocks
            return this._process();
        },

        /**
         * Finalizes the encryption or decryption process.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
         *
         * @return {WordArray} The data after final processing.
         *
         * @example
         *
         *     var encrypted = cipher.finalize();
         *     var encrypted = cipher.finalize('data');
         *     var encrypted = cipher.finalize(wordArray);
         */
        finalize: function (dataUpdate) {
            // Final data update
            if (dataUpdate) {
                this._append(dataUpdate);
            }

            // Perform concrete-cipher logic
            var finalProcessedData = this._doFinalize();

            return finalProcessedData;
        },

        keySize: 128/32,

        ivSize: 128/32,

        _ENC_XFORM_MODE: 1,

        _DEC_XFORM_MODE: 2,

        /**
         * Creates shortcut functions to a cipher's object interface.
         *
         * @param {Cipher} cipher The cipher to create a helper for.
         *
         * @return {Object} An object with encrypt and decrypt shortcut functions.
         *
         * @static
         *
         * @example
         *
         *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
         */
        _createHelper: (function () {
            function selectCipherStrategy(key) {
                if (typeof key == 'string') {
                    return PasswordBasedCipher;
                } else {
                    return SerializableCipher;
                }
            }

            return function (cipher) {
                return {
                    encrypt: function (message, key, cfg) {
                        return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                    },

                    decrypt: function (ciphertext, key, cfg) {
                        return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                    }
                };
            };
        }())
    });

    /**
     * Abstract base stream cipher template.
     *
     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
     */
    var StreamCipher = C_lib.StreamCipher = Cipher.extend({
        _doFinalize: function () {
            // Process partial blocks
            var finalProcessedBlocks = this._process(!!'flush');

            return finalProcessedBlocks;
        },

        blockSize: 1
    });

    /**
     * Mode namespace.
     */
    var C_mode = C.mode = {};

    /**
     * Abstract base block cipher mode template.
     */
    var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
        /**
         * Creates this mode for encryption.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @static
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
         */
        createEncryptor: function (cipher, iv) {
            return this.Encryptor.create(cipher, iv);
        },

        /**
         * Creates this mode for decryption.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @static
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
         */
        createDecryptor: function (cipher, iv) {
            return this.Decryptor.create(cipher, iv);
        },

        /**
         * Initializes a newly created mode.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
         */
        init: function (cipher, iv) {
            this._cipher = cipher;
            this._iv = iv;
        }
    });

    /**
     * Cipher Block Chaining mode.
     */
    var CBC = C_mode.CBC = (function () {
        /**
         * Abstract base CBC mode.
         */
        var CBC = BlockCipherMode.extend();

        /**
         * CBC encryptor.
         */
        CBC.Encryptor = CBC.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function (words, offset) {
                // Shortcuts
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;

                // XOR and encrypt
                xorBlock.call(this, words, offset, blockSize);
                cipher.encryptBlock(words, offset);

                // Remember this block to use with next block
                this._prevBlock = words.slice(offset, offset + blockSize);
            }
        });

        /**
         * CBC decryptor.
         */
        CBC.Decryptor = CBC.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function (words, offset) {
                // Shortcuts
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;

                // Remember this block to use with next block
                var thisBlock = words.slice(offset, offset + blockSize);

                // Decrypt and XOR
                cipher.decryptBlock(words, offset);
                xorBlock.call(this, words, offset, blockSize);

                // This block becomes the previous block
                this._prevBlock = thisBlock;
            }
        });

        function xorBlock(words, offset, blockSize) {
            // Shortcut
            var iv = this._iv;

            // Choose mixing block
            if (iv) {
                var block = iv;

                // Remove IV for subsequent blocks
                this._iv = undefined;
            } else {
                var block = this._prevBlock;
            }

            // XOR blocks
            for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= block[i];
            }
        }

        return CBC;
    }());

    /**
     * Padding namespace.
     */
    var C_pad = C.pad = {};

    /**
     * PKCS #5/7 padding strategy.
     */
    var Pkcs7 = C_pad.Pkcs7 = {
        /**
         * Pads data using the algorithm defined in PKCS #5/7.
         *
         * @param {WordArray} data The data to pad.
         * @param {number} blockSize The multiple that the data should be padded to.
         *
         * @static
         *
         * @example
         *
         *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
         */
        pad: function (data, blockSize) {
            // Shortcut
            var blockSizeBytes = blockSize * 4;

            // Count padding bytes
            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

            // Create padding word
            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

            // Create padding
            var paddingWords = [];
            for (var i = 0; i < nPaddingBytes; i += 4) {
                paddingWords.push(paddingWord);
            }
            var padding = WordArray.create(paddingWords, nPaddingBytes);

            // Add padding
            data.concat(padding);
        },

        /**
         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
         *
         * @param {WordArray} data The data to unpad.
         *
         * @static
         *
         * @example
         *
         *     CryptoJS.pad.Pkcs7.unpad(wordArray);
         */
        unpad: function (data) {
            // Get number of padding bytes from last byte
            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

            // Remove padding
            data.sigBytes -= nPaddingBytes;
        }
    };

    var NoPadding=C_pad.NoPadding={
        pad: function () {},
        unpad: function() {}
    };

    /**
     * Abstract base block cipher template.
     *
     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
     */
    var BlockCipher = C_lib.BlockCipher = Cipher.extend({
        /**
         * Configuration options.
         *
         * @property {Mode} mode The block mode to use. Default: CBC
         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
         */
        cfg: Cipher.cfg.extend({
            mode: CBC,
            padding: Pkcs7
        }),

        reset: function () {
            // Reset cipher
            Cipher.reset.call(this);

            // Shortcuts
            var cfg = this.cfg;
            var iv = cfg.iv;
            var mode = cfg.mode;

            // Reset block mode
            if (this._xformMode == this._ENC_XFORM_MODE) {
                var modeCreator = mode.createEncryptor;
            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                var modeCreator = mode.createDecryptor;

                // Keep at least one block in the buffer for unpadding
                this._minBufferSize = 1;
            }
            this._mode = modeCreator.call(mode, this, iv && iv.words);
        },

        _doProcessBlock: function (words, offset) {
            this._mode.processBlock(words, offset);
        },

        _doFinalize: function () {
            // Shortcut
            var padding = this.cfg.padding;

            // Finalize
            if (this._xformMode == this._ENC_XFORM_MODE) {
                // Pad data
                padding.pad(this._data, this.blockSize);

                // Process final blocks
                var finalProcessedBlocks = this._process(!!'flush');
            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                // Process final blocks
                var finalProcessedBlocks = this._process(!!'flush');

                // Unpad data
                padding.unpad(finalProcessedBlocks);
            }

            return finalProcessedBlocks;
        },

        blockSize: 128/32
    });

    /**
     * A collection of cipher parameters.
     *
     * @property {WordArray} ciphertext The raw ciphertext.
     * @property {WordArray} key The key to this ciphertext.
     * @property {WordArray} iv The IV used in the ciphering operation.
     * @property {WordArray} salt The salt used with a key derivation function.
     * @property {Cipher} algorithm The cipher algorithm.
     * @property {Mode} mode The block mode used in the ciphering operation.
     * @property {Padding} padding The padding scheme used in the ciphering operation.
     * @property {number} blockSize The block size of the cipher.
     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
     */
    var CipherParams = C_lib.CipherParams = Base.extend({
        /**
         * Initializes a newly created cipher params object.
         *
         * @param {Object} cipherParams An object with any of the possible cipher parameters.
         *
         * @example
         *
         *     var cipherParams = CryptoJS.lib.CipherParams.create({
         *         ciphertext: ciphertextWordArray,
         *         key: keyWordArray,
         *         iv: ivWordArray,
         *         salt: saltWordArray,
         *         algorithm: CryptoJS.algo.AES,
         *         mode: CryptoJS.mode.CBC,
         *         padding: CryptoJS.pad.PKCS7,
         *         blockSize: 4,
         *         formatter: CryptoJS.format.OpenSSL
         *     });
         */
        init: function (cipherParams) {
            this.mixIn(cipherParams);
        },

        /**
         * Converts this cipher params object to a string.
         *
         * @param {Format} formatter (Optional) The formatting strategy to use.
         *
         * @return {string} The stringified cipher params.
         *
         * @throws Error If neither the formatter nor the default formatter is set.
         *
         * @example
         *
         *     var string = cipherParams + '';
         *     var string = cipherParams.toString();
         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
         */
        toString: function (formatter) {
            return (formatter || this.formatter).stringify(this);
        }
    });

    /**
     * Format namespace.
     */
    var C_format = C.format = {};

    /**
     * OpenSSL formatting strategy.
     */
    var OpenSSLFormatter = C_format.OpenSSL = {
        /**
         * Converts a cipher params object to an OpenSSL-compatible string.
         *
         * @param {CipherParams} cipherParams The cipher params object.
         *
         * @return {string} The OpenSSL-compatible string.
         *
         * @static
         *
         * @example
         *
         *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
         */
        stringify: function (cipherParams) {
            // Shortcuts
            var ciphertext = cipherParams.ciphertext;
            var salt = cipherParams.salt;

            // Format
            if (salt) {
                var wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
            } else {
                var wordArray = ciphertext;
            }

            return wordArray.toString(Base64);
        },

        /**
         * Converts an OpenSSL-compatible string to a cipher params object.
         *
         * @param {string} openSSLStr The OpenSSL-compatible string.
         *
         * @return {CipherParams} The cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
         */
        parse: function (openSSLStr) {
            // Parse base64
            var ciphertext = Base64.parse(openSSLStr);

            // Shortcut
            var ciphertextWords = ciphertext.words;

            // Test for salt
            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
                // Extract salt
                var salt = WordArray.create(ciphertextWords.slice(2, 4));

                // Remove salt from ciphertext
                ciphertextWords.splice(0, 4);
                ciphertext.sigBytes -= 16;
            }

            return CipherParams.create({ ciphertext: ciphertext, salt: salt });
        }
    };

    /**
     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
     */
    var SerializableCipher = C_lib.SerializableCipher = Base.extend({
        /**
         * Configuration options.
         *
         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
         */
        cfg: Base.extend({
            format: OpenSSLFormatter
        }),

        /**
         * Encrypts a message.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {WordArray|string} message The message to encrypt.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} A cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         */
        encrypt: function (cipher, message, key, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Encrypt
            var encryptor = cipher.createEncryptor(key, cfg);
            var ciphertext = encryptor.finalize(message);

            // Shortcut
            var cipherCfg = encryptor.cfg;

            // Create and return serializable cipher params
            return CipherParams.create({
                ciphertext: ciphertext,
                key: key,
                iv: cipherCfg.iv,
                algorithm: cipher,
                mode: cipherCfg.mode,
                padding: cipherCfg.padding,
                blockSize: cipher.blockSize,
                formatter: cfg.format
            });
        },

        /**
         * Decrypts serialized ciphertext.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The plaintext.
         *
         * @static
         *
         * @example
         *
         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         */
        decrypt: function (cipher, ciphertext, key, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Convert string to CipherParams
            ciphertext = this._parse(ciphertext, cfg.format);

            // Decrypt
            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

            return plaintext;
        },

        /**
         * Converts serialized ciphertext to CipherParams,
         * else assumed CipherParams already and returns ciphertext unchanged.
         *
         * @param {CipherParams|string} ciphertext The ciphertext.
         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
         *
         * @return {CipherParams} The unserialized ciphertext.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
         */
        _parse: function (ciphertext, format) {
            if (typeof ciphertext == 'string') {
                return format.parse(ciphertext, this);
            } else {
                return ciphertext;
            }
        }
    });

    /**
     * Key derivation function namespace.
     */
    var C_kdf = C.kdf = {};

    /**
     * OpenSSL key derivation function.
     */
    var OpenSSLKdf = C_kdf.OpenSSL = {
        /**
         * Derives a key and IV from a password.
         *
         * @param {string} password The password to derive from.
         * @param {number} keySize The size in words of the key to generate.
         * @param {number} ivSize The size in words of the IV to generate.
         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
         *
         * @return {CipherParams} A cipher params object with the key, IV, and salt.
         *
         * @static
         *
         * @example
         *
         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
         */
        execute: function (password, keySize, ivSize, salt) {
            // Generate random salt
            if (!salt) {
                salt = WordArray.random(64/8);
            }

            // Derive key and IV
            var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);

            // Separate key and IV
            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
            key.sigBytes = keySize * 4;

            // Return params
            return CipherParams.create({ key: key, iv: iv, salt: salt });
        }
    };

    /**
     * A serializable cipher wrapper that derives the key from a password,
     * and returns ciphertext as a serializable cipher params object.
     */
    var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
        /**
         * Configuration options.
         *
         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
         */
        cfg: SerializableCipher.cfg.extend({
            kdf: OpenSSLKdf
        }),

        /**
         * Encrypts a message using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {WordArray|string} message The message to encrypt.
         * @param {string} password The password.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} A cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
         */
        encrypt: function (cipher, message, password, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Derive key and other params
            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);

            // Add IV to config
            cfg.iv = derivedParams.iv;

            // Encrypt
            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

            // Mix in derived params
            ciphertext.mixIn(derivedParams);

            return ciphertext;
        },

        /**
         * Decrypts serialized ciphertext using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {string} password The password.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The plaintext.
         *
         * @static
         *
         * @example
         *
         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
         */
        decrypt: function (cipher, ciphertext, password, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Convert string to CipherParams
            ciphertext = this._parse(ciphertext, cfg.format);

            // Derive key and other params
            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);

            // Add IV to config
            cfg.iv = derivedParams.iv;

            // Decrypt
            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

            return plaintext;
        }
    });
}());

(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var C_enc = C.enc;

    /**
     * Base64 encoding strategy.
     */
    var Base64 = C_enc.Base64 = {
        /**
         * Converts a word array to a Base64 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Base64 string.
         *
         * @static
         *
         * @example
         *
         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this._map;

            // Clamp excess bits
            wordArray.clamp();

            // Convert
            var base64Chars = [];
            for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                }
            }

            // Add padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                while (base64Chars.length % 4) {
                    base64Chars.push(paddingChar);
                }
            }

            return base64Chars.join('');
        },

        /**
         * Converts a Base64 string to a word array.
         *
         * @param {string} base64Str The Base64 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
         */
        parse: function (base64Str) {
            // Shortcuts
            var base64StrLength = base64Str.length;
            var map = this._map;

            // Ignore padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex != -1) {
                    base64StrLength = paddingIndex;
                }
            }

            // Convert
            var words = [];
            var nBytes = 0;
            for (var i = 0; i < base64StrLength; i++) {
                if (i % 4) {
                    var bits1 = map.indexOf(base64Str.charAt(i - 1)) << ((i % 4) * 2);
                    var bits2 = map.indexOf(base64Str.charAt(i)) >>> (6 - (i % 4) * 2);
                    words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
                    nBytes++;
                }
            }

            return WordArray.create(words, nBytes);
        },

        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    };
}());
(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var BlockCipher = C_lib.BlockCipher;
    var C_algo = C.algo;

    // Lookup tables
    var SBOX = [];
    var INV_SBOX = [];
    var SUB_MIX_0 = [];
    var SUB_MIX_1 = [];
    var SUB_MIX_2 = [];
    var SUB_MIX_3 = [];
    var INV_SUB_MIX_0 = [];
    var INV_SUB_MIX_1 = [];
    var INV_SUB_MIX_2 = [];
    var INV_SUB_MIX_3 = [];

    // Compute lookup tables
    (function () {
        // Compute double table
        var d = [];
        for (var i = 0; i < 256; i++) {
            if (i < 128) {
                d[i] = i << 1;
            } else {
                d[i] = (i << 1) ^ 0x11b;
            }
        }

        // Walk GF(2^8)
        var x = 0;
        var xi = 0;
        for (var i = 0; i < 256; i++) {
            // Compute sbox
            var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
            sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
            SBOX[x] = sx;
            INV_SBOX[sx] = x;

            // Compute multiplication
            var x2 = d[x];
            var x4 = d[x2];
            var x8 = d[x4];

            // Compute sub bytes, mix columns tables
            var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
            SUB_MIX_0[x] = (t << 24) | (t >>> 8);
            SUB_MIX_1[x] = (t << 16) | (t >>> 16);
            SUB_MIX_2[x] = (t << 8)  | (t >>> 24);
            SUB_MIX_3[x] = t;

            // Compute inv sub bytes, inv mix columns tables
            var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
            INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
            INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
            INV_SUB_MIX_2[sx] = (t << 8)  | (t >>> 24);
            INV_SUB_MIX_3[sx] = t;

            // Compute next counter
            if (!x) {
                x = xi = 1;
            } else {
                x = x2 ^ d[d[d[x8 ^ x2]]];
                xi ^= d[d[xi]];
            }
        }
    }());

    // Precomputed Rcon lookup
    var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

    /**
     * AES block cipher algorithm.
     */
    var AES = C_algo.AES = BlockCipher.extend({
        _doReset: function () {
            // Shortcuts
            var key = this._key;
            var keyWords = key.words;
            var keySize = key.sigBytes / 4;

            // Compute number of rounds
            var nRounds = this._nRounds = keySize + 6

            // Compute number of key schedule rows
            var ksRows = (nRounds + 1) * 4;

            // Compute key schedule
            var keySchedule = this._keySchedule = [];
            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
                if (ksRow < keySize) {
                    keySchedule[ksRow] = keyWords[ksRow];
                } else {
                    var t = keySchedule[ksRow - 1];

                    if (!(ksRow % keySize)) {
                        // Rot word
                        t = (t << 8) | (t >>> 24);

                        // Sub word
                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

                        // Mix Rcon
                        t ^= RCON[(ksRow / keySize) | 0] << 24;
                    } else if (keySize > 6 && ksRow % keySize == 4) {
                        // Sub word
                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
                    }

                    keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
                }
            }

            // Compute inv key schedule
            var invKeySchedule = this._invKeySchedule = [];
            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
                var ksRow = ksRows - invKsRow;

                if (invKsRow % 4) {
                    var t = keySchedule[ksRow];
                } else {
                    var t = keySchedule[ksRow - 4];
                }

                if (invKsRow < 4 || ksRow <= 4) {
                    invKeySchedule[invKsRow] = t;
                } else {
                    invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
                        INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
                }
            }
        },

        encryptBlock: function (M, offset) {
            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
        },

        decryptBlock: function (M, offset) {
            // Swap 2nd and 4th rows
            var t = M[offset + 1];
            M[offset + 1] = M[offset + 3];
            M[offset + 3] = t;

            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

            // Inv swap 2nd and 4th rows
            var t = M[offset + 1];
            M[offset + 1] = M[offset + 3];
            M[offset + 3] = t;
        },

        _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
            // Shortcut
            var nRounds = this._nRounds;

            // Get input, add round key
            var s0 = M[offset]     ^ keySchedule[0];
            var s1 = M[offset + 1] ^ keySchedule[1];
            var s2 = M[offset + 2] ^ keySchedule[2];
            var s3 = M[offset + 3] ^ keySchedule[3];

            // Key schedule row counter
            var ksRow = 4;

            // Rounds
            for (var round = 1; round < nRounds; round++) {
                // Shift rows, sub bytes, mix columns, add round key
                var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
                var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
                var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
                var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

                // Update state
                s0 = t0;
                s1 = t1;
                s2 = t2;
                s3 = t3;
            }

            // Shift rows, sub bytes, add round key
            var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
            var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
            var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
            var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

            // Set output
            M[offset]     = t0;
            M[offset + 1] = t1;
            M[offset + 2] = t2;
            M[offset + 3] = t3;
        },

        keySize: 256/32
    });

    /**
     * Shortcut functions to the cipher's object interface.
     *
     * @example
     *
     *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
     *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
     */
    C.AES = BlockCipher._createHelper(AES);
}());
!function($){return $?($.Unslider=function(t,n){var e=this;return e._="unslider",e.defaults={autoplay:!1,delay:3e3,speed:750,easing:"swing",keys:{prev:37,next:39},nav:!0,arrows:{prev:'<a class="'+e._+'-arrow prev">←</a>',next:'<a class="'+e._+'-arrow next">→</a>'},animation:"horizontal",selectors:{container:"ul:first",slides:"li"},animateHeight:!1,activeClass:e._+"-active",swipe:!0},e.$context=t,e.options={},e.$parent=null,e.$container=null,e.$slides=null,e.$nav=null,e.$arrows=[],e.total=0,e.current=0,e.prefix=e._+"-",e.eventSuffix="."+e.prefix+~~(2e3*Math.random()),e.interval=null,e.init=function(t){return e.options=$.extend({},e.defaults,t),e.$container=e.$context.find(e.options.selectors.container).addClass(e.prefix+"wrap"),e.$slides=e.$container.children(e.options.selectors.slides),e.setup(),["nav","arrows","keys","infinite"].forEach(function(t){e.options[t]&&e["init"+$._ucfirst(t)]()}),void 0!==typeof jQuery.event.special.swipe&&e.options.swipe&&e.initSwipe(),e.options.autoplay&&e.start(),e.calculateSlides(),e.$context.trigger(e._+".ready"),e.animate(e.options.index||e.current,"init")},e.setup=function(){e.$context.addClass(e.prefix+e.options.animation).wrap('<div class="'+e._+'" />'),e.$parent=e.$context.parent("."+e._);var t=e.$context.css("position");"static"===t&&e.$context.css("position","relative"),e.$context.css("overflow","visible")},e.calculateSlides=function(){if(e.total=e.$slides.length,"fade"!==e.options.animation){var t="width";"vertical"===e.options.animation&&(t="height"),e.$container.css(t,100*e.total+"%").addClass(e.prefix+"carousel"),e.$slides.css(t,100/e.total+"%")}},e.start=function(){return e.interval=setTimeout(function(){e.next()},e.options.delay),e},e.stop=function(){return clearTimeout(e.interval),e},e.initNav=function(){var t=$('<nav class="'+e.prefix+'nav"><ol /></nav>');e.$slides.each(function(n){var i=this.getAttribute("data-nav")||n+1;$.isFunction(e.options.nav)&&(i=e.options.nav.call(e.$slides.eq(n),n,i)),t.children("ol").append('<li data-slide="'+n+'">'+i+"</li>")}),e.$nav=t.insertAfter(e.$context),e.$nav.find("li").on("click"+e.eventSuffix,function(){var t=$(this).addClass(e.options.activeClass);t.siblings().removeClass(e.options.activeClass),e.animate(t.attr("data-slide"))})},e.initArrows=function(){e.options.arrows===!0&&(e.options.arrows=e.defaults.arrows),$.each(e.options.arrows,function(t,n){e.$arrows.push($(n).insertAfter(e.$context).on("click"+e.eventSuffix,e[t]))})},e.initKeys=function(){e.options.keys===!0&&(e.options.keys=e.defaults.keys),$(document).on("keyup"+e.eventSuffix,function(t){$.each(e.options.keys,function(n,i){t.which===i&&$.isFunction(e[n])&&e[n].call(e)})})},e.initSwipe=function(){var t=e.$slides.width();e.$container.on({swipeleft:e.next,swiperight:e.prev,movestart:function(t){return t.distX>t.distY&&t.distX<-t.distY||t.distX<t.distY&&t.distX>-t.distY?!!t.preventDefault():void e.$container.css("position","relative")}}),"fade"!==e.options.animation&&e.$container.on({move:function(n){e.$container.css("left",-(100*e.current)+100*n.distX/t+"%")},moveend:function(n){return Math.abs(n.distX)/t<$.event.special.swipe.settings.threshold?e._move(e.$container,{left:-(100*e.current)+"%"},!1,200):void 0}})},e.initInfinite=function(){var t=["first","last"];t.forEach(function(n,i){e.$slides.push.apply(e.$slides,e.$slides.filter(':not(".'+e._+'-clone")')[n]().clone().addClass(e._+"-clone")["insert"+(0===i?"After":"Before")](e.$slides[t[~~!i]]()))})},e.destroyArrows=function(){e.$arrows.forEach(function(t){t.remove()})},e.destroySwipe=function(){e.$container.off("movestart move moveend")},e.destroyKeys=function(){$(document).off("keyup"+e.eventSuffix)},e.setIndex=function(t){return 0>t&&(t=e.total-1),e.current=Math.min(Math.max(0,t),e.total-1),e.options.nav&&e.$nav.find('[data-slide="'+e.current+'"]')._toggleActive(e.options.activeClass),e.$slides.eq(e.current)._toggleActive(e.options.activeClass),e},e.animate=function(t,n){if("first"===t&&(t=0),"last"===t&&(t=e.total),isNaN(t))return e;e.options.autoplay&&e.stop().start(),e.setIndex(t),e.$context.trigger(e._+".change",[t,e.$slides.eq(t)]);var i="animate"+$._ucfirst(e.options.animation);return $.isFunction(e[i])&&e[i](e.current,n),e},e.next=function(){var t=e.current+1;return t>=e.total&&(t=0),e.animate(t,"next")},e.prev=function(){return e.animate(e.current-1,"prev")},e.animateHorizontal=function(t){var n="left";return"rtl"===e.$context.attr("dir")&&(n="right"),e.options.infinite&&e.$container.css("margin-"+n,"-100%"),e.slide(n,t)},e.animateVertical=function(t){return e.options.animateHeight=!0,e.options.infinite&&e.$container.css("margin-top",-e.$slides.outerHeight()),e.slide("top",t)},e.slide=function(t,n){if(e.options.animateHeight&&e._move(e.$context,{height:e.$slides.eq(n).outerHeight()},!1),e.options.infinite){var i;n===e.total-1&&(i=e.total-3,n=-1),n===e.total-2&&(i=0,n=e.total-2),"number"==typeof i&&(e.setIndex(i),e.$context.on(e._+".moved",function(){e.current===i&&e.$container.css(t,-(100*i)+"%").off(e._+".moved")}))}var o={};return o[t]=-(100*n)+"%",e._move(e.$container,o)},e.animateFade=function(t){var n=e.$slides.eq(t).addClass(e.options.activeClass);e._move(n.siblings().removeClass(e.options.activeClass),{opacity:0}),e._move(n,{opacity:1},!1)},e._move=function(t,n,i,o){return i!==!1&&(i=function(){e.$context.trigger(e._+".moved")}),t._move(n,o||e.options.speed,e.options.easing,i)},e.init(n)},$.fn._toggleActive=function(t){return this.addClass(t).siblings().removeClass(t)},$._ucfirst=function(t){return(t+"").toLowerCase().replace(/^./,function(t){return t.toUpperCase()})},$.fn._move=function(){var t="animate";return this.stop(!0,!0),$.fn.velocity&&(t="velocity"),$.fn[t].apply(this,arguments)},void($.fn.unslider=function(t){return this.each(function(){var n=$(this);if("string"==typeof t&&n.data("unslider")){t=t.split(":");var e=t[0],i=n.data("unslider")[e];if(t[1]){var o=t[1].split(",");return $.isFunction(i)&&i.apply(n,o)}return $.isFunction(i)&&i(),this}return n.data("unslider",new $.Unslider(n,t))})})):console.warn("Unslider needs jQuery")}(window.jQuery);
(function(){
var
  version = "2.0.7",
  hasOwn = {}.hasOwnProperty,
  PingppSDK = function(){},
  cfg = {
    PINGPP_NOTIFY_URL: 'https://api.pingxx.com/notify/charges/',
    UPACP_WAP_URL: 'https://gateway.95516.com/gateway/api/frontTransReq.do',
    ALIPAY_WAP_URL: 'http://wappaygw.alipay.com/service/rest.htm',
    UPMP_WAP_URL: 'uppay://uppayservice/?style=token&paydata=',
    JDPAY_WAP_URL: 'https://m.jdpay.com/wepay/web/pay',
    YEEPAY_WAP_URL: 'https://ok.yeepay.com/paymobile/api/pay/request',
    YEEPAY_WAP_TEST_URL: 'http://mobiletest.yeepay.com/paymobile/api/pay/request',
    PINGPP_MOCK_URL: 'http://sissi.pingxx.com/mock.php'
  },
  channels = {
    alipay_wap: 'alipay_wap',
    upmp_wap: 'upmp_wap',
    upacp_wap: 'upacp_wap',
    bfb_wap: 'bfb_wap',
    wx_pub: 'wx_pub',
    yeepay_wap: 'yeepay_wap',
    jdpay_wap: 'jdpay_wap'
  };

PingppSDK.prototype = {

  version: version,

  _resultCallback: undefined,

  _jsApiParameters: {},

  _debug: false,

  _signature: undefined,

  createPayment: function(charge_json, callback, signature, debug) {
    if (typeof callback == "function") {
      this._resultCallback = callback;
    }
    if (typeof signature != "undefined") {
      this._signature = signature;
    }
    if (typeof debug == "boolean") {
      this._debug = debug;
    }
    var charge;
    if(typeof charge_json == "string"){
      try{
        charge = JSON.parse(charge_json);
      }catch(err){
        this._innerCallback("fail", this._error("json_decode_fail"));
        return;
      }
    }else{
      charge = charge_json;
    }
    if(typeof charge == "undefined"){
      this._innerCallback("fail", this._error("json_decode_fail"));
      return;
    }
    if(!hasOwn.call(charge, 'id')){
      this._innerCallback("fail", this._error("invalid_charge", "no_charge_id"));
      return;
    }
    if(!hasOwn.call(charge, 'channel')){
      this._innerCallback("fail", this._error("invalid_charge", "no_channel"));
      return;
    }
    var channel = charge['channel'];
    if(!hasOwn.call(charge, 'credential')){
      this._innerCallback("fail", this._error("invalid_charge", "no_credential"));
      return;
    }
    if (!charge['credential']) {
      this._innerCallback("fail", this._error("invalid_credential", "credential_is_undefined"));
      return;
    }
    if (!hasOwn.call(channels, channel)) {
      this._innerCallback("fail", this._error("invalid_charge", "no_such_channel:" + channel));
      return;
    }
    if (!hasOwn.call(charge['credential'], channel)) {
      this._innerCallback("fail", this._error("invalid_credential", "no_valid_channel_credential"));
      return;
    }
    if(!hasOwn.call(charge, 'livemode')){
      this._innerCallback("fail", this._error("invalid_charge", "no_livemode"));
      return;
    }
    if (charge['livemode'] == false) {
      this._testModeNotify(charge);
      return;
    }
    var credential = charge['credential'][channel];
    if (channel == channels.upmp_wap) {  // 调起银联支付控件，客户端需要安装银联支付控件才能调起
      location.href = cfg.UPMP_WAP_URL + credential['paydata'];
    } else if (channel == channels.upacp_wap) {
      form_submit(cfg.UPACP_WAP_URL, 'post', credential);
    } else if (channel == channels.alipay_wap) {  // 调起支付宝手机网页支付
      credential['_input_charset'] = 'utf-8';
      if (typeof _AP != "undefined") {
        var query = stringify_data(credential, channel, true);
        _AP.pay(cfg.ALIPAY_WAP_URL + "?" + query);
      } else {
        form_submit(cfg.ALIPAY_WAP_URL, 'get', credential);
      }
    } else if (channel == channels.bfb_wap) {
      if (!hasOwn.call(credential, 'url')) {
        this._innerCallback("fail", this._error("invalid_credential", "missing_field:url"));
        return;
      }
      location.href = credential['url'] + '?' + stringify_data(credential, channel);
    } else if (channel == channels.yeepay_wap) {
      var fields = ["merchantaccount", "encryptkey", "data"];
      for (var k = 0; k < fields.length; k++) {
        if(!hasOwn.call(credential, fields[k])){
          this._innerCallback("fail", this._error("invalid_credential", "missing_field_"+fields[k]));
          return;
        }
      }
      if (hasOwn.call(credential, "mode") && credential["mode"] == "test") {
        location.href = cfg.YEEPAY_WAP_TEST_URL + '?' + stringify_data(credential, channel, true);
      } else {
        location.href = cfg.YEEPAY_WAP_URL + '?' + stringify_data(credential, channel, true);
      }
    } else if (channel == channels.wx_pub) {
      var fields = ["appId", "timeStamp", "nonceStr", "package", "signType", "paySign"];
      for (var k = 0; k < fields.length; k++) {
        if (!hasOwn.call(credential, fields[k])) {
          this._innerCallback("fail", this._error("invalid_credential", "missing_field_"+fields[k]));
          return;
        }
      }
      this._jsApiParameters = credential;
      this._callpay();
    } else if (channel == channels.jdpay_wap) {
      form_submit(cfg.JDPAY_WAP_URL, 'post', credential);
    }
  },

  _jsApiCall: function(){
    var self = this;
    if(self._jsApiParameters != {}){
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        self._jsApiParameters,
        function(res){
          if(res.err_msg == 'get_brand_wcpay_request:ok'){
            self._innerCallback("success");
          }else if(res.err_msg == 'get_brand_wcpay_request:cancel'){
            self._innerCallback("cancel");
          }else{
            self._innerCallback("fail", self._error("wx_result_fail", res.err_msg));
          }
        }
      );
    }
  },

  _callpay: function(){
    var self = this;
    if (typeof wx != "undefined" && typeof self._signature != "undefined") {
      var wxConfigFailed = false;
      wx.config({
        debug: self._debug,
        appId: self._jsApiParameters["appId"],
        timestamp: self._jsApiParameters["timeStamp"],
        nonceStr: self._jsApiParameters["nonceStr"],
        signature: self._signature,
        jsApiList: ['chooseWXPay']
      });
      wx.ready(function(){
        if (wxConfigFailed) {
          return;
        }
        wx.chooseWXPay({
          timestamp: self._jsApiParameters["timeStamp"],
          nonceStr: self._jsApiParameters["nonceStr"],
          "package": self._jsApiParameters["package"],
          signType: self._jsApiParameters["signType"],
          paySign: self._jsApiParameters["paySign"],
          success: function(res) {
            if (res.errMsg == "chooseWXPay:ok") {
              self._innerCallback("success");
            } else {
              self._innerCallback("fail", self._error("wx_result_fail", res.errMsg));
            }
          },
          cancel: function(res) {
            self._innerCallback("cancel");
          },
          fail: function(res) {
            self._innerCallback("fail", self._error("wx_result_fail", res.errMsg));
          }
        });
      });
      wx.error(function(res){
        wxConfigFailed = true;
        self._innerCallback("fail", self._error("wx_config_error", res.errMsg));
      });
    } else if (typeof WeixinJSBridge == "undefined") {
      function eventCallback(){
        self._jsApiCall();
      }
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', eventCallback, false);
      } else if(document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', eventCallback);
        document.attachEvent('onWeixinJSBridgeReady', eventCallback);
      }
    }else{
      this._jsApiCall();
    }
  },

  _error: function(msg, extra) {
    msg = (typeof msg == "undefined") ? "" : msg;
    extra = (typeof extra == "undefined") ? "" : extra;
    return {
      msg:msg,
      extra:extra
    };
  },

  _innerCallback: function(result, err) {
    if (typeof this._resultCallback == "function") {
      if (typeof err == "undefined") {
        err = this._error();
      }
      this._resultCallback(result, err);
    }
  },

  _testModeNotify: function(charge) {
    var self = this;
    if (charge['channel'] == channels.wx_pub) {
      var dopay = confirm("模拟付款？");
      if (dopay) {
        var request = new XMLHttpRequest();
        request.open('GET', cfg.PINGPP_NOTIFY_URL+charge['id']+'?livemode=false', true);
        request.onload = function() {
          if (request.status >= 200 && request.status < 400 && request.responseText == "success"){
            self._innerCallback("success");
          } else {
            var extra = 'http_code:'+request.status+';response:'+request.responseText;
            self._innerCallback("fail", self._error("testmode_notify_fail", extra));
          }
        };
        request.onerror = function() {
          self._innerCallback("fail", self._error("network_err"));
        };
        request.send();
      } else {
        self._innerCallback("cancel");
      }
    } else {
      var params = {
        'ch_id': charge['id'],
        'scheme': 'http',
        'channel': charge['channel']
      };
      if (hasOwn.call(charge, 'order_no')) {
        params['order_no'] = charge['order_no'];
      } else if (hasOwn.call(charge, 'orderNo')) {
        params['order_no'] = charge['orderNo'];
      }
      if (hasOwn.call(charge, 'time_expire')) {
        params['time_expire'] = charge['time_expire'];
      } else if (hasOwn.call(charge, 'timeExpire')) {
        params['time_expire'] = charge['timeExpire'];
      }
      if (hasOwn.call(charge, 'extra')) {
        params['extra'] = encodeURIComponent(JSON.stringify(charge['extra']));
      }
      location.href = cfg.PINGPP_MOCK_URL+'?'+stringify_data(params);
    }
  }
};

function form_submit(url, method, params) {
  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", url);

  for (var key in params) {
    if (hasOwn.call(params, key)) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", params[key]);
      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

function stringify_data(data, channel, urlencode) {
  if (typeof urlencode == "undefined") {
    urlencode = false;
  }
  var output = [];
  for (var i in data) {
    if (channel == "bfb_wap" && i == "url") {
      continue;
    }
    if (channel == "yeepay_wap" && i == "mode") {
      continue;
    }
    output.push(i + '=' + (urlencode ? encodeURIComponent(data[i]) : data[i]));
  }
  return output.join('&');
}

PingppSDK.prototype.payment = PingppSDK.prototype.createPayment;
window.pingpp = new PingppSDK();
// aliases
window.PINGPP_PAY_SDK = window.PINGPP_WX_PUB = window.pingpp;
})();

/*!
 * jQuery cxSelect
 * @name jquery.cxselect.js
 * @version 1.3.8
 * @date 2015-12-7
 * @author ciaoca
 * @email ciaoca@gmail.com
 * @site https://github.com/ciaoca/cxSelect
 * @license Released under the MIT license
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(window.jQuery||window.Zepto||window.$)}(function(a){a.cxSelect=function(){var b={dom:{},api:{}};return b.init=function(){var c,f,g,h,i,b=this,d=function(a){return a&&("function"==typeof HTMLElement||"object"==typeof HTMLElement)&&a instanceof HTMLElement?!0:a&&a.nodeType&&1===a.nodeType?!0:!1},e=function(a){return a&&a.length&&("function"==typeof jQuery||"object"==typeof jQuery)&&a instanceof jQuery?!0:!1};for(f=0,g=arguments.length;g>f;f++)e(arguments[f])?b.dom.box=arguments[f]:d(arguments[f])?b.dom.box=a(arguments[f]):"object"==typeof arguments[f]&&(c=arguments[f]);if(b.dom.box.length&&(b.settings=a.extend({},a.cxSelect.defaults,c,{url:b.dom.box.data("url"),nodata:b.dom.box.data("nodata"),required:b.dom.box.data("required"),firstTitle:b.dom.box.data("firstTitle"),firstValue:b.dom.box.data("firstValue"),jsonSpace:b.dom.box.data("jsonSpace"),jsonName:b.dom.box.data("jsonName"),jsonValue:b.dom.box.data("jsonValue"),jsonSub:b.dom.box.data("jsonSub")}),h=b.dom.box.data("selects"),"string"==typeof h&&h.length&&(b.settings.selects=h.split(",")),a.isArray(b.settings.selects)&&b.settings.selects.length)){for(b.selectArray=[],f=0,g=b.settings.selects.length;g>f&&(i=b.dom.box.find("select."+b.settings.selects[f]),i);f++)"string"==typeof i.val()&&i.data("value",i.val()),b.selectArray.push(i);b.selectArray.length&&(b.dom.box.on("change","select",function(){b.selectChange(this.className)}),b.settings.url?"string"==typeof b.settings.url?a.getJSON(b.settings.url,function(a){b.start(a)}):"object"==typeof b.settings.url&&b.start(b.settings.url):b.start())}},b.getIndex=function(a){return this.settings.required?a:a-1},b.start=function(a){var d,e,f,b=this,c=b.settings.jsonSpace;if(b.dataJson=void 0,a&&"object"==typeof a&&(b.dataJson=a,"string"==typeof c&&c.length))for(d=c.split("."),e=0,f=d.length;f>e;e++)b.dataJson=b.dataJson[d[e]];b.dataJson||"string"==typeof b.selectArray[0].data("url")&&b.selectArray[0].data("url").length?b.getOptionData(0):b.selectArray[0].prop("disabled",!1).css({display:"",visibility:""})},b.selectChange=function(a){var b,c,d;if("string"==typeof a&&a.length){for(a=a.replace(/\s+/g,","),a=","+a+",",c=0,d=this.selectArray.length;d>c;c++)a.indexOf(","+this.settings.selects[c]+",")>-1&&(b=c);"number"==typeof b&&(b+=1,this.getOptionData(b))}},b.getOptionData=function(b){var e,f,g,h,i,j,k,l,m,n,o,p,d=this;if(!("number"!=typeof b||isNaN(b)||0>b||b>=d.selectArray.length)){for(e=b-1,f=d.selectArray[b],j={},k=f.data("url"),l="undefined"==typeof f.data("jsonSpace")?d.settings.jsonSpace:f.data("jsonSpace"),o=0,p=d.selectArray.length;p>o;o++)o>=b&&(d.selectArray[o].empty().prop("disabled",!0),"none"===d.settings.nodata?d.selectArray[o].css("display","none"):"hidden"===d.settings.nodata&&d.selectArray[o].css("visibility","hidden"));if("string"==typeof k&&k.length){if(e>=0){if(!d.selectArray[e].val().length)return;m=f.data("queryName"),n=d.selectArray[e].attr("name"),"string"==typeof m&&m.length?j[m]=d.selectArray[e].val():"string"==typeof n&&n.length&&(j[n]=d.selectArray[e].val())}a.getJSON(k,j,function(a){var b,c,e;if(h=a,"string"==typeof l&&l.length)for(b=l.split("."),c=0,e=b.length;e>c;c++)h=h[b[c]];d.buildOption(f,h)})}else if(d.dataJson&&"object"==typeof d.dataJson){for(h=d.dataJson,o=0,p=d.selectArray.length;p>o;o++)b>o&&(i=d.getIndex(d.selectArray[o][0].selectedIndex),"object"==typeof h[i]&&a.isArray(h[i][d.settings.jsonSub])&&h[i][d.settings.jsonSub].length&&(g=o,h=h[i][d.settings.jsonSub]));(0>e||e===g)&&d.buildOption(f,h)}}},b.buildOption=function(b,c){var i,j,k,d=this,e="undefined"==typeof b.data("firstTitle")?d.settings.firstTitle:String(b.data("firstTitle")),f="undefined"==typeof b.data("firstValue")?d.settings.firstValue:String(b.data("firstValue")),g="undefined"==typeof b.data("jsonName")?d.settings.jsonName:String(b.data("jsonName")),h="undefined"==typeof b.data("jsonValue")?d.settings.jsonValue:String(b.data("jsonValue"));if(a.isArray(c)){if(i=d.settings.required?"":'<option value="'+f+'">'+e+"</option>",g.length)for(h.length||(h=g),j=0,k=c.length;k>j;j++)i+='<option value="'+String(c[j][h])+'">'+String(c[j][g])+"</option>";else for(j=0,k=c.length;k>j;j++)i+='<option value="'+String(c[j])+'">'+String(c[j])+"</option>";b.html(i).prop("disabled",!1).css({display:"",visibility:""}),"undefined"!=typeof b.data("value")&&b.val(String(b.data("value"))).removeData("value").removeAttr("data-value"),b.trigger("change")}},b.init.apply(b,arguments),this},a.cxSelect.defaults={selects:[],url:null,nodata:null,required:!1,firstTitle:"请选择",firstValue:"",jsonSpace:"",jsonName:"n",jsonValue:"",jsonSub:"s"},a.fn.cxSelect=function(b,c){return this.each(function(){a.cxSelect(this,b,c)}),this}});

var app = (function(){
  /*
  * 0 全部订单
  * 1 代付款
  * 2 代发货
  * 3 代收货
  */
  var 
    configUrlMap = {
      //APIBase : "http://www.yaerku.com/pjapi/"
      //APIBase:"../app/json/home.json"
      //APIBase : "http://www.yaerku.com/pjapi/"
      //APIBase : "http://t.snapwine.net:7784/pjapi/"
      APIBase : "http://192.168.1.7:7784/pjapi/"
    }
    config = {
      Base64Key:"RkVB2p5ida3ywUDJf7IgXcoGrm8TjOEAb",
      userId :"oUeq9t-m7cPT5sAb7V7nPTfxbnpU",
      userType : "12"
    }

    localArr = [
      'name',
      'tel',
      'pro',
      'city',
      'dis',
      'detail'
    ]

    browser = {
      versions : function(){
        var 
          u = navigator.userAgent
          app = navigator.appVersion
        return {
          trident: u.indexOf('Trident') > -1, //IE内核
          presto: u.indexOf('Presto') > -1, //opera内核
          webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
          gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
          iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
          iPad: u.indexOf('iPad') > -1, //是否iPad
          webApp: u.indexOf('Safari') == -1 //是否web应用程序，没有头部与底部
        }
      }(),
      language:(navigator.browserLanguage || navigator.language).toLowerCase()
    }



  var moduleId = 1,//起始酒款模块 id, 默认值1
      pageId = 1; //酒款分页 id,默认为1

  var appState = {
      module:moduleId,
      page:pageId
  }
  function calScreenWidth(){
    return screen.width
  }

  function getSearchArgFromUrl(){
    var searchString = window.location.search
    var res = {}
    if (searchString.length > 0) {
      var argArr = searchString.substr(1,searchString.length -1 ).split('&')
      
      for (var i = 0; i < argArr.length; i++) {
        var coupleArg = argArr[i].split('=')
        console.log(coupleArg)

        res[coupleArg[0]] = coupleArg[1]
      }
    }
    return res
  }
  
  function deviceInfo(){
    var 
      devicePlat = browser.versions
      device = ""
    if (devicePlat.ios) {
       device = "iphone"
    } else if (devicePlat.android) {
      device = "android"
    }
    return device
  }  

  function browserInfo(){
    if (browser.versions.mobile) {
      var ua = navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return "weixin"
      } else if (ua.match(/WeiBo/i) == "weibo") {
        return "weibo"
      } else if (ua.match(/QQ/i) == "qq") {
        return qq
      } else if (browser.versions.ios) {
        return "ios"
      } else if (browser.versions.android) {
        return "android"
      }
    } else {
      return "pc"
    }
  }

  function appVersion(){
    var version = "2.2.0"
    return version
  }

  function timestamp(){
    return parseInt(new Date() / 1000)
  }

  function ajaxLog(path,des,feedback) {
    console.log(path +" "+ des +" " + feedback)
  }

  function pathInfo(addPath){
    var
      l = window.location
      host = l.protocol + "//" + l.host
      pathname = l.pathname
      path = pathname.substring(0,pathname.lastIndexOf('/')+1)
      newPathName = host + path + addPath

    return newPathName
  }

  function storageAvailable(type,arr) {
    try {
      var
        storage = window[type]
        x = '__storage_test__'
      arr.forEach(function(val){
        storage.setItem(val.key) = val.value
      })
      return true
    }
    catch(e) {
      return false
    }
  }
  function AES(plainText,timestamp) {

    pkcs7 = function(str) {
      var len = str.length
          block_size = 32
          pad = block_size-(len % block_size)
          padChar=String.fromCharCode(pad)

      for (var i = 0; i < pad; i++) {
        str = str + padChar
      }
      return str
    }

    var Base64Key = config['Base64Key'] + timestamp + '='
        key = CryptoJS.enc.Base64.parse(Base64Key)
        iv = key.left(16)

    //var text = pkcs7(unescape(encodeURIComponent(plainText)))
    //alert(text)

    //text=CryptoJS.enc.Latin1.parse(plainText);
    var text=CryptoJS.enc.Latin1.parse(pkcs7(plainText))
        ciphertext = CryptoJS.AES.encrypt(text, 
                                          key, 
                                          {iv: iv, 
                                            mode:CryptoJS.mode.CBC, 
                                            padding:CryptoJS.pad.NoPadding}),
        base64Text = CryptoJS.enc.Base64.stringify(ciphertext.ciphertext)
        console.log("base64Text =" + base64Text)
    return base64Text
  }

  /**
  *@param Des descripption of the request String
  *@param MethodName specific API name of current request String
  *@param RequestType GET/POST or Other Type String
  *@param userData JSON
  *@param Timestamp Current Timestamp an 10bit Interger
  */
  function appAjax(des,
                   methodName,
                   requestType,
                   userData,
                   timestamp,
                   succeedCallback,
                   failedCallback
                   ) {
    var 
      path = configUrlMap['APIBase']
      data = jointPostData(methodName,timestamp,AES(userData,timestamp))
    $.ajax({
      url : path,
      method : requestType,
      dataType : 'json',
      data : data
    })
    .done(function(data) {
      ajaxLog(path,des,'successed')
      //var json = JSON.parse(JSON.stringify(eval( "(" + data +")")))
      //callBack(json)
      succeedCallback(data)
    })
    .fail(function(data) {
      failedCallback(data)
      ajaxLog(path,des,'failed')
    })
    .always(function(data) {
      //alwaysCallback(data)
      ajaxLog(path,des,'completed')
    });
  }

  /**
  *   
  */
  function getUserinfoData(){
    var u = {}
    u.userId = config.userId
    u.userType = config.userType
    u.version = appVersion()
    u.deviceMode = deviceInfo()
    return u
  }

  /**
  * @m API method name
  * @t timestamp using for AES
  * @p base64text representing the sensitive user info
  */
  function jointPostData(m,t,p) {
    return data = {"m" : m,"t" : t,"p" : p}
  }

  return {
    urls:configUrlMap,
    screenSize:calScreenWidth,
    appState:appState,
    methods:{
      produceSeperateWineHtml : produceSeperateWineHtml,
      getSearchArgFromUrl :     getSearchArgFromUrl,
      deviceInfo : deviceInfo,
      appVersion : appVersion,
      timestamp : timestamp,
      getBasicUserinfo : getUserinfoData,
      appAjax : appAjax,
      browser : browserInfo,
      pathInfo : pathInfo,
      setBgImage :setBgImage,
      storageAvailable,storageAvailable,
      localArr:localArr
    }
  }

  function setBgImage(str) {
    if (str.search('focus') != -1) {//点击的时候是选中状态
      str = str.replace('focus','blur')
    } else if (str.search('blur') != -1) { //点击的时候是未选中状态
      str = str.replace('blur','focus')
    }
    return str
  }
  
  function produceSeperateWineHtml(currentWine,wrap,wineIndex,moduleIndex,moduleLength,wineLength,moduleId) 
  {
    var itemHeight = 0
    //console.log("arguments.length = " + arguments.length)
    if (arguments.length==5) {
      currentWine = arguments[0],
      wrap = arguments[1],
      wineIndex = arguments[2],
      wineLength = arguments[3],
      moduleId = arguments[4];
    }
    var 
      screenWidth = app.screenSize()
      //imgWidth = liWidth = screenWidth * 0.425
      imgWidth = liWidth = parseInt(parseInt((screenWidth - 26) / 2))
      ratio = 0.6 //图片原始的高宽比:432 / 720 = 0.6
      imgHeight = Math.ceil(imgWidth * ratio)
      liBottomHeight = 70
      liHeight = imgHeight + liBottomHeight

    $li = $("<li></li>")
    $wineWrap = $("<div class='wine-wrap'></div>") //包住酒款
    $divUp = $("<div class='div-up'></div>") //酒款上部
    $divBottom = $("<div class='div-bottom'></div>") //酒款下部

    $awinePic = $("<a class='wine-detail' href='"
                    +pathInfo("detail.html?id=")
                    +currentWine['id']
                    +"'data-id='"
                    +currentWine['id']
                    +"'></a>")

    $spanMailInfo = $("<span class='mail-info'>"+currentWine['discount']+"</span>") //满200包邮 => 酒款上部
    $spanCntInfo = $("<span class='cnt-info'>"+currentWine['shortage']+"</span>") //仅剩6 => 酒款上部
    

    $img = $("<img class='wine-img' src='"+currentWine['pics'][0]['pic']+"'>") //酒款图片 => 酒款上部
    $img.css({
      width: imgWidth,
      height:imgHeight
    })

    $spanSubtitle = $("<span class='subtitle'>"+currentWine['subtitle']+"</span>") //副标题 => 酒款上部

    $divHeadline = $("<div>"+currentWine['title']+"</div>") //主描述 => 酒款下部
    $spanCurrentPrice = $("<span class='market'>"+'&yen;'+currentWine['market']+"</span>")//现价 => 酒款下部
    $spanOriginalPrice = $("<del>"+currentWine['price']+"</del>")//原价 or 其他标注 => 酒款下部
    $spanRecom = $("<span>"+currentWine['limit']+"</span>")//主描述 => 提示
    
    $awinePic.append($img)
    $divUp.append($awinePic)
    $divUp.append($spanMailInfo)
    $divUp.append($spanCntInfo)
    $divUp.append($spanSubtitle)


    $divBottom.append($divHeadline)
    $divBottom.append($spanCurrentPrice)
    $divBottom.append($spanOriginalPrice)
    $divBottom.append($spanRecom)

    // 设置 divUp 以及 divBottom 的高度
    $divUp.css('height', imgHeight)
    $divBottom.css('height', liBottomHeight)
    $awinePic.css('height', imgHeight)

    $wineWrap.append($divUp)
    $wineWrap.append($divBottom)
    $li.append($wineWrap)


    var 
      y = parseInt(wineIndex / 2) * liHeight
      base = 42
      liMargin = 15
      rightColumnStart = 8 + liWidth + 10
    if (wineIndex == 0) {
      $li.css({
        left: '8',
        top:y + base
      });
    } else if (wineIndex % 2 == 0 && wineIndex !== 0) {
      $li.css({
        left: '8',
        top:y + base + liMargin * parseInt(wineIndex / 2)
      });
    } else if (wineIndex % 2 == 1) {
      if (wineIndex == 1) {
        $li.css({
          left: rightColumnStart,
          top: y + base
        });
      } else{
        $li.css({
          left: rightColumnStart,
          top: y + base + liMargin * parseInt(wineIndex / 2)
        })
      }
      
    }

    $wineWrap.css('width', liWidth)
    
    $(wrap).append($li)
    itemHeight = Math.ceil(parseFloat($li.css('height')))

    if (arguments.length == 7){
      // if i === 最后一行 && j === 最后一行 添加 margin
      if (moduleIndex == moduleLength - 1 && 
          ((wineIndex == wineLength - 1) || (wineIndex == wineLength - 2))) {
          $li.addClass('last-wine-item')
        }
    } else if (arguments.length == 6) {
      console.log("arguments.length: "+arguments.length)
      if (wineIndex == wineLength-1 || wineIndex == wineLength - 2) {
        $li.addClass('last-wine-item')
      }
    }

    return itemHeight
  }
  // 432 / 720 = 0.6
  //下面是最后的});
})();