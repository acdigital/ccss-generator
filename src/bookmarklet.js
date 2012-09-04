/*
 * @category JS
 * @package Cross-browser CSS generator
 * @copyright 2012 Dmitry Sheiko (http://dsheiko.com)
 * @license MIT
 */

(function( window ){
var document = window.document,
    tpl = '<div id="pcb-boundingBox" class="pcb-modal">\
<style>\
#pcb-boundingBox {\
    position: absolute;\
    top: 0;\
    left: 0;\
    right: 0;\
    bottom: 0;\
    font-family: Tahoma;\
    font-size: 14px;\
    z-index: 99999;\
}\
#pcb-boundingBox a, #pcb-boundingBox a:visited { color: white; }\
#pcb-boundingBox p { margin: 0; }\
#pcb-boundingBox .screen-lock {\
    position: fixed;\
    top: 0;\
    left: 0;\
    right: 0;\
    bottom: 0;\
    background-color: #262626;\
    opacity: 0.95;\
    -moz-opacity:0.95;\
    -khtml-opacity: 0.95;\
    -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=95)";\
    filter: alpha(opacity=95);\
}\
#pcb-boundingBox .form {\
    position: absolute;\
    top: 90px;\
    left: 50%;\
    margin-left: -300px;\
    width: 600px;\
    background-color: #00a4e4;\
    color: #fff;\
    border-radius: 5px;\
}\
#pcb-boundingBox .form > form {\
    position: relative;\
    color: #fff;\
    padding: 32px 48px;\
}\
#pcb-boundingBox fieldset {\
    margin: 0 0 10px 0;\
    padding: 0;\
    border: 0;\
}\
#pcb-boundingBox .form button.close {\
    position: absolute;\
    width: 24px;\
    height: 24px;\
    top: -12px;\
    right: -12px;\
    display: block;\
    border: 0;\
    font-weight: bold;\
    border-radius: 50% 50%;\
	cursor: pointer;\
}\
#pcb-boundingBox .form h2 {\
    font-size: 2.5em;\
    padding: 0;\
    font-weight: normal;\
    background-color: #00a4e4;\
    margin: 0 0 20px 0;\
}\
#pcb-boundingBox input {\
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\
  -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\
}\
#pcb-boundingBox .btn {\
  display: inline-block;\
  padding: 4px 10px 4px;\
  margin-bottom: 0;\
  font-size: 13px;\
  line-height: 18px;\
  color: #333333;\
  text-align: center;\
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);\
  vertical-align: middle;\
  background-color: #f5f5f5;\
  background-image: -moz-linear-gradient(top, #ffffff, #e6e6e6);\
  background-image: -ms-linear-gradient(top, #ffffff, #e6e6e6);\
  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#e6e6e6));\
  background-image: -webkit-linear-gradient(top, #ffffff, #e6e6e6);\
  background-image: -o-linear-gradient(top, #ffffff, #e6e6e6);\
  background-image: linear-gradient(top, #ffffff, #e6e6e6);\
  background-repeat: repeat-x;\
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ffffff\', endColorstr=\'#e6e6e6\', GradientType=0);\
  border-color: #e6e6e6 #e6e6e6 #bfbfbf;\
  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\
  filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);\
  border: 1px solid #ccc;\
  border-bottom-color: #bbb;\
  -webkit-border-radius: 4px;\
  -moz-border-radius: 4px;\
  border-radius: 4px;\
  -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);\
  -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);\
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);\
  cursor: pointer;\
  filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);\
  *margin-left: .3em;\
}\
#pcb-boundingBox .btn:hover,\
#pcb-boundingBox .btn:active{\
  background-color: #e6e6e6;\
}\
#pcb-boundingBox label {\
  display: block;\
  margin-bottom: 5px;\
  color: #fff;\
}\
#pcb-boundingBox input,\
#pcb-boundingBox textarea {\
  display: inline-block;\
  width: 440px !important;\
  padding: 4px;\
  margin-bottom: 9px;\
  font-size: 13px;\
  line-height: 18px;\
  color: #555555;\
  border: 1px solid #ccc;\
  -webkit-border-radius: 3px;\
  -moz-border-radius: 3px;\
  border-radius: 3px;\
}\
#pcb-boundingBox textarea {\
    height: 200px;\
}\
#pcb-boundingBox input.onerror {\
    color: #DF382C;\
    border-color: #DF382C;\
    -webkit-box-shadow: 0 0 5px 2px rgba(223, 56, 44, 0.6);\
    -moz-box-shadow: 0 0 5px 2px rgba(223, 56, 44, 0.6);\
    box-shadow: 0 0 5px 2px rgba(223, 56, 44, 0.6);\
}\
#pcb-boundingBox .errorMsg {\
    color: #DF382C;\
}\
#pcb-boundingBox .btn:hover {\
  color: #333333;\
  text-decoration: none;\
  background-color: #e6e6e6;\
  background-position: 0 -15px;\
  -webkit-transition: background-position 0.1s linear;\
  -moz-transition: background-position 0.1s linear;\
  -ms-transition: background-position 0.1s linear;\
  -o-transition: background-position 0.1s linear;\
  transition: background-position 0.1s linear;\
}\
#pcb-boundingBox .btn:focus {\
  outline: thin dotted #333;\
  outline: 5px auto -webkit-focus-ring-color;\
  outline-offset: -2px;\
}\
</style>\
    <div class="screen-lock"></div>\
    <div class="form">\
        <form id="pcb-form">\
            <h2>Cross-browser CSS generator</h2>\
            <fieldset>\
                <label>W3C declaration (e.g. opacity: 0.5;)</label>\
                <input name="instruction">\
                <button type="submit" class="btn">GO</button>\
                <div class="errorMsg"></div>\
            </fieldset>\
            <label>Cross-browser CSS</label>\
            <textarea name="output"></textarea>\
            <p><var>ccss-generator.js</var> is created by <a href="http://dsheiko.com">Dmitry Sheiko</a>.\
                It\'s released under the MIT license. </p>\
            <p>If you have any questions or feedback you can use the <a href="https://github.com/dsheiko/ccss-generator">github project page.</a></p>\
        </form>\
        <button class="close">X</button>\
    </div>\
</div>',
    btn,
    m = document.createElement( "div" ),
    s = document.createElement( "script" );
    m.id = "pcb-boundingBox";
    m.innerHTML = tpl;
    document.body.appendChild( m );
    btn = document.querySelector( "#pcb-boundingBox button.close" );
    btn.onclick = function( e ) {
            e.preventDefault();
            document.body.removeChild( m );
    }
    s.type = 'text/javascript';
    s.src = 'http://demo.dsheiko.com/ccss/src/ccss-generator.js';
    window.ccssGenerator || document.body.appendChild( s );
}( window ));