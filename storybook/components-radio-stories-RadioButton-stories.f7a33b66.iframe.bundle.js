"use strict";(globalThis.webpackChunkbox_ui_elements=globalThis.webpackChunkbox_ui_elements||[]).push([[97955],{"./node_modules/@storybook/addon-styling/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/resolve-url-loader/index.js!./node_modules/@storybook/addon-styling/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[13].use[3]!./src/components/radio/RadioButton.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_storybook_addon_styling_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@storybook/addon-styling/node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_storybook_addon_styling_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_storybook_addon_styling_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_storybook_addon_styling_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@storybook/addon-styling/node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_storybook_addon_styling_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_storybook_addon_styling_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,'.radio-label{position:relative;display:inline-flex;align-items:center;user-select:none}.radio-label>input[type=radio]{flex:none;width:14px;height:14px;margin:0;opacity:0}.radio-label>input[type=radio]+span::before{position:absolute;top:3px;left:0;width:14px;height:14px;background-color:#fff;border:7px solid #fff;border-radius:9001px;box-shadow:0 0 0 1px #909090,0 -1px 1px rgba(0,0,0,.4);transition:border-width .1s;content:""}.radio-label>input[type=radio]:checked+span::before{background-color:#0061d5;border:3px solid #fff}.radio-label>input[type=radio]:focus+span::before{box-shadow:0 0 0 2px #0061d5}.radio-label>input[type=radio]:disabled+span::before{background-color:#bcbcbc;border-color:#fbfbfb;box-shadow:0 0 0 1px #d3d3d3}.radio-label>input[type=radio]+span+span{margin-left:10px}.radio-label>input[type=radio]:disabled+span+span{color:#bcbcbc}.radio-container{margin:0 0 20px}.radio-description{margin-top:2px;margin-left:24px;color:#6f6f6f}',"",{version:3,sources:["webpack://./src/components/radio/RadioButton.scss","webpack://./src/styles/constants/_colors.scss"],names:[],mappings:"AAMA,aACI,iBAAA,CACA,mBAAA,CACA,kBAAA,CACA,gBAAA,CAEA,+BACI,SAAA,CACA,UAAA,CACA,WAAA,CACA,QAAA,CACA,SAAA,CAEA,4CACI,iBAAA,CACA,OAAA,CACA,MAAA,CACA,UAAA,CACA,WAAA,CACA,qBCtBJ,CDuBI,qBAAA,CACA,oBAAA,CACA,sDACI,CAEJ,2BAAA,CACA,UAAA,CAGJ,oDACI,wBC5BG,CD6BH,qBAAA,CAGJ,kDACI,4BAAA,CAGJ,qDACI,wBCrBE,CDsBF,oBClBE,CDmBF,4BAAA,CAGJ,yCACI,gBAAA,CAGJ,kDACI,aC/BE,CDoCd,iBACI,eAAA,CAGJ,mBACI,cAAA,CACA,gBAAA,CACA,aC9CU",sourcesContent:["@import '../../styles/variables';\n\n/**************************************\n * Radio\n **************************************/\n\n.radio-label {\n    position: relative;\n    display: inline-flex;\n    align-items: center;\n    user-select: none;\n\n    > input[type='radio'] {\n        flex: none;\n        width: 14px;\n        height: 14px;\n        margin: 0;\n        opacity: 0;\n\n        + span::before {\n            position: absolute;\n            top: 3px;\n            left: 0;\n            width: 14px;\n            height: 14px;\n            background-color: $white;\n            border: 7px solid $white;\n            border-radius: 9001px;\n            box-shadow:\n                0 0 0 1px $bdl-gray-50,\n                0 -1px 1px rgb(0 0 0 / 40%);\n            transition: border-width 0.1s;\n            content: '';\n        }\n\n        &:checked + span::before {\n            background-color: $primary-color;\n            border: 3px solid $white;\n        }\n\n        &:focus + span::before {\n            box-shadow: 0 0 0 2px $primary-color;\n        }\n\n        &:disabled + span::before {\n            background-color: $bdl-gray-30;\n            border-color: $bdl-gray-02;\n            box-shadow: 0 0 0 1px $bdl-gray-20;\n        }\n\n        + span + span {\n            margin-left: 10px;\n        }\n\n        &:disabled + span + span {\n            color: $bdl-gray-30;\n        }\n    }\n}\n\n.radio-container {\n    margin: 0 0 20px;\n}\n\n.radio-description {\n    margin-top: 2px;\n    margin-left: 24px;\n    color: $bdl-gray-65;\n}\n","// Box Design Language Colors\n// confirm with design before extending\n\n$white: #fff !default;\n$black: #000 !default;\n$countBadgeBackground: #e9163c !default;\n\n// Box/Primary Blues\n$bdl-box-blue: #0061d5 !default;\n$bdl-box-blue-80: #3381dd !default;\n$bdl-box-blue-50: #7fb0ea !default;\n$bdl-box-blue-40: #99c0ee !default;\n$bdl-box-blue-30: #b2cff2 !default;\n$bdl-box-blue-20: #ccdff7 !default;\n$bdl-box-blue-10: #e5effa !default;\n$bdl-box-blue-05: #f2f7fd !default;\n$bdl-box-blue-02: #fafcfe !default;\n\n// Box/Primary Grays\n$bdl-gray: #222 !default;\n$bdl-gray-80: #4e4e4e !default;\n$bdl-gray-65: #6f6f6f !default;\n$bdl-gray-50: #909090 !default;\n$bdl-gray-40: #a7a7a7 !default;\n$bdl-gray-30: #bcbcbc !default;\n$bdl-gray-20: #d3d3d3 !default;\n$bdl-gray-10: #e8e8e8 !default;\n$bdl-gray-05: #f4f4f4 !default;\n$bdl-gray-02: #fbfbfb !default;\n\n// Dark Blues\n$bdl-dark-blue: #003c84 !default;\n$bdl-dark-blue-50: #7f9dc1 !default;\n$bdl-dark-blue-20: #ccd8e6 !default;\n$bdl-dark-blue-10: #e5ebf2 !default;\n$bdl-dark-blue-05: #f2f5f9 !default;\n$bdl-dark-blue-02: #fafbfd !default;\n\n// Light Blues\n$bdl-light-blue: #2486fc !default;\n$bdl-light-blue-50: #91c2fd !default;\n$bdl-light-blue-20: #d3e7fe !default;\n$bdl-light-blue-10: #e9f2fe !default;\n$bdl-light-blue-05: #f4f9ff !default;\n$bdl-light-blue-02: #fbfdff !default;\n\n// Yelloranges\n$bdl-yellorange: #f5b31b !default;\n$bdl-yellorange-50: #fad98d !default;\n$bdl-yellorange-20: #fdf0d1 !default;\n$bdl-yellorange-10: #fef7e8 !default;\n$bdl-yellorange-05: #fefbf3 !default;\n$bdl-yellorange-02: #fffefb !default;\n\n// Yellows\n$bdl-yellow: #ffd700 !default;\n$bdl-yellow-50: #ffeb7f !default;\n$bdl-yellow-20: #fff7cc !default;\n$bdl-yellow-10: #fffbe5 !default;\n$bdl-yellow-05: #fffdf2 !default;\n$bdl-yellow-02: #fffefa !default;\n\n// Green Lights\n$bdl-green-light: #26c281 !default;\n$bdl-green-light-50: #92e0c0 !default;\n$bdl-green-light-20: #d4f3e6 !default;\n$bdl-green-light-10: #e9f8f2 !default;\n$bdl-green-light-05: #f4fcf8 !default;\n$bdl-green-light-02: #fbfefd !default;\n\n// Grimaces\n$bdl-grimace: #4826c2 !default;\n$bdl-grimace-50: #a392e0 !default;\n$bdl-grimace-20: #dad4f3 !default;\n$bdl-grimace-10: #ece9f8 !default;\n$bdl-grimace-05: #f6f4fc !default;\n$bdl-grimace-02: #fbfbfe !default;\n\n// Orange\n$bdl-orange: #f1811a !default;\n$bdl-orange-50: #f8c08c !default;\n$bdl-orange-20: #fce6d1 !default;\n$bdl-orange-10: #fdf2e8 !default;\n$bdl-orange-05: #fef8f3 !default;\n$bdl-orange-02: #fffdfb !default;\n\n// Purple Rains\n$bdl-purple-rain: #9f3fed !default;\n$bdl-purple-rain-50: #cf9ff6 !default;\n$bdl-purple-rain-20: #ecd9fb !default;\n$bdl-purple-rain-10: #f5ebfd !default;\n$bdl-purple-rain-05: #faf5fe !default;\n$bdl-purple-rain-02: #fdfbff !default;\n\n// Watermelon Reds\n$bdl-watermelon-red: #ed3757 !default;\n$bdl-watermelon-red-50: #f69bab !default;\n$bdl-watermelon-red-20: #fbd7dd !default;\n$bdl-watermelon-red-10: #fdebee !default;\n$bdl-watermelon-red-05: #fef5f6 !default;\n$bdl-watermelon-red-02: #fffbfc !default;\n"],sourceRoot:""}]);const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/components/radio/stories/RadioButton.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{__namedExportsOrder:()=>__namedExportsOrder,basic:()=>basic,default:()=>RadioButton_stories,disabled:()=>disabled});var react=__webpack_require__("./node_modules/react/index.js"),RadioButton=__webpack_require__("./src/components/radio/RadioButton.tsx");const basic=()=>react.createElement(RadioButton.A,{label:"Radio Button 1",value:"radio1"}),disabled=()=>react.createElement(RadioButton.A,{label:"Disabled Radio Button",value:"radio2",isDisabled:!0}),RadioButton_stories={title:"Components/Radio/RadioButton",component:RadioButton.A,parameters:{notes:"`import { RadioButton } from 'box-ui-elements/es/components/radio';`\n"}},__namedExportsOrder=["basic","disabled"];basic.parameters={...basic.parameters,docs:{...basic.parameters?.docs,source:{originalSource:'() => <RadioButton label="Radio Button 1" value="radio1" />',...basic.parameters?.docs?.source}}},disabled.parameters={...disabled.parameters,docs:{...disabled.parameters?.docs,source:{originalSource:'() => <RadioButton label="Disabled Radio Button" value="radio2" isDisabled />',...disabled.parameters?.docs?.source}}}},"./src/components/radio/RadioButton.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>components_radio_RadioButton});var react=__webpack_require__("./node_modules/react/index.js"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),RadioButton=__webpack_require__("./node_modules/@storybook/addon-styling/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/resolve-url-loader/index.js!./node_modules/@storybook/addon-styling/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[13].use[3]!./src/components/radio/RadioButton.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(RadioButton.A,options);RadioButton.A&&RadioButton.A.locals&&RadioButton.A.locals;const _excluded=["isDisabled","isSelected","description","hideLabel","label","name","value"];function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const onChangeStub=()=>{},RadioButton_RadioButton=_ref=>{let{isDisabled,isSelected=!1,description,hideLabel=!1,label,name,value}=_ref,rest=function _objectWithoutProperties(e,t){if(null==e)return{};var o,r,i=function _objectWithoutPropertiesLoose(r,e){if(null==r)return{};var t={};for(var n in r)if({}.hasOwnProperty.call(r,n)){if(e.includes(n))continue;t[n]=r[n]}return t}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)o=s[r],t.includes(o)||{}.propertyIsEnumerable.call(e,o)&&(i[o]=e[o])}return i}(_ref,_excluded);return react.createElement("div",{className:"radio-container"},react.createElement("label",{className:"radio-label"},react.createElement("input",_extends({checked:isSelected,disabled:isDisabled,name,onChange:onChangeStub,type:"radio",value},rest)),react.createElement("span",null),react.createElement("span",{className:hideLabel?"accessibility-hidden":""},label)),description?react.createElement("div",{className:"radio-description"},description):null)},components_radio_RadioButton=RadioButton_RadioButton;try{RadioButton_RadioButton.displayName="RadioButton",RadioButton_RadioButton.__docgenInfo={description:"",displayName:"RadioButton",props:{description:{defaultValue:null,description:"",name:"description",required:!1,type:{name:"ReactNode"}},hideLabel:{defaultValue:{value:"false"},description:"",name:"hideLabel",required:!1,type:{name:"boolean"}},isDisabled:{defaultValue:null,description:"",name:"isDisabled",required:!1,type:{name:"boolean"}},isSelected:{defaultValue:{value:"false"},description:"",name:"isSelected",required:!1,type:{name:"boolean"}},label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"ReactNode"}},name:{defaultValue:null,description:"",name:"name",required:!1,type:{name:"string"}},value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/radio/RadioButton.tsx#RadioButton"]={docgenInfo:RadioButton_RadioButton.__docgenInfo,name:"RadioButton",path:"src/components/radio/RadioButton.tsx#RadioButton"})}catch(__react_docgen_typescript_loader_error){}}}]);