// ==UserScript==
// @name         Neoboards: User Tags
// @version      1.0.0
// @description  Tag users on the Neoboards with styled labels and notes.
// @author       rawbeee
// @match        *://www.neopets.com/neoboards/topic.phtml*
// @match        *://www.neopets.com/neoboards/boardlist.phtml*
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://images.neopets.com/themes/h5/altadorcup/images/settings-icon.png
// @run-at       document-end
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEY = "TaggedUsersNeopets";
  const SETTINGS_KEY = "TaggedUsersNeopetsSettings";
  const tagWord = (count) => (count === 1 ? "tag" : "tags");

  const cssText = `
    .authorTitle, .author {
width: 200px !important;}
.nesPopup {
    transform: translate(-50%, -50%) !important;
    will-change: transform !important;
    margin-top: 0px !important;
    margin-left: 0px !important;
    top: 50% !important;
    left: 50% !important;
    height: auto !important;
    max-height: 80% !important;
    width: 90% !important;
    max-width: 600px !important;
    position: fixed !important;
    z-index: 9999 !important;
}
.nesPopupBody {
position: relative;
    overflow: auto;
    background: #fff;
    text-align: center;
    font-family: "MuseoSansRounded500", 'Arial', sans-serif;
    background-color: #f0f0f0;
    max-height: 400px;
    padding: 15px;
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
#importFileInput {
    display: none;
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
.tag-preview {
    display: flex;
    align-items: center;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 8px;
    background: #fff;
}
.tag-preview-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: center;
}
.tag-preview-username {
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 14px;
}
.tag-preview-display {
    cursor: pointer;
    margin-bottom: 3px;
}
.tag-preview-notes {
    font-size: 11px;
    color: #666;
    font-style: italic;
    margin-top: 3px;
    text-align: left;
}
.tag-preview-checkbox {
    margin-left: 15px;
}
#tag_browser_container, #import_browser_container {
    overflow-y: auto;
}
#tag_browser_list {
    margin: auto auto;
    width: 80%;
}
.import-section {
    margin-bottom: 20px;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 6px;
    background: #f9f9f9;
}
.import-section h4 {
    margin: 0 0 12px 0;
    padding-bottom: 5px;
    border-bottom: 1px solid #ccc;
}
.import-section.new-tags {
    border-color: #4caf50;
    background: #f1f8e9;
}
.import-section.conflicting-tags {
    border-color: #ff9800;
    background: #fff3e0;
}
.conflict-comparison {
    display: grid;
    grid-template-areas:
        "current-label arrow imported-label"
        "current-tags arrow imported-tags"
        "current-notes arrow imported-notes";
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: auto 1fr auto;
    gap: 15px 15px;
    margin-top: 8px;
    padding: 8px;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #ddd;
    align-items: start;
}
.conflict-side {
    display: contents;
}
.conflict-side:first-child .conflict-label {
    grid-area: current-label;
}
.conflict-side:first-child .current-tag-display,
.conflict-side:first-child .import-tag-display {
    grid-area: current-tags;
}
.conflict-side:first-child .notes {
    grid-area: current-notes;
}
.conflict-side:last-child .conflict-label {
    grid-area: imported-label;
}
.conflict-side:last-child .current-tag-display,
.conflict-side:last-child .import-tag-display {
    grid-area: imported-tags;
}
.conflict-side:last-child .notes {
    grid-area: imported-notes;
}
.conflict-label {
    font-size: 11px;
    font-weight: bold;
    color: #666;
    text-align: center;
    align-self: start;
}
.current-tag-display,
.import-tag-display {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
    align-items: start;
    min-height: 24px;
    padding: 4px;
    background: #fafafa;
    border: 1px dashed #ddd;
    border-radius: 4px;
    align-self: start;
}
.conflict-side .notes {
    font-size: 11px;
    color: #666;
    font-style: italic;
    text-align: left;
    line-height: 1.3;
    padding: 4px;
    border-radius: 3px;
    min-height: 20px;
    align-self: start;
}

.conflict-side .notes:empty::before {
    color: #999;
    font-style: italic;
}

.conflict-arrow {
    grid-area: arrow;
    font-size: 18px;
    color: #ff9800;
    font-weight: bold;
    align-self: center;
    justify-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.customUserTag.desktop-only { display: inline-block; }
.customUserTag.mobile-only { display: none; }
@media (max-width: 700px) {
    .customUserTag.desktop-only { display: none !important; }
    .customUserTag.mobile-only { display: inline-block !important; }
    .nesPopup input { font-size: 16px !important; }
}
@media (min-width: 701px) {
    .customUserTag.desktop-only { display: inline-block !important; }
    .customUserTag.mobile-only { display: none !important; }
}
@media screen and (max-width: 700px) {
  .settings-section > div[style*="display: grid"] {
    grid-template-columns: 1fr !important;
  }
}
button:hover,
#saveFeatureSettings:hover,
#saveBoardSettings:hover,
#saveBookmarkedThreadSettings:hover,
#saveRecentSettings:hover,
#close_settings_pop:hover {
    filter: contrast(0.7) brightness(1.1);
    transition: filter 0.2s ease;
}
`;

  function gmSetValue(key, value) {
    try {
      if (typeof GM_setValue === "function") {
        GM_setValue(key, value);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      localStorage.setItem(key, value);
    }
  }

  function gmGetValue(key) {
    try {
      if (typeof GM_getValue === "function") {
        return GM_getValue(key);
      } else {
        return localStorage.getItem(key);
      }
    } catch (e) {
      return localStorage.getItem(key);
    }
  }

  function getDefaultTagStyle() {
    return {
      border: "1px solid #aaa",
      borderRadius: "4px",
      background: "#f3f3f3",
      fontFace: "Arial",
      fontSize: "12px",
      fontColor: "#000000",
      bold: false,
      italic: false,
      padding: "2px 4px",
    };
  }

  function getSettings() {
    const settings = gmGetValue(SETTINGS_KEY);
    try {
      const parsed = settings ? JSON.parse(settings) : {};
      return {
        showBoardlistTags:
          parsed.showBoardlistTags !== undefined
            ? parsed.showBoardlistTags
            : true,
        showTopicTags:
          parsed.showTopicTags !== undefined ? parsed.showTopicTags : true,
        defaultTagStyle: parsed.defaultTagStyle || getDefaultTagStyle(),
      };
    } catch {
      return {
        showBoardlistTags: true,
        showTopicTags: true,
        defaultTagStyle: getDefaultTagStyle(),
      };
    }
  }

  function saveSettings(settings) {
    gmSetValue(SETTINGS_KEY, JSON.stringify(settings));
  }

  function getData() {
    const data = gmGetValue(STORAGE_KEY);
    try {
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  function saveData(data) {
    gmSetValue(STORAGE_KEY, JSON.stringify(data));
  }

  function sanitizeTagHTML(rawHTML) {
    const temp = document.createElement("div");
    temp.innerHTML = rawHTML;

    const allowedTags = new Set([
      "b",
      "i",
      "u",
      "img",
      "div",
      "span",
      "font",
      "marquee",
      "br",
    ]);
    const allowedAttrs = new Set([
      "src",
      "style",
      "width",
      "height",
      "color",
      "face",
      "size",
      "title",
      "direction",
      "behavior",
      "scrollamount",
      "loop",
      "filter",
    ]);

    function sanitizeStyle(styleStr) {
      const style = styleStr
        .split(";")
        .map((rule) => rule.trim())
        .filter(Boolean);
      const safeStyles = [];

      for (let rule of style) {
        const [propRaw, valRaw] = rule.split(":");
        if (!valRaw) continue;

        const prop = propRaw.trim().toLowerCase();
        const val = valRaw.trim().toLowerCase();

        if (
          prop.startsWith("on") ||
          (prop === "position" &&
            ["fixed", "absolute", "sticky"].includes(val)) ||
          prop === "z-index" ||
          prop === "clip-path" ||
          prop === "-moz-binding" ||
          prop === "content" ||
          val.includes("expression") ||
          val.includes("javascript:") ||
          val.includes("url(javascript:") ||
          val.includes("@import")
        ) {
          continue;
        }

        safeStyles.push(`${prop}: ${val}`);
      }

      return safeStyles.join("; ");
    }

    function walk(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();

        if (!allowedTags.has(tag)) {
          node.remove();
          return;
        }

        for (const attr of [...node.attributes]) {
          const name = attr.name.toLowerCase();
          const value = attr.value;

          if (!allowedAttrs.has(name)) {
            node.removeAttribute(attr.name);
            continue;
          }

          if (name === "style") {
            const cleanStyle = sanitizeStyle(value);
            if (cleanStyle) {
              node.setAttribute("style", cleanStyle);
            } else {
              node.removeAttribute("style");
            }
          }

          if (
            name.startsWith("on") ||
            value.toLowerCase().includes("javascript:")
          ) {
            node.removeAttribute(attr.name);
          }
        }
      }

      for (const child of [...node.childNodes]) {
        walk(child);
      }
    }

    walk(temp);
    return temp.innerHTML;
  }

  function importTags() {
    const fileInput = document.getElementById("importFileInput");
    const file = fileInput.files[0];
    const button = document.getElementById("chooseFileButton");
    button.textContent = "📁 Choose File";
    button.title = "";

    if (!file) {
      alert("Please select a file to import.");
      document.getElementById("settings_pop").style.display = "block";
      return;
    }

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      alert("Please select a valid JSON file.");
      return;
    }

    if (
      confirm("Only import files from sources you trust! Click OK to continue.")
    ) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const importData = JSON.parse(e.target.result);

          if (!importData.tags || typeof importData.tags !== "object") {
            alert(
              "Invalid file format. Please ensure you're importing a valid tags export file."
            );
            return;
          }

          const importedTags = importData.tags;
          const importCount = Object.keys(importedTags).length;

          if (importCount === 0) {
            alert("The import file contains no tags.");
            return;
          }

          for (const user in importedTags) {
            if (importedTags[user].text) {
              importedTags[user].text = sanitizeTagHTML(
                importedTags[user].text
              );
            }
          }

          openImportBrowser(importedTags, importData);
          fileInput.value = "";
        } catch (error) {
          alert(
            "Error reading the file. Please ensure it's a valid JSON file exported from this script."
          );
          console.error("Import error:", error);
        }
      };

      reader.readAsText(file);
    }
  }

  function processImportData(importedTags) {
    const currentData = getData();
    const importedUsernames = Object.keys(importedTags);

    const newTags = {};
    const conflictingTags = {};

    importedUsernames.forEach((username) => {
      if (currentData[username]) {
        const current = currentData[username];
        const imported = importedTags[username];

        const areIdentical =
          current.text === imported.text &&
          current.notes === imported.notes &&
          JSON.stringify(current.style) === JSON.stringify(imported.style);

        if (!areIdentical) {
          conflictingTags[username] = importedTags[username];
        }
      } else {
        newTags[username] = importedTags[username];
      }
    });

    return { newTags, conflictingTags, currentData };
  }

  function executeImport(selectedUsernames, importedTags, currentData) {
    if (selectedUsernames.length === 0) {
      alert("No tags selected for import.");
      return;
    }

    const finalData = { ...currentData };
    let newCount = 0;
    let overwriteCount = 0;

    selectedUsernames.forEach((username) => {
      if (currentData[username]) {
        overwriteCount++;
      } else {
        newCount++;
      }
      finalData[username] = importedTags[username];
    });

    saveData(finalData);
    injectTagUI();

    let message = `Import completed!\r\n`;
    if (newCount > 0) {
      message += `• ${newCount} new ${tagWord(newCount)} imported\r\n`;
    }
    if (overwriteCount > 0) {
      message += `• ${overwriteCount} existing ${tagWord(
        overwriteCount
      )} overwritten\r\n`;
    }
    message += `You now have ${Object.keys(finalData).length} total ${tagWord(
      Object.keys(finalData).length
    )}.`;

    noticePopup(message);
    document.getElementById("import_browser").remove();
  }

  function exportSelectedTags(selectedUsernames) {
    const data = getData();

    if (selectedUsernames.length === 0) {
      alert("No tags selected for export.");
      return;
    }

    const selectedTags = {};
    selectedUsernames.forEach((username) => {
      selectedTags[username] = data[username];
    });

    const exportData = {
      exportedAt: new Date().toISOString(),
      tagCount: selectedUsernames.length,
      tags: selectedTags,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedUsernames.length}-user-${tagWord(
      selectedUsernames.length
    )}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    noticePopup(
      `Successfully exported ${selectedUsernames.length} ${tagWord(
        selectedUsernames.length
      )}!`
    );
  }

  function saveDisplaySettings() {
    const settings = getSettings();
    settings.showBoardlistTags =
      document.getElementById("showBoardlistTags").checked;
    settings.showTopicTags = document.getElementById("showTopicTags").checked;
    saveSettings(settings);
    injectTagUI();
    noticePopup("Display settings saved!");
  }

  function saveDefaultTagSettings() {
    const settings = getSettings();
    settings.defaultTagStyle = {
      border: document.getElementById("defaultBorder").value,
      borderRadius: document.getElementById("defaultBorderRadius").value,
      background: document.getElementById("defaultBackground").value,
      fontFace: document.getElementById("defaultFontFace").value,
      fontSize: document.getElementById("defaultFontSize").value,
      fontColor: document.getElementById("defaultFontColor").value,
      bold: document.getElementById("defaultBold").checked,
      italic: document.getElementById("defaultItalic").checked,
      padding: document.getElementById("defaultPadding").value,
    };
    saveSettings(settings);
    noticePopup(
      "Default tag settings saved! New tags will use these settings."
    );
  }

  function createModal(
    id,
    title,
    bodyContent,
    footerContent,
    maxHeight = "400px"
  ) {
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }
    const modal = document.createElement("div");
    modal.className = "nesPopup";
    modal.id = id;
    modal.style.cssText = `
        display: block;
        background: #f0f0f0;
        border-radius: 18px;
        border: 3px solid #b7b7b7;
    `;
    modal.innerHTML = `
        <div class="popup-header__2020">
            <h3 style="margin-bottom: 0px;">${title}</h3>
            <div class="popup-header-pattern__2020"></div>
        </div>
        <div class="nesPopupBody" style="background-color: #f0f0f0; max-height: ${maxHeight}; padding: 15px;">
            ${bodyContent}
        </div>
        <div class="popup-footer__2020">
            <div style="display: flex; flex-wrap: wrap; justify-content: space-evenly; align-items: center; padding: 5px; position: relative; z-index: 10; gap: 10px;">
                ${footerContent}
            </div>
            <div class="popup-footer-pattern__2020"></div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  function createTagElement(username, tagData, options = {}) {
    const {
      showPlusTag = true,
      clickHandler = null,
      includeNotes = false,
      includeCheckbox = false,
      checkboxClass = "",
      checked = false,
      isClickable = true,
      displayMode = "standard",
      conflictData = null,
      containerClass = "",
      customStyles = {},
    } = options;

    function createTagDisplay(data, additionalClasses = "") {
      const tagDiv = document.createElement("div");
      if (additionalClasses) {
        tagDiv.className = additionalClasses;
      }

      if (data) {
        tagDiv.innerHTML = data.text || "‎";

        Object.assign(tagDiv.style, {
          border: data.style.border,
          borderRadius: data.style.borderRadius,
          background: data.style.background,
          fontFamily: data.style.fontFace,
          fontSize: data.style.fontSize,
          color: data.style.fontColor,
          fontWeight: data.style.bold ? "bold" : "normal",
          fontStyle: data.style.italic ? "italic" : "normal",
          padding: data.style.padding,
          display: "inline-block",
          cursor: isClickable ? "pointer" : "default",
          ...customStyles,
        });
      } else if (showPlusTag) {
        tagDiv.textContent = "+ TAG";
        Object.assign(tagDiv.style, {
          color: "#999",
          display: "inline-block",
          cursor: "pointer",
          fontSize: window.innerWidth < 700 ? "14px" : "10px",
          ...customStyles,
        });
      }

      if (clickHandler && isClickable) {
        tagDiv.addEventListener("click", clickHandler);
      }

      return tagDiv;
    }

    switch (displayMode) {
      case "conflict":
        return createConflictDisplay(
          username,
          tagData,
          conflictData,
          includeCheckbox,
          checkboxClass,
          checked
        );

      case "import":
      case "standard":
      default:
        return createStandardDisplay(
          username,
          tagData,
          includeNotes,
          includeCheckbox,
          checkboxClass,
          checked,
          containerClass,
          createTagDisplay
        );
    }
  }
  function createStandardDisplay(
    username,
    tagData,
    includeNotes,
    includeCheckbox,
    checkboxClass,
    checked,
    containerClass,
    createTagDisplay
  ) {
    const tagDisplay = createTagDisplay(tagData);

    if (!includeNotes && !includeCheckbox && !containerClass) {
      return tagDisplay;
    }

    const container = document.createElement("div");
    container.className = `tag-preview ${containerClass}`;

    const notesHtml =
      tagData && tagData.notes && includeNotes
        ? `<div class="tag-preview-notes">${escapeHtml(tagData.notes)}</div>`
        : "";

    const checkboxHtml = includeCheckbox
      ? `<div class="tag-preview-checkbox"><input type="checkbox" class="${checkboxClass}" data-username="${username}" ${
          checked ? "checked" : ""
        }></div>`
      : "";

    container.innerHTML = `
        <div class="tag-preview-content">
            <div class="tag-preview-username">${username}</div>
            <div class="tag-preview-display"></div>
            ${notesHtml}
        </div>
        ${checkboxHtml}
    `;

    container.querySelector(".tag-preview-display").appendChild(tagDisplay);
    return container;
  }
  function createConflictDisplay(
    username,
    currentTag,
    importTag,
    includeCheckbox,
    checkboxClass,
    checked
  ) {
    const currentDisplay = document.createElement("div");
    currentDisplay.innerHTML = currentTag.text || "‎";
    Object.assign(currentDisplay.style, {
      border: currentTag.style.border,
      borderRadius: currentTag.style.borderRadius,
      background: currentTag.style.background,
      fontFamily: currentTag.style.fontFace,
      fontSize: currentTag.style.fontSize,
      color: currentTag.style.fontColor,
      fontWeight: currentTag.style.bold ? "bold" : "normal",
      fontStyle: currentTag.style.italic ? "italic" : "normal",
      padding: currentTag.style.padding,
      display: "inline-block",
    });

    const importDisplay = document.createElement("div");
    importDisplay.innerHTML = importTag.text || "‎";
    Object.assign(importDisplay.style, {
      border: importTag.style.border,
      borderRadius: importTag.style.borderRadius,
      background: importTag.style.background,
      fontFamily: importTag.style.fontFace,
      fontSize: importTag.style.fontSize,
      color: importTag.style.fontColor,
      fontWeight: importTag.style.bold ? "bold" : "normal",
      fontStyle: importTag.style.italic ? "italic" : "normal",
      padding: importTag.style.padding,
      display: "inline-block",
    });

    const container = document.createElement("div");
    container.className = "tag-preview";

    const currentNotes = currentTag.notes
      ? `<div class="tag-preview-notes">${escapeHtml(currentTag.notes)}</div>`
      : "";
    const importNotes = importTag.notes
      ? `<div class="tag-preview-notes">${escapeHtml(importTag.notes)}</div>`
      : "";
    const checkboxHtml = includeCheckbox
      ? `<div><input type="checkbox" class="${checkboxClass}" data-username="${username}" ${
          checked ? "checked" : ""
        }></div>`
      : "";

    container.innerHTML = `
    <div class="tag-preview-content" style="flex: 1;">
        <div class="tag-preview-username">${username}</div>
        <div class="conflict-comparison">
            <div class="conflict-side">
                <div class="conflict-label">CURRENT</div>
                <div class="current-tag-display"></div>
                <div class="notes">${currentNotes}</div>
            </div>
            <div class="conflict-arrow">→</div>
            <div class="conflict-side">
                <div class="conflict-label">IMPORTED</div>
                <div class="import-tag-display"></div>
                <div class="notes">${importNotes}</div>
            </div>
        </div>
    </div>
    ${checkboxHtml}
