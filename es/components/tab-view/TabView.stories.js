import * as React from 'react';
import Tab from './Tab';
import TabView from './TabView';
import notes from './TabView.stories.md';
export const basic = () => /*#__PURE__*/React.createElement(TabView, {
  defaultSelectedIndex: 1
}, /*#__PURE__*/React.createElement(Tab, {
  title: "Item 1"
}, "Bonbon sweet jujubes chocolate cake cupcake brownie ice cream apple pie. Sesame snaps chocolate bar pie halvah jujubes candy muffin cake souffl\xE9. Tart drag\xE9e bear claw cookie. Sweet roll muffin jelly-o."), /*#__PURE__*/React.createElement(Tab, {
  title: "Item 2"
}, "Bear claw brownie gingerbread sugar plum marzipan. Liquorice apple pie pastry cake lemon drops. Danish tootsie roll chocolate sesame snaps bonbon apple pie sesame snaps. Sweet roll marshmallow candy canes oat cake fruitcake donut jelly-o drag\xE9e.", ' '));
export const withCallback = () => {
  // eslint-disable-next-line no-alert
  const cb = selectedIndex => alert(selectedIndex);
  return /*#__PURE__*/React.createElement(TabView, {
    defaultSelectedIndex: 1,
    onTabSelect: cb
  }, /*#__PURE__*/React.createElement(Tab, {
    title: "Item 1"
  }, "Jujubes pie apple pie pie caramels gummies sesame snaps sweet roll chocolate bar. Powder macaroon halvah oat cake. Icing lollipop cookie. Cookie chocolate bar sweet roll danish chocolate jujubes cake halvah ice cream.", ' '), /*#__PURE__*/React.createElement(Tab, {
    title: "Item 2"
  }, "Muffin oat cake donut biscuit lemon drops sweet tootsie roll chupa chups. Lemon drops liquorice chocolate. Cake cake halvah lemon drops candy danish apple pie. Lollipop caramels tootsie roll drag\xE9e lemon drops wafer.", ' '));
};
export const withLink = () => /*#__PURE__*/React.createElement(TabView, {
  defaultSelectedIndex: 0
}, /*#__PURE__*/React.createElement(Tab, {
  title: "Item 1"
}, "Topping marzipan ice cream. Candy canes ice cream oat cake. Gummi bears toffee sweet roll chocolate bar. Sesame snaps cake chocolate bar powder."), /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com"
}));
export const dynamic = () => /*#__PURE__*/React.createElement(TabView, {
  defaultSelectedIndex: 7,
  isDynamic: true
}, /*#__PURE__*/React.createElement(Tab, {
  title: "Item with very long name 1"
}, "Powder apple pie brownie macaroon. Donut gummies apple pie danish chocolate bar cupcake carrot cake muffin caramels. Chupa chups sesame snaps brownie. Liquorice gingerbread marshmallow topping chocolate bar. Lollipop jelly beans tootsie roll. Candy liquorice danish cookie fruitcake cake. Caramels cupcake powder candy tart biscuit. Ice cream danish brownie chocolate. Brownie muffin jelly-o bear claw ice cream. Chocolate cake icing oat cake pudding cheesecake wafer pie topping. Powder tootsie roll gingerbread cake souffl\xE9. Tart biscuit cookie pie chocolate cake dessert jelly beans lemon drops muffin."), /*#__PURE__*/React.createElement(Tab, {
  title: "Item with another very long name 2"
}, "Danish cheesecake tart cotton candy pie jelly. Apple pie sweet roll jelly. Liquorice pudding danish lollipop halvah chupa chups cupcake caramels drag\xE9e. Toffee tootsie roll cake pastry tootsie roll cake. Gingerbread gummi bears candy croissant croissant dessert macaroon pie toffee. Oat cake donut cotton candy gummies. Tart pudding jelly icing jelly cake muffin. Tart marzipan carrot cake icing. Sesame snaps chocolate bar ice cream chocolate cake candy apple pie pastry. Carrot cake cookie chocolate cake donut tiramisu brownie. Wafer cotton candy danish jujubes macaroon. Bonbon icing cake. Candy canes tiramisu powder topping sweet roll cake. Tart chupa chups donut bear claw croissant."), /*#__PURE__*/React.createElement(Tab, {
  title: "Item with another very very long name 3"
}, "Bonbon chocolate bar chocolate cake. Muffin sweet roll cheesecake pie icing. Fruitcake dessert jujubes liquorice chupa chups powder candy canes gingerbread. Pastry powder drag\xE9e caramels chupa chups gummies drag\xE9e pie. Cookie chocolate cake chocolate bar souffl\xE9 carrot cake jelly-o bear claw. Bonbon bear claw gummies sweet roll oat cake topping brownie. Carrot cake cake lemon drops chocolate powder chupa chups. Croissant topping powder tart pastry gummi bears jelly. Powder chocolate bar pudding apple pie dessert sweet carrot cake cotton candy. Muffin candy halvah cotton candy topping brownie gummies wafer pastry. Icing gummi bears biscuit. Sweet roll oat cake danish liquorice jelly-o. Toffee oat cake candy chocolate cake cupcake chocolate cake candy canes tiramisu tart."), /*#__PURE__*/React.createElement(Tab, {
  title: "Item with another very very very long name 4"
}, "Gummi bears tiramisu sugar plum. Brownie apple pie jelly brownie jelly. Tiramisu carrot cake croissant gummies pastry marzipan bear claw. Toffee marshmallow oat cake pastry powder. Drag\xE9e cupcake wafer jelly beans liquorice jelly beans. Cake biscuit jelly topping bonbon jelly-o. Cake bonbon chupa chups jelly gingerbread. Marzipan danish gummi bears. Souffl\xE9 sweet jujubes drag\xE9e pie cake. Sugar plum brownie jelly jujubes danish. Croissant chocolate powder chocolate cotton candy biscuit. Dessert wafer cake apple pie chupa chups cookie. Gummies jelly-o jujubes muffin souffl\xE9 pie."), /*#__PURE__*/React.createElement(Tab, {
  title: "Item 5"
}, "Sweet candy jujubes cupcake tart. Cookie brownie candy canes pastry sugar plum halvah cheesecake. Jelly beans chupa chups icing pastry biscuit brownie gummi bears dessert gummies. Liquorice ice cream bonbon caramels. Pudding powder topping liquorice candy canes drag\xE9e powder. Ice cream tart pudding jelly beans candy canes bear claw powder icing tootsie roll. Candy canes jelly-o jelly lollipop gingerbread marzipan donut pie candy. Sweet roll sweet lollipop apple pie sweet fruitcake marshmallow. Donut sugar plum gummies. Gummies wafer ice cream drag\xE9e cookie jelly-o croissant tart. Dessert lollipop icing jelly macaroon topping chocolate bar. Drag\xE9e jelly-o halvah toffee dessert pastry cupcake brownie cupcake."), /*#__PURE__*/React.createElement(Tab, {
  title: "Item 6"
}, "Candy sugar plum pudding bonbon biscuit jujubes. Croissant cookie souffl\xE9 cake toffee pie. Caramels apple pie brownie souffl\xE9 fruitcake apple pie macaroon. Danish bonbon chocolate cake jelly cupcake. Chupa chups jujubes pie fruitcake. Jelly beans jelly carrot cake candy canes ice cream. Chocolate bar oat cake lemon drops chocolate cake chupa chups cake jelly-o marshmallow candy canes. Powder gummi bears caramels apple pie oat cake cupcake cookie. Cake gummies tootsie roll sweet chocolate cake cheesecake chocolate bar. Croissant candy canes donut cheesecake gummies cupcake cake cupcake. Jujubes gingerbread pie cake chocolate cake. Marzipan sesame snaps sesame snaps cake chocolate wafer topping chupa chups."), /*#__PURE__*/React.createElement(Tab, {
  title: "Item 7"
}, "Marshmallow brownie wafer macaroon oat cake dessert candy cupcake croissant. Gummi bears cookie lemon drops fruitcake lollipop lemon drops bear claw sweet. Jujubes candy candy liquorice fruitcake cake topping cake jujubes. Caramels cotton candy gummi bears cake. Marshmallow fruitcake gummies gingerbread bonbon cheesecake apple pie candy canes croissant. Oat cake jujubes tootsie roll topping jujubes apple pie cheesecake caramels cheesecake. Powder jelly beans pastry pudding cheesecake. Pudding bear claw cookie. Jelly-o jelly cupcake croissant cake sesame snaps bonbon jujubes chocolate bar. Lollipop gummies brownie dessert gummies halvah sugar plum. Cookie wafer sweet roll. Chupa chups danish apple pie oat cake lollipop jujubes chocolate. Jujubes caramels cake wafer sugar plum gingerbread apple pie."), /*#__PURE__*/React.createElement(Tab, {
  title: "Item 8"
}, "Muffin tart drag\xE9e icing sesame snaps ", /*#__PURE__*/React.createElement("a", {
  href: "https://www.box.com/"
}, "cheesecake"), " marzipan. Lemon drops ice cream bonbon. ", /*#__PURE__*/React.createElement("input", {
  type: "text"
}), " Macaroon chocolate cake marzipan candy gummies carrot cake sweet roll croissant. Apple pie marshmallow cake donut icing sweet roll gingerbread. Carrot cake sesame snaps ice cream sweet roll powder bear claw. Oat cake biscuit chocolate macaroon carrot cake. Macaroon ice cream liquorice halvah carrot cake bear claw toffee donut carrot cake. Apple pie cookie danish dessert souffl\xE9 fruitcake topping chocolate. Fruitcake jelly-o sweet roll ice cream. Wafer chocolate chupa chups marshmallow drag\xE9e carrot cake. Macaroon icing bonbon macaroon dessert chocolate bar. Cookie gingerbread croissant candy canes wafer."), /*#__PURE__*/React.createElement(Tab, {
  title: "Item 9"
}, "Ice cream fruitcake oat cake gummi bears toffee sesame snaps marzipan. Chocolate bar jujubes souffl\xE9 pastry chocolate. Bonbon donut cotton candy powder pudding chocolate bar marzipan pudding bear claw. Oat cake dessert cupcake danish liquorice powder. Jelly-o marzipan lollipop muffin icing cake. Pastry pudding oat cake souffl\xE9 chocolate. Tootsie roll macaroon cotton candy caramels chocolate bar caramels tootsie roll. Chocolate gingerbread icing souffl\xE9 lollipop bear claw cupcake jelly beans. Tart powder fruitcake brownie cake candy canes jelly beans liquorice macaroon. Tootsie roll cookie cupcake wafer chocolate bar gingerbread apple pie tiramisu macaroon. Chocolate cake cake tootsie roll chupa chups tootsie roll brownie tootsie roll liquorice bear claw. Icing caramels pudding souffl\xE9 candy canes gummi bears sugar plum jelly."));
export const dynamicWithLinks = () => /*#__PURE__*/React.createElement(TabView, {
  defaultSelectedIndex: 0,
  isDynamic: true
}, /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com 1"
}), /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com 2"
}), /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com 3"
}), /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com 4"
}), /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com 5"
}), /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com 6"
}), /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com 7"
}), /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com 8"
}), /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com 9"
}), /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com 10"
}), /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com 11"
}), /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com 12"
}), /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com 13"
}), /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com 14"
}), /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com 15"
}), /*#__PURE__*/React.createElement(Tab, {
  href: "https://www.box.com/",
  title: "Box.com 16"
}));
export default {
  title: 'Components/TabView',
  component: TabView,
  parameters: {
    notes
  }
};
//# sourceMappingURL=TabView.stories.js.map