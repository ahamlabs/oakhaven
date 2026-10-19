# Known issues and limitations

- **Desktop only.** Oakhaven needs a keyboard and mouse, or a standard gamepad. Touch screens aren't supported, and below roughly 800 px wide the journal and phone are cramped.
- **Browsers.** Tested in Chromium (Chrome, Edge, Brave). Firefox and Safari 17 or later should work. Older Safari lacks CSS `zoom`, so the Text size setting doesn't scale the journal and phone there.
- **Saves live in this browser** (localStorage). The phone's gallery lives in IndexedDB. Clearing site data erases both. Private windows forget everything when closed.
- **Audio starts after your first click or key press,** because browsers block sound until you interact with the page.
- **The Crisp renderer** (640×400) runs at about 8–9 ms per frame on a mid-range laptop. On older machines, use Doom or Build.
- **Camera photos** are captured from the game canvas at up to 640 px wide. "Save to device" downloads a JPEG through the browser's normal download prompt.
- **The Last Broadcast** is only available in Act IV, before you enter the cathedral.
- Some optional cases have a time window: the Act I cases close when Act II starts if you never opened them, and chapter select skips them.

To report a bug, open the pause menu and note the chapter shown there, the renderer and what you were doing. Then attach your save. You can export it from the browser's devtools: `localStorage['oakhaven.save.auto']`.

- **Fourth wall.**
  - Fullscreen needs a user gesture, so the moment waits for your next keypress or click.
  - Some browsers, and embedded previews, refuse fullscreen. The moment then plays in the window.
  - Location lookup needs network access to BigDataCloud. Offline, or if you decline, the town comes from your time zone. A UTC time zone shows "your town".
- **Names.** Very short custom names can collide with ordinary words, because the substitution matches whole words. Renaming Dean to "Sam", for example, makes the two brothers indistinguishable on screen.
