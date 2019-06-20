### Description

Customizable menu that provides for implementing interactive items, subitems, and icons pulled from `box-ui-elements`. Icons take the form of those in `/icons` for this feature.

Responsive states exist for large, medium and small. To override the medium state, add an `is-forced-open` class to the container element.

Remove the menu item from favorites to see the placeholder text.

## Examples

```js
const IconAdminConsole = require('./icons/IconAdminConsole').default;
const IconAllFiles = require('./icons/IconAllFiles').default;
const IconBoxRelay = require('./icons/IconBoxRelay').default;
const IconReturnToAdminConsole = require('./icons/IconReturnToAdminConsole')
  .default;
const IconDevConsole = require('./icons/IconDevConsole').default;
const IconRecents = require('./icons/IconRecents').default;
const IconSynced = require('./icons/IconSynced').default;
const IconTrash = require('./icons/IconTrash').default;
const IconFeed = require('./icons/IconFeed').default;
const IconNotifications = require('./icons/IconNotifications').default;
const IconNotes = require('./icons/IconNotes').default;
const IconRelay = require('./icons/IconRelay').default;
const IconFavorites = require('./icons/IconFavorites').default;
const IconFilePDF = require('../../icons/file/IconFilePDF').default;

const onToggleCollapse = () => {
  setState(prevState => {
    const prevCollapsed = prevState.collapsed;
    return {
      collapsed: {
        ...prevCollapsed,
        favorites: !prevCollapsed.favorites,
      },
    };
  });
};

const onClickRemove = () => console.log('hello world!');

const leftSidebarProps = {
  customTheme: {
    isLight: 'yes',
    primaryColorLight: '#f0f0f0', // selected menu item background color
    primaryColorLighter: '#123',
    primaryColorDark: '#123',
    primaryColorDarker: '#123',
    contrastColor: '#123',
    secondaryColor: '#123', // icons, selected menu item border, selected menu item icon
  },
  htmlAttributes: {
    'data-resin-component': 'leftnav',
  },
  copyrightFooterProps: {
    'data-resin-target': 'copyright',
    href: '/about-us',
  },
  instantLoginProps: {
    htmlAttributes: {
      href: '/logout',
      'data-resin-target': 'exitinstantlogin',
      rel: 'external',
    },
    iconComponent: IconReturnToAdminConsole,
    id: 'return-to-admin-console',
    message: 'Return to Admin Console',
    showTooltip: true,
  },
  isInstantLoggedIn: true,
  isDragging: true,
};

initialState = {
  collapsed: {},
};

const menuItems = [
  {
    id: 'all-files',
    className: 'nav-all-files-class',
    message: 'All Files',
    htmlAttributes: {
      href: '/folder/0',
      rel: 'some-rel',
      target: '_blank',
      'data-resin-target': 'allfiles',
    },
    routerLink: undefined,
    routerProps: undefined,
    selected: true,
    showTooltip: true,
    iconComponent: IconAllFiles,
    menuItems: [
      {
        id: 'recents',
        message: 'Recents',
        htmlAttributes: {
          href: '/recents',
          rel: 'some-rel',
          target: '_blank',
          'data-resin-target': 'recents',
        },
        selected: false,
        showTooltip: true,
        iconComponent: IconRecents,
      },
      {
        id: 'synced',
        message: 'Synced',
        htmlAttributes: {
          href: '/synced',
          rel: 'some-rel',
          'data-resin-target': 'syncedtodesktop',
          target: '_blank',
        },
        selected: false,
        showTooltip: true,
        iconComponent: IconSynced,
      },
      {
        id: 'trash',
        canReceiveDrop: true,
        message: 'Trash',
        htmlAttributes: {
          href: '/trash',
          rel: 'some-rel',
          'data-resin-target': 'trash',
          target: '_blank',
        },
        selected: false,
        showTooltip: true,
        iconComponent: IconTrash,
      },
    ],
  },
  {
    id: 'feed',
    message: 'Feed',
    htmlAttributes: {
      href: '/feed',
      rel: 'some-rel',
      target: '_blank',
      'data-resin-target': 'feed',
    },
    selected: false,
    showTooltip: true,
    iconComponent: IconFeed,
    newItemBadge: true,
  },
  {
    id: 'notifications',
    message: 'Notifications',
    htmlAttributes: {
      href: '/notifications',
      rel: 'some-rel',
      target: '_blank',
      'data-resin-target': 'notifications',
    },
    selected: false,
    showTooltip: true,
    iconComponent: IconNotifications,
    newItemBadge: true,
  },
  {
    id: 'automations',
    message: 'Automations',
    htmlAttributes: {
      href: '/automations',
      rel: 'some-rel',
      target: '_blank',
      'data-resin-target': 'automations',
    },
    selected: false,
    showTooltip: true,
    iconComponent: IconBoxRelay,
    newItemBade: false,
  },
  {
    id: 'notes',
    message: 'Notes',
    htmlAttributes: {
      href: '/notes',
      rel: 'some-rel',
      target: '_blank',
      'data-resin-target': 'boxnotes',
    },
    selected: false,
    showTooltip: true,
    iconComponent: IconNotes,
  },
  {
    id: 'relay',
    message: 'Relay',
    htmlAttributes: {
      href: '/relay',
      rel: 'some-rel',
      target: '_blank',
      'data-resin-target': 'ibm_orion_app_launcher',
    },
    selected: false,
    showTooltip: true,
    iconComponent: IconRelay,
  },
  {
    htmlAttributes: {
      href: '/master',
      rel: 'external',
      'data-resin-target': 'adminconsole',
    },
    iconComponent: IconAdminConsole,
    id: 'admin-console',
    className: 'nav-admin-console-class',
    message: 'Admin Console',
    selected: false,
    showTooltip: true,
  },
  {
    htmlAttributes: {
      href: '/developers/services',
      rel: 'external',
      'data-resin-target': 'devconsole',
    },
    iconComponent: IconDevConsole,
    id: 'developer-console',
    className: 'nav-dev-console-class',
    message: 'Dev Console',
    selected: false,
    showTooltip: true,
  },
  {
    id: 'favorites',
    canReceiveDrop: false,
    message: 'Favorites',
    htmlAttributes: {
      href: '/favorites',
      rel: 'some-rel',
      target: '_blank',
      'data-resin-target': 'favorites',
    },
    selected: false,
    showTooltip: true,
    iconComponent: IconFavorites,
    showLoadingIndicator: false,
    onToggleCollapse: onToggleCollapse,
    collapsed: state.collapsed.favorites,
    placeholder: 'Drag items here for quick access',
    menuItems: [
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-1',
        message: 'Some Really Longggggg Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-2',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-3',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-4',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-5',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-6',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-7',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-8',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-9',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-10',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-11',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-12',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-13',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-14',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-15',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-16',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-17',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-18',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
      {
        iconComponent: IconFilePDF,
        id: 'favorites-item-19',
        message: 'Some Short Favorite',
        htmlAttributes: {
          href: '/1234',
          'data-resin-feature': 'favorites',
          'data-resin-target': 'itemname',
        },
        onClickRemove,
        scaleIcon: true,
        showTooltip: true,
      },
    ],
  },
];

<LeftSidebar menuItems={menuItems} leftSidebarProps={leftSidebarProps} />;
```
