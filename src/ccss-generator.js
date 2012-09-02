/*
 * @category JS
 * @package Cross-browser CSS generator
 * @copyright 2012 Dmitry Sheiko (http://dsheiko.com)
 * @license MIT
 */
/*
 Other tricks:
_prop IE6, *prop IE7
Gradient http://css-tricks.com/forums/discussion/17514/cross-browser-gradient/p1
Min-height http://css-tricks.com/snippets/css/cross-browser-min-height/
Opacity: http://css-tricks.com/snippets/css/cross-browser-opacity/
border-radius (http://curved-corner.googlecode.com/files/border-radius.htc) http://cross-browser-tricks.blogspot.de/

 Vendor-prefixed CSS Property Map
 http://peter.sh/experiments/vendor-prefixed-css-property-overview/
 https://developer.mozilla.org/en-US/docs/CSS/CSS_Reference/Mozilla_Extensions
 http://peter.sh/experiments/vendor-prefixed-css-properties-trident/

 Vocabluary (W3C)
 A CSS rule consists of selector ('h1') and declaration ('color: red')
 The declaration has two parts: property name ('color') and property value ('red')
*/
// @TODO ? opacity snippet?
(function( window, undefined ){
    "use strict";
    var doc = window.document,
        Util = {
            trim: function( str ) {
                return str.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' );
            },
            cutMultiple: function( valStr ) {
                var re = /,(.*)$/g;
                return valStr.replace( re, "" );
            },
            getValueParams: function( valStr ) {
                var re = /\s+/g,
                    pStr = this.trim( valStr.replace( re, " " ) ),
                    re = /\s(px|em|cm|mm|in|pt|pc|%)/;
                return pStr.replace(re, "$1").split( " " );
            },
            isUnit: function ( val ) {
                var re = /(px|em|cm|mm|in|pt|pc|%)/,
                    n = this.trim( val.replace( re, "" ) );
                return !isNaN( parseFloat( n ) ) && isFinite( n );
            }
        },
        GeneratorException = function ( msg ) {
            this.name = "GeneratorException";
            this.message = msg || "GeneratorException";
        },
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
                nonStandardDeclarationMap = {
                    "border-bottom-left-radius" : [
                        function( val ) { return "   -moz-border-radius-bottomleft: "
                            + val + " /* FF 1.0 - 12.0 */ \n"; }
                    ],
                    "border-bottom-right-radius" : [
                        function( val ) { return "   -moz-border-radius-bottomright: "
                            + val + " /* FF 1.0 - 12.0 */ \n"; }
                    ],
                    "transition" : [
                        // @TODO treat multiple values (,)
                        function( val ) {
                            var out = '',
                                engine,
                                params = Util.getValueParams( val ),
                                transPropPrefs = params.length ? propPrefixMap[ params[ 0 ] ] : [];

                            for ( engine in pref ) {
                                if ( pref.hasOwnProperty( engine ) ) {
                                    var pClone = Object.create( params );
                                    if ( transPropPrefs.indexOf( pref[ engine ] ) !== -1 ) {
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
                                params = Util.getValueParams( Util.cutMultiple( val ) );

                            if ( params.length && !Util.isUnit( params[ 0 ] ) ) {
                                if ( params[ 0 ] === "INSET" ) {
                                    info.inset = "true";
                                }
                                params.shift();
                            }

                            if ( params.length && Util.isUnit( params[ 0 ] ) ) {
                                info.x = params[ 0 ];
                                params.shift();
                            }
                            if ( params.length && Util.isUnit( params[ 0 ] ) ) {
                                info.y = params[ 0 ];
                                params.shift();
                            }
                            if ( params.length && Util.isUnit( params[ 0 ] ) ) {
                                info.blur = params[ 0 ];
                                params.shift();
                            }
                            if ( params.length ) {
                                info.color = params[ 0 ];
                                params.shift();
                            }
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
                            + "       opacity: " + oVal + ";\n\n"
                            + "       filter: alpha(opacity=" + perVal + ");\n"
                            + "-ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(Opacity="
                                + perVal + ")\";";
                        }
                    ]
                },
                throwError = function( msg ) {
                    throw new GeneratorException( msg );
                };
                
                nonStandardDeclarationMap["transition-property"] =
                    nonStandardDeclarationMap.transition;

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
                getNonStandardDeclarations: function( prop, val ) {
                    var out = '',
                        i = 0,
                        handlers = nonStandardDeclarationMap[ prop ],
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
                    out += this.getNonStandardDeclarations( declaration.propName, declaration.propValue );
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
                        try {
                            that.setOutput( generator.generateFor( that.getInput() ) );
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

    doc.querySelector( "body" ).onload = function() {
        var form = new FormHandler();
        form.init();
    }

}( window ));