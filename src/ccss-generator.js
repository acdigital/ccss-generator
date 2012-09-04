/*
 * @category JS
 * @package Cross-browser CSS generator
 * @copyright 2012 Dmitry Sheiko (http://dsheiko.com)
 * @license MIT
 */
/*
 Vocabluary (W3C)
 A CSS rule consists of selector ('h1') and declaration ('color: red')
 The declaration has two parts: property name ('color') and property value ('red')
*/
(function( window, undefined ){
    "use strict";
    var doc = window.document,
        Util = {
            trim: function( str ) {
                return str.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' );
            }
        },
        GeneratorException = function ( msg ) {
            this.name = "GeneratorException";
            this.message = msg || "GeneratorException";
        },
        ValueParser = (function(){
            return {
                getColors: function( val ) {
                    var match,
                        matches = [],
                        re = /(#([0-9A-Fa-f]{3,6})\b)|(AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGray|DarkGrey|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|Darkorange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGray|DarkSlateGrey|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGray|DimGrey|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gray|Grey|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGray|LightGrey|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGray|LightSlateGrey|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGray|SlateGrey|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)|(rgba?\([\s,\d%]+\))/g;
                    while ( match = re.exec( val ) ) {
                        matches.push( match.shift() );
                    }
                    return matches;
                },
                getUnits: function( val ) {
                    var match,
                        matches = [],
                        re = /(\d+\s*(px|em|cm|mm|in|pt|pc|%))/g;
                    while ( match = re.exec( val ) ) {
                        matches.push( match.shift().replace( /\s+/, '' ) );
                    }
                    return matches;
                },
                getSideOrCorner: function( val ) {
                     var re = /to\s+(left|right|top|bottom)/i,
                         match = re.exec( val );
                     return match.length > 1 ? match[1] : false;
                },
                hasLinearGradient: function( val ) {
                    var re = /linear-gradient/i;
                     return re.test( val );

                },
                getValueParams: function( valStr ) {
                    var re = /\s+/g;
                    return Util.trim( valStr.replace( re, " " ) ).split( " " );
                }
            }
        }()),
        Generator = function(){
            var
                pref = { w: "-webkit-", g: "   -moz-", t: "    -ms-", p: "     -o-", n: "        " },
                propPrefixMap = {
                    "animation": [ pref.w, pref.g, pref.t, pref.n ],
                    "animation-delay": [ pref.w, pref.g, pref.t, pref.n ],
                    "animation-direction": [ pref.w, pref.g, pref.t, pref.n ],
                    "animation-duration": [ pref.w, pref.g, pref.t, pref.n ],
                    "animation-fill-mode": [ pref.w, pref.g, pref.t, pref.n ],
                    "animation-iteration-count": [ pref.w, pref.g, pref.t, pref.n ],
                    "animation-name": [ pref.w, pref.g, pref.t, pref.n ],
                    "animation-play-state": [ pref.w, pref.g, pref.t, pref.n ],
                    "animation-timing-function": [ pref.w, pref.g, pref.t, pref.n ],
                    "appearance" : [ pref.w, pref.g, pref.t, pref.n ],
                    "backface-visibility" : [ pref.w, pref.g, pref.t, pref.n ],
                    "background-clip" : [ pref.w, pref.g, pref.t, pref.p, pref.n ],
                    "background-origin" : [ pref.w, pref.g, pref.t, pref.p, pref.n ],
                    "background-position-x" : [ pref.w, pref.t, pref.p, pref.n ],
                    "background-position-y" : [ pref.w, pref.t, pref.p, pref.n ],
                    "background-size" : [ pref.w, pref.g, pref.t, pref.p, pref.n ],
                    "border-after" : [ pref.w, pref.n ],
                    "border-after-color" : [ pref.w, pref.n ],
                    "border-after-style" : [ pref.w, pref.n ],
                    "border-after-width" : [ pref.w, pref.n ],
                    "border-before-color" : [ pref.w, pref.n ],
                    "border-before-style" : [ pref.w, pref.n ],
                    "border-before-width" : [ pref.w, pref.n ],
                    "border-bottom-left-radius" : [ pref.w, pref.n ],
                    "border-bottom-right-radius" : [ pref.w, pref.n ],
                    "border-end" : [ pref.w, pref.g, pref.n ],
                    "border-end-color" : [ pref.w, pref.g, pref.n ],
                    "border-end-style" : [ pref.w, pref.g, pref.n ],
                    "border-end-width" : [ pref.w, pref.g, pref.n ],
                    "border-image" : [ pref.w, pref.g, pref.n ],
                    "border-left-colors" : [ pref.g ],
                    "border-right-colors" : [ pref.g ],
                    "border-bottom-colors" : [ pref.g ],
                    "border-top-colors" : [ pref.g ],
                    "border-radius" : [ pref.w, pref.g, pref.t, pref.p, pref.n ],
                    "border-start" : [ pref.w, pref.g, pref.n ],
                    "border-start-color" : [ pref.w, pref.g, pref.n ],
                    "border-start-style" : [ pref.w, pref.g, pref.n ],
                    "border-start-width" : [ pref.w, pref.g, pref.n ],
                    "border-top-left-radius" : [ pref.w, pref.g, pref.t, pref.p, pref.n ],
                    "border-top-right-radius" : [ pref.w, pref.g, pref.t, pref.p, pref.n ],
                    "box-align" : [ pref.w, pref.g, pref.t, pref.n ],
                    "box-decoration-break" : [ pref.w, pref.p, pref.n ],
                    "box-direction" : [ pref.w, pref.g, pref.t, pref.n ],
                    "box-flex" : [ pref.w, pref.g, pref.t, pref.n ],
                    "box-flex-group" : [ pref.w, pref.n ],
                    "box-lines" : [ pref.w, pref.t, pref.n ],
                    "box-ordinal-group" : [ pref.w, pref.t, pref.p, pref.n ],
                    "box-orient" : [ pref.w, pref.g, pref.t, pref.n ],
                    "box-pack" : [ pref.w, pref.g, pref.t, pref.n ],
                    "box-shadow" : [ pref.w, pref.g, pref.n ],
                    "box-sizing" : [ pref.w, pref.g, pref.p, pref.n ],
                    "column-count" : [ pref.w, pref.g, pref.n ],
                    "column-fill" : [ pref.g, pref.t, pref.p, pref.n ],
                    "column-gap" : [ pref.w, pref.g, pref.n ],
                    "column-rule" : [ pref.w, pref.g, pref.n ],
                    "column-rule-color" : [ pref.w, pref.g, pref.n ],
                    "column-rule-style" : [ pref.w, pref.g, pref.n ],
                    "column-rule-width" : [ pref.w, pref.g, pref.n ],
                    "column-span" : [ pref.w, pref.n ],
                    "column-width" : [ pref.w, pref.g, pref.n ],
                    "columns" : [ pref.w, pref.g, pref.n ],
                    "grid-column" : [ pref.t, pref.n ],
                    "grid-column-align" : [ pref.t, pref.n ],
                    "grid-column-span" : [ pref.t, pref.n ],
                    "grid-columns" : [ pref.w, pref.t, pref.n ],
                    "grid-layer" : [ pref.t, pref.n ],
                    "grid-row" : [ pref.t, pref.n ],
                    "grid-row-align" : [ pref.t, pref.n ],
                    "grid-row-span" : [ pref.t, pref.n ],
                    "grid-rows" : [ pref.w, pref.t, pref.n ],
                    "hyphens" : [ pref.w, pref.g, pref.t, pref.n ],
                    "locale" : [ pref.w, pref.n ],
                    "logical-height" : [ pref.w, pref.n ],
                    "logical-width" : [ pref.w, pref.n ],
                    "margin-after" : [ pref.w, pref.n ],
                    "margin-after-collapse" : [ pref.w, pref.n ],
                    "margin-end" : [ pref.w, pref.g, pref.n ],
                    "margin-start" : [ pref.w, pref.g, pref.n ],
                    "marquee-direction" : [ pref.w, pref.n ],
                    "marquee-speed" : [ pref.w, pref.n ],
                    "marquee-style" : [ pref.w, pref.n ],
                    "object-fit" : [ pref.p, pref.n ],
                    "object-position" : [ pref.p, pref.n ],
                    "overflow-style" : [ pref.t, pref.n ],
                    "overflow-x" : [ pref.t, pref.n ],
                    "overflow-y" : [ pref.t, pref.n ],
                    "padding-after" : [ pref.w, pref.n ],
                    "padding-before" : [ pref.w, pref.n ],
                    "padding-end" : [ pref.w, pref.g, pref.n ],
                    "padding-start" : [ pref.w, pref.g, pref.n ],
                    "perspective" : [ pref.w, pref.g, pref.t, pref.n ],
                    "perspective-origin" : [ pref.w, pref.g, pref.t, pref.n ],
                    "text-align-last" : [ pref.g, pref.t, pref.n ],
                    "text-autospace" : [ pref.t, pref.n ],
                    "text-justify" : [ pref.t, pref.n ],
                    "text-overflow" : [ pref.p, pref.n ],
                    "transform" : [ pref.w, pref.g, pref.t, pref.p, pref.n ],
                    "transform-origin" : [ pref.w, pref.g, pref.t, pref.p, pref.n ],
                    "transform-style" : [ pref.w, pref.g, pref.t, pref.p, pref.n ],
                    "transition-delay" : [ pref.w, pref.g, pref.t, pref.p, pref.n ],
                    "transition-duration" : [ pref.w, pref.g, pref.t, pref.p, pref.n ],
                    "transition-timing-function" : [ pref.w, pref.g, pref.t, pref.p, pref.n ],
                    "word-break" : [ pref.w, pref.g, pref.t, pref.n ],
                    "word-wrap" : [ pref.w, pref.g, pref.t, pref.p, pref.n ],
                    "writing-mode" : [ pref.w, pref.t, pref.p, pref.n ]
                },
                tricksMap = {
                    "border-bottom-left-radius" : [
                        function( val ) { return "   -moz-border-radius-bottomleft: "
                            + val + " /* FF 1.0 - 12.0 */ \n"; }
                    ],
                    "border-bottom-right-radius" : [
                        function( val ) { return "   -moz-border-radius-bottomright: "
                            + val + " /* FF 1.0 - 12.0 */ \n"; }
                    ],
                    "border-radius" : [
                        function( val ) {
                            return "/* behavior: url(./border-radius.htc); For IE, download and customize htc file http://curved-corner.googlecode.com/files/border-radius.htc */";
                        }
                    ],
                    "min-height" : [
                        function( val ) {
                            return "height: auto !important; /* @see: http://css-tricks.com/snippets/css/cross-browser-min-height/ */\n"
                            + "height: " + val + ";\n"
                            + "min-height: " + val + ";\n";
                        }
                    ],
                    "background-image" : [
                        function( val ) {
                            var inverted = {
                                    "bottom" : "top",
                                    "top" : "bottom",
                                    "left" : "right",
                                    "right" : "left"
                                },
                                colors,
                                startColor,
                                endColor,
                                sideOrCorner;

                                if ( !ValueParser.hasLinearGradient( val ) ) {
                                    return '';
                                }
                                colors = ValueParser.getColors( val );
                                startColor = colors[ 0 ] || "black";
                                endColor = colors[ 1 ] || "black";
                                sideOrCorner = ValueParser.getSideOrCorner( val );

                                return "background-color: " + startColor + ";\n" +
                                        "background-image: -webkit-gradient(linear, left "
                                            + inverted[ sideOrCorner ] + ", left "
                                            + sideOrCorner + ", from(" + startColor + "), to(" + endColor + ")); /* Saf4+, Chrome */\n" +
                                        "background-image: -webkit-linear-gradient("
                                            + inverted[ sideOrCorner ] + ", "
                                            + startColor + ", "
                                            + endColor + "); /* Chrome 10+, Saf5.1+, iOS 5+ */\n" +
                                        "background-image:    -moz-linear-gradient("
                                            + inverted[ sideOrCorner ] + ", "
                                            + startColor + ", "
                                            + endColor + "); /* FF3.6+ */\n" +
                                        "background-image:     -ms-linear-gradient("
                                            + inverted[ sideOrCorner ] + ", "
                                            + startColor + ", " + endColor + "); /* IE10 */\n" +
                                        "background-image:      -o-linear-gradient("
                                            + inverted[ sideOrCorner ] + ", "
                                            + startColor + ", "
                                            + endColor + "); /* Opera 11.10+ */\n" +
                                        "background-image:    " + val + ";\n" +
                                        "filter:  progid:DXImageTransform.Microsoft.gradient("
                                            + "GradientType=0,startColorstr='"
                                            + startColor + "', endColorstr='"
                                            + endColor + "'); /* IE6 & IE7 */\n"
                                        "-ms-filter: \"progid:DXImageTransform.Microsoft.gradient("
                                            + "GradientType=0,startColorstr='"
                                            + startColor + "', endColorstr='"
                                            + endColor + "')\"; /* IE8 */\n";

                        }
                    ],
                    "transition" : [
                        // @TODO treat multiple values (,)
                        function( val ) {
                            var out = '',
                                engine,
                                params = ValueParser.getValueParams( val ),
                                transPropPrefs = params.length ? propPrefixMap[ params[ 0 ] ] : [];

                            for ( engine in pref ) {
                                if ( pref.hasOwnProperty( engine ) ) {
                                    var pClone = Object.create( params );
                                    if ( transPropPrefs && transPropPrefs.indexOf( pref[ engine ] ) !== -1 ) {
                                        pClone[ 0 ] = Util.trim( pref[ engine ] ) + pClone[ 0 ];
                                    }
                                    out += pref[ engine ] + "transition: " + pClone.join(" ")+ "\n";
                                }
                            }
                            return out;
                        }
                    ],
                    "box-shadow" : [
                        function( val ) {
                            var info = { "inset": "false", "x": 0, "y": 0, "blur": 0, "color": "black" },
                                re = /inset/i,
                                units = ValueParser.getUnits( val ),
                                colors = ValueParser.getColors( val );


                            info.x = units[0] || "0";
                            info.y = units[1] || "0";
                            info.blur = units[2] || "0";
                            info.color = colors[0] || "black";
                            re.test( val ) && ( info.inset = "true" );

                            return "\nfilter:progid:DXImageTransform.Microsoft.dropshadow"
                            + "(\n    OffX=" + info.x + ", OffY=" + info.y + ", Color='"
                            + info.color + "', Positive='" + info.inset + "'\n); /* IE 5.5 */ \n"
                            + "border-collapse: separate; /* Required by IE 9 */";
                        }
                    ],
                    "opacity" : [
                        function( val ) {
                            var oVal =  Util.trim( val ),
                                perVal = oVal * 100;
                            return "-khtml-opacity: " + oVal + ";\n"
                            + "  -moz-opacity: " + oVal + ";\n"
                            + "       opacity: " + oVal + ";\n"
                            + "       filter: alpha(opacity=" + perVal + ");\n"
                            + "   -ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(Opacity="
                                + perVal + ")\";";
                        }
                    ]
                },
                throwError = function( msg ) {
                    throw new GeneratorException( msg );
                };

                tricksMap["transition-property"] =
                    tricksMap.transition;

            return {
                validate: function( declaration ) {
                    declaration.declaration.indexOf( ":" ) < 2 &&
                        throwError( "Incorrect syntax. Colon missing." );
                    declaration.declaration.substr( -1, 1 ) !== ";" &&
                        throwError( "Incorrect syntax. Semicolon at the end missing." );
                },
                parseDeclaration: function( inputStr ) {
                    var parts = inputStr.split( ":" ),
                        re = /;$/;
                        parts.length !== 2 && throwError( "Incorrect syntax." );
                    return {
                        declaration: inputStr,
                        propName: parts[ 0 ].toLowerCase(),
                        propValue: parts[ 1 ].replace(re, "").toLowerCase()
                    }
                },
                getPrefixedDeclarations: function( prop, val ) {
                    var out = '',
                        i = 0,
                        prefs = propPrefixMap[ prop ],
                        len = prefs ? prefs.length : 0;

                    for ( ; i < len; i++ ) {
                        out += prefs[ i ] + prop + ":" + val + ";\n";
                    }
                    return out;
                },
                getTricks: function( prop, val ) {
                    var out = '',
                        i = 0,
                        handlers = tricksMap[ prop ],
                        len = handlers ? handlers.length : 0;

                    for ( ; i < len; i++ ) {
                        out += handlers[ i ]( val );
                    }
                    return out;
                },
                generateFor: function( inputStr ) {
                    var out = '',
                        declaration = this.parseDeclaration( inputStr );

                    this.validate( declaration );
                    out += this.getPrefixedDeclarations( declaration.propName, declaration.propValue );
                    out += this.getTricks( declaration.propName, declaration.propValue );
                    return out;
                }
            }
        },
        FormHandler = function() {
            var form = doc.querySelector( "#pcb-form" ),
                input = doc.querySelector( "#pcb-form input[name=instruction]" ),
                output = doc.querySelector( "#pcb-form textarea[name=output]" ),
                errorOut = doc.querySelector( "#pcb-form .errorMsg" ),
                generator = new Generator();

            return {
                init: function() {
                    var that = this;
                    form.onsubmit = function( e ) {
                        e.preventDefault();
                        that.reset();
                        try {
                            that.setOutput(  generator.generateFor( that.getInput() )
                                || input.value );
                        }
                        catch( e if e instanceof GeneratorException) {
                            that.setOnError( e.message );
                        }
                    }
                },
                reset: function() {
                    input.removeAttribute( "class" );
                    errorOut.innerHTML = "";
                },
                setOnError: function( msg ) {
                    input.setAttribute( "class", "onerror" );
                    errorOut.innerHTML = msg;
                },
                setOutput: function( out ) {
                    output.value =  out;
                },
                getInput: function() {
                    return Util.trim( input.value );
                }
            }

        };

    GeneratorException.prototype = new Error();
    GeneratorException.prototype.constructor = GeneratorException;

    var form = new FormHandler();
    form.init();

}( window ));