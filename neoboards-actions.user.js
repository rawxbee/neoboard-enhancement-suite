// ==UserScript==
// @name         Neoboards: Actions
// @version      2.0.0
// @description  Adds buttons to each post that allows you to respond to the specific user, mail the specific user, view the specific user's auctions/trades/shop and refresh the thread. The script will also auto-select your last used pen.
// @author       rawbeee & sunbathr
// @match        *://www.neopets.com/neoboards/topic*
// @match        *://www.neopets.com/neoboards/create_topic.phtml?*
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://images.neopets.com/themes/h5/altadorcup/images/settings-icon.png
// @run-at       document-end
// ==/UserScript==

(function () {
  "use strict";

  function setValue(key, value) {
    if (typeof GM_setValue === "function") {
      GM_setValue(key, JSON.stringify(value));
    } else if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  function getValue(key, defaultValue) {
    if (typeof GM_getValue === "function") {
      const value = GM_getValue(key);
      if (value === undefined) return defaultValue;
      try {
        return JSON.parse(value);
      } catch {
        return defaultValue;
      }
    } else if (typeof localStorage !== "undefined") {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;
      try {
        return JSON.parse(value);
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  }

  function getSettingsValues() {
    return {
      lastPen: getValue("LastPen", 0),
      mode: getValue("Mode", 0),
    };
  }

  const css = `
.reportButton-neoboards {
  border: 0px !important;
  text-transform: uppercase;
  font-size: 9px !important;
  color: #999 !important;
  width: 50px;
  height: 20px;
  margin-bottom: 0px;
  position:absolute;
  bottom: 0px;
  right: 0px;
  overflow: hidden;
  background-color: transparent;
  transition-duration: color 2s ease;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  gap: 2px;
  margin-bottom: 15px;
}
.reportButton-neoboards:hover {
  background-color: transparent !important;
  color: red !important;
}
.boardPostByline {
  position: relative;
}
.boardPost {
  position: relative;
}
.postPetInfo {
  margin-bottom: 10px;
}
.rotateRefresh {
  transform: rotate(-45deg);
  transition-duration: 2s;
}
.rotateRefresh:hover {
  transform: rotate(-315deg);
}
.actionbtn img {
  transition-duration: 0.2s;
}
.actionbtn img:hover {
  transform: translateY(-2px);
}
.replyTo {
  transition-duration: 0.2s;
}
.replyTo:hover {
  transform: translateY(-2px);
}
.boardPostMessage {
  margin-bottom: 40px;
}
.topicReplyTitle {
  display: none;
}
.modesContainer {
  grid-row: 5 / 6;
  grid-column: 1 / 4;
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 50px;
}
.modes {
  width: 80px !important;
  font-family: "MuseoSansRounded700", 'Arial Bold', sans-serif;
  text-align: center;
  color: #000;
}
#settings_pop a:link {
  color: #3b54b4 !important;
  text-decoration: none !important;
  font-size: 14px;
}
#settings_pop a:visited {
  color: #3b54b4 !important;
  text-decoration: none !important;
  font-size: 14px;
}
/* Button hover contrast filter */
button:hover,
#close_settings_pop:hover {
    filter: contrast(0.7) brightness(1.1);
    transition: filter 0.2s ease;
}
`;

  function addCSS(css) {
    const style = document.createElement("style");
    style.type = "text/css";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function ensureSettingsMenuExists() {
    const subNav = document.querySelector(".navsub-left__2020");
    if (!subNav) return;
    if (subNav.querySelector("#settings_btn")) {
      const anchors = document.querySelector("#quick_settings");
      if (anchors) {
        anchors.innerHTML += ` | <a href='#A-Settings'>Actions</a>`;
      }
      return;
    }
    const nesPopup = document.createElement("div");
    nesPopup.id = "settings_pop";
    nesPopup.className = "nesPopup settingspopup";
    Object.assign(nesPopup.style, {
      display: "none",
      background: "rgb(240, 240, 240)",
      borderRadius: "18px",
      border: "3px solid rgb(183, 183, 183)",
      transform: "translate(-50%, -50%)",
      willChange: "transform",
      marginTop: "0px",
      marginLeft: "0px",
      top: "50%",
      left: "50%",
      height: "auto",
      maxHeight: "80%",
      width: "90%",
      maxWidth: "600px",
      position: "fixed",
      zIndex: "9999",
    });

    const popupHeader = document.createElement("div");
    popupHeader.className = "popup-header__2020";
    popupHeader.innerHTML = `
    <h3 style="margin-bottom: 0px;">Neoboard-enhancement-suite Settings</h3>
    <div class="popup-header-pattern__2020"></div>
  `;
    nesPopup.appendChild(popupHeader);

    const nesPopupBody = document.createElement("div");
    nesPopupBody.id = "settings-body";
    nesPopupBody.className = "nesPopupBody";
    Object.assign(nesPopupBody.style, {
      position: "relative",
      overflow: "auto",
      backgroundColor: "#f0f0f0",
      textAlign: "center",
      fontFamily: `"MuseoSansRounded500", "Arial", sans-serif`,
      maxHeight: "400px",
      padding: "15px",
    });
    nesPopupBody.innerHTML = `
    <a href="https://www.neopets.com/neoboards/index.phtml">Index</a> |
    <a href="https://www.neopets.com/neoboards/preferences.phtml">Preferences</a> |
    <a href="https://github.com/rawxbee/neoboard-enhancement-suite">Suite</a>
    <p></p>
    <div id="quick_settings"><a href='#A-Settings'>Actions</a></div>
    <div id="nes_settings"></div>
  `;
    nesPopup.appendChild(nesPopupBody);

    const popupFooter = document.createElement("div");
    popupFooter.className = "popup-footer__2020";

    const footerContent = document.createElement("div");
    Object.assign(footerContent.style, {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-evenly",
      alignItems: "center",
      padding: "5px",
      position: "relative",
      zIndex: "10",
      gap: "10px",
    });

    const closeButton = document.createElement("button");
    closeButton.id = "close_settings_pop";
    Object.assign(closeButton.style, {
      width: "85px",
      background: "#666666",
      color: "white",
      border: "2px solid #363636",
      padding: "8px 16px",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
    });
    closeButton.textContent = "Close";
    footerContent.appendChild(closeButton);

    popupFooter.appendChild(footerContent);
    popupFooter.innerHTML += `<div class="popup-footer-pattern__2020"></div>`;
    nesPopup.appendChild(popupFooter);

    document.body.appendChild(nesPopup);

    const buttonSpan = document.createElement("span");
    buttonSpan.className = "settings_btn";
    buttonSpan.id = "settings_btn";
    buttonSpan.style.cursor = "pointer";
    buttonSpan.innerHTML = `<img src="https://images.neopets.com/themes/h5/basic/images/v3/settings-icon.svg" style="height:30px; width:30px;">`;
    subNav.appendChild(buttonSpan);

    const modal = document.getElementById("settings_pop");
    const button = document.getElementById("settings_btn");
    if (button && modal) {
      button.addEventListener("click", () => {
        modal.style.display = modal.style.display === "none" ? "block" : "none";
      });
    }

    const closeMenu = document.getElementById("close_settings_pop");
    if (closeMenu && modal) {
      closeMenu.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }
  }

  function extractUsername(element) {
    const user = element.querySelector(".postAuthorName");
    return user ? user.textContent.replace(/[^a-zA-Z 0-9 _]+/g, "") : "";
  }

  function unique(list) {
    const result = [];
    list.forEach(function (e) {
      if (result.indexOf(e) === -1) result.push(e);
    });
    return result;
  }

  function hasNeoboardPens() {
    return !!document.querySelector(".neoboardPens");
  }

  if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (str1, str2, ignore) {
      return this.replace(
        new RegExp(
          str1.replace(
            /([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,
            "\\$&"
          ),
          ignore ? "gi" : "g"
        ),
        typeof str2 == "string" ? str2.replace(/\$/g, "$$$$") : str2
      );
    };
  }

  function getSettingsValues() {
    const boardNumber = getBoardNumber();
    const perBoardEnabled = getValue("PerBoardEnabled", false);

    if (perBoardEnabled && boardNumber) {
      return {
        lastPen: getValue(`LastPen_${boardNumber}`, 0),
        mode: getValue(`Mode_${boardNumber}`, 0),
        perBoardEnabled: perBoardEnabled,
        boardNumber: boardNumber,
        boardTitle: getBoardTitle(),
      };
    } else {
      return {
        lastPen: getValue("LastPen", 0),
        mode: getValue("Mode", 0),
        perBoardEnabled: perBoardEnabled,
        boardNumber: boardNumber,
        boardTitle: getBoardTitle(),
      };
    }
  }

  function getBoardNumber() {
    const breadcrumbLink = document.querySelector(
      ".topicNavTop .breadcrumbs a"
    );
    if (!breadcrumbLink || !breadcrumbLink.nextElementSibling) return null;
    const href = breadcrumbLink.nextElementSibling.href;
    return href
      ? href.replace(
          "https://www.neopets.com/neoboards/boardlist.phtml?board=",
          ""
        )
      : null;
  }

  function getBoardTitle() {
    const breadcrumbLink = document.querySelector(
      ".topicNavTop .breadcrumbs a"
    );
    if (!breadcrumbLink || !breadcrumbLink.nextElementSibling) return null;
    return breadcrumbLink.nextElementSibling.textContent;
  }

  function getStorageKey(baseKey) {
    if (settingsValues.perBoardEnabled && settingsValues.boardNumber) {
      return `${baseKey}_${settingsValues.boardNumber}`;
    }
    return baseKey;
  }

  function noticePopup(text) {
    const existingNotice = document.querySelector(".nesNotice");
    if (existingNotice) {
      existingNotice.remove();
    }

    const notice = document.createElement("div");
    notice.className = "nesNotice";
    notice.textContent = text;
    Object.assign(notice.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      marginLeft: "20px",
      backgroundColor: "#4CAF50",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      zIndex: "9999",
      fontSize: "14px",
      whiteSpace: "pre-line",
      opacity: "1",
      transition: "opacity 4s ease",
    });
    document.body.appendChild(notice);

    setTimeout(() => {
      notice.style.opacity = "0";
    }, 4000);

    setTimeout(() => {
      notice.remove();
    }, 8000);
  }

  function createReplyButton(byline, username) {
    const replyDiv = document.createElement("div");
    replyDiv.className = "replyTo";
    replyDiv.style.cssText =
      "cursor: pointer; color: #999; font-size: 10px; position:absolute; bottom: -3px; right:8px;";
    replyDiv.innerHTML = "<p>REPLY </p>";
    replyDiv.addEventListener("click", function () {
      const form_obj = document.message_form;
      if (form_obj && form_obj.message) {
        form_obj.message.value += "@" + username + " ";
        form_obj.message.focus();
      }
    });
    byline.appendChild(replyDiv);
  }

  function createUserActionButtons(info, username) {
    const span = document.createElement("span");
    span.className = "actions";
    span.innerHTML = `
<a href="/neomessages.phtml?type=send&recipient=${username}"><div class="actionbtn" style="cursor:pointer;"><img src="https://images.neopets.com/themes/h5/basic/images/v3/neomail-icon.svg" style="height:20px; width:20px;"></div></a>
<a href="/island/tradingpost.phtml?type=browse&criteria=owner&search_string=${username}"><div class="actionbtn" style="cursor:pointer;"><img src="https://images.neopets.com/themes/h5/basic/images/tradingpost-icon.png" style="height:20px; width:20px;"></div></a>
<a href="/genie.phtml?type=find_user&auction_username=${username}"><div class="actionbtn" style="cursor:pointer;"><img src="https://images.neopets.com/themes/h5/basic/images/auction-icon.png" style="height:20px; width:20px;"></div></a>
<a href="/browseshop.phtml?owner=${username}"><div class="actionbtn" style="cursor:pointer;"><img src="https://images.neopets.com/themes/h5/basic/images/myshop-icon.png" style="height:20px; width:20px;"></div></a>
<a href="/gallery/index.phtml?gu=${username}"><div class="actionbtn" style="cursor:pointer;"><img src="https://images.neopets.com/themes/h5/basic/images/v3/gallery-icon.svg" style="height:20px; width:20px;"></div></a>
<a class="copy-username-btn"><div class="actionbtn" style="cursor:pointer;"><img src="https://images.neopets.com/themes/h5/basic/images/v3/profile-icon.svg" style="height:20px; width:20px;"></div></a>
`;
    info.appendChild(span);

    const copyBtn = span.querySelector(".copy-username-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", function (e) {
        e.preventDefault();
        navigator.clipboard
          .writeText(username)
          .then(() => {
            noticePopup(`Copied "${username}" to the clipboard!`);
          })
          .catch(() => {
            noticePopup("Failed to copy username");
          });
      });
    }
  }

  function createRefreshButton(btn) {
    const div = document.createElement("div");
    div.className = "rotateRefresh";
    div.style.cssText =
      "position:absolute; bottom:20px; right:15.5px; cursor:pointer;";
    div.onclick = function () {
      location.reload();
    };
    div.innerHTML = `<img src="https://i.imgur.com/bRnoAwd.png" style="height:15px; width:15px;">`;
    btn.parentNode.insertBefore(div, btn);
  }

  function createModeElements() {
    const rememberDiv = document.createElement("div");
    rememberDiv.className = "modes neoboardPen ";
    rememberDiv.innerHTML = `
   <img src="https://images.neopets.com/images/edit.gif" border="0">
      <label class="neoboardPenLabel" for="select_!">Remember</label>
         <input class="" type="radio" name="select_mode" value="0" title="When this mode is selected, clicking a pen will remember it for future page loads">
`;

    const randomDiv = document.createElement("div");
    randomDiv.className = "modes neoboardPen";
    randomDiv.innerHTML = `
   <img src="https://images.neopets.com/games/bilgedice/dice_sm_3.gif" border="0">
      <label class="neoboardPenLabel" for="select_!">Random</label>
         <input class="" type="radio" name="select_mode" value="1" title="When this mode is selected, a random pen is selected for future page loads">
`;

    const modeContainer = document.createElement("div");
    modeContainer.className = "modesContainer";
    modeContainer.innerHTML = rememberDiv.outerHTML + randomDiv.outerHTML;

    return modeContainer;
  }

  function replyTo() {
    document.querySelectorAll(".boardPostByline").forEach(function (byline) {
      const username = extractUsername(byline);
      if (username) {
        createReplyButton(byline, username);
      }
    });
  }

  function userActions() {
    document.querySelectorAll(".postAuthorInfo").forEach(function (info) {
      const username = extractUsername(info);
      if (username) {
        createUserActionButtons(info, username);
      }
    });
  }

  function refreshThread() {
    document
      .querySelectorAll(".reportButton-neoboards")
      .forEach(function (btn) {
        createRefreshButton(btn);
      });
  }

  function addPenSelectionListeners() {
    if (!hasNeoboardPens()) return;

    document
      .querySelectorAll('input[type=radio][name="select_pen"]')
      .forEach(function (input) {
        input.addEventListener("click", function () {
          const clicked = this.value;
          setValue(getStorageKey("LastPen"), clicked);

          const currentMode = getValue(getStorageKey("Mode"), 0);
          if (currentMode == 0) {
            const penDiv = this.closest(".neoboardPen");
            const penLabel = penDiv
              ? penDiv.querySelector(".neoboardPenLabel")
              : null;
            const penTitle = penLabel ? penLabel.textContent.trim() : "Pen";

            const message =
              settingsValues.perBoardEnabled && settingsValues.boardTitle
                ? `${penTitle} saved for future use on ${settingsValues.boardTitle}!`
                : `${penTitle} saved for future use!`;

            noticePopup(message);
          }
        });
      });
  }

  function addModeSelectionListeners() {
    document
      .querySelectorAll('input[type=radio][name="select_mode"]')
      .forEach(function (input) {
        input.addEventListener("click", function () {
          const clicked = this.value;
          setValue(getStorageKey("Mode"), clicked);

          if (clicked === "0") {
            const currentlySelectedPen = document.querySelector(
              'input[type=radio][name="select_pen"]:checked'
            );
            if (currentlySelectedPen) {
              setValue(getStorageKey("LastPen"), currentlySelectedPen.value);

              const penDiv = currentlySelectedPen.closest(".neoboardPen");
              const penLabel = penDiv
                ? penDiv.querySelector(".neoboardPenLabel")
                : null;
              const penTitle = penLabel ? penLabel.textContent.trim() : "pen";

              const message =
                settingsValues.perBoardEnabled && settingsValues.boardTitle
                  ? `Remember mode selected for ${settingsValues.boardTitle} - ${penTitle} saved!`
                  : `Remember mode selected - ${penTitle} saved!`;

              noticePopup(message);
            } else {
              const message =
                settingsValues.perBoardEnabled && settingsValues.boardTitle
                  ? `Remember mode selected for ${settingsValues.boardTitle}!`
                  : "Remember mode selected!";

              noticePopup(message);
            }
          } else if (clicked === "1") {
            settingsValues.mode = 1;
            selectLastUsedPen();

            const message =
              settingsValues.perBoardEnabled && settingsValues.boardTitle
                ? `Random mode selected for ${settingsValues.boardTitle}!`
                : "Random mode selected!";

            noticePopup(message);
          }
        });
      });
  }

  function addModes() {
    if (!hasNeoboardPens()) return;

    const modeContainer = createModeElements();
    const penHeader = document.getElementsByClassName("neoboardPenTitle")[0];
    if (penHeader) {
      penHeader.insertAdjacentElement("afterend", modeContainer);
      addModeSelectionListeners();
    }
  }

  function selectLastUsedPen() {
    if (!hasNeoboardPens()) return;

    if (settingsValues.mode != 1) {
      const radBtn = document.querySelector(
        'input[type=radio][name="select_pen"][value="' +
          settingsValues.lastPen +
          '"]'
      );
      if (radBtn) radBtn.checked = true;

      const radBtn2 = document.querySelector(
        'input[type=radio][name="select_mode"][value="' +
          settingsValues.mode +
          '"]'
      );
      if (radBtn2) radBtn2.checked = true;
    } else {
      const pens = document.querySelectorAll(".neoboardPen");
      const max = pens.length - 1;
      const rand_pen = Math.floor(Math.random() * Math.floor(max));

      const rradBtn = document.querySelector(
        'input[type=radio][name="select_pen"][value="' + rand_pen + '"]'
      );
      if (rradBtn) rradBtn.checked = true;

      const rradBtn2 = document.querySelector(
        'input[type=radio][name="select_mode"][value="' +
          settingsValues.mode +
          '"]'
      );
      if (rradBtn2) rradBtn2.checked = true;
    }
  }

  function enhanceImpressLinks() {
    document.querySelectorAll(".boardPostMessage").forEach(function (message) {
      let text = message.innerHTML;
      const linkPattern =
        /(http|https)?:\/\/(impress|impress\-2020)\.openneo\.net\/user\S*?\/(closet|lists)|(impress|impress\-2020)\.openneo\.net\/user\S*?\/(closet|lists)|(http|https)?:\/\/(impress|impress\-2020)\.openneo\.net\/outfits\/\d+|(impress|impress\-2020)\.openneo\.net\/outfits\/\d+/g;
      const array = text.match(linkPattern);

      if (!Array.isArray(array) || !array.length) {
        return;
      }

      unique(array).forEach(function (link) {
        const newlink = link.replace("http://", "").replace("https://", "");
        const embed =
          '<a href="https://' + newlink + '" target="_blank">' + link + "</a>";
        text = text.replaceAll(link, embed);
      });

      if (text !== message.innerHTML) {
        const newDiv = document.createElement("div");
        newDiv.className = "boardPostMessage";
        newDiv.innerHTML = text;
        message.parentNode.replaceChild(newDiv, message);
      }
    });
  }

  function addSettings() {
    ensureSettingsMenuExists();

    const settingsNone = document.getElementById("settings_none");
    if (settingsNone) settingsNone.remove();

    const nesSettings = document.getElementById("nes_settings");
    if (!nesSettings) return;

    if (nesSettings.dataset.actionsSettingsAdded === "1") return;
    nesSettings.dataset.actionsSettingsAdded = "1";

    const settingsContainer = document.createElement("div");
    settingsContainer.id = "actions-settings";
    settingsContainer.className = "settings-container";
    settingsContainer.innerHTML = `
        <h2 id='A-Settings'>Actions</h2>
        <div class="settings-section">
            <h4 style="margin-bottom: 10px;">Neoboard Pen Settings:</h4>
            <div class="actions-grid">
                <label for="PerBoardEnabled">Enable Per-Board Pen Settings:</label>
                <input type="checkbox" id="PerBoardEnabled" ${
                  settingsValues.perBoardEnabled ? "checked" : ""
                }>
            </div>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
                When enabled, pen preferences will be saved separately for each board.
            </p>
            <button id="saveActionsSettings" style="background: #e0e0e0; border: 2px solid #9f9f9f; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;">Save</button>
        </div>
    `;

    const gridCSS = `.actions-grid {
display: grid;
grid-template-columns: auto auto;
gap: 10px 15px;
justify-content: center;
align-items: center;
}

.settings-section {
  margin: auto auto 15px auto;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
  width: 80%;
}

.settings-section h4 {
  margin: 0 0 10px 0;
}

.settings-section label {
  display: flex;
  justify-content: flex-start;
  text-align: left;
}

#saveActionsSettings:hover {
    filter: contrast(0.7) brightness(1.1);
    transition: filter 0.2s ease;
}`;

    addCSS(gridCSS);
    nesSettings.insertAdjacentElement("beforeend", settingsContainer);

    const saveButton = document.getElementById("saveActionsSettings");
    const perBoardCheckbox = document.getElementById("PerBoardEnabled");
    const pensExist = hasNeoboardPens();
    if (!pensExist) {
      const settingsSection = document.querySelector(
        "#actions-settings .settings-section"
      );
      if (settingsSection) {
        settingsSection.querySelector("p").innerHTML = `
                    You don't have any Neoboard Pens :(
                `;
        settingsSection.querySelector(".actions-grid").remove();
        saveButton.remove();
      }
    }
    if (saveButton && perBoardCheckbox) {
      saveButton.addEventListener("click", function () {
        setValue("PerBoardEnabled", perBoardCheckbox.checked);
        noticePopup(
          `Per-board settings ${
            perBoardCheckbox.checked ? "enabled" : "disabled"
          }. You may need to refresh for changes to take effect.`
        );
      });
    }
  }

  const settingsValues = getSettingsValues();
  addCSS(css);
  addSettings();
  replyTo();
  userActions();
  refreshThread();
  addPenSelectionListeners();
  addModes();
  selectLastUsedPen();
  enhanceImpressLinks();
})();
