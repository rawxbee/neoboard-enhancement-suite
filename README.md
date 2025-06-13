# Neoboard Enhancement Suite<br>by sunbathr and rawbeee

A suite of scripts intended to enhance the neoboard experience on desktop

- [Neoboards: Actions](https://github.com/rawxbee/neoboard-enhancement-suite/edit/main/README.md#-neoboards-actions)
- [Neoboards: Bookmarks and History](https://github.com/rawxbee/neoboard-enhancement-suite/edit/main/README.md#-neoboards-bookmarks-and-history)
- [Neoboards: Follow or Block](https://github.com/rawxbee/neoboard-enhancement-suite/edit/main/README.md#-neoboards-follow-or-block-users)
- [Neoboards: Smilies](https://github.com/rawxbee/neoboard-enhancement-suite/edit/main/README.md#-neoboards-smilies)
- [Neoboards: User Tags](https://github.com/rawxbee/neoboard-enhancement-suite/edit/main/README.md#-neoboards-user-tags)

# Installation

To use the Neoboard Enhancement Suite scripts:

1. **Install a userscript manager such as:**  
   - [Tampermonkey](https://www.tampermonkey.net/) (recommended for use with desktop browsers)
   - [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887) (recommended for use with Safari on iOS)
     - In the native Files app create a new folder for your scripts.
       - Ensure the folder is "On My iPhone" rather than in "iCloud Drive", or you may need to intermittently redownload. 
     - Set this as the default folder for your scripts.
     - Go to device settings. Navigate to Safari > Extensions > then toggle Userscripts "on".
    
2. **Install the scripts:**  
   - Navigate to the script(s) you would like to install.
     - [neoboards-actions.user.js](https://github.com/rawxbee/neoboard-enhancement-suite/blob/main/neoboards-actions.user.js)
     - [neoboards-bookmarks-and-history.user.js](https://github.com/rawxbee/neoboard-enhancement-suite/blob/main/neoboards-bookmarks-and-history.user.js)
     - [neoboards-follow-or-block.user.js](https://github.com/rawxbee/neoboard-enhancement-suite/blob/main/neoboards-follow-or-block.user.js)
     - [neoboards-smilies.user.js](https://github.com/rawxbee/neoboard-enhancement-suite/blob/main/neoboards-smilies.user.js)
     - [neoboards-user-tags.user.js](https://github.com/rawxbee/neoboard-enhancement-suite/blob/main/neoboards-user-tags.user.js)
   - **Tampermonkey:**
     - On the script page locate the button labelled "Raw" and click it.
     - A new tab should open that will give you the choice to review the code and install.
     - As long as you do not edit the script yourself, you should be notified when an update is available and be given the option to update.
   - **Userscripts:**
     - On the script page locate the "..." above the code display window to view the "Raw file content" menu.
     - Tap "Download".
     - Tap the download icon in your search bar and access your downloads through the menu that comes up.
     - Tap the file you downloaded.
     - Tap the file name at the top and choose "Save to Files".
     - Save the file to the designated folder you made for Userscripts.
     - Repeat to update or reinstall.

3. **Reload Neoboards:**  
   - After installation, refresh any open Neoboards pages to activate the enhancements. Most scripts are only active on pages where they are used.

4. **Access settings:**  
   - Click the settings cog in the Neoboards navigation bar to configure options for each script.

---

# <img src="https://images.neopets.com/themes/h5/altadorcup/images/settings-icon.png" height="20px"> Neoboards: Actions

[neoboards-actions.user.js](https://github.com/rawxbee/neoboard-enhancement-suite/blob/main/neoboards-actions.user.js)

Adds quick-action buttons to each post on the Neoboards, letting you easily reply, send a neomail, view a user's trades/auctions/shop/gallery, or copy their username. Also includes thread refresh and neoboard pen modes.


## Features

- **Quick actions:** Instantly reply, neomail, view the trades/auctions/shop/gallery, or copy the username for any user.
- **Thread refresh:** Refresh the current thread with a single click.
- **Neoboard pen modes:** Remembers your last used neoboard pen or have one randomly selected each time. You can even choose to have preferences saved per board (Site Events, Avatar Chat, etc).
- **Enhanced links:** Automatically converts OpenNeo Dress to Impress links into clickable links.

## Usage

- **Reply to a user:** Click the "**REPLY**" button in a user's reply to mention them in your message.
- **Quick action buttons:** Click the buttons within a user's reply to neomail them, see their trades/auctions/shop/gallery, or copy their username!
- **Refresh thread:** Click the refresh icon near the report button to reload the thread.
- **Select pen mode:** Choose "Remember" or "Random" mode for pen selection above the pen list.
- **Per-board settings:** Access the settings menu to enable/disable.

## Settings

- **Per-Board Pen Settings:** Choose whether or not you want preferences to be saved per-board (Site Events, Avatar Chat, etc)

###### Settings are accessed through the settings cog, which can be found on the left side of the sub-navigation menu (the one with your neopoints!).

---

# <img src="https://images.neopets.com/themes/h5/altadorcup/images/settings-icon.png" height="20px"> Neoboards: Bookmarks and History

[neoboards-bookmarks-and-history.user.js](https://github.com/rawxbee/neoboard-enhancement-suite/blob/main/neoboards-bookmarks-and-history.user.js)

Adds bookmarks and history tracking for threads and boards. Easily keep track of your favorite and recently visited threads, and customize the look of your bookmarks and history.

## Features

- **Bookmark any thread or board** for quick access.
- **Recent Threads:** Automatically tracks and displays your recently visited threads.
- **Customizable:** Pick and choose colors and features.
- **Collapsible Sections:** Expand/collapse your bookmarks and history lists.
- **Bulk Actions:** Clear all bookmarks or history with one click.

## Usage

- **Bookmark a thread:** Click the "**BOOKMARK**" button at the top of a thread. Click again to "**UNBOOKMARK**".
- **Bookmark a board:** Click the "**ADD**" button next to a board name. Click again to "**REMOVE**".
- **View bookmarks/history:** Bookmarked boards, threads, and recent threads appear above the board list and topics.
- **Remove bookmarks/history:** Use the "**X**" button next to a thread or the "**Clear Bookmarks**"/"**Clear History**" buttons.
- **Configure Settings:** Access the settings menu to configure appearance and limitations.

## Settings

- **Features:** Choose which features you want by enabling or disabling them.
- **Bookmarked Board Button Colors**: Customize the button color, and choose whether the Edit button exists.
- **Bookmarked Threads:** Customize the colors for bookmarked thread elements, and choose whether bookmarked threads have a left-side border..
- **Recent Threads:** Customize the colors for recent thread elements, and choose whether recent threads have a left-side border. Also choose how many recent threads can be saved before old threads fall off the list.

###### Settings are accessed through the settings cog, which can be found on the left side of the sub-navigation menu (the one with your neopoints!).

---

# <img src="https://images.neopets.com/themes/h5/altadorcup/images/settings-icon.png" height="20px"> Neoboards: Follow or Block Users

[neoboards-follow-or-block-users.user.js](https://github.com/rawxbee/neoboard-enhancement-suite/blob/main/neoboards-follow-or-block.user.js)

Lets you follow users (highlights threads and messages) or block users (hides threads and messages) on the Neoboards. Easily manage your lists and customize colors from the settings menu.

## Features

- **Follow users:** Highlights their threads and messages for easy spotting.
- **Block users:** Hides their threads and messages.
- **Bulk management:** Add, remove, or manage followed and blocked users in bulk.
- **Customizable colors:** Choose highlight colors for followed users.
- **Customizable display:** Choose whether followed user threads/messages are highlighted and whether blocked user threads/messages are hidden.

## Usage

- **Follow a user:** Click the "**FOLLOW**" button under a user's post to add them to your followed list.
- **Unfollow a user:** Click the "**UNFOLLOW**" button under a followed user's post to remove them.
- **Block a user:** Click the "**BLOCK**" button under a user's post to hide their threads and messages.
- **Import/Export:** Access the settings menu and copy or paste a comma-separated list.
- **Manage lists:** Access the settings menu and click "**Manage Followed List**" or "**Manage Blocked List**" to bulk add or remove users.
- **Customize colors:** Change highlight and underline colors for followed users in the settings menu.
- **Customize display:** Change display options for followed and blocked users in the settings menu. 

## Settings

- **Display Settings:** Enable or disable highlights and hiding.
- **Followed/Blocked User Colors:** Set the byline (highlight) and underline colors for followed/blocked users.
- **Following:** An editable comma-separated list of users being followed.
- **Manage Followed List:** Organized display of followed users with bulk options.
- **Blocking** A comma-separated list of users being blocked.
- **Manage Followed List:** Organized display of blocked users with bulk options.

###### Settings are accessed through the settings cog, which can be found on the left side of the sub-navigation menu (the one with your neopoints!).

---

# <img src="https://images.neopets.com/themes/h5/altadorcup/images/settings-icon.png" height="20px"> Neoboards: Smilies

[neoboards-smilies.user.js](https://github.com/rawxbee/neoboard-enhancement-suite/blob/main/neoboards-smilies.user.js)

Adds the entire Neoboards smilie library to the reply and topic creation forms, letting you easily insert any smilie with a click. Also embeds image links as images within messages.

## Features

- **Full smilie library:** Access all Neoboards smilies, organized by category, directly below the reply box.
- **One-click insertion:** Click any smilie to insert its code at your cursor position.
- **Image embedding:** Automatically displays direct image links as images within messages.

## Usage

- **Insert a smilie:** Click any smilie below the reply or topic form to add it to your message.
- **Embed an image:** Paste a direct Neopets image URL in your post; it will display as an image (for you and others using the script).

## Settings

- **Features:** Choose which features you want by enabling or disabling them.

###### Settings are accessed through the settings cog, which can be found on the left side of the sub-navigation menu (the one with your neopoints!).

---

# <img src="https://images.neopets.com/themes/h5/altadorcup/images/settings-icon.png" height="20px"> Neoboards: User Tags

[neoboards-user-tags.user.js](https://github.com/rawxbee/neoboard-enhancement-suite/blob/main/neoboards-user-tags.user.js)

Lets you tag users on the Neoboards with custom, styled labels and note. Easily manage, import, and export your user tags in bulk.

## Features

- **Tag any user** with a custom label and optional notes.
- **Style tags**: Choose font, color, background, border, and more.
- **Show tags** on both board lists and individual topics.
- **Manage tags**: Edit, delete, or browse all your tags in a dedicated UI.
- **Import/Export**: Backup your tags or transfer them between browsers/devices.
- **Bulk actions**: Select multiple tags for export or deletion.

## Usage

- **Tag a user:** Click the "**+ TAG**" button next to a username on the boards or topics to create a tag.
- **Edit/Delete a tag:** Click the user's tag to edit or delete it.
- **Manage tags:** Access the settings menu and click "**Manage Existing Tags**" to browse, create, export, or delete tags.
- **Import tags:** Access the settings menu and click "**Choose File**" to select a `.json` file, then click "**Import Tags**".<br>_Only import files from sources you trust._

## Tag Field Examples

| Field            | Example Input                 | Notes                                                                        |
|------------------|-------------------------------|------------------------------------------------------------------------------|
| **Tag**          | `Maya`<br>`<b>TCer</b>`       | Plain text or simple HTML (`b`, `i`, `u`, `span`, `img`, `marquee`, etc.)    |
| **Font Face**    | `Arial`<br>`Comic Sans MS`    | Any installed font name                                                      |
| **Font Size**    | `12px`<br>`1em`               | CSS font size values                                                         |
| **Font Color**   | NA                            | Use the color picker                                                         |
| **Border**       | `1px solid #aaa`              | CSS border property                                                          |
| **Border Radius**| `4px`                         | CSS border-radius property                                                   |
| **Background**   | `#f3f3f3`<br>`url('img.png')` | Color or image URL (CSS background value)                                    |
| **Padding**      | `2px 4px`                     | CSS padding property                                                         |
| **Notes**        | `Met on AC, nice!`            | Any plain text                                                               |

## Settings

- **Display Settings:** Toggle whether tags appear on board lists and/or topics.
- **Default Tag Style:** Set the default appearance for new tags.
- **User Tag Management:** Import/export tags and manage your tag list.

###### Settings are accessed through the settings cog, which can be found on the left side of the sub-navigation menu (the one with your neopoints!).

---

# Other Recommendations

https://github.com/moonbathr/neopets/tree/main

https://github.com/neopets-fixes/neopets_code

https://github.com/Blathers/neopets-user-scripts/

https://github.com/rawxbee/neopets-scripts

*Compatiability with the neoboard-enhancement-suite is not guaranteed*



