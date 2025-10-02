import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import noop from 'lodash/noop';

// eslint-disable-next-line import/named
import { createTheme } from '../../utils/createTheme';
import CollapsibleSidebar from './CollapsibleSidebar';
import CollapsibleSidebarLogo from './CollapsibleSidebarLogo';
import CollapsibleSidebarFooter from './CollapsibleSidebarFooter';
import CollapsibleSidebarNav from './CollapsibleSidebarNav';
import CollapsibleSidebarItem from './CollapsibleSidebarItem';
import CollapsibleSidebarMenuItem from './CollapsibleSidebarMenuItem';
import notes from './CollapsibleSidebar.stories.md';
import Link from '../../components/link/Link';
import IconPlusRound from '../../icons/general/IconPlusRound';
import { BetaBadge, TrialBadge } from '../../components/badge';
import Folder16 from '../../icon/fill/Folder16';
import ClockBadge16 from '../../icon/fill/ClockBadge16';
import Code16 from '../../icon/fill/Code16';
import Trash16 from '../../icon/fill/Trash16';
import FileDefault16 from '../../icon/fill/FileDefault16';
import CheckmarkBadge16 from '../../icon/fill/CheckmarkBadge16';
const renderFiles = () => {
  const items = [];
  for (let i = 0; i < 5; i += 1) {
    items.push(/*#__PURE__*/React.createElement("li", {
      key: `djb-leftnav-menu-item-all-file-${i}`
    }, /*#__PURE__*/React.createElement(CollapsibleSidebarItem, {
      collapsedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
        as: Link,
        href: "/",
        icon: /*#__PURE__*/React.createElement(FileDefault16, {
          height: 20,
          width: 20
        })
      }),
      expanded: true,
      expandedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
        as: Link,
        href: "/",
        icon: /*#__PURE__*/React.createElement(FileDefault16, {
          height: 20,
          width: 20
        }),
        text: `File ${i}`
      }),
      tooltipMessage: "File Link"
    })));
  }
  return items;
};
export const basic = () => {
  const hexColor = '#0061d5';
  const theme = createTheme(hexColor);
  const linkProps = {
    href: '/?path=/story/components-tooltip--top-center',
    'data-resin-target': 'resinTarget'
  };
  const menuItemContent = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BetaBadge, {
    style: {
      marginLeft: 8
    }
  }), /*#__PURE__*/React.createElement(TrialBadge, {
    style: {
      marginLeft: 8
    }
  }));
  return /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: theme
  }, /*#__PURE__*/React.createElement(CollapsibleSidebar, {
    expanded: true
  }, /*#__PURE__*/React.createElement(CollapsibleSidebarLogo, {
    canEndTrial: false,
    linkProps: linkProps,
    onToggle: noop,
    expanded: true
  }), /*#__PURE__*/React.createElement(CollapsibleSidebarNav, null, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", {
    key: "djb-leftnav-menu-item-all-files"
  }, /*#__PURE__*/React.createElement(CollapsibleSidebarItem, {
    collapsedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      icon: /*#__PURE__*/React.createElement(Folder16, {
        height: 20,
        width: 20
      }),
      linkClassName: "is-currentPage"
    }),
    expanded: true,
    expandedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      icon: /*#__PURE__*/React.createElement(Folder16, {
        height: 20,
        width: 20
      }),
      linkClassName: "is-currentPage",
      text: "All Files"
    }),
    tooltipMessage: "All Files Link"
  })), /*#__PURE__*/React.createElement("li", {
    key: "djb-leftnav-menu-item-all-recents"
  }, /*#__PURE__*/React.createElement(CollapsibleSidebarItem, {
    collapsedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      icon: /*#__PURE__*/React.createElement(Folder16, {
        height: 20,
        width: 20
      })
    }),
    expanded: true,
    expandedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      icon: /*#__PURE__*/React.createElement(ClockBadge16, {
        height: 20,
        width: 20
      }),
      text: "Recents"
    }),
    tooltipMessage: "Recents Link"
  })), /*#__PURE__*/React.createElement("li", {
    key: "djb-leftnav-menu-item-synced"
  }, /*#__PURE__*/React.createElement(CollapsibleSidebarItem, {
    collapsedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      icon: /*#__PURE__*/React.createElement(CheckmarkBadge16, {
        height: 20,
        width: 20
      })
    }),
    expanded: true,
    expandedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      content: menuItemContent,
      icon: /*#__PURE__*/React.createElement(CheckmarkBadge16, {
        height: 20,
        width: 20
      }),
      text: "Really really long synced link name synced Link"
    }),
    tooltipMessage: "Synced Link"
  })), /*#__PURE__*/React.createElement("li", {
    key: "djb-leftnav-menu-item-all-trash"
  }, /*#__PURE__*/React.createElement(CollapsibleSidebarItem, {
    collapsedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      icon: /*#__PURE__*/React.createElement(Trash16, {
        height: 20,
        width: 20
      })
    }),
    expanded: true,
    expandedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      icon: /*#__PURE__*/React.createElement(Trash16, {
        height: 20,
        width: 20
      }),
      text: "Really really long trash link name Trash Link"
    }),
    tooltipMessage: "Trash Link"
  })), /*#__PURE__*/React.createElement("li", {
    key: "djb-leftnav-menu-item-all-file-overflow"
  }, /*#__PURE__*/React.createElement(CollapsibleSidebarItem, {
    collapsedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      icon: /*#__PURE__*/React.createElement(Folder16, {
        height: 20,
        width: 20
      })
    }),
    expanded: true,
    expandedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      icon: /*#__PURE__*/React.createElement(Folder16, {
        height: 20,
        width: 20
      }),
      overflowAction: /*#__PURE__*/React.createElement(Link, {
        href: "/"
      }, /*#__PURE__*/React.createElement(IconPlusRound, {
        color: "white"
      })),
      text: "Overflow"
    }),
    tooltipMessage: "Overflow Link"
  })), /*#__PURE__*/React.createElement("li", {
    key: "djb-leftnav-menu-item-all-file-overflow-long"
  }, /*#__PURE__*/React.createElement(CollapsibleSidebarItem, {
    collapsedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      icon: /*#__PURE__*/React.createElement(Folder16, {
        height: 20,
        width: 20
      })
    }),
    expanded: true,
    expandedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      icon: /*#__PURE__*/React.createElement(Folder16, {
        height: 20,
        width: 20
      }),
      overflowAction: /*#__PURE__*/React.createElement(Link, {
        href: "/"
      }, /*#__PURE__*/React.createElement(IconPlusRound, {
        color: "white"
      })),
      text: "Really really long overflow action name Overflow"
    }),
    tooltipMessage: "Overflow Long Link"
  })), /*#__PURE__*/React.createElement("li", {
    key: "djb-leftnav-menu-item-all-file-overflow-hover"
  }, /*#__PURE__*/React.createElement(CollapsibleSidebarItem, {
    collapsedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      icon: /*#__PURE__*/React.createElement(Folder16, {
        height: 20,
        width: 20
      })
    }),
    expanded: true,
    expandedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      icon: /*#__PURE__*/React.createElement(Folder16, {
        height: 20,
        width: 20
      }),
      overflowAction: /*#__PURE__*/React.createElement(Link, {
        href: "/"
      }, /*#__PURE__*/React.createElement(IconPlusRound, {
        color: "white"
      })),
      showOverflowAction: "hover",
      text: "Overflow Hover"
    }),
    tooltipMessage: "Overflow Hover Link"
  })), /*#__PURE__*/React.createElement("li", {
    key: "djb-leftnav-menu-item-all-file-overflow-hover-long"
  }, /*#__PURE__*/React.createElement(CollapsibleSidebarItem, {
    collapsedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      icon: /*#__PURE__*/React.createElement(Folder16, {
        height: 20,
        width: 20
      })
    }),
    expanded: true,
    expandedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      icon: /*#__PURE__*/React.createElement(Folder16, {
        height: 20,
        width: 20
      }),
      overflowAction: /*#__PURE__*/React.createElement(Link, {
        href: "/"
      }, /*#__PURE__*/React.createElement(IconPlusRound, {
        color: "white"
      })),
      showOverflowAction: "hover",
      text: "Really really long overflow action name Overflow Hover"
    }),
    tooltipMessage: "Overflow Hover Long Link"
  })), /*#__PURE__*/React.createElement("li", {
    key: "djb-leftnav-menu-item-all-file-disabled-tooltip"
  }, /*#__PURE__*/React.createElement(CollapsibleSidebarItem, {
    collapsedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      shouldHideTooltip: true,
      icon: /*#__PURE__*/React.createElement(Folder16, {
        height: 20,
        width: 20
      })
    }),
    expanded: true,
    expandedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      href: "/",
      shouldHideTooltip: true,
      icon: /*#__PURE__*/React.createElement(Folder16, {
        height: 20,
        width: 20
      }),
      overflowAction: /*#__PURE__*/React.createElement(Link, {
        href: "/"
      }, /*#__PURE__*/React.createElement(IconPlusRound, {
        color: "white"
      })),
      showOverflowAction: "hover",
      text: "Should Hide Tooltip"
    }),
    tooltipMessage: ""
  })), renderFiles())), /*#__PURE__*/React.createElement(CollapsibleSidebarFooter, null, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", {
    key: "djb-leftnav-menu-item-all-files"
  }, /*#__PURE__*/React.createElement(CollapsibleSidebarItem, {
    collapsedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      icon: /*#__PURE__*/React.createElement(Code16, {
        height: 20,
        width: 20
      })
    }),
    expanded: true,
    expandedElement: /*#__PURE__*/React.createElement(CollapsibleSidebarMenuItem, {
      as: Link,
      icon: /*#__PURE__*/React.createElement(Code16, {
        height: 20,
        width: 20
      }),
      text: "Developer Console super duper long"
    }),
    tooltipMessage: "Developer Console Link supder duper long"
  }))))));
};
basic.story = {
  name: 'Basic Usage'
};
export default {
  title: 'Features/CollapsibleSidebar',
  component: CollapsibleSidebar,
  parameters: {
    notes
  }
};
//# sourceMappingURL=CollapsibleSidebar.stories.js.map