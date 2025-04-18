"use strict";(globalThis.webpackChunkbox_ui_elements=globalThis.webpackChunkbox_ui_elements||[]).push([[51366],{"./node_modules/@storybook/addon-actions/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{XI:()=>action});var v4=__webpack_require__("./node_modules/@storybook/addon-actions/node_modules/uuid/dist/esm-browser/v4.js"),external_STORYBOOK_MODULE_PREVIEW_API_=__webpack_require__("storybook/internal/preview-api"),external_STORYBOOK_MODULE_GLOBAL_=__webpack_require__("@storybook/global"),external_STORYBOOK_MODULE_CORE_EVENTS_PREVIEW_ERRORS_=__webpack_require__("storybook/internal/preview-errors"),ADDON_ID="storybook/actions",EVENT_ID=`${ADDON_ID}/action-event`,config={depth:10,clearOnStoryChange:!0,limit:50},findProto=(obj,callback)=>{let proto=Object.getPrototypeOf(obj);return!proto||callback(proto)?proto:findProto(proto,callback)},serializeArg=a=>{if("object"==typeof(e=a)&&e&&findProto(e,(proto=>/^Synthetic(?:Base)?Event$/.test(proto.constructor.name)))&&"function"==typeof e.persist){let e=Object.create(a.constructor.prototype,Object.getOwnPropertyDescriptors(a));e.persist();let viewDescriptor=Object.getOwnPropertyDescriptor(e,"view"),view=viewDescriptor?.value;return"object"==typeof view&&"Window"===view?.constructor.name&&Object.defineProperty(e,"view",{...viewDescriptor,value:Object.create(view.constructor.prototype)}),e}var e;return a},generateId=()=>"object"==typeof crypto&&"function"==typeof crypto.getRandomValues?(0,v4.A)():Date.now().toString(36)+Math.random().toString(36).substring(2);function action(name,options={}){let actionOptions={...config,...options},handler=function(...args){if(options.implicit){let storyRenderer=("__STORYBOOK_PREVIEW__"in external_STORYBOOK_MODULE_GLOBAL_.global?external_STORYBOOK_MODULE_GLOBAL_.global.__STORYBOOK_PREVIEW__:void 0)?.storyRenders.find((render=>"playing"===render.phase||"rendering"===render.phase));if(storyRenderer){let deprecated=!window?.FEATURES?.disallowImplicitActionsInRenderV8,error=new external_STORYBOOK_MODULE_CORE_EVENTS_PREVIEW_ERRORS_.ImplicitActionsDuringRendering({phase:storyRenderer.phase,name,deprecated});if(!deprecated)throw error;console.warn(error)}}let channel=external_STORYBOOK_MODULE_PREVIEW_API_.addons.getChannel(),id=generateId(),serializedArgs=args.map(serializeArg),normalizedArgs=args.length>1?serializedArgs:serializedArgs[0],actionDisplayToEmit={id,count:0,data:{name,args:normalizedArgs},options:{...actionOptions,maxDepth:5+(actionOptions.depth||3),allowFunction:actionOptions.allowFunction||!1}};channel.emit(EVENT_ID,actionDisplayToEmit)};return handler.isAction=!0,handler.implicit=options.implicit,handler}},"./src/components/primary-button/PrimaryButton.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{__namedExportsOrder:()=>__namedExportsOrder,default:()=>PrimaryButton_stories,disabled:()=>disabled,loading:()=>loading,regular:()=>regular});var react=__webpack_require__("./node_modules/react/index.js"),dist=__webpack_require__("./node_modules/@storybook/addon-actions/dist/index.mjs"),addon_knobs_dist=__webpack_require__("./node_modules/@storybook/addon-knobs/dist/index.js"),PrimaryButton=__webpack_require__("./src/components/primary-button/PrimaryButton.tsx");const regular=()=>react.createElement(PrimaryButton.A,{isDisabled:(0,addon_knobs_dist.boolean)("isDisabled",!1),isLoading:(0,addon_knobs_dist.boolean)("isLoading",!1),onClick:(0,dist.XI)("onClick called")},"Click Here"),loading=()=>react.createElement(PrimaryButton.A,{isLoading:!0},"Click Here"),disabled=()=>react.createElement(PrimaryButton.A,{isDisabled:!0},"Click Here"),PrimaryButton_stories={title:"Components/Buttons/PrimaryButton",component:PrimaryButton.A,parameters:{notes:"`import PrimaryButton from 'box-ui-elements/es/components/primary-button';`\n"}},__namedExportsOrder=["regular","loading","disabled"];regular.parameters={...regular.parameters,docs:{...regular.parameters?.docs,source:{originalSource:"() => <PrimaryButton isDisabled={boolean('isDisabled', false)} isLoading={boolean('isLoading', false)} onClick={action('onClick called')}>\n        Click Here\n    </PrimaryButton>",...regular.parameters?.docs?.source}}},loading.parameters={...loading.parameters,docs:{...loading.parameters?.docs,source:{originalSource:"() => <PrimaryButton isLoading>Click Here</PrimaryButton>",...loading.parameters?.docs?.source}}},disabled.parameters={...disabled.parameters,docs:{...disabled.parameters?.docs,source:{originalSource:"() => <PrimaryButton isDisabled>Click Here</PrimaryButton>",...disabled.parameters?.docs?.source}}}},"./src/components/primary-button/PrimaryButton.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_button_Button__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/button/Button.tsx");const _excluded=["children","className"];function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const PrimaryButton=_ref=>{let{children,className=""}=_ref,rest=function _objectWithoutProperties(e,t){if(null==e)return{};var o,r,i=function _objectWithoutPropertiesLoose(r,e){if(null==r)return{};var t={};for(var n in r)if({}.hasOwnProperty.call(r,n)){if(e.includes(n))continue;t[n]=r[n]}return t}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)o=s[r],t.includes(o)||{}.propertyIsEnumerable.call(e,o)&&(i[o]=e[o])}return i}(_ref,_excluded);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button_Button__WEBPACK_IMPORTED_MODULE_1__.A,_extends({className:`btn-primary ${className}`},rest),children)},__WEBPACK_DEFAULT_EXPORT__=PrimaryButton;try{PrimaryButton.displayName="PrimaryButton",PrimaryButton.__docgenInfo={description:"",displayName:"PrimaryButton",props:{children:{defaultValue:null,description:"Child components for the button, generally localized text",name:"children",required:!1,type:{name:"ReactNode"}},className:{defaultValue:{value:""},description:"Custom class for the button",name:"className",required:!1,type:{name:"string"}},icon:{defaultValue:null,description:"icon component, can be paired with children (text) or on its own",name:"icon",required:!1,type:{name:"ReactElement<any, string | JSXElementConstructor<any>>"}},isDisabled:{defaultValue:null,description:"whether the button is disabled or not",name:"isDisabled",required:!1,type:{name:"boolean"}},isLoading:{defaultValue:null,description:"whether the button is loading or not",name:"isLoading",required:!1,type:{name:"boolean"}},isSelected:{defaultValue:null,description:"whether the button is selected or not",name:"isSelected",required:!1,type:{name:"boolean"}},onClick:{defaultValue:null,description:"onClick handler for the button",name:"onClick",required:!1,type:{name:"Function"}},setRef:{defaultValue:null,description:"to set buttons inner ref",name:"setRef",required:!1,type:{name:"Function"}},size:{defaultValue:null,description:"size of the button",name:"size",required:!1,type:{name:'"large"'}},showRadar:{defaultValue:null,description:"whether to show a radar",name:"showRadar",required:!1,type:{name:"boolean"}},type:{defaultValue:null,description:"type for the button",name:"type",required:!1,type:{name:"enum",value:[{value:'"button"'},{value:'"reset"'},{value:'"submit"'}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/primary-button/PrimaryButton.tsx#PrimaryButton"]={docgenInfo:PrimaryButton.__docgenInfo,name:"PrimaryButton",path:"src/components/primary-button/PrimaryButton.tsx#PrimaryButton"})}catch(__react_docgen_typescript_loader_error){}}}]);