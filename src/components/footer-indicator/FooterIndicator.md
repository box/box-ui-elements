### Description

Renders a small tab with text in the bottom-left corner of a page.

### Examples

#### Default

```
<div style={{
    height: '250px',
    position: 'relative',
    transform: 'translate3d(0,0,0)',
}}>
    <FooterIndicator
        indicatorText="FooterIndicator"
    />
</div>
```

#### With truncated text

```
<div style={{
    height: '250px',
    position: 'relative',
    transform: 'translate3d(0,0,0)',
}}>
    <FooterIndicator
        indicatorText="FooterIndicatorWithExtremelyRemarkablyStupendouslyTerrificallyLongName"
    />
</div>
```

#### In a `NavSidebar`

```js
const NavSidebar = require('box-ui-elements/es/components/nav-sidebar/NavSidebar')
  .default;
const NavList = require('box-ui-elements/es/components/nav-sidebar/NavList')
  .default;

<div
  style={{
    transform: 'translate3d(0,0,0)',
  }}
>
  <NavSidebar style={{ padding: 0 }}>
    <div style={{ padding: '20px' }}>
      <NavList>
        <Link>Item A</Link>
        <Link>Item B</Link>
        <Link>Item C</Link>
        <Link>Item D</Link>
        <Link>Item E</Link>
      </NavList>
    </div>
    <FooterIndicator indicatorText="FooterIndicatorInANavSidebar" />
  </NavSidebar>
</div>;
```

#### In a `LeftSidebar`

```js
const LeftSidebar = require('box-ui-elements/es/features/left-sidebar/LeftSidebar')
  .default;
const IconReturnToAdminConsole = require('box-ui-elements/es/features/left-sidebar/icons/IconReturnToAdminConsole')
  .default;
const IconFilePDF = require('../../icons/file/IconFilePDF').default;

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
  indicatorText: 'FooterIndicatorInALeftSidebar',
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

const menuItems = [
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
    showLoadingIndicator: false,
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
        scaleIcon: true,
        showTooltip: true,
      },
    ],
  },
];

<div
  style={{
    transform: 'translate3d(0,0,0)',
  }}
>
  <LeftSidebar menuItems={menuItems} leftSidebarProps={leftSidebarProps} />
</div>;
```
