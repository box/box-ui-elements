import * as React from 'react';
import { IntlProvider } from 'react-intl';
import Link from '../link/Link';
import IconHome from '../../icons/general/IconHome';
import Breadcrumb from './Breadcrumb';
import notes from './Breadcrumb.stories.md';
export const regular = () => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(Breadcrumb, {
  label: "Breadcrumb"
}, /*#__PURE__*/React.createElement(IconHome, null), /*#__PURE__*/React.createElement(Link, {
  href: "#foo"
}, "Box Engineering")));
export const withMultipleCrumbs = () => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(Breadcrumb, {
  label: "Breadcrumb"
}, /*#__PURE__*/React.createElement(IconHome, null), /*#__PURE__*/React.createElement(Link, {
  href: "#foo"
}, "Box Engineering"), /*#__PURE__*/React.createElement(Link, {
  href: "#foo"
}, "Frameworks"), /*#__PURE__*/React.createElement(Link, {
  href: "#foo"
}, "Front End"), /*#__PURE__*/React.createElement(Link, {
  href: "#foo"
}, "React"), /*#__PURE__*/React.createElement(Link, {
  href: "#foo"
}, "Box React UI")));
export default {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Breadcrumb.stories.js.map