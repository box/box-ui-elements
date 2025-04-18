/*! For license information please see 18944.882aad04.iframe.bundle.js.LICENSE.txt */
"use strict";(globalThis.webpackChunkbox_ui_elements=globalThis.webpackChunkbox_ui_elements||[]).push([[18944],{"./node_modules/@bundled-es-modules/statuses/index-esm.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>source_default});var mod,isNodeMode,target,__create=Object.create,__defProp=Object.defineProperty,__getOwnPropDesc=Object.getOwnPropertyDescriptor,__getOwnPropNames=Object.getOwnPropertyNames,__getProtoOf=Object.getPrototypeOf,__hasOwnProp=Object.prototype.hasOwnProperty,__commonJS=(cb,mod)=>function __require(){return mod||(0,cb[__getOwnPropNames(cb)[0]])((mod={exports:{}}).exports,mod),mod.exports},require_codes=__commonJS({"node_modules/statuses/codes.json"(exports,module){module.exports={100:"Continue",101:"Switching Protocols",102:"Processing",103:"Early Hints",200:"OK",201:"Created",202:"Accepted",203:"Non-Authoritative Information",204:"No Content",205:"Reset Content",206:"Partial Content",207:"Multi-Status",208:"Already Reported",226:"IM Used",300:"Multiple Choices",301:"Moved Permanently",302:"Found",303:"See Other",304:"Not Modified",305:"Use Proxy",307:"Temporary Redirect",308:"Permanent Redirect",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Payload Too Large",414:"URI Too Long",415:"Unsupported Media Type",416:"Range Not Satisfiable",417:"Expectation Failed",418:"I'm a Teapot",421:"Misdirected Request",422:"Unprocessable Entity",423:"Locked",424:"Failed Dependency",425:"Too Early",426:"Upgrade Required",428:"Precondition Required",429:"Too Many Requests",431:"Request Header Fields Too Large",451:"Unavailable For Legal Reasons",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout",505:"HTTP Version Not Supported",506:"Variant Also Negotiates",507:"Insufficient Storage",508:"Loop Detected",509:"Bandwidth Limit Exceeded",510:"Not Extended",511:"Network Authentication Required"}}}),require_statuses=__commonJS({"node_modules/statuses/index.js"(exports,module){var codes=require_codes();function getStatusMessage(code){if(!Object.prototype.hasOwnProperty.call(status2.message,code))throw new Error("invalid status code: "+code);return status2.message[code]}function status2(code){if("number"==typeof code)return getStatusMessage(code);if("string"!=typeof code)throw new TypeError("code must be a number or string");var n=parseInt(code,10);return isNaN(n)?function getStatusCode(message){var msg=message.toLowerCase();if(!Object.prototype.hasOwnProperty.call(status2.code,msg))throw new Error('invalid status message: "'+message+'"');return status2.code[msg]}(code):getStatusMessage(n)}module.exports=status2,status2.message=codes,status2.code=function createMessageToStatusCodeMap(codes2){var map={};return Object.keys(codes2).forEach((function forEachCode(code){var message=codes2[code],status3=Number(code);map[message.toLowerCase()]=status3})),map}(codes),status2.codes=function createStatusCodeList(codes2){return Object.keys(codes2).map((function mapCode(code){return Number(code)}))}(codes),status2.redirect={300:!0,301:!0,302:!0,303:!0,305:!0,307:!0,308:!0},status2.empty={204:!0,205:!0,304:!0},status2.retry={502:!0,503:!0,504:!0}}}),source_default=(mod=require_statuses(),isNodeMode=1,target=null!=mod?__create(__getProtoOf(mod)):{},((to,from,except,desc)=>{if(from&&"object"==typeof from||"function"==typeof from)for(let key of __getOwnPropNames(from))__hasOwnProp.call(to,key)||key===except||__defProp(to,key,{get:()=>from[key],enumerable:!(desc=__getOwnPropDesc(from,key))||desc.enumerable});return to})(!isNodeMode&&mod&&mod.__esModule?target:__defProp(target,"default",{value:mod,enumerable:!0}),mod)).default},"./node_modules/msw/lib/core/HttpResponse.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{c:()=>HttpResponse});var cb,mod,index_esm=__webpack_require__("./node_modules/@bundled-es-modules/statuses/index-esm.js"),__create=Object.create,__defProp=Object.defineProperty,__getOwnPropDesc=Object.getOwnPropertyDescriptor,__getOwnPropNames=Object.getOwnPropertyNames,__getProtoOf=Object.getPrototypeOf,__hasOwnProp=Object.prototype.hasOwnProperty,import_set_cookie_parser=((mod,isNodeMode,target)=>(target=null!=mod?__create(__getProtoOf(mod)):{},((to,from,except,desc)=>{if(from&&"object"==typeof from||"function"==typeof from)for(let key of __getOwnPropNames(from))__hasOwnProp.call(to,key)||key===except||__defProp(to,key,{get:()=>from[key],enumerable:!(desc=__getOwnPropDesc(from,key))||desc.enumerable});return to})(!isNodeMode&&mod&&mod.__esModule?target:__defProp(target,"default",{value:mod,enumerable:!0}),mod)))((cb={"node_modules/set-cookie-parser/lib/set-cookie.js"(exports,module){var defaultParseOptions={decodeValues:!0,map:!1,silent:!1};function isNonEmptyString(str){return"string"==typeof str&&!!str.trim()}function parseString(setCookieValue,options){var parts=setCookieValue.split(";").filter(isNonEmptyString),parsed=function parseNameValuePair(nameValuePairStr){var name="",value="",nameValueArr=nameValuePairStr.split("=");return nameValueArr.length>1?(name=nameValueArr.shift(),value=nameValueArr.join("=")):value=nameValuePairStr,{name,value}}(parts.shift()),name=parsed.name,value=parsed.value;options=options?Object.assign({},defaultParseOptions,options):defaultParseOptions;try{value=options.decodeValues?decodeURIComponent(value):value}catch(e){console.error("set-cookie-parser encountered an error while decoding a cookie with value '"+value+"'. Set options.decodeValues to false to disable this feature.",e)}var cookie={name,value};return parts.forEach((function(part){var sides=part.split("="),key=sides.shift().trimLeft().toLowerCase(),value2=sides.join("=");"expires"===key?cookie.expires=new Date(value2):"max-age"===key?cookie.maxAge=parseInt(value2,10):"secure"===key?cookie.secure=!0:"httponly"===key?cookie.httpOnly=!0:"samesite"===key?cookie.sameSite=value2:cookie[key]=value2})),cookie}function parse(input,options){if(options=options?Object.assign({},defaultParseOptions,options):defaultParseOptions,!input)return options.map?{}:[];if(input.headers)if("function"==typeof input.headers.getSetCookie)input=input.headers.getSetCookie();else if(input.headers["set-cookie"])input=input.headers["set-cookie"];else{var sch=input.headers[Object.keys(input.headers).find((function(key){return"set-cookie"===key.toLowerCase()}))];sch||!input.headers.cookie||options.silent||console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."),input=sch}return Array.isArray(input)||(input=[input]),(options=options?Object.assign({},defaultParseOptions,options):defaultParseOptions).map?input.filter(isNonEmptyString).reduce((function(cookies2,str){var cookie=parseString(str,options);return cookies2[cookie.name]=cookie,cookies2}),{}):input.filter(isNonEmptyString).map((function(str){return parseString(str,options)}))}module.exports=parse,module.exports.parse=parse,module.exports.parseString=parseString,module.exports.splitCookiesString=function splitCookiesString2(cookiesString){if(Array.isArray(cookiesString))return cookiesString;if("string"!=typeof cookiesString)return[];var start,ch,lastComma,nextStart,cookiesSeparatorFound,cookiesStrings=[],pos=0;function skipWhitespace(){for(;pos<cookiesString.length&&/\s/.test(cookiesString.charAt(pos));)pos+=1;return pos<cookiesString.length}for(;pos<cookiesString.length;){for(start=pos,cookiesSeparatorFound=!1;skipWhitespace();)if(","===(ch=cookiesString.charAt(pos))){for(lastComma=pos,pos+=1,skipWhitespace(),nextStart=pos;pos<cookiesString.length&&"="!==(ch=cookiesString.charAt(pos))&&";"!==ch&&","!==ch;)pos+=1;pos<cookiesString.length&&"="===cookiesString.charAt(pos)?(cookiesSeparatorFound=!0,pos=nextStart,cookiesStrings.push(cookiesString.substring(start,lastComma)),start=pos):pos=lastComma+1}else pos+=1;(!cookiesSeparatorFound||pos>=cookiesString.length)&&cookiesStrings.push(cookiesString.substring(start,cookiesString.length))}return cookiesStrings}}},function __require(){return mod||(0,cb[__getOwnPropNames(cb)[0]])((mod={exports:{}}).exports,mod),mod.exports})()),HEADERS_INVALID_CHARACTERS=/[^a-z0-9\-#$%&'*+.^_`|~]/i;function normalizeHeaderName(name){if(HEADERS_INVALID_CHARACTERS.test(name)||""===name.trim())throw new TypeError("Invalid character in header field name");return name.trim().toLowerCase()}var charCodesToRemove=[String.fromCharCode(10),String.fromCharCode(13),String.fromCharCode(9),String.fromCharCode(32)],HEADER_VALUE_REMOVE_REGEXP=new RegExp(`(^[${charCodesToRemove.join("")}]|$[${charCodesToRemove.join("")}])`,"g");function normalizeHeaderValue(value){return value.replace(HEADER_VALUE_REMOVE_REGEXP,"")}function isValidHeaderName(value){if("string"!=typeof value)return!1;if(0===value.length)return!1;for(let i=0;i<value.length;i++){const character=value.charCodeAt(i);if(character>127||!isToken(character))return!1}return!0}function isToken(value){return![127,32,"(",")","<",">","@",",",";",":","\\",'"',"/","[","]","?","=","{","}"].includes(value)}function isValidHeaderValue(value){if("string"!=typeof value)return!1;if(value.trim()!==value)return!1;for(let i=0;i<value.length;i++){const character=value.charCodeAt(i);if(0===character||10===character||13===character)return!1}return!0}var _a,_b,_c,NORMALIZED_HEADERS=Symbol("normalizedHeaders"),RAW_HEADER_NAMES=Symbol("rawHeaderNames"),lib_Headers=class _Headers{constructor(init){if(this[_a]={},this[_b]=new Map,this[_c]="Headers",["Headers","HeadersPolyfill"].includes(init?.constructor.name)||init instanceof _Headers||void 0!==globalThis.Headers&&init instanceof globalThis.Headers){init.forEach(((value,name)=>{this.append(name,value)}),this)}else Array.isArray(init)?init.forEach((([name,value])=>{this.append(name,Array.isArray(value)?value.join(", "):value)})):init&&Object.getOwnPropertyNames(init).forEach((name=>{const value=init[name];this.append(name,Array.isArray(value)?value.join(", "):value)}))}[(_a=NORMALIZED_HEADERS,_b=RAW_HEADER_NAMES,_c=Symbol.toStringTag,Symbol.iterator)](){return this.entries()}*keys(){for(const[name]of this.entries())yield name}*values(){for(const[,value]of this.entries())yield value}*entries(){let sortedKeys=Object.keys(this[NORMALIZED_HEADERS]).sort(((a,b)=>a.localeCompare(b)));for(const name of sortedKeys)if("set-cookie"===name)for(const value of this.getSetCookie())yield[name,value];else yield[name,this.get(name)]}has(name){if(!isValidHeaderName(name))throw new TypeError(`Invalid header name "${name}"`);return this[NORMALIZED_HEADERS].hasOwnProperty(normalizeHeaderName(name))}get(name){if(!isValidHeaderName(name))throw TypeError(`Invalid header name "${name}"`);return this[NORMALIZED_HEADERS][normalizeHeaderName(name)]??null}set(name,value){if(!isValidHeaderName(name)||!isValidHeaderValue(value))return;const normalizedName=normalizeHeaderName(name),normalizedValue=normalizeHeaderValue(value);this[NORMALIZED_HEADERS][normalizedName]=normalizeHeaderValue(normalizedValue),this[RAW_HEADER_NAMES].set(normalizedName,name)}append(name,value){if(!isValidHeaderName(name)||!isValidHeaderValue(value))return;const normalizedName=normalizeHeaderName(name),normalizedValue=normalizeHeaderValue(value);let resolvedValue=this.has(normalizedName)?`${this.get(normalizedName)}, ${normalizedValue}`:normalizedValue;this.set(name,resolvedValue)}delete(name){if(!isValidHeaderName(name))return;if(!this.has(name))return;const normalizedName=normalizeHeaderName(name);delete this[NORMALIZED_HEADERS][normalizedName],this[RAW_HEADER_NAMES].delete(normalizedName)}forEach(callback,thisArg){for(const[name,value]of this.entries())callback.call(thisArg,value,name,this)}getSetCookie(){const setCookieHeader=this.get("set-cookie");return null===setCookieHeader?[]:""===setCookieHeader?[""]:(0,import_set_cookie_parser.splitCookiesString)(setCookieHeader)}};const{message}=index_esm.A;function normalizeResponseInit(init={}){const status=init?.status||200,statusText=init?.statusText||message[status]||"",headers=new Headers(init?.headers);return{...init,headers,status,statusText}}class HttpResponse extends Response{constructor(body,init){const responseInit=normalizeResponseInit(init);super(body,responseInit),function decorateResponse(response,init){if(init.type&&Object.defineProperty(response,"type",{value:init.type,enumerable:!0,writable:!1}),"undefined"!=typeof document){const responseCookies=lib_Headers.prototype.getSetCookie.call(init.headers);for(const cookieString of responseCookies)document.cookie=cookieString}return response}(this,responseInit)}static text(body,init){const responseInit=normalizeResponseInit(init);return responseInit.headers.has("Content-Type")||responseInit.headers.set("Content-Type","text/plain"),responseInit.headers.has("Content-Length")||responseInit.headers.set("Content-Length",body?new Blob([body]).size.toString():"0"),new HttpResponse(body,responseInit)}static json(body,init){const responseInit=normalizeResponseInit(init);responseInit.headers.has("Content-Type")||responseInit.headers.set("Content-Type","application/json");const responseText=JSON.stringify(body);return responseInit.headers.has("Content-Length")||responseInit.headers.set("Content-Length",responseText?new Blob([responseText]).size.toString():"0"),new HttpResponse(responseText,responseInit)}static xml(body,init){const responseInit=normalizeResponseInit(init);return responseInit.headers.has("Content-Type")||responseInit.headers.set("Content-Type","text/xml"),new HttpResponse(body,responseInit)}static arrayBuffer(body,init){const responseInit=normalizeResponseInit(init);return body&&responseInit.headers.set("Content-Length",body.byteLength.toString()),new HttpResponse(body,responseInit)}static formData(body,init){return new HttpResponse(body,normalizeResponseInit(init))}}},"./node_modules/msw/lib/core/http.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{L:()=>http});var devUtils=__webpack_require__("./node_modules/msw/lib/core/utils/internal/devUtils.mjs");var index_esm=__webpack_require__("./node_modules/@bundled-es-modules/statuses/index-esm.js");const{message}=index_esm.A;function parse(str,options){void 0===options&&(options={});for(var tokens=function lexer(str){for(var tokens=[],i=0;i<str.length;){var char=str[i];if("*"!==char&&"+"!==char&&"?"!==char)if("\\"!==char)if("{"!==char)if("}"!==char)if(":"!==char)if("("!==char)tokens.push({type:"CHAR",index:i,value:str[i++]});else{var count=1,pattern="";if("?"===str[j=i+1])throw new TypeError('Pattern cannot start with "?" at '.concat(j));for(;j<str.length;)if("\\"!==str[j]){if(")"===str[j]){if(0==--count){j++;break}}else if("("===str[j]&&(count++,"?"!==str[j+1]))throw new TypeError("Capturing groups are not allowed at ".concat(j));pattern+=str[j++]}else pattern+=str[j++]+str[j++];if(count)throw new TypeError("Unbalanced pattern at ".concat(i));if(!pattern)throw new TypeError("Missing pattern at ".concat(i));tokens.push({type:"PATTERN",index:i,value:pattern}),i=j}else{for(var name="",j=i+1;j<str.length;){var code=str.charCodeAt(j);if(!(code>=48&&code<=57||code>=65&&code<=90||code>=97&&code<=122||95===code))break;name+=str[j++]}if(!name)throw new TypeError("Missing parameter name at ".concat(i));tokens.push({type:"NAME",index:i,value:name}),i=j}else tokens.push({type:"CLOSE",index:i,value:str[i++]});else tokens.push({type:"OPEN",index:i,value:str[i++]});else tokens.push({type:"ESCAPED_CHAR",index:i++,value:str[i++]});else tokens.push({type:"MODIFIER",index:i,value:str[i++]})}return tokens.push({type:"END",index:i,value:""}),tokens}(str),_a=options.prefixes,prefixes=void 0===_a?"./":_a,defaultPattern="[^".concat(escapeString(options.delimiter||"/#?"),"]+?"),result=[],key=0,i=0,path="",tryConsume=function(type){if(i<tokens.length&&tokens[i].type===type)return tokens[i++].value},mustConsume=function(type){var value=tryConsume(type);if(void 0!==value)return value;var _a=tokens[i],nextType=_a.type,index=_a.index;throw new TypeError("Unexpected ".concat(nextType," at ").concat(index,", expected ").concat(type))},consumeText=function(){for(var value,result="";value=tryConsume("CHAR")||tryConsume("ESCAPED_CHAR");)result+=value;return result};i<tokens.length;){var char=tryConsume("CHAR"),name=tryConsume("NAME"),pattern=tryConsume("PATTERN");if(name||pattern){var prefix=char||"";-1===prefixes.indexOf(prefix)&&(path+=prefix,prefix=""),path&&(result.push(path),path=""),result.push({name:name||key++,prefix,suffix:"",pattern:pattern||defaultPattern,modifier:tryConsume("MODIFIER")||""})}else{var value=char||tryConsume("ESCAPED_CHAR");if(value)path+=value;else if(path&&(result.push(path),path=""),tryConsume("OPEN")){prefix=consumeText();var name_1=tryConsume("NAME")||"",pattern_1=tryConsume("PATTERN")||"",suffix=consumeText();mustConsume("CLOSE"),result.push({name:name_1||(pattern_1?key++:""),pattern:name_1&&!pattern_1?defaultPattern:pattern_1,prefix,suffix,modifier:tryConsume("MODIFIER")||""})}else mustConsume("END")}}return result}function match(str,options){var keys=[];return function regexpToFunction(re,keys,options){void 0===options&&(options={});var _a=options.decode,decode=void 0===_a?function(x){return x}:_a;return function(pathname){var m=re.exec(pathname);if(!m)return!1;for(var path=m[0],index=m.index,params=Object.create(null),_loop_1=function(i){if(void 0===m[i])return"continue";var key=keys[i-1];"*"===key.modifier||"+"===key.modifier?params[key.name]=m[i].split(key.prefix+key.suffix).map((function(value){return decode(value,key)})):params[key.name]=decode(m[i],key)},i=1;i<m.length;i++)_loop_1(i);return{path,index,params}}}(pathToRegexp(str,keys,options),keys,options)}function escapeString(str){return str.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1")}function flags(options){return options&&options.sensitive?"":"i"}function stringToRegexp(path,keys,options){return function tokensToRegexp(tokens,keys,options){void 0===options&&(options={});for(var _a=options.strict,strict=void 0!==_a&&_a,_b=options.start,start=void 0===_b||_b,_c=options.end,end=void 0===_c||_c,_d=options.encode,encode=void 0===_d?function(x){return x}:_d,_e=options.delimiter,delimiter=void 0===_e?"/#?":_e,_f=options.endsWith,endsWithRe="[".concat(escapeString(void 0===_f?"":_f),"]|$"),delimiterRe="[".concat(escapeString(delimiter),"]"),route=start?"^":"",_i=0,tokens_1=tokens;_i<tokens_1.length;_i++){var token=tokens_1[_i];if("string"==typeof token)route+=escapeString(encode(token));else{var prefix=escapeString(encode(token.prefix)),suffix=escapeString(encode(token.suffix));if(token.pattern)if(keys&&keys.push(token),prefix||suffix)if("+"===token.modifier||"*"===token.modifier){var mod="*"===token.modifier?"?":"";route+="(?:".concat(prefix,"((?:").concat(token.pattern,")(?:").concat(suffix).concat(prefix,"(?:").concat(token.pattern,"))*)").concat(suffix,")").concat(mod)}else route+="(?:".concat(prefix,"(").concat(token.pattern,")").concat(suffix,")").concat(token.modifier);else"+"===token.modifier||"*"===token.modifier?route+="((?:".concat(token.pattern,")").concat(token.modifier,")"):route+="(".concat(token.pattern,")").concat(token.modifier);else route+="(?:".concat(prefix).concat(suffix,")").concat(token.modifier)}}if(end)strict||(route+="".concat(delimiterRe,"?")),route+=options.endsWith?"(?=".concat(endsWithRe,")"):"$";else{var endToken=tokens[tokens.length-1],isEndDelimited="string"==typeof endToken?delimiterRe.indexOf(endToken[endToken.length-1])>-1:void 0===endToken;strict||(route+="(?:".concat(delimiterRe,"(?=").concat(endsWithRe,"))?")),isEndDelimited||(route+="(?=".concat(delimiterRe,"|").concat(endsWithRe,")"))}return new RegExp(route,flags(options))}(parse(path,options),keys,options)}function pathToRegexp(path,keys,options){return path instanceof RegExp?function regexpToRegexp(path,keys){if(!keys)return path;for(var groupsRegex=/\((?:\?<(.*?)>)?(?!\?)/g,index=0,execResult=groupsRegex.exec(path.source);execResult;)keys.push({name:execResult[1]||index++,prefix:"",suffix:"",modifier:"",pattern:""}),execResult=groupsRegex.exec(path.source);return path}(path,keys):Array.isArray(path)?function arrayToRegexp(paths,keys,options){var parts=paths.map((function(path){return pathToRegexp(path,keys,options).source}));return new RegExp("(?:".concat(parts.join("|"),")"),flags(options))}(path,keys,options):stringToRegexp(path,keys,options)}new TextEncoder;Symbol("isPatchedModule");var process=__webpack_require__("./node_modules/process/browser.js");__webpack_require__("./node_modules/outvariant/lib/index.mjs"),__webpack_require__("./node_modules/process/browser.js");var __defProp=Object.defineProperty,colors_exports={};function yellow(text){return`[33m${text}[0m`}function blue(text){return`[34m${text}[0m`}function gray(text){return`[90m${text}[0m`}function red(text){return`[31m${text}[0m`}function green(text){return`[32m${text}[0m`}((target,all)=>{for(var name in all)__defProp(target,name,{get:all[name],enumerable:!0})})(colors_exports,{blue:()=>blue,gray:()=>gray,green:()=>green,red:()=>red,yellow:()=>yellow});(function isNodeProcess(){if("undefined"!=typeof navigator&&"ReactNative"===navigator.product)return!0;if(void 0!==process){const type=process.type;return"renderer"!==type&&"worker"!==type&&!(!process.versions||!process.versions.node)}return!1})();__webpack_require__("./node_modules/strict-event-emitter/lib/index.mjs");const REDUNDANT_CHARACTERS_EXP=/[\?|#].*$/g;function cleanUrl(path){return path.endsWith("?")?path:path.replace(REDUNDANT_CHARACTERS_EXP,"")}function normalizePath(path,baseUrl){if(path instanceof RegExp)return path;const maybeAbsoluteUrl=function getAbsoluteUrl(path,baseUrl){if(function isAbsoluteUrl(url){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)}(path))return path;if(path.startsWith("*"))return path;const origin=baseUrl||"undefined"!=typeof document&&document.baseURI;return origin?decodeURI(new URL(encodeURI(path),origin).href):path}(path,baseUrl);return cleanUrl(maybeAbsoluteUrl)}function matchRequestUrl(url,path,baseUrl){const normalizedPath=normalizePath(path,baseUrl),cleanPath="string"==typeof normalizedPath?function coercePath(path){return path.replace(/([:a-zA-Z_-]*)(\*{1,2})+/g,((_,parameterName,wildcard)=>parameterName?parameterName.startsWith(":")?`${parameterName}${wildcard}`:`${parameterName}(.*)`:"(.*)")).replace(/([^\/])(:)(?=\d+)/,"$1\\$2").replace(/^([^\/]+)(:)(?=\/\/)/,"$1\\$2")}(normalizedPath):normalizedPath,cleanUrl=function getCleanUrl(url,isAbsolute=!0){return[isAbsolute&&url.origin,url.pathname].filter(Boolean).join("")}(url),result=match(cleanPath,{decode:decodeURIComponent})(cleanUrl);return{matches:!1!==result,params:result&&result.params||{}}}var cb,mod,toPublicUrl=__webpack_require__("./node_modules/msw/lib/core/utils/request/toPublicUrl.mjs"),__create=Object.create,index_esm_defProp=Object.defineProperty,__getOwnPropDesc=Object.getOwnPropertyDescriptor,__getOwnPropNames=Object.getOwnPropertyNames,__getProtoOf=Object.getPrototypeOf,__hasOwnProp=Object.prototype.hasOwnProperty,source_default=((mod,isNodeMode,target)=>(target=null!=mod?__create(__getProtoOf(mod)):{},((to,from,except,desc)=>{if(from&&"object"==typeof from||"function"==typeof from)for(let key of __getOwnPropNames(from))__hasOwnProp.call(to,key)||key===except||index_esm_defProp(to,key,{get:()=>from[key],enumerable:!(desc=__getOwnPropDesc(from,key))||desc.enumerable});return to})(!isNodeMode&&mod&&mod.__esModule?target:index_esm_defProp(target,"default",{value:mod,enumerable:!0}),mod)))((cb={"node_modules/cookie/index.js"(exports){exports.parse=function parse(str,options){if("string"!=typeof str)throw new TypeError("argument str must be a string");for(var obj={},dec=(options||{}).decode||decode,index=0;index<str.length;){var eqIdx=str.indexOf("=",index);if(-1===eqIdx)break;var endIdx=str.indexOf(";",index);if(-1===endIdx)endIdx=str.length;else if(endIdx<eqIdx){index=str.lastIndexOf(";",eqIdx-1)+1;continue}var key=str.slice(index,eqIdx).trim();if(void 0===obj[key]){var val=str.slice(eqIdx+1,endIdx).trim();34===val.charCodeAt(0)&&(val=val.slice(1,-1)),obj[key]=tryDecode(val,dec)}index=endIdx+1}return obj},exports.serialize=function serialize(name,val,options){var opt=options||{},enc=opt.encode||encode;if("function"!=typeof enc)throw new TypeError("option encode is invalid");if(!fieldContentRegExp.test(name))throw new TypeError("argument name is invalid");var value=enc(val);if(value&&!fieldContentRegExp.test(value))throw new TypeError("argument val is invalid");var str=name+"="+value;if(null!=opt.maxAge){var maxAge=opt.maxAge-0;if(isNaN(maxAge)||!isFinite(maxAge))throw new TypeError("option maxAge is invalid");str+="; Max-Age="+Math.floor(maxAge)}if(opt.domain){if(!fieldContentRegExp.test(opt.domain))throw new TypeError("option domain is invalid");str+="; Domain="+opt.domain}if(opt.path){if(!fieldContentRegExp.test(opt.path))throw new TypeError("option path is invalid");str+="; Path="+opt.path}if(opt.expires){var expires=opt.expires;if(!function isDate(val){return"[object Date]"===__toString.call(val)||val instanceof Date}(expires)||isNaN(expires.valueOf()))throw new TypeError("option expires is invalid");str+="; Expires="+expires.toUTCString()}if(opt.httpOnly&&(str+="; HttpOnly"),opt.secure&&(str+="; Secure"),opt.priority)switch("string"==typeof opt.priority?opt.priority.toLowerCase():opt.priority){case"low":str+="; Priority=Low";break;case"medium":str+="; Priority=Medium";break;case"high":str+="; Priority=High";break;default:throw new TypeError("option priority is invalid")}if(opt.sameSite)switch("string"==typeof opt.sameSite?opt.sameSite.toLowerCase():opt.sameSite){case!0:str+="; SameSite=Strict";break;case"lax":str+="; SameSite=Lax";break;case"strict":str+="; SameSite=Strict";break;case"none":str+="; SameSite=None";break;default:throw new TypeError("option sameSite is invalid")}return str};var __toString=Object.prototype.toString,fieldContentRegExp=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;function decode(str){return-1!==str.indexOf("%")?decodeURIComponent(str):str}function encode(val){return encodeURIComponent(val)}function tryDecode(str,decode2){try{return decode2(str)}catch(e){return str}}}},function __require(){return mod||(0,cb[__getOwnPropNames(cb)[0]])((mod={exports:{}}).exports,mod),mod.exports})(),1).default,cookies_lib=__webpack_require__("./node_modules/@mswjs/cookies/lib/index.mjs");function getAllDocumentCookies(){return source_default.parse(document.cookie)}function getAllRequestCookies(request){const requestCookiesString=request.headers.get("cookie"),cookiesFromHeaders=requestCookiesString?source_default.parse(requestCookiesString):{};cookies_lib.M.hydrate();const cookiesFromStore=Array.from(cookies_lib.M.get(request)?.entries()).reduce(((cookies,[name,{value}])=>Object.assign(cookies,{[name.trim()]:value})),{}),cookiesFromDocument=function getRequestCookies(request){if("undefined"==typeof document||"undefined"==typeof location)return{};switch(request.credentials){case"same-origin":{const url=new URL(request.url);return location.origin===url.origin?getAllDocumentCookies():{}}case"include":return getAllDocumentCookies();default:return{}}}(request),forwardedCookies={...cookiesFromDocument,...cookiesFromStore};for(const[name,value]of Object.entries(forwardedCookies))request.headers.append("cookie",source_default.serialize(name,value));return{...forwardedCookies,...cookiesFromHeaders}}var RequestHandler=__webpack_require__("./node_modules/msw/lib/core/handlers/RequestHandler.mjs"),HttpMethods=(HttpMethods2=>(HttpMethods2.HEAD="HEAD",HttpMethods2.GET="GET",HttpMethods2.POST="POST",HttpMethods2.PUT="PUT",HttpMethods2.PATCH="PATCH",HttpMethods2.OPTIONS="OPTIONS",HttpMethods2.DELETE="DELETE",HttpMethods2))(HttpMethods||{});class HttpHandler extends RequestHandler.w{constructor(method,path,resolver,options){super({info:{header:`${method} ${path}`,path,method},resolver,options}),this.checkRedundantQueryParameters()}checkRedundantQueryParameters(){const{method,path}=this.info;if(path instanceof RegExp)return;if(cleanUrl(path)===path)return;const searchParams=function getSearchParams(path){return new URL(`/${path}`,"http://localhost").searchParams}(path),queryParams=[];searchParams.forEach(((_,paramName)=>{queryParams.push(paramName)})),devUtils.J.warn(`Found a redundant usage of query parameters in the request handler URL for "${method} ${path}". Please match against a path instead and access query parameters using "new URL(request.url).searchParams" instead. Learn more: https://mswjs.io/docs/recipes/query-parameters`)}async parse(args){return{match:matchRequestUrl(new URL(args.request.url),this.info.path,args.resolutionContext?.baseUrl),cookies:getAllRequestCookies(args.request)}}predicate(args){const hasMatchingMethod=this.matchMethod(args.request.method),hasMatchingUrl=args.parsedResult.match.matches;return hasMatchingMethod&&hasMatchingUrl}matchMethod(actualMethod){return this.info.method instanceof RegExp?this.info.method.test(actualMethod):function isStringEqual(actual,expected){return actual.toLowerCase()===expected.toLowerCase()}(this.info.method,actualMethod)}extendResolverArgs(args){return{params:args.parsedResult.match?.params||{},cookies:args.parsedResult.cookies}}async log(args){const publicUrl=(0,toPublicUrl.e)(args.request.url),loggedRequest=await async function serializeRequest(request){const requestClone=request.clone(),requestText=await requestClone.text();return{url:new URL(request.url),method:request.method,headers:Object.fromEntries(request.headers.entries()),body:requestText}}(args.request),loggedResponse=await async function serializeResponse(response){const responseClone=response.clone(),responseText=await responseClone.text(),responseStatus=responseClone.status||200;return{status:responseStatus,statusText:responseClone.statusText||message[responseStatus]||"OK",headers:Object.fromEntries(responseClone.headers.entries()),body:responseText}}(args.response),statusColor=function getStatusCodeColor(status){return status<300?"#69AB32":status<400?"#F0BB4B":"#E95F5D"}(loggedResponse.status);console.groupCollapsed(devUtils.J.formatMessage(`${function getTimestamp(){const now=new Date;return[now.getHours(),now.getMinutes(),now.getSeconds()].map(String).map((chunk=>chunk.slice(0,2))).map((chunk=>chunk.padStart(2,"0"))).join(":")}()} ${args.request.method} ${publicUrl} (%c${loggedResponse.status} ${loggedResponse.statusText}%c)`),`color:${statusColor}`,"color:inherit"),console.log("Request",loggedRequest),console.log("Handler:",this),console.log("Response",loggedResponse),console.groupEnd()}}function createHttpHandler(method){return(path,resolver,options={})=>new HttpHandler(method,path,resolver,options)}const http={all:createHttpHandler(/.+/),head:createHttpHandler(HttpMethods.HEAD),get:createHttpHandler(HttpMethods.GET),post:createHttpHandler(HttpMethods.POST),put:createHttpHandler(HttpMethods.PUT),delete:createHttpHandler(HttpMethods.DELETE),patch:createHttpHandler(HttpMethods.PATCH),options:createHttpHandler(HttpMethods.OPTIONS)}}}]);