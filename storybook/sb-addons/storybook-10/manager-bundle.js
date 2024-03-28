try{
(()=>{var ot=__STORYBOOK_ADDONS__,{addons:q,types:at,mockChannel:nt}=__STORYBOOK_ADDONS__;var W=(()=>{let e;return typeof window<"u"?e=window:typeof globalThis<"u"?e=globalThis:typeof window<"u"?e=window:typeof self<"u"?e=self:e={},e})();var bt=__STORYBOOK_CLIENT_LOGGER__,{deprecate:gt,logger:Z,once:mt,pretty:ht}=__STORYBOOK_CLIENT_LOGGER__;function y(){return y=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e},y.apply(this,arguments)}function pe(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function v(e,t){return v=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(r,o){return r.__proto__=o,r},v(e,t)}function de(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,v(e,t)}function H(e){return H=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},H(e)}function fe(e){return Function.toString.call(e).indexOf("[native code]")!==-1}function ce(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function S(e,t,r){return ce()?S=Reflect.construct.bind():S=function(o,a,n){var s=[null];s.push.apply(s,a);var l=Function.bind.apply(o,s),p=new l;return n&&v(p,n.prototype),p},S.apply(null,arguments)}function L(e){var t=typeof Map=="function"?new Map:void 0;return L=function(r){if(r===null||!fe(r))return r;if(typeof r!="function")throw new TypeError("Super expression must either be null or a function");if(typeof t<"u"){if(t.has(r))return t.get(r);t.set(r,o)}function o(){return S(r,arguments,H(this).constructor)}return o.prototype=Object.create(r.prototype,{constructor:{value:o,enumerable:!1,writable:!0,configurable:!0}}),v(o,r)},L(e)}var ue={1:`Passed invalid arguments to hsl, please pass multiple numbers e.g. hsl(360, 0.75, 0.4) or an object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75 }).

`,2:`Passed invalid arguments to hsla, please pass multiple numbers e.g. hsla(360, 0.75, 0.4, 0.7) or an object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75, alpha: 0.7 }).

`,3:`Passed an incorrect argument to a color function, please pass a string representation of a color.

`,4:`Couldn't generate valid rgb string from %s, it returned %s.

`,5:`Couldn't parse the color string. Please provide the color as a string in hex, rgb, rgba, hsl or hsla notation.

`,6:`Passed invalid arguments to rgb, please pass multiple numbers e.g. rgb(255, 205, 100) or an object e.g. rgb({ red: 255, green: 205, blue: 100 }).

`,7:`Passed invalid arguments to rgba, please pass multiple numbers e.g. rgb(255, 205, 100, 0.75) or an object e.g. rgb({ red: 255, green: 205, blue: 100, alpha: 0.75 }).

`,8:`Passed invalid argument to toColorString, please pass a RgbColor, RgbaColor, HslColor or HslaColor object.

`,9:`Please provide a number of steps to the modularScale helper.

`,10:`Please pass a number or one of the predefined scales to the modularScale helper as the ratio.

`,11:`Invalid value passed as base to modularScale, expected number or em string but got "%s"

`,12:`Expected a string ending in "px" or a number passed as the first argument to %s(), got "%s" instead.

`,13:`Expected a string ending in "px" or a number passed as the second argument to %s(), got "%s" instead.

`,14:`Passed invalid pixel value ("%s") to %s(), please pass a value like "12px" or 12.

`,15:`Passed invalid base value ("%s") to %s(), please pass a value like "12px" or 12.

`,16:`You must provide a template to this method.

`,17:`You passed an unsupported selector state to this method.

`,18:`minScreen and maxScreen must be provided as stringified numbers with the same units.

`,19:`fromSize and toSize must be provided as stringified numbers with the same units.

`,20:`expects either an array of objects or a single object with the properties prop, fromSize, and toSize.

`,21:"expects the objects in the first argument array to have the properties `prop`, `fromSize`, and `toSize`.\n\n",22:"expects the first argument object to have the properties `prop`, `fromSize`, and `toSize`.\n\n",23:`fontFace expects a name of a font-family.

`,24:`fontFace expects either the path to the font file(s) or a name of a local copy.

`,25:`fontFace expects localFonts to be an array.

`,26:`fontFace expects fileFormats to be an array.

`,27:`radialGradient requries at least 2 color-stops to properly render.

`,28:`Please supply a filename to retinaImage() as the first argument.

`,29:`Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.

`,30:"Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n",31:`The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation

`,32:`To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])
To pass a single animation please supply them in simple values, e.g. animation('rotate', '2s')

`,33:`The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation

`,34:`borderRadius expects a radius value as a string or number as the second argument.

`,35:`borderRadius expects one of "top", "bottom", "left" or "right" as the first argument.

`,36:`Property must be a string value.

`,37:`Syntax Error at %s.

`,38:`Formula contains a function that needs parentheses at %s.

`,39:`Formula is missing closing parenthesis at %s.

`,40:`Formula has too many closing parentheses at %s.

`,41:`All values in a formula must have the same unit or be unitless.

`,42:`Please provide a number of steps to the modularScale helper.

`,43:`Please pass a number or one of the predefined scales to the modularScale helper as the ratio.

`,44:`Invalid value passed as base to modularScale, expected number or em/rem string but got %s.

`,45:`Passed invalid argument to hslToColorString, please pass a HslColor or HslaColor object.

`,46:`Passed invalid argument to rgbToColorString, please pass a RgbColor or RgbaColor object.

`,47:`minScreen and maxScreen must be provided as stringified numbers with the same units.

`,48:`fromSize and toSize must be provided as stringified numbers with the same units.

`,49:`Expects either an array of objects or a single object with the properties prop, fromSize, and toSize.

`,50:`Expects the objects in the first argument array to have the properties prop, fromSize, and toSize.

`,51:`Expects the first argument object to have the properties prop, fromSize, and toSize.

`,52:`fontFace expects either the path to the font file(s) or a name of a local copy.

`,53:`fontFace expects localFonts to be an array.

`,54:`fontFace expects fileFormats to be an array.

`,55:`fontFace expects a name of a font-family.

`,56:`linearGradient requries at least 2 color-stops to properly render.

`,57:`radialGradient requries at least 2 color-stops to properly render.

`,58:`Please supply a filename to retinaImage() as the first argument.

`,59:`Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.

`,60:"Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n",61:`Property must be a string value.

`,62:`borderRadius expects a radius value as a string or number as the second argument.

`,63:`borderRadius expects one of "top", "bottom", "left" or "right" as the first argument.

`,64:`The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation.

`,65:`To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])\\nTo pass a single animation please supply them in simple values, e.g. animation('rotate', '2s').

`,66:`The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation.

`,67:`You must provide a template to this method.

`,68:`You passed an unsupported selector state to this method.

`,69:`Expected a string ending in "px" or a number passed as the first argument to %s(), got %s instead.

`,70:`Expected a string ending in "px" or a number passed as the second argument to %s(), got %s instead.

`,71:`Passed invalid pixel value %s to %s(), please pass a value like "12px" or 12.

`,72:`Passed invalid base value %s to %s(), please pass a value like "12px" or 12.

`,73:`Please provide a valid CSS variable.

`,74:`CSS variable not found and no default was provided.

`,75:`important requires a valid style object, got a %s instead.

`,76:`fromSize and toSize must be provided as stringified numbers with the same units as minScreen and maxScreen.

`,77:`remToPx expects a value in "rem" but you provided it in "%s".

`,78:`base must be set in "px" or "%" but you set it in "%s".
`};function be(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var o=t[0],a=[],n;for(n=1;n<t.length;n+=1)a.push(t[n]);return a.forEach(function(s){o=o.replace(/%[a-z]/,s)}),o}var f=function(e){de(t,e);function t(r){for(var o,a=arguments.length,n=new Array(a>1?a-1:0),s=1;s<a;s++)n[s-1]=arguments[s];return o=e.call(this,be.apply(void 0,[ue[r]].concat(n)))||this,pe(o)}return t}(L(Error));function j(e){return Math.round(e*255)}function ge(e,t,r){return j(e)+","+j(t)+","+j(r)}function F(e,t,r,o){if(o===void 0&&(o=ge),t===0)return o(r,r,r);var a=(e%360+360)%360/60,n=(1-Math.abs(2*r-1))*t,s=n*(1-Math.abs(a%2-1)),l=0,p=0,d=0;a>=0&&a<1?(l=n,p=s):a>=1&&a<2?(l=s,p=n):a>=2&&a<3?(p=n,d=s):a>=3&&a<4?(p=s,d=n):a>=4&&a<5?(l=s,d=n):a>=5&&a<6&&(l=n,d=s);var h=r-n/2,x=l+h,c=p+h,_=d+h;return o(x,c,_)}var U={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"639",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"};function me(e){if(typeof e!="string")return e;var t=e.toLowerCase();return U[t]?"#"+U[t]:e}var he=/^#[a-fA-F0-9]{6}$/,xe=/^#[a-fA-F0-9]{8}$/,ye=/^#[a-fA-F0-9]{3}$/,ve=/^#[a-fA-F0-9]{4}$/,M=/^rgb\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*\)$/i,Fe=/^rgb(?:a)?\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i,we=/^hsl\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*\)$/i,Be=/^hsl(?:a)?\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i;function O(e){if(typeof e!="string")throw new f(3);var t=me(e);if(t.match(he))return{red:parseInt(""+t[1]+t[2],16),green:parseInt(""+t[3]+t[4],16),blue:parseInt(""+t[5]+t[6],16)};if(t.match(xe)){var r=parseFloat((parseInt(""+t[7]+t[8],16)/255).toFixed(2));return{red:parseInt(""+t[1]+t[2],16),green:parseInt(""+t[3]+t[4],16),blue:parseInt(""+t[5]+t[6],16),alpha:r}}if(t.match(ye))return{red:parseInt(""+t[1]+t[1],16),green:parseInt(""+t[2]+t[2],16),blue:parseInt(""+t[3]+t[3],16)};if(t.match(ve)){var o=parseFloat((parseInt(""+t[4]+t[4],16)/255).toFixed(2));return{red:parseInt(""+t[1]+t[1],16),green:parseInt(""+t[2]+t[2],16),blue:parseInt(""+t[3]+t[3],16),alpha:o}}var a=M.exec(t);if(a)return{red:parseInt(""+a[1],10),green:parseInt(""+a[2],10),blue:parseInt(""+a[3],10)};var n=Fe.exec(t.substring(0,50));if(n)return{red:parseInt(""+n[1],10),green:parseInt(""+n[2],10),blue:parseInt(""+n[3],10),alpha:parseFloat(""+n[4])>1?parseFloat(""+n[4])/100:parseFloat(""+n[4])};var s=we.exec(t);if(s){var l=parseInt(""+s[1],10),p=parseInt(""+s[2],10)/100,d=parseInt(""+s[3],10)/100,h="rgb("+F(l,p,d)+")",x=M.exec(h);if(!x)throw new f(4,t,h);return{red:parseInt(""+x[1],10),green:parseInt(""+x[2],10),blue:parseInt(""+x[3],10)}}var c=Be.exec(t.substring(0,50));if(c){var _=parseInt(""+c[1],10),ie=parseInt(""+c[2],10)/100,le=parseInt(""+c[3],10)/100,N="rgb("+F(_,ie,le)+")",B=M.exec(N);if(!B)throw new f(4,t,N);return{red:parseInt(""+B[1],10),green:parseInt(""+B[2],10),blue:parseInt(""+B[3],10),alpha:parseFloat(""+c[4])>1?parseFloat(""+c[4])/100:parseFloat(""+c[4])}}throw new f(5)}function Se(e){var t=e.red/255,r=e.green/255,o=e.blue/255,a=Math.max(t,r,o),n=Math.min(t,r,o),s=(a+n)/2;if(a===n)return e.alpha!==void 0?{hue:0,saturation:0,lightness:s,alpha:e.alpha}:{hue:0,saturation:0,lightness:s};var l,p=a-n,d=s>.5?p/(2-a-n):p/(a+n);switch(a){case t:l=(r-o)/p+(r<o?6:0);break;case r:l=(o-t)/p+2;break;default:l=(t-r)/p+4;break}return l*=60,e.alpha!==void 0?{hue:l,saturation:d,lightness:s,alpha:e.alpha}:{hue:l,saturation:d,lightness:s}}function J(e){return Se(O(e))}var Ce=function(e){return e.length===7&&e[1]===e[2]&&e[3]===e[4]&&e[5]===e[6]?"#"+e[1]+e[3]+e[5]:e},A=Ce;function m(e){var t=e.toString(16);return t.length===1?"0"+t:t}function G(e){return m(Math.round(e*255))}function ke(e,t,r){return A("#"+G(e)+G(t)+G(r))}function k(e,t,r){return F(e,t,r,ke)}function Pe(e,t,r){if(typeof e=="number"&&typeof t=="number"&&typeof r=="number")return k(e,t,r);if(typeof e=="object"&&t===void 0&&r===void 0)return k(e.hue,e.saturation,e.lightness);throw new f(1)}function Oe(e,t,r,o){if(typeof e=="number"&&typeof t=="number"&&typeof r=="number"&&typeof o=="number")return o>=1?k(e,t,r):"rgba("+F(e,t,r)+","+o+")";if(typeof e=="object"&&t===void 0&&r===void 0&&o===void 0)return e.alpha>=1?k(e.hue,e.saturation,e.lightness):"rgba("+F(e.hue,e.saturation,e.lightness)+","+e.alpha+")";throw new f(2)}function Y(e,t,r){if(typeof e=="number"&&typeof t=="number"&&typeof r=="number")return A("#"+m(e)+m(t)+m(r));if(typeof e=="object"&&t===void 0&&r===void 0)return A("#"+m(e.red)+m(e.green)+m(e.blue));throw new f(6)}function w(e,t,r,o){if(typeof e=="string"&&typeof t=="number"){var a=O(e);return"rgba("+a.red+","+a.green+","+a.blue+","+t+")"}else{if(typeof e=="number"&&typeof t=="number"&&typeof r=="number"&&typeof o=="number")return o>=1?Y(e,t,r):"rgba("+e+","+t+","+r+","+o+")";if(typeof e=="object"&&t===void 0&&r===void 0&&o===void 0)return e.alpha>=1?Y(e.red,e.green,e.blue):"rgba("+e.red+","+e.green+","+e.blue+","+e.alpha+")"}throw new f(7)}var Re=function(e){return typeof e.red=="number"&&typeof e.green=="number"&&typeof e.blue=="number"&&(typeof e.alpha!="number"||typeof e.alpha>"u")},Ie=function(e){return typeof e.red=="number"&&typeof e.green=="number"&&typeof e.blue=="number"&&typeof e.alpha=="number"},Te=function(e){return typeof e.hue=="number"&&typeof e.saturation=="number"&&typeof e.lightness=="number"&&(typeof e.alpha!="number"||typeof e.alpha>"u")},ze=function(e){return typeof e.hue=="number"&&typeof e.saturation=="number"&&typeof e.lightness=="number"&&typeof e.alpha=="number"};function Q(e){if(typeof e!="object")throw new f(8);if(Ie(e))return w(e);if(Re(e))return Y(e);if(ze(e))return Oe(e);if(Te(e))return Pe(e);throw new f(8)}function V(e,t,r){return function(){var o=r.concat(Array.prototype.slice.call(arguments));return o.length>=t?e.apply(this,o):V(e,t,o)}}function R(e){return V(e,e.length,[])}function I(e,t,r){return Math.max(e,Math.min(t,r))}function _e(e,t){if(t==="transparent")return t;var r=J(t);return Q(y({},r,{lightness:I(0,1,r.lightness-parseFloat(e))}))}var je=R(_e),Me=je;function Ge(e,t){if(t==="transparent")return t;var r=J(t);return Q(y({},r,{lightness:I(0,1,r.lightness+parseFloat(e))}))}var De=R(Ge),Ee=De;function He(e,t){if(t==="transparent")return t;var r=O(t),o=typeof r.alpha=="number"?r.alpha:1,a=y({},r,{alpha:I(0,1,(o*100+parseFloat(e)*100)/100)});return w(a)}var St=R(He);function Le(e,t){if(t==="transparent")return t;var r=O(t),o=typeof r.alpha=="number"?r.alpha:1,a=y({},r,{alpha:I(0,1,+(o*100-parseFloat(e)*100).toFixed(2)/100)});return w(a)}var Ae=R(Le),Ye=Ae,i={primary:"#FF4785",secondary:"#029CFD",tertiary:"#FAFBFC",ancillary:"#22a699",orange:"#FC521F",gold:"#FFAE00",green:"#66BF3C",seafoam:"#37D5D3",purple:"#6F2CAC",ultraviolet:"#2A0481",lightest:"#FFFFFF",lighter:"#F7FAFC",light:"#EEF3F6",mediumlight:"#ECF4F9",medium:"#D9E8F2",mediumdark:"#73828C",dark:"#5C6870",darker:"#454E54",darkest:"#2E3438",border:"hsla(203, 50%, 30%, 0.15)",positive:"#66BF3C",negative:"#FF4400",warning:"#E69D00",critical:"#FFFFFF",defaultText:"#2E3438",inverseText:"#FFFFFF",positiveText:"#448028",negativeText:"#D43900",warningText:"#A15C20"},K={app:"#F6F9FC",bar:i.lightest,content:i.lightest,gridCellSize:10,hoverable:Ye(.9,i.secondary),positive:"#E1FFD4",negative:"#FEDED2",warning:"#FFF5CF",critical:"#FF4400"},P={fonts:{base:['"Nunito Sans"',"-apple-system",'".SFNSText-Regular"','"San Francisco"',"BlinkMacSystemFont",'"Segoe UI"','"Helvetica Neue"',"Helvetica","Arial","sans-serif"].join(", "),mono:["ui-monospace","Menlo","Monaco",'"Roboto Mono"','"Oxygen Mono"','"Ubuntu Monospace"','"Source Code Pro"','"Droid Sans Mono"','"Courier New"',"monospace"].join(", ")},weight:{regular:400,bold:700},size:{s1:12,s2:14,s3:16,m1:20,m2:24,m3:28,l1:32,l2:40,l3:48,code:90}},$e={base:"light",colorPrimary:"#FF4785",colorSecondary:"#029CFD",appBg:K.app,appContentBg:i.lightest,appBorderColor:i.border,appBorderRadius:4,fontBase:P.fonts.base,fontCode:P.fonts.mono,textColor:i.darkest,textInverseColor:i.lightest,textMutedColor:i.dark,barTextColor:i.mediumdark,barHoverColor:i.secondary,barSelectedColor:i.secondary,barBg:i.lightest,buttonBg:K.app,buttonBorder:i.medium,booleanBg:i.mediumlight,booleanSelectedBg:i.lightest,inputBg:i.lightest,inputBorder:i.border,inputTextColor:i.darkest,inputBorderRadius:4},X=$e,Ne={base:"dark",colorPrimary:"#FF4785",colorSecondary:"#029CFD",appBg:"#222425",appContentBg:"#1B1C1D",appBorderColor:"rgba(255,255,255,.1)",appBorderRadius:4,fontBase:P.fonts.base,fontCode:P.fonts.mono,textColor:"#C9CDCF",textInverseColor:"#222425",textMutedColor:"#798186",barTextColor:"#798186",barHoverColor:i.secondary,barSelectedColor:i.secondary,barBg:"#292C2E",buttonBg:"#222425",buttonBorder:"rgba(255,255,255,.1)",booleanBg:"#222425",booleanSelectedBg:"#2E3438",inputBg:"#1B1C1D",inputBorder:"rgba(255,255,255,.1)",inputTextColor:i.lightest,inputBorderRadius:4},qe=Ne,{window:D}=W;var We=e=>typeof e!="string"?(Z.warn(`Color passed to theme object should be a string. Instead ${e}(${typeof e}) was passed.`),!1):!0,Ze=e=>!/(gradient|var|calc)/.test(e),Ue=(e,t)=>e==="darken"?w(`${Me(1,t)}`,.95):e==="lighten"?w(`${Ee(1,t)}`,.95):t,ee=e=>t=>{if(!We(t)||!Ze(t))return t;try{return Ue(e,t)}catch{return t}},Ct=ee("lighten"),kt=ee("darken"),Ke=()=>!D||!D.matchMedia?"light":D.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",C={light:X,dark:qe,normal:X},E=Ke(),$=(e={base:E},t)=>{let r={...C[E],...C[e.base]||{},...e,base:C[e.base]?e.base:E};return{...t,...r,barSelectedColor:e.barSelectedColor||r.colorSecondary}};var T="#fff";var z="#0061d5";var te="#222";var re="#e8e8e8",oe="#f4f4f4",ae="#fbfbfb";var ne="4px";var se=$({base:"light",colorPrimary:z,colorSecondary:z,appBg:oe,appContentBg:T,appBorderColor:re,appBorderRadius:parseInt(ne,10),fontBase:'Lato, "Helvetica Neue", Helvetica, Arial, sans-serif',fontCode:"monospace",textColor:te,textInverseColor:ae,barTextColor:T,barSelectedColor:T,barBg:z,brandTitle:"Box Elements",brandUrl:"https://opensource.box.com/box-ui-elements/storybook",brandImage:"https://repository-images.githubusercontent.com/95743138/c161b500-021b-11ea-8bf9-3aa8776acdec"});q.setConfig({sidebar:{collapsedRoots:["features","icon","icons","illustration"]},theme:se});})();
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }
