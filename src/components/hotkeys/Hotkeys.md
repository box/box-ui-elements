### Description

The Hotkey (or Keyboard Shortcut) system allows you to quickly and easily register keyboard shortcut handlers for your application, and also provides a "Help" modal.

The Hotkey system introduces a concept called "Hotkey Layers." These are virtual "barriers" that segregate shortcuts on different "layers" of your application. A common example is modals: in order to prevent your keyboard shortcuts from triggering while a modal is open, you can instantiate a `<HotkeyLayer>` in your modal. (The provided `HotkeyFriendlyModal` component accomplishes this; you should use this in place of the base `Modal` in your app if you're using Hotkeys.)

This becomes more useful the more "layers" you have in your application. Imagine your base app, which has shortcuts of its own; a Preview overlay, which has shortcuts of its own, and shouldn't trigger shortcuts on your base app; and a Preview-triggered modal, which shouldn't trigger shortcuts on either Preview or your base app.

The "help" modal also adapts well to this usage; it only displays shortcuts from the "active" layer.

### Usage

In order to properly use hotkeys in your app, you must have a "base" `HotkeyLayer` somewhere in your app hierarchy that wraps all your content. You cannot use the `Hotkey` component unless there is at least one `HotkeyLayer` descendant.

Hotkeys that do not have a `type` attribute will still be registered, but will not appear in the help modal. This is a good way to create "hidden" shortcuts.

### Examples

**Basic**

```
/*
    NOTE: please see the HotkeyFriendlyModal example for code
*/
<div>
    Try typing "?" to trigger the help modal.
</div>
```