`;

    container.querySelector(".current-tag-display").appendChild(currentDisplay);
    container.querySelector(".import-tag-display").appendChild(importDisplay);
    return container;
  }

  function setupSelectAllEvents(checkboxClass, selectAllId, deselectAllId) {
    const selectAllBtn = document.querySelector(selectAllId);
    const deselectAllBtn = document.querySelector(deselectAllId);

    if (selectAllBtn) {
      selectAllBtn.addEventListener("click", () => {
        document.querySelectorAll(checkboxClass).forEach((checkbox) => {
          checkbox.checked = true;
        });
      });
    }

    if (deselectAllBtn) {
      deselectAllBtn.addEventListener("click", () => {
        document.querySelectorAll(checkboxClass).forEach((checkbox) => {
          checkbox.checked = false;
        });
      });
    }
  }
  function createSelectAllButtons(
    selectAllId,
    deselectAllId,
    selectAllText = "Select All",
    deselectAllText = "Deselect All",
    selectAllColor = "#2196f3"
  ) {
    return `
        <div style="margin-bottom: 10px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
            <button id="${selectAllId}" style="background: ${selectAllColor}; color: white; border: 2px solid #333; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; width: 120px;">${selectAllText}</button>
            <button id="${deselectAllId}" style="background: #666; color: white; border: 2px solid #333; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; width: 120px;">${deselectAllText}</button>
        </div>
    `;
  }

  function getSelectedCheckboxes(checkboxClass) {
    return Array.from(
      document.querySelectorAll(`${checkboxClass}:checked`)
    ).map((checkbox) => {
      return checkbox.dataset.username;
    });
  }

  function injectTagUI() {
    const data = getData();
    const settings = getSettings();

    if (settings.showTopicTags) {
      document.querySelectorAll(".postAuthorName").forEach((userElem) => {
        const user = userElem.textContent.replace(/[^a-zA-Z0-9_]/g, "");
        const postAuthorInfo = userElem.closest(".postAuthorInfo");

        const existing = postAuthorInfo.querySelector(".customUserTag");
        if (existing) {
          existing.remove();
        }

        const tagDiv = createTagElement(user, data[user], {
          clickHandler: () => openEditor(user),
          customStyles: {
            "max-width": "100%",
          },
        });
        tagDiv.classList.add("customUserTag");

        userElem.parentNode.insertAdjacentElement("afterend", tagDiv);
      });
    }

    if (settings.showBoardlistTags) {
      document.querySelectorAll(".author a").forEach((userElem) => {
        const user = userElem.textContent.replace(/[^a-zA-Z0-9_]/g, "");
        const container = userElem.closest(".author");

        const existingDesktop = container.querySelector(
          ".customUserTag.desktop-only"
        );
        if (existingDesktop) {
          existingDesktop.remove();
        }

        const tagDivDesktop = createTagElement(user, data[user], {
          clickHandler: () => openEditor(user),
          customStyles: {
            "margin-top": "2px",
          },
        });
        tagDivDesktop.classList.add("customUserTag", "desktop-only");

        Object.assign(container.style, {
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
        });

        container.appendChild(tagDivDesktop);
      });

      document.querySelectorAll(".mobileBoardStats").forEach((statsElem) => {
        let user = null;
        const row = statsElem.closest("tr, .boardRow, .board-row, .row");
        if (row) {
          const authorLink = row.querySelector(".author a");
          if (authorLink) {
            user = authorLink.textContent.replace(/[^a-zA-Z0-9_]/g, "");
          }
        }
        if (!user) {
          const prevAuthor =
            statsElem.parentElement &&
            statsElem.parentElement.querySelector(".author a");
          if (prevAuthor) {
            user = prevAuthor.textContent.replace(/[^a-zA-Z0-9_]/g, "");
          }
        }
        if (!user) return;

        const existingMobile = statsElem.parentElement.querySelector(
          ".customUserTag.mobile-only"
        );
        if (existingMobile) {
          existingMobile.remove();
        }

        const tagDivMobile = createTagElement(user, data[user], {
          clickHandler: () => openEditor(user),
          customStyles: {
            "margin-top": "2px",
          },
        });
        tagDivMobile.classList.add("customUserTag", "mobile-only");

        statsElem.insertAdjacentElement("afterend", tagDivMobile);
      });
    }
  }

  function openEditor(username, returnToBrowser = false) {
    const data = getData();
    const settings = getSettings();
    const tag = data[username] || {
      text: "",
      style: {
        ...settings.defaultTagStyle,
      },
      notes: "",
    };

    const isNewTag = !data[username] || !username;

    const usernameInputHtml = `<input type="text" id="tag_username" value="${
      username || ""
    }" style="width: fit-content; padding: 1px; border: 1px solid #ccc; border-radius: 3px; font-family: 'Cafeteria', 'Arial Bold', sans-serif; font-size: 26px; color: #363636; text-align: center;" autocomplete="off" placeholder="username">`;

    const modalTitle = isNewTag
      ? `Creating tag for ${usernameInputHtml}`
      : `Editing tag for ${usernameInputHtml}`;

    const bodyContent = `
    <div id="tag_settings">
        <div style="margin-bottom: 12px;">
            <label style="font-weight: bold; display: block; margin-bottom: 3px;">Tag:</label>
            <input type="text" id="tag_text" style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 3px;" placeholder="Plain text or HTML">
        </div>
        <div style="margin-bottom: 12px;">
            <label style="margin-right: 20px;"><input type="checkbox" id="tag_bold" ${
              tag.style.bold ? "checked" : ""
            } style="margin-right: 5px;"> Bold</label>
            <label><input type="checkbox" id="tag_italic" ${
              tag.style.italic ? "checked" : ""
            } style="margin-right: 5px;"> Italic</label>
        </div>
        <div style="display: flex; gap: 15px; margin-bottom: 12px;">
            <div style="flex: 1;">
                <label style="font-weight: bold; display: block; margin-bottom: 3px;">Font Face:</label>
                <input type="text" id="tag_font" list="neosafe-fonts" value="${
                  tag.style.fontFace
                }" style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 3px;" placeholder="Example: Arial">
                <datalist id="neosafe-fonts">
  <option value="Arial">
  <option value="Verdana">
  <option value="Helvetica">
  <option value="Tahoma">
  <option value="Trebuchet MS">
  <option value="Times New Roman">
  <option value="Georgia">
  <option value="Garamond">
  <option value="Courier New">
  <option value="Brush Script MT">
  <option value="Lucida Console">
  <option value="Lucida Sans Unicode">
  <option value="Palatino Linotype">
  <option value="Impact">
  <option value="Comic Sans MS">
  <option value="Cafeteria">
</datalist>
            </div>
            <div style="flex: 1;">
                <label style="font-weight: bold; display: block; margin-bottom: 3px;">Font Size:</label>
                <input type="text" id="tag_size" value="${
                  tag.style.fontSize
                }" style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 3px;" placeholder="Example: 12px">
            </div>
<div style="flex: 1;">
            <label style="font-weight: bold; display: block; margin-bottom: 3px;">Font Color:</label>
            <input type="color" id="tag_color" value="${
              tag.style.fontColor
            }" style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 3px;">
</div>
        </div>
        <div style="display: flex; gap: 15px; margin-bottom: 12px;">
            <div style="flex: 1;">
                <label style="font-weight: bold; display: block; margin-bottom: 3px;">Border:</label>
                <input type="text" id="tag_border" value="${
                  tag.style.border
                }" style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 3px;" placeholder="Example: 2px solid black">
            </div>
            <div style="flex: 1;">
                <label style="font-weight: bold; display: block; margin-bottom: 3px;">Border Radius:</label>
                <input type="text" id="tag_radius" value="${
                  tag.style.borderRadius
                }" style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 3px;" placeholder="Example: 8px">
            </div>
        </div>
        <div style="display: flex; gap: 15px; margin-bottom: 12px;">
            <div style="flex: 1;">
                <label style="font-weight: bold; display: block; margin-bottom: 3px;">Background:</label>
                <input type="text" id="tag_bg" value="${
                  tag.style.background
                }" style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 3px;" placeholder="Example: #f3f3f3 OR url('IMGURL')">
            </div>
            <div style="flex: 1;">
                <label style="font-weight: bold; display: block; margin-bottom: 3px;">Padding:</label>
                <input type="text" id="tag_padding" value="${
                  tag.style.padding
                }" style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 3px;" placeholder="Example: 2px 4px">
            </div>
        </div>
        <div style="margin-bottom: 15px;">
            <label style="font-weight: bold; display: block; margin-bottom: 3px;">Notes:</label>
            <textarea id="tag_notes" style="width: 100%; height: 60px; padding: 4px; border: 1px solid #ccc; border-radius: 3px; resize: vertical;">${escapeHtml(
              tag.notes,
              true
            )}</textarea>
        </div>
    </div>
`;

    const footerContent = `
    <button id="save_tag" style="width: 85px; background: #4caf50; color: white; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600;">Save</button>
    ${
      !isNewTag && username
        ? '<button id="delete_tag" style="width: 85px; background: #d32f2f; color: white; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600;">Delete</button>'
        : ""
    }
    <button id="close_tag_editor" style="width: 85px; background: #666; color: white; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600;">Close</button>
`;

    createModal("user_tag_editor", modalTitle, bodyContent, footerContent);

    document.getElementById("tag_text").value = tag.text;

    document.getElementById("save_tag").addEventListener("click", () => {
      const newUsername = document.getElementById("tag_username").value.trim();
      if (!newUsername) {
        alert("Username cannot be empty.");
        return;
      }
      if (newUsername !== username && username) {
        if (data[newUsername]) {
          if (
            !confirm(`A tag for "${newUsername}" already exists. Overwrite it?`)
          ) {
            return;
          }
        }
        delete data[username];
      }
      data[newUsername] = {
        text: document.getElementById("tag_text").value,
        style: {
          border: document.getElementById("tag_border").value,
          borderRadius: document.getElementById("tag_radius").value,
          background: document.getElementById("tag_bg").value,
          fontFace: document.getElementById("tag_font").value,
          fontSize: document.getElementById("tag_size").value,
          fontColor: document.getElementById("tag_color").value,
          bold: document.getElementById("tag_bold").checked,
          italic: document.getElementById("tag_italic").checked,
          padding: document.getElementById("tag_padding").value,
        },
        notes: document.getElementById("tag_notes").value,
      };
      saveData(data);
      document.getElementById("user_tag_editor").remove();
      injectTagUI();

      if (returnToBrowser) {
        openTagBrowser();
      }
    });

    if (!isNewTag && username) {
      document.getElementById("delete_tag").addEventListener("click", () => {
        if (confirm(`Delete tag for ${username}?`)) {
          delete data[username];
          saveData(data);
          document.getElementById("user_tag_editor").remove();
          injectTagUI();

          if (returnToBrowser) {
            openTagBrowser();
          }
        }
      });
    }

    document
      .getElementById("close_tag_editor")
      .addEventListener("click", () => {
        document.getElementById("user_tag_editor").remove();
        if (returnToBrowser) {
          openTagBrowser();
        }
      });
  }

  function addCSS(css) {
    const style = document.createElement("style");
    style.type = "text/css";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function escapeHtml(text, fromEditor = false) {
    const div = document.createElement("div");
    div.textContent = text;
    return fromEditor ? div.innerHTML : div.innerHTML.replace(/\n/g, "<br>");
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

  function ensureSettingsMenuExists() {
    const subNav = document.querySelector(".navsub-left__2020");
    if (!subNav) return;
    if (subNav.querySelector("#settings_btn")) {
      const anchors = document.querySelector("#quick_settings");
      if (anchors) {
        anchors.innerHTML += ` | <a href='#UT-Settings'>User Tags</a>`;
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
        <div id="quick_settings"><a href='#UT-Settings'>User Tags</a></div>
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

  function addUserTaggerSettings() {
    ensureSettingsMenuExists();
    const settings = getSettings();
    const settings_none = document.getElementById("settings_none");
    if (settings_none) settings_none.remove();

    const settings_manage = `
        <div id="user-tags-header" class="settings-header">
        <h2 id='UT-Settings'>User Tags</h2>
        </div>
    <div class="settings-section">
        <h4>User Tag Display Settings:</h4>
        <table style="margin-left: auto; margin-right: auto;">
            <tr>
                <td><label for="showTopicTags">Show tags on topics:</label></td>
                <td><input type="checkbox" id="showTopicTags" name="showTopicTags" ${
                  settings.showTopicTags ? "checked" : ""
                }></td>
            </tr>
            <tr>
                <td><label for="showBoardlistTags">Show tags on board list:</label></td>
                <td><input type="checkbox" id="showBoardlistTags" name="showBoardlistTags" ${
                  settings.showBoardlistTags ? "checked" : ""
                }></td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center; padding-top: 10px;"><button id="saveDisplaySettingsButton" style="background: #e0e0e0; border: 2px solid #9f9f9f; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;">Save</button></td>
            </tr>
        </table>
    </div>

    <div class="settings-section">
        <h4>Default User Tag Style:</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
            <div>
                <label style="font-weight: bold; display: block; margin-bottom: 3px;">Font Face:</label>
                <input type="text" id="defaultFontFace" list="neosafe-fonts" value="${
                  settings.defaultTagStyle.fontFace
                }" style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 3px;" placeholder="Example: Arial">
                <datalist id="neosafe-fonts">
      <option value="Arial">
      <option value="Verdana">
      <option value="Helvetica">
      <option value="Tahoma">
      <option value="Trebuchet MS">
      <option value="Times New Roman">
      <option value="Georgia">
      <option value="Garamond">
      <option value="Courier New">
      <option value="Brush Script MT">
      <option value="Lucida Console">
      <option value="Lucida Sans Unicode">
      <option value="Palatino Linotype">
      <option value="Impact">
      <option value="Comic Sans MS">
      <option value="Cafeteria">
    </datalist>
            </div>
            <div>
                <label style="font-weight: bold; display: block; margin-bottom: 3px;">Font Size:</label>
                <input type="text" id="defaultFontSize" value="${
                  settings.defaultTagStyle.fontSize
                }" style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 3px;" placeholder="Example: 12px">
            </div>
            <div>
                <label style="font-weight: bold; display: block; margin-bottom: 3px;">Font Color:</label>
                <input type="color" id="defaultFontColor" value="${
                  settings.defaultTagStyle.fontColor
                }" style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 3px;">
            </div>
            <div>
                <label style="font-weight: bold; display: block; margin-bottom: 3px;">Background:</label>
                <input type="text" id="defaultBackground" value="${
                  settings.defaultTagStyle.background
                }" style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 3px;" placeholder="Example: #f3f3f3 OR url('IMGURL')">
            </div>
            <div>
                <label style="font-weight: bold; display: block; margin-bottom: 3px;">Border:</label>
                <input type="text" id="defaultBorder" value="${
                  settings.defaultTagStyle.border
                }" style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 3px;" placeholder="Example: 2px solid black">
            </div>
            <div>
                <label style="font-weight: bold; display: block; margin-bottom: 3px;">Border Radius:</label>
                <input type="text" id="defaultBorderRadius" value="${
                  settings.defaultTagStyle.borderRadius
                }" style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 3px;" placeholder="Example: 8px">
            </div>
            <div>
                <label style="font-weight: bold; display: block; margin-bottom: 3px;">Padding:</label>
                <input type="text" id="defaultPadding" value="${
                  settings.defaultTagStyle.padding
                }" style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 3px;" placeholder="Example: 2px 4px">
            </div>
            <div style="display: flex; flex-direction: row;gap: 5px; flex-wrap: wrap; align-items: center; justify-content: space-evenly;">
                <label style="font-weight: bold; display: block; margin-bottom: 3px; width: 100%;">Style:</label>
                <label><input type="checkbox" id="defaultBold" ${
                  settings.defaultTagStyle.bold ? "checked" : ""
                } style="margin-right: 5px;"> Bold</label>
                <label><input type="checkbox" id="defaultItalic" ${
                  settings.defaultTagStyle.italic ? "checked" : ""
                } style="margin-right: 5px;"> Italic</label>
            </div>
        </div>
        <div style="text-align: center;">
            <button id="saveDefaultTagSettingsButton" style="background: #e0e0e0; border: 2px solid #9f9f9f; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;">Save</button>
        </div>
    </div>

    <div class="settings-section">
        <h4>User Tag Management:</h4>
        <table style="margin-left: auto; margin-right: auto; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td colspan="1" style="text-align: center; width: 50%; padding: 2px;"><button id="chooseFileButton" style="width: 120px; height: 40px; background: #616161; color: white; border: 2px solid #363636; padding: 0px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">📁 Choose File</button><input type="file" id="importFileInput" accept=".json">
                    </td>
                    <td colspan="1" style="text-align: center; width: 50%; padding: 2px;"><button id="importTagsButton" style="width: 120px; height: 40px; background: #3f51b5; color: white; border: 2px solid #363636; padding: 0px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; box-sizing: border-box;">Import Tags</button>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: center; padding: 2px;"><button id="browseTagsButton" style="width: 248px; height: 40px; background: #23708c; color: white; border: 2px solid #363636; padding: 0px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; box-sizing: border-box;">Manage Existing Tags</button></td>
                </tr>
            </tbody>
        </table>
    </div>`;

    if (!document.getElementById("nes_settings")) return;
    document
      .getElementById("nes_settings")
      .insertAdjacentHTML("beforeend", settings_manage);

    setupSettingsEventListeners();
  }

  function setupSettingsEventListeners() {
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (target.id === "saveDisplaySettingsButton") {
        saveDisplaySettings();
      } else if (target.id === "saveDefaultTagSettingsButton") {
        saveDefaultTagSettings();
      } else if (target.id === "chooseFileButton") {
        document.getElementById("importFileInput").click();
      } else if (target.id === "importTagsButton") {
        document.getElementById("settings_pop").style.display = "none";
        importTags();
      } else if (target.id === "browseTagsButton") {
        document.getElementById("settings_pop").style.display = "none";
        openTagBrowser();
      }
    });

    document
      .getElementById("importFileInput")
      .addEventListener("change", function () {
        const fileInput = this;
        const button = document.getElementById("chooseFileButton");

        if (fileInput.files && fileInput.files[0]) {
          const fileName = fileInput.files[0].name;
          button.textContent = fileName;
          button.title = fileName;
        } else {
          button.textContent = "📁 Choose File";
          button.title = "";
        }
      });
  }

  function renderImportList(newTags, conflictingTags, currentData) {
    const listContainer = document.getElementById("import_browser_list");
    listContainer.innerHTML = "";

    if (Object.keys(newTags).length > 0) {
      const newSection = document.createElement("div");
      newSection.className = "import-section new-tags";
      newSection.innerHTML = `
                <h4>Found ${Object.keys(newTags).length} new ${tagWord(
        Object.keys(newTags).length
      )} - Choose which to add</h4>
                ${createSelectAllButtons(
                  "select_all_new",
                  "deselect_all_new",
                  "Select All",
                  "Deselect All",
                  "#4caf50"
                )}
                <div class="new-tags-list"></div>
            `;
      listContainer.appendChild(newSection);

      const newTagsList = newSection.querySelector(".new-tags-list");
      Object.keys(newTags)
        .sort()
        .forEach((username) => {
          const tagRow = createTagElement(username, newTags[username], {
            displayMode: "import",
            includeNotes: true,
            includeCheckbox: true,
            checkboxClass: "import-tag-checkbox new-tag-checkbox",
            checked: true,
            isClickable: false,
            containerClass: "new-tag-row",
          });
          newTagsList.appendChild(tagRow);
        });
    }

    if (Object.keys(conflictingTags).length > 0) {
      const conflictSection = document.createElement("div");
      conflictSection.className = "import-section conflicting-tags";
      conflictSection.innerHTML = `
                <h4>Found ${
                  Object.keys(conflictingTags).length
                } conflicting ${tagWord(
        Object.keys(conflictingTags).length
      )} - Choose which to overwrite</h4>
                ${createSelectAllButtons(
                  "select_all_conflicts",
                  "deselect_all_conflicts",
                  "Select All",
                  "Deselect All",
                  "#ff9800"
                )}
                <div class="conflicting-tags-list"></div>
            `;
      listContainer.appendChild(conflictSection);

      const conflictingTagsList = conflictSection.querySelector(
        ".conflicting-tags-list"
      );
      Object.keys(conflictingTags)
        .sort()
        .forEach((username) => {
          const tagRow = createTagElement(username, currentData[username], {
            displayMode: "conflict",
            conflictData: conflictingTags[username],
            includeCheckbox: true,
            checkboxClass: "import-tag-checkbox conflict-tag-checkbox",
            checked: false,
            isClickable: false,
          });
          conflictingTagsList.appendChild(tagRow);
        });
    }

    if (
      Object.keys(newTags).length === 0 &&
      Object.keys(conflictingTags).length === 0
    ) {
      listContainer.innerHTML =
        '<div style="text-align: center; padding: 20px; color: #666;">No tags to import.</div>';
    }
  }

  function injectTagUI() {
    const data = getData();
    const settings = getSettings();

    if (settings.showTopicTags) {
      injectTopicTags(data);
    }

    if (settings.showBoardlistTags) {
      injectBoardlistTags(data);
    }
  }

  function injectTopicTags(data) {
    document.querySelectorAll(".postAuthorName").forEach((userElem) => {
      const user = userElem.textContent.replace(/[^a-zA-Z0-9_]/g, "");
      const postAuthorInfo = userElem.closest(".postAuthorInfo");

      const existing = postAuthorInfo.querySelector(".customUserTag");
      if (existing) {
        existing.remove();
      }

      const tagDiv = createTagElement(user, data[user], {
        clickHandler: () => openEditor(user),
        customStyles: {
          "max-width": "100%",
        },
      });
      tagDiv.classList.add("customUserTag");

      userElem.parentNode.insertAdjacentElement("afterend", tagDiv);
    });
  }

  function injectBoardlistTags(data) {
    injectDesktopBoardlistTags(data);
    injectMobileBoardlistTags(data);
  }

  function injectDesktopBoardlistTags(data) {
    document.querySelectorAll(".author a").forEach((userElem) => {
      const user = userElem.textContent.replace(/[^a-zA-Z0-9_]/g, "");
      const container = userElem.closest(".author");

      const existingDesktop = container.querySelector(
        ".customUserTag.desktop-only"
      );
      if (existingDesktop) {
        existingDesktop.remove();
      }

      const tagDivDesktop = createTagElement(user, data[user], {
        clickHandler: () => openEditor(user),
        customStyles: {
          "margin-top": "2px",
        },
      });
      tagDivDesktop.classList.add("customUserTag", "desktop-only");

      Object.assign(container.style, {
        display: "flex",
        "flex-direction": "column",
        "align-items": "center",
      });

      container.appendChild(tagDivDesktop);
    });
  }

  function injectMobileBoardlistTags(data) {
    document.querySelectorAll(".mobileBoardStats").forEach((statsElem) => {
      let user = null;
      const row = statsElem.closest("tr, .boardRow, .board-row, .row");
      if (row) {
        const authorLink = row.querySelector(".author a");
        if (authorLink) {
          user = authorLink.textContent.replace(/[^a-zA-Z0-9_]/g, "");
        }
      }
      if (!user) {
        const prevAuthor =
          statsElem.parentElement &&
          statsElem.parentElement.querySelector(".author a");
        if (prevAuthor) {
          user = prevAuthor.textContent.replace(/[^a-zA-Z0-9_]/g, "");
        }
      }
      if (!user) return;

      const existingMobile = statsElem.parentElement.querySelector(
        ".customUserTag.mobile-only"
      );
      if (existingMobile) {
        existingMobile.remove();
      }

      const tagDivMobile = createTagElement(user, data[user], {
        clickHandler: () => openEditor(user),
        customStyles: {
          "margin-top": "2px",
        },
      });
      tagDivMobile.classList.add("customUserTag", "mobile-only");

      statsElem.insertAdjacentElement("afterend", tagDivMobile);
    });
  }

  function openImportBrowser(importedTags, importData) {
    const { newTags, conflictingTags, currentData } =
      processImportData(importedTags);
    const importedUsernames = Object.keys(importedTags);
    const newCount = Object.keys(newTags).length;
    const conflictCount = Object.keys(conflictingTags).length;
    const skippedCount = importedUsernames.length - newCount - conflictCount;

    const bodyContent = `
            <div id="import_browser_container">
                <div id="import_browser_list"></div>
            </div>
        `;

    const footerContent = `
            <button id="import_selected_tags" style="width: 85px; background: #3f51b5; color: white; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600;">Import</button>
            <button id="cancel_import" style="width: 85px; background: #666; color: white; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600;">Cancel</button>
        `;

    createModal(
      "import_browser",
      `Importing User Tags - File contains ${
        importedUsernames.length
      } ${tagWord(importedUsernames.length)}`,
      bodyContent,
      footerContent
    );

    if (newCount === 0 && conflictCount === 0) {
      document.getElementById("import_browser_list").innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666;">
                    ${
                      skippedCount > 0
                        ? `All tags in the import file are identical to your existing tags.<br>No import needed.`
                        : "No tags to import."
                    }
                </div>
            `;
      const importButton = document.getElementById("import_selected_tags");
      importButton.disabled = true;
      Object.assign(importButton.style, {
        opacity: "0.5",
      });
    } else {
      renderImportList(newTags, conflictingTags, currentData);
    }

    setupImportBrowserEvents(importedTags, currentData);
  }

  function openTagBrowser() {
    const data = getData();
    const usernames = Object.keys(data);

    const bodyContent = `
            <div style="position: sticky; top: 0px; z-index: 5;">
                ${createSelectAllButtons(
                  "select_all_tags",
                  "deselect_all_tags"
                )}
            </div>
            <div id="tag_browser_container">
                <div id="tag_browser_list"></div>
            </div>
        `;

    const footerContent = `
            <button id="add_new_tag" style="width: 85px; background: #4caf50; color: white; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600;">Create</button>
            <button id="export_selected_tags" style="width: 85px; background: #3f51b5; color: white; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600;">Export</button>
            <button id="delete_selected_tags" style="width: 85px; background: #d32f2f; color: white; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600;">Delete</button>
            <button id="close_tag_browser" style="width: 85px; background: #666; color: white; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600;">Close</button>
        `;

    createModal(
      "tag_browser",
      `Managing User Tags (${usernames.length} total)`,
      bodyContent,
      footerContent
    );

    const listContainer = document.getElementById("tag_browser_list");

    if (usernames.length === 0) {
      const noTagsMessage = document.createElement("div");
      noTagsMessage.style.textAlign = "center";
      noTagsMessage.style.padding = "20px";
      noTagsMessage.style.color = "#666";
      noTagsMessage.textContent =
        'No user tags found. Click "Create" to add a new tag.';
      listContainer.appendChild(noTagsMessage);
    } else {
      usernames.sort().forEach((username) => {
        const tagElement = createTagElement(username, data[username], {
          includeNotes: true,
          includeCheckbox: true,
          checkboxClass: "tag-preview-checkbox",
          clickHandler: () => {
            document.getElementById("tag_browser").remove();
            openEditor(username, true);
          },
        });
        listContainer.appendChild(tagElement);
      });
    }

    setupTagBrowserEvents();
  }

  function setupImportBrowserEvents(importedTags, currentData) {
    setupSelectAllEvents(
      ".new-tag-checkbox",
      "#select_all_new",
      "#deselect_all_new"
    );
    setupSelectAllEvents(
      ".conflict-tag-checkbox",
      "#select_all_conflicts",
      "#deselect_all_conflicts"
    );

    document
      .getElementById("import_selected_tags")
      .addEventListener("click", () => {
        const selectedUsernames = getSelectedCheckboxes(".import-tag-checkbox");
        executeImport(selectedUsernames, importedTags, currentData);
      });

    document.getElementById("cancel_import").addEventListener("click", () => {
      document.getElementById("import_browser").remove();
    });
  }

  function setupTagBrowserEvents() {
    setupSelectAllEvents(
      ".tag-preview-checkbox",
      "#select_all_tags",
      "#deselect_all_tags"
    );

    document
      .getElementById("delete_selected_tags")
      .addEventListener("click", () => {
        const selected = getSelectedCheckboxes(".tag-preview-checkbox");

        if (selected.length === 0) {
          alert("No tags selected for deletion.");
          return;
        }

        if (
          confirm(
            `Delete ${selected.length} selected ${tagWord(selected.length)}?`
          )
        ) {
          const data = getData();
          selected.forEach((username) => {
            delete data[username];
          });
          saveData(data);
          noticePopup(
            `${selected.length} ${tagWord(selected.length)} deleted.`
          );
          openTagBrowser();
          injectTagUI();
        }
      });

    document.getElementById("add_new_tag").addEventListener("click", () => {
      document.getElementById("tag_browser").remove();
      openEditor("", true);
    });

    document
      .getElementById("export_selected_tags")
      .addEventListener("click", () => {
        const selectedUsernames = getSelectedCheckboxes(
          ".tag-preview-checkbox"
        );
        exportSelectedTags(selectedUsernames);
      });

    document
      .getElementById("close_tag_browser")
      .addEventListener("click", () =>
        document.getElementById("tag_browser").remove()
      );
  }

  addCSS(cssText);
  injectTagUI();
  addUserTaggerSettings();
})();
