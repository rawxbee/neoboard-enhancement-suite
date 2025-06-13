// ==UserScript==
// @name         Neoboards: Bookmarks and History
// @version      2.0.0
// @author       sunbathr & rawbeee
// @description  Bookmark boards and thread and keep track of threads you have visited recently. Look for the settings gear in the buffer to edit colors.
// @match        *://www.neopets.com/neoboards/*
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://images.neopets.com/themes/h5/altadorcup/images/settings-icon.png
// @run-at       document-end
// ==/UserScript==

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
    features: getValue("featureSettings", {
      enableBoards: true,
      enableThreads: true,
      enableRecents: true,
    }),

    bookmarkSettings: getValue("bookmarkSettings", {
      barColor: "#02517b",
      barTextColor: "#ffffff",
      linkTextColor: "#02517b",
      buttonColor: "#02517b",
      buttonTextColor: "#ffffff",
      borderColor: "#02517b",
      borderEnabled: true,
    }),

    recentSettings: getValue("recentSettings", {
      barColor: "#6f8d97",
      barTextColor: "#ffffff",
      linkTextColor: "#6f8d97",
      borderColor: "#6f8d97",
      borderEnabled: true,
      threadLimit: 20,
    }),

    boardSettings: getValue("boardSettings", {
      addButtonColor: "#02517b",
      addButtonTextColor: "#ffffff",
      enableBoardEditing: true,
    }),
  };
}

const css = `
@media screen and (max-width: 700px) {
    .bookmarkButton {
        margin: auto !important;
    }
}
@media screen and (max-width: 480px) {
    .boardDesc {
        flex-direction: column;
    }
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
.authorTitle {
margin-left: 4px;
}
/* Button hover contrast filter */
button:hover,
.bookmarkButton:hover,
.addBoardButton:hover,
.deleteBookmarkButton:hover,
.deleteRecentsButton:hover,
.deleteBookmarksButton:hover,
.orderButton:hover,
.moveLeftButton:hover,
.moveRightButton:hover,
.removeBoardButton:hover,
.saveEditsButton:hover,
#saveFeatureSettings:hover,
#saveBoardSettings:hover,
#saveBookmarkedThreadSettings:hover,
#saveRecentSettings:hover,
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
      anchors.innerHTML += ` | <a href='#BH-Settings'>Bookmarks and History</a>`;
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
    <div id="quick_settings"><a href='#BH-Settings'>Bookmarks and History</a></div>
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

function extractBoardDetails(buttonParent, rearranging) {
  if (buttonParent) {
    if (buttonParent.classList.contains("boardDesc")) {
      const title = buttonParent.querySelector("a").innerText;
      const url = buttonParent.querySelector("a").href.replace(/&next=\d+/, "");
      const imageUrl = getComputedStyle(
        buttonParent.previousSibling.firstChild
      ).backgroundImage.replace(/url\(["']?(.*?)["']?\)/, "$1");
      return { title, url, imageUrl };
    }

    if (buttonParent.classList.contains("boardTitle")) {
      const title = buttonParent.querySelector("h1").textContent;
      const url = buttonParent.querySelector("a").href.replace(/&next=\d+/, "");
      const imageUrl = getComputedStyle(
        buttonParent.querySelector(".boardTitleIcon")
      ).backgroundImage.replace(/url\(["']?(.*?)["']?\)/, "$1");
      return { title, url, imageUrl };
    }
  }
  if (rearranging) {
    const boards = document.querySelectorAll(".bookmarkedBoard");
    const rearranged = [];
    boards.forEach((board) => {
      const title = board.querySelector("img").title;
      const url = board.querySelector("a").href.replace(/&next=\d+/, "");
      const imageUrl = board.querySelector("img").src;
      const topicDetails = { title, url, imageUrl };
      rearranged.push(topicDetails);
    });
    return rearranged;
  }
}

function extractTopicDetails() {
  const topicTitle = document.querySelector(".topicTitle");
  if (!topicTitle) return;

  const title = topicTitle
    .querySelector("a:nth-child(2) > h1")
    .innerHTML.replace(/^Topic:\s*/, "");
  const url = topicTitle
    .querySelector("a:nth-child(2)")
    .href.replace(/&next=\d+/, "");
  return { title, url };
}

function getLatestBoards() {
  const latestBoards = getValue("boards", []);
  return latestBoards;
}

function getLatestBookmarks() {
  const latestBookmarks = getValue("bookmarks", []);
  return latestBookmarks;
}

function getLatestRecentThreads() {
  const latestRecentThreads = getValue("recents", []);
  return latestRecentThreads;
}

function checkBoardBookmarksStorage(boardDetails) {
  const boards = getValue("boards", []);
  return boards.some((b) => b.url === boardDetails.url);
}

function checkBookmarksStorage(topicDetails) {
  const bookmarks = getValue("bookmarks", []);
  return bookmarks.some((b) => b.url === topicDetails.url);
}

function checkRecentThreadsStorage(topicDetails) {
  const recentThreads = getValue("recents", []);
  return recentThreads.some((b) => b.url === topicDetails.url);
}

function updateBookmarkedBoards(boardDetails, button, rearranging) {
  const enabled = settingsValues.features.enableBoards;
  if (!enabled) return;

  const latestBoards = getLatestBoards();

  if (rearranging) {
    const latestBookmarks = extractBoardDetails(false, rearranging);
    setValue("boards", latestBookmarks);
    document
      .querySelectorAll(".addBoardButton, .addBoardButton")
      .forEach((button) => button.remove());
    createAddBoardButton();
    createOrderButton();
  }

  if (boardDetails) {
    const isBookmarked = checkBoardBookmarksStorage(boardDetails);

    if (isBookmarked) {
      const idx = latestBoards.findIndex((b) => b.url === boardDetails.url);
      if (idx !== -1) latestBoards.splice(idx, 1);
    } else {
      latestBoards.push(boardDetails);
    }
    setValue("boards", latestBoards);
    setBookmarkBoardButton(button, !isBookmarked);

    const saveEditsButton = document.querySelector(".saveEditsButton");
    if (saveEditsButton) {
      saveEditsButton.remove();
    }
  }
}

function updateBookmarkedThreads(topicDetails, bookmarkButton) {
  const enabled = settingsValues.features.enableThreads;
  if (!enabled) return;

  const latestBookmarks = getLatestBookmarks();
  const isBookmarked = checkBookmarksStorage(topicDetails);

  if (isBookmarked) {
    const idx = latestBookmarks.findIndex((b) => b.url === topicDetails.url);
    if (idx !== -1) latestBookmarks.splice(idx, 1);
  }

  if (!isBookmarked && bookmarkButton) {
    latestBookmarks.push(topicDetails);
  }
  setValue("bookmarks", latestBookmarks);
  if (bookmarkButton) {
    setBookmarkThreadButton(bookmarkButton, !isBookmarked);
  }
}

function updateRecentThreads() {
  const enabled = settingsValues.features.enableRecents;
  if (!enabled) return;

  const topicDetails = extractTopicDetails();
  if (!topicDetails) return;

  const latestRecentThreads = getLatestRecentThreads();
  const idx = latestRecentThreads.findIndex((b) => b.url === topicDetails.url);

  if (idx !== -1) {
    latestRecentThreads.splice(idx, 1);
  }

  latestRecentThreads.unshift(topicDetails);

  latestRecentThreads.length = Math.min(
    latestRecentThreads.length,
    settingsValues.recentSettings.threadLimit
  );

  setValue("recents", latestRecentThreads);
}

function createBookmarkedBoardList() {
  const bookmarkedBoards = getLatestBoards();
  const container = document.createElement("div");

  bookmarkedBoards.forEach((board) => {
    const boardDiv = document.createElement("div");
    boardDiv.className = "bookmarkedBoard";
    Object.assign(boardDiv.style, {
      border: "1px #efefef solid",
      padding: "7px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    });

    const link = document.createElement("a");
    link.href = board.url;

    const img = document.createElement("img");
    img.src = board.imageUrl;
    img.title = board.title;

    link.appendChild(img);
    boardDiv.appendChild(link);
    container.appendChild(boardDiv);
  });

  return container.innerHTML;
}

function createBookmarkedThreadList() {
  const bookmarkedThreads = getLatestBookmarks();
  const fragment = document.createDocumentFragment();

  bookmarkedThreads.forEach((thread) => {
    const threadDiv = document.createElement("div");
    Object.assign(threadDiv.style, {
      width: "100%",
      position: "relative",
      border: "1px #efefef solid",
      fontSize: "14px",
      textAlign: "center",
      boxSizing: "border-box",
      padding: "10px 35px",
    });
    threadDiv.className = "bookmarkedThread";

    const link = document.createElement("a");
    link.href = thread.url;
    link.style.color = settingsValues.bookmarkSettings.linkTextColor;
    link.innerHTML = thread.title;

    const deleteBookmarkButton = document.createElement("button");
    deleteBookmarkButton.type = "button";
    deleteBookmarkButton.className = "deleteBookmarkButton";
    deleteBookmarkButton.textContent = "X";
    Object.assign(deleteBookmarkButton.style, {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      border: "none",
      borderRadius: "4px",
      backgroundColor: "#bf5454",
      padding: "3px 6px",
      color: "white",
      fontWeight: "600",
      cursor: "pointer",
    });

    threadDiv.append(link, deleteBookmarkButton);

    deleteBookmarkButton.addEventListener("click", function () {
      const confirmDelete = confirm(
        "Are you sure you want to delete this bookmark?"
      );
      if (!confirmDelete) return;
      const url = thread.url;
      const currentUrl = window.location.href;
      const bookmarkButton = document.querySelector(".bookmarkButton");
      if (bookmarkButton && currentUrl === url) {
        updateBookmarkedThreads({ url }, bookmarkButton);
        setBookmarkThreadButton(bookmarkButton, false);
        const bookmarkedThreadsHTML = createBookmarkedThreadList();
        setBookmarkedThreadList(bookmarkedThreadsHTML);
      } else {
        updateBookmarkedThreads({ url }, false);
        const bookmarkedThreadsHTML = createBookmarkedThreadList();
        setBookmarkedThreadList(bookmarkedThreadsHTML);
      }
      setThreadBorders();
      noticePopup("Bookmark removed!");
    });
    fragment.appendChild(threadDiv);
  });

  return fragment;
}

function createRecentThreadList() {
  const recentThreads = getLatestRecentThreads();
  const container = document.createElement("div");

  recentThreads.forEach((thread) => {
    const threadDiv = document.createElement("div");
    threadDiv.className = "recentThread";

    Object.assign(threadDiv.style, {
      width: "100%",
      border: "1px #efefef solid",
      fontSize: "14px",
      textAlign: "center",
      boxSizing: "border-box",
      padding: "10px",
    });

    const link = document.createElement("a");
    link.href = thread.url;
    link.style.color = settingsValues.recentSettings.linkTextColor;
    link.innerHTML = thread.title;

    threadDiv.appendChild(link);
    container.appendChild(threadDiv);
  });

  return container.innerHTML;
}

function createOrderButton() {
  const enabled =
    settingsValues.features.enableBoards &&
    settingsValues.boardSettings.enableBoardEditing;
  if (!enabled) return;

  const totalBoards = document.querySelectorAll(".bookmarkedBoard").length;

  if (totalBoards > 1) {
    const orderButtonDiv = document.createElement("div");
    orderButtonDiv.className = "orderButtonDiv";

    Object.assign(orderButtonDiv.style, {
      border: "1px #efefef solid",
      padding: "7px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    });

    const orderButton = document.createElement("button");
    orderButton.type = "button";
    orderButton.className = "orderButton";
    orderButton.innerHTML = "Edit";

    Object.assign(orderButton.style, {
      height: "50px",
      width: "50px",
      border: "none",
      cursor: "pointer",
      color: "#b7b7b7",
      display: "flex",
      flexDirection: "row",
      alignContent: "center",
      flexWrap: "wrap",
      justifyContent: "center",
    });
    orderButton.addEventListener("click", function () {
      setBoardEditingButtons();
      orderButtonDiv.remove();
    });

    orderButtonDiv.append(orderButton);
    const bookmarkedBoards = document.querySelector(".bookmarkedBoards");
    bookmarkedBoards.append(orderButtonDiv);
  }
}

function createAddBoardButton() {
  const enabled = settingsValues.features.enableBoards;
  if (!enabled) return;
  const boardIndex = document.querySelector("#boardIndex");
  if (boardIndex) {
    for (const board of boardIndex.querySelectorAll(
      "li .boardDesc:not(.premiumBoardDesc)"
    )) {
      const title = board.querySelector("a").innerText;
      const url = board.querySelector("a").href.replace(/&next=\d+/, "");
      const imageUrl = getComputedStyle(
        board.previousSibling.firstChild
      ).backgroundImage.replace(/url\(["']?(.*?)["']?\)/, "$1");
      const boardDetails = { title, url, imageUrl };
      const isBookmarked = checkBoardBookmarksStorage(boardDetails);

      const addBoardButton = document.createElement("button");
      addBoardButton.type = "button";
      addBoardButton.className = "addBoardButton";
      addBoardButton.innerHTML = `${isBookmarked ? "REMOVE" : "ADD"}`;
      Object.assign(addBoardButton.style, {
        width: "80px",
        height: "20px",
        marginTop: "10px",
        boxSizing: "border-box",
        border: "none",
        borderRadius: "4px",
        paddingTop: "4px",
        display: "flex",
        justifyContent: "center",
        backgroundColor: settingsValues.boardSettings.addButtonColor,
        color: settingsValues.boardSettings.addButtonTextColor,
        fontSize: "12px",
        fontWeight: "600",
        fontFamily: "'MuseoSansRounded500', 'Arial', sans-serif",
        cursor: "pointer",
      });
      setBookmarkBoardButton(addBoardButton, isBookmarked);
      board.append(addBoardButton);
    }
  }

  const boardList = document.querySelector("#boardList");
  if (boardList) {
    const board = boardList.querySelector(".boardTitle");
    const title = board.querySelector("h1").textContent;
    const url = board.querySelector("a").href.replace(/&next=\d+/, "");
    const imageUrl = getComputedStyle(
      board.querySelector(".boardTitleIcon")
    ).backgroundImage.replace(/url\(["']?(.*?)["']?\)/, "$1");
    const boardDetails = { title, url, imageUrl };
    const isBookmarked = checkBoardBookmarksStorage(boardDetails);

    const addBoardButton = document.createElement("button");
    addBoardButton.type = "button";
    addBoardButton.className = "addBoardButton";
    Object.assign(addBoardButton.style, {
      width: "80px",
      height: "20px",
      marginTop: "9px",
      marginLeft: "-92px",
      position: "absolute",
      boxSizing: "border-box",
      border: "none",
      borderRadius: "4px",
      paddingTop: "4px",
      display: "inline-block",
      backgroundColor: settingsValues.boardSettings.addButtonColor,
      color: settingsValues.boardSettings.addButtonTextColor,
      fontSize: "12px",
      fontWeight: "600",
      fontFamily: "'MuseoSansRounded500', 'Arial', sans-serif",
      cursor: "pointer",
    });
    setBookmarkBoardButton(addBoardButton, isBookmarked);
    const h1 = board.querySelector("h1");
    h1.style.setProperty("width", "auto", "important");
    h1.style.setProperty("margin-right", "105px", "important");
    board.querySelector("a").after(addBoardButton);
  }
  const addBoardButton = document.querySelectorAll(".addBoardButton");
  if (addBoardButton) {
    for (const button of addBoardButton) {
      button.addEventListener("click", function () {
        const buttonParent = button.parentElement;
        const boardDetails = extractBoardDetails(buttonParent, false);
        if (!boardDetails) return;

        updateBookmarkedBoards(boardDetails, button);

        const bookmarkedBoardsHTML = createBookmarkedBoardList();
        setBookmarkedBoardList(bookmarkedBoardsHTML);
      });
    }
  }
}

function createBookmarkThreadButton() {
  const enabled = settingsValues.features.enableThreads;
  if (!enabled) return;

  const topicDetails = extractTopicDetails();
  if (!topicDetails) return;

  const isBookmarked = checkBookmarksStorage(topicDetails);
  const bookmarkButton = document.createElement("button");
  bookmarkButton.type = "button";
  bookmarkButton.className = "bookmarkButton";
  Object.assign(bookmarkButton.style, {
    width: "100%",
    margin: "3px",
    width: "215px",
    height: "31px",
    boxSizing: "border-box",
    border: "none",
    borderRadius: "4px",
    paddingBottom: "35px",
    display: "flex",
    justifyContent: "center",
    backgroundColor: settingsValues.bookmarkSettings.buttonColor,
    color: settingsValues.bookmarkSettings.buttonTextColor,
    fontSize: "12px",
    fontWeight: "600",
    fontFamily: "'MuseoSansRounded500', 'Arial', sans-serif",
    cursor: "pointer",
  });

  setBookmarkThreadButton(bookmarkButton, isBookmarked);

  const topicTitle = document.querySelector(".topicTitle");
  topicTitle.parentNode.insertBefore(bookmarkButton, topicTitle.nextSibling);
}

function createBookmarkAndHistorySection() {
  const enabled =
    settingsValues.features.enableBoards ||
    settingsValues.features.enableThreads ||
    settingsValues.features.enableRecents;
  if (!enabled) return;

  const boardContainer = document.querySelector(
    "#boardIndex, #boardList, #boardTopic"
  );
  if (boardContainer) {
    const bookmarkAndHistorySection = document.createElement("div");
    bookmarkAndHistorySection.className = "bookmarkAndHistorySection";
    bookmarkAndHistorySection.style.width = "100%";
    bookmarkAndHistorySection.style.marginTop = "8px";
    boardContainer.parentNode.insertBefore(
      bookmarkAndHistorySection,
      boardContainer
    );

    createBoardSection();
    createBookmarkedSection();
    createRecentsSection();
  }
}

function createBoardSection() {
  const enabled = settingsValues.features.enableBoards;
  if (!enabled) return;

  const bookmarkAndHistorySection = document.querySelector(
    ".bookmarkAndHistorySection"
  );
  if (!bookmarkAndHistorySection) return;

  const bookmarkedBoardsDiv = document.createElement("div");
  bookmarkedBoardsDiv.className = "bookmarkedBoards";
  Object.assign(bookmarkedBoardsDiv.style, {
    width: "95%",
    margin: "10px auto",
    minWidth: "200px",
    maxWidth: "792px",
    boxSizing: "border-box",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
  });

  const bookmarkedBoardsHTML = createBookmarkedBoardList();
  if (bookmarkedBoardsHTML) {
    bookmarkedBoardsDiv.innerHTML = bookmarkedBoardsHTML;
  }

  bookmarkAndHistorySection.appendChild(bookmarkedBoardsDiv);
}

function createBookmarkedSection() {
  const enabled = settingsValues.features.enableThreads;
  if (!enabled) return;

  const bookmarkAndHistorySection = document.querySelector(
    ".bookmarkAndHistorySection"
  );
  if (!bookmarkAndHistorySection) return;

  const bookmarkedCollapsible = document.createElement("button");
  bookmarkedCollapsible.type = "button";
  bookmarkedCollapsible.className = "bookmarkedCollapsible";
  bookmarkedCollapsible.innerHTML = "Bookmarked Threads";
  Object.assign(bookmarkedCollapsible.style, {
    width: "95%",
    margin: "10px auto 0  auto",
    minWidth: "200px",
    maxWidth: "792px",
    border: "none",
    borderRadius: "4px",
    padding: "5px",
    display: "flex",
    justifyContent: "center",
    backgroundColor: settingsValues.bookmarkSettings.barColor,
    color: settingsValues.bookmarkSettings.barTextColor,
    fontSize: "15px",
    fontWeight: "600",
    fontFamily: "'MuseoSansRounded500', 'Arial', sans-serif",
    cursor: "pointer",
  });

  const bookmarkedCollapsedContent = document.createElement("div");
  bookmarkedCollapsedContent.className = "bookmarkedCollapsedContent";
  Object.assign(bookmarkedCollapsedContent.style, {
    display: "none",
    width: "95%",
    minWidth: "200px",
    maxWidth: "792px",
    boxSizing: "border-box",
    margin: "auto",
    justifyContent: "center",
    flexDirection: "column",
  });

  const bookmarkedRows = document.createElement("div");
  bookmarkedRows.className = "bookmarkedRows";
  Object.assign(bookmarkedRows.style, {
    display: "flex",
    width: "100%",
    margin: "6px auto 3px auto",
    justifyContent: "center",
    flexDirection: "column",
    gap: "3px",
    alignItems: "center",
    fontFamily: "'MuseoSansRounded500', 'Arial', sans-serif",
  });

  const deleteBookmarksButton = document.createElement("button");
  deleteBookmarksButton.type = "button";
  deleteBookmarksButton.className = "deleteBookmarksButton";
  deleteBookmarksButton.innerHTML = "Delete Bookmarks";
  Object.assign(deleteBookmarksButton.style, {
    display: "none",
    margin: "6px auto 3px auto",
    width: "200px",
    boxSizing: "border-box",
    justifyContent: "center",
    border: "none",
    borderRadius: "4px",
    padding: "5px",
    justifyContent: "center",
    backgroundColor: "#bf5454",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "'MuseoSansRounded500', 'Arial', sans-serif",
    cursor: "pointer",
  });

  const bookmarkedThreadsHTML = createBookmarkedThreadList();

  const noBookmarks = document.createElement("div");
  noBookmarks.className = "noBookmarks";
  noBookmarks.innerHTML = "Empty";
  Object.assign(noBookmarks.style, {
    width: "100%",
    border: "1px #efefef solid",
    fontSize: "14px",
    color: "#b7b7b7",
    textAlign: "center",
    boxSizing: "border-box",
    padding: "10px",
  });

  const hasBookmarks = bookmarkedThreadsHTML.childNodes.length > 0;

  if (!hasBookmarks) {
    bookmarkedRows.appendChild(noBookmarks);
  } else {
    bookmarkedRows.appendChild(bookmarkedThreadsHTML);
  }

  bookmarkedCollapsedContent.appendChild(bookmarkedRows);

  bookmarkedCollapsedContent.appendChild(deleteBookmarksButton);
  deleteBookmarksButton.style.display = hasBookmarks ? "flex" : "none";

  bookmarkAndHistorySection.appendChild(bookmarkedCollapsible);

  bookmarkAndHistorySection.appendChild(bookmarkedCollapsedContent);
}

function createRecentsSection() {
  const enabled = settingsValues.features.enableRecents;
  if (!enabled) return;

  const bookmarkAndHistorySection = document.querySelector(
    ".bookmarkAndHistorySection"
  );
  if (!bookmarkAndHistorySection) return;

  const recentCollapsible = document.createElement("button");
  recentCollapsible.type = "button";
  recentCollapsible.className = "recentCollapsible";
  recentCollapsible.innerHTML = "Recent Threads";
  Object.assign(recentCollapsible.style, {
    width: "95%",
    margin: "10px auto 0  auto",
    minWidth: "200px",
    maxWidth: "792px",
    border: "none",
    borderRadius: "4px",
    padding: "5px",
    display: "flex",
    justifyContent: "center",
    backgroundColor: settingsValues.recentSettings.barColor,
    color: settingsValues.recentSettings.barTextColor,
    fontSize: "15px",
    fontWeight: "600",
    fontFamily: "'MuseoSansRounded500', 'Arial', sans-serif",
    cursor: "pointer",
  });

  const recentCollapsedContent = document.createElement("div");
  recentCollapsedContent.className = "recentCollapsedContent";
  Object.assign(recentCollapsedContent.style, {
    display: "none",
    width: "95%",
    minWidth: "200px",
    maxWidth: "792px",
    boxSizing: "border-box",
    margin: "auto",
    justifyContent: "center",
    flexDirection: "column",
  });

  const recentRows = document.createElement("div");
  recentRows.className = "recentRows";
  Object.assign(recentRows.style, {
    display: "flex",
    width: "100%",
    margin: "6px auto 3px auto",
    justifyContent: "center",
    flexDirection: "column",
    gap: "3px",
    alignItems: "center",
    fontFamily: "'MuseoSansRounded500', 'Arial', sans-serif",
  });

  const deleteRecentsButton = document.createElement("button");
  deleteRecentsButton.type = "button";
  deleteRecentsButton.className = "deleteRecentsButton";
  deleteRecentsButton.innerHTML = "Clear Recent Threads";
  Object.assign(deleteRecentsButton.style, {
    display: "none",
    margin: "6px auto 3px auto",
    width: "200px",
    boxSizing: "border-box",
    justifyContent: "center",
    border: "none",
    borderRadius: "4px",
    padding: "5px",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#bf5454",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "'MuseoSansRounded500', 'Arial', sans-serif",
    cursor: "pointer",
  });

  const recentThreadsHTML = createRecentThreadList();

  recentRows.innerHTML =
    recentThreadsHTML ||
    `<div class="noBookmarks" style="width: 100%; border: 1px #efefef solid; font-size: 14px; color: #b7b7b7; text-align: center; box-sizing: border-box; padding: 10px;">
                Empty
            </div>`;

  recentCollapsedContent.appendChild(recentRows);

  recentCollapsedContent.appendChild(deleteRecentsButton);
  deleteRecentsButton.style.display = recentThreadsHTML ? "flex" : "none";

  bookmarkAndHistorySection.appendChild(recentCollapsible);

  bookmarkAndHistorySection.appendChild(recentCollapsedContent);
}

function addSettings() {
  ensureSettingsMenuExists();

  const settingsNone = document.getElementById("settings_none");
  if (settingsNone) settingsNone.remove();

  var nesSettings = document.getElementById("nes_settings");
  if (!nesSettings) return;

  if (nesSettings.dataset.bookmarkSettingsAdded === "1") return;
  nesSettings.dataset.bookmarkSettingsAdded = "1";

  const settingsContainer = document.createElement("div");
  settingsContainer.id = "bookmarks-history-settings";
  settingsContainer.className = "settings-container";
  settingsContainer.innerHTML =
    "<h2 id='BH-Settings'>Bookmarks and History</h2>";

  const settingsSection1 = document.createElement("div");
  settingsSection1.id = "BH-features-settings";
  settingsSection1.className = "settings-section";
  settingsSection1.innerHTML = `<h4 style="margin-bottom: 10px;">Features:</h4>
        <div class="bookmark-grid">
            <label for="EnableBoards">Board Bookmarks:</label>
            <input type="checkbox" id="EnableBoards" ${
              settingsValues.features.enableBoards ? "checked" : ""
            }>

            <label for="EnableThreads">Thread Bookmarks:</label>
            <input type="checkbox" id="EnableThreads" ${
              settingsValues.features.enableThreads ? "checked" : ""
            }>

            <label for="EnableRecents">Recent Threads:</label>
            <input type="checkbox" id="EnableRecents" ${
              settingsValues.features.enableRecents ? "checked" : ""
            }>
        </div>
        <div style="text-align:center;margin-top:8px;">
            <button id="saveFeatureSettings" style="background: #e0e0e0; border: 2px solid #9f9f9f; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;">Save</button>
        </div>`;

  settingsContainer.appendChild(settingsSection1);

  if (settingsValues.features.enableBoards) {
    const settingsSection2 = document.createElement("div");
    settingsSection2.id = "BH-boards-customization";
    settingsSection2.className = "settings-section";
    settingsSection2.innerHTML = `<h4 style="margin-bottom: 10px;">Bookmarked Boards:</h4>
        <div class="bookmark-grid">
            <label for="BoardAddButton">Add Button:</label>
            <input type="color" id="BoardAddButton" name="BoardAddButton" value="${
              settingsValues.boardSettings.addButtonColor
            }">

            <label for="BoardAddButtonText">Add Button Text:</label>
            <input type="color" id="BoardAddButtonText" name="BoardAddButtonText" value="${
              settingsValues.boardSettings.addButtonTextColor
            }">

            <label for="BoardEditingEnabled">Enable Board Editing:</label>
            <input type="checkbox" id="BoardEditingEnabled" ${
              settingsValues.boardSettings.enableBoardEditing ? "checked" : ""
            }>
        </div>
        <div style="text-align:center;margin-top:8px;">
            <button id="saveBoardSettings" style="background: #e0e0e0; border: 2px solid #9f9f9f; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;">Save</button>
        </div>`;

    settingsContainer.appendChild(settingsSection2);
  }

  if (settingsValues.features.enableThreads) {
    const settingsSection3 = document.createElement("div");
    settingsSection3.id = "BH-bookmarks-customization";
    settingsSection3.className = "settings-section";
    settingsSection3.innerHTML = `<h4 style="margin-bottom: 10px;">Bookmarked Threads:</h4>
        <div class="bookmark-grid">
            <label for="BookmarkBar">Bar:</label>
            <input type="color" id="BookmarkBar" name="BookmarkBar" value="${
              settingsValues.bookmarkSettings.barColor
            }">

            <label for="BookmarkBarText">Bar Header Text:</label>
            <input type="color" id="BookmarkBarText" name="BookmarkBarText" value="${
              settingsValues.bookmarkSettings.barTextColor
            }">

            <label for="BookmarkLink">Links:</label>
            <input type="color" id="BookmarkLink" name="BookmarkLink" value="${
              settingsValues.bookmarkSettings.linkTextColor
            }">

            <label for="BookmarkButton">Bookmark Button:</label>
            <input type="color" id="BookmarkButton" name="BookmarkButton" value="${
              settingsValues.bookmarkSettings.buttonColor
            }">

            <label for="BookmarkButtonText">Bookmark Button Text:</label>
            <input type="color" id="BookmarkButtonText" name="BookmarkButtonText" value="${
              settingsValues.bookmarkSettings.buttonTextColor
            }">

            <label for="BookmarkBorder">Border:</label>
            <input type="color" id="BookmarkBorder" name="BookmarkBorder" value="${
              settingsValues.bookmarkSettings.borderColor
            }">

            <label for="BookmarkBorderEnabled">Show Borders:</label>
            <input type="checkbox" id="BookmarkBorderEnabled" ${
              settingsValues.bookmarkSettings.borderEnabled ? "checked" : ""
            }>
        </div>
        <div style="text-align:center;margin-top:8px;">
            <button id="saveBookmarkedThreadSettings" style="background: #e0e0e0; border: 2px solid #9f9f9f; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;">Save</button>
        </div>`;

    settingsContainer.appendChild(settingsSection3);
  }

  if (settingsValues.features.enableRecents) {
    const settingsSection4 = document.createElement("div");
    settingsSection4.id = "BH-recents-customization";
    settingsSection4.className = "settings-section";
    settingsSection4.innerHTML = `<h4 style="margin-bottom: 10px;">Recent Threads:</h4>
        <div class="bookmark-grid">
            <label for="RecentBar">Bar:</label>
            <input type="color" id="RecentBar" name="RecentBar" value="${
              settingsValues.recentSettings.barColor
            }">

            <label for="RecentBarText">Bar Header Text:</label>
            <input type="color" id="RecentBarText" name="RecentBarText" value="${
              settingsValues.recentSettings.barTextColor
            }">

            <label for="RecentLink">Links:</label>
            <input type="color" id="RecentLink" name="RecentLink" value="${
              settingsValues.recentSettings.linkTextColor
            }">

            <label for="RecentBorder">Border:</label>
            <input type="color" id="RecentBorder" name="RecentBorder" value="${
              settingsValues.recentSettings.borderColor
            }">

            <label for="RecentBorderEnabled">Show Borders:</label>
            <input type="checkbox" id="RecentBorderEnabled" ${
              settingsValues.recentSettings.borderEnabled ? "checked" : ""
            }>

            <label for="RecentThreadLimit">Thread Limit:</label>
            <input type="number" id="RecentThreadLimit" name="RecentThreadLimit" value="${
              settingsValues.recentSettings.threadLimit
            }" min="1" max="50" style="width: 80px;">
        </div>
        <div style="text-align:center;margin-top:8px;">
            <button id="saveRecentSettings" style="background: #e0e0e0; border: 2px solid #9f9f9f; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;">Save</button>
        </div>`;

    settingsContainer.appendChild(settingsSection4);
  }

  const gridCSS = `.bookmark-grid {
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px 15px;
  justify-content: center;
  align-items: center;
}

.bookmark-grid input[type="color"],
.bookmark-grid input[type="checkbox"],
.bookmark-grid input[type="number"] {
  width: 80px;
  border: 1px solid #ccc;
  border-radius: 3px;
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

.settings-section input {
    display: flex;
}`;

  addCSS(gridCSS);
  nesSettings.insertAdjacentElement("beforeend", settingsContainer);

  const saveFeatureSettings = document.getElementById("saveFeatureSettings");
  if (saveFeatureSettings) {
    saveFeatureSettings.addEventListener("click", function () {
      const enableBoards = document.getElementById("EnableBoards").checked;
      const enableThreads = document.getElementById("EnableThreads").checked;
      const enableRecents = document.getElementById("EnableRecents").checked;

      const updatedFeatureSettings = {
        enableBoards,
        enableThreads,
        enableRecents,
      };

      setValue("featureSettings", updatedFeatureSettings);
      settingsValues.features = updatedFeatureSettings;

      noticePopup(
        "Feature settings saved! Refresh the page for changes to take effect."
      );
    });
  }

  if (settingsValues.features.enableBoards) {
    const saveBoardSettings = document.getElementById("saveBoardSettings");
    if (saveBoardSettings) {
      saveBoardSettings.addEventListener("click", function () {
        const addButtonColor = document
          .getElementById("BoardAddButton")
          .value.trim();
        const addButtonTextColor = document
          .getElementById("BoardAddButtonText")
          .value.trim();
        const enableBoardEditing = document.getElementById(
          "BoardEditingEnabled"
        ).checked;

        const updatedBoardSettings = {
          addButtonColor,
          addButtonTextColor,
          enableBoardEditing,
        };

        setValue("boardSettings", updatedBoardSettings);
        settingsValues.boardSettings = updatedBoardSettings;
        noticePopup(
          "Board settings saved! Refresh the page for changes to take effect."
        );
      });
    }
  }

  if (settingsValues.features.enableThreads) {
    const saveBookmarkedThreadSettings = document.getElementById(
      "saveBookmarkedThreadSettings"
    );
    if (saveBookmarkedThreadSettings) {
      saveBookmarkedThreadSettings.addEventListener("click", function () {
        const barColor = document.getElementById("BookmarkBar").value.trim();
        const barTextColor = document
          .getElementById("BookmarkBarText")
          .value.trim();
        const linkTextColor = document
          .getElementById("BookmarkLink")
          .value.trim();
        const buttonColor = document
          .getElementById("BookmarkButton")
          .value.trim();
        const buttonTextColor = document
          .getElementById("BookmarkButtonText")
          .value.trim();
        const borderColor = document
          .getElementById("BookmarkBorder")
          .value.trim();
        const borderEnabled = document.getElementById(
          "BookmarkBorderEnabled"
        ).checked;

        const updatedBookmarkSettings = {
          barColor,
          barTextColor,
          linkTextColor,
          buttonColor,
          buttonTextColor,
          borderColor,
          borderEnabled,
        };

        setValue("bookmarkSettings", updatedBookmarkSettings);
        settingsValues.bookmarkSettings = updatedBookmarkSettings;

        noticePopup(
          "Bookmarked thread settings saved! Refresh the page for changes to take effect."
        );
      });
    }
  }

  if (settingsValues.features.enableRecents) {
    const saveRecentSettings = document.getElementById("saveRecentSettings");
    if (saveRecentSettings) {
      saveRecentSettings.addEventListener("click", function () {
        const barColor = document.getElementById("RecentBar").value.trim();
        const barTextColor = document
          .getElementById("RecentBarText")
          .value.trim();
        const linkTextColor = document
          .getElementById("RecentLink")
          .value.trim();
        const borderColor = document
          .getElementById("RecentBorder")
          .value.trim();
        const borderEnabled = document.getElementById(
          "RecentBorderEnabled"
        ).checked;
        const threadLimit = parseInt(
          document.getElementById("RecentThreadLimit").value
        );

        const updatedRecentSettings = {
          barColor,
          barTextColor,
          linkTextColor,
          borderColor,
          borderEnabled,
          threadLimit,
        };

        setValue("recentSettings", updatedRecentSettings);
        settingsValues.recentSettings = updatedRecentSettings;
        noticePopup(
          "Recent thread settings saved! Refresh the page for changes to take effect."
        );
      });
    }
  }
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

function setThreadBorders() {
  const enabled =
    settingsValues.bookmarkSettings.borderEnabled ||
    settingsValues.recentSettings.borderEnabled;
  if (!enabled) return;

  const boardList = document.querySelector("#boardList");
  if (!boardList) return;

  const boards = boardList.querySelectorAll(".boardTopicTitle");
  boards.forEach((board) => {
    const url = board.querySelector("a").href;
    const isRecent = checkRecentThreadsStorage({ url });
    if (isRecent && settingsValues.recentSettings.borderEnabled) {
      board.parentElement.style.borderLeft = `4px solid ${settingsValues.recentSettings.borderColor}`;
    } else {
      const isBookmarked = checkBookmarksStorage({ url });
      if (isBookmarked && settingsValues.bookmarkSettings.borderEnabled) {
        board.parentElement.style.borderLeft = `4px solid ${settingsValues.bookmarkSettings.borderColor} `;
      } else {
        board.parentElement.style.borderLeft = "4px solid transparent";
      }
    }
  });
}

function setBoardEditingButtons() {
  const enabled =
    settingsValues.features.enableBoards &&
    settingsValues.boardSettings.enableBoardEditing;
  if (!enabled) return;

  const bookmarkedBoards = document.querySelector(".bookmarkedBoards");
  const saveEditsButton = document.querySelector(".saveEditsButton");

  if (!saveEditsButton) {
    const saveEditsButton = document.createElement("button");
    saveEditsButton.type = "button";
    saveEditsButton.className = "saveEditsButton";
    saveEditsButton.innerHTML = "Save";

    Object.assign(saveEditsButton.style, {
      margin: "6px auto 3px auto",
      width: "200px",
      boxSizing: "border-box",
      justifyContent: "center",
      border: "none",
      borderRadius: "4px",
      padding: "5px",
      display: "flex",
      justifyContent: "center",
      backgroundColor: "#4caf50",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "600",
      fontFamily: "'MuseoSansRounded500', 'Arial', sans-serif",
      cursor: "pointer",
    });

    bookmarkedBoards.parentNode.insertBefore(
      saveEditsButton,
      bookmarkedBoards.nextSibling
    );

    saveEditsButton.addEventListener("click", () => {
      updateBookmarkedBoards(false, false, true);
      document
        .querySelectorAll(
          ".moveLeftButton, .moveRightButton, .removeBoardButton"
        )
        .forEach((button) => button.remove());
      document
        .querySelectorAll(".bookmarkedBoard a")
        .forEach((a) => (a.style.marginTop = ""));
      saveEditsButton.remove();
      noticePopup("Order saved!");
    });
  }

  const boards = document.querySelectorAll(".bookmarkedBoard");
  const total = boards.length;
  boards.forEach((board, index) => {
    if (index !== 0) {
      const moveLeftButton = document.createElement("button");
      moveLeftButton.type = "button";
      moveLeftButton.className = "moveLeftButton";
      moveLeftButton.innerHTML = "◄";
      moveLeftButton.title = "Move left";

      Object.assign(moveLeftButton.style, {
        border: "none",
        width: "100%",
        fontSize: "15px",
        marginBottom: "6px",
        display: "flex",
        justifyContent: "flex-start",
        cursor: "pointer",
      });

      board.querySelector("a").style.marginTop = "";
      board.prepend(moveLeftButton);

      moveLeftButton.addEventListener("click", () => {
        const current = moveLeftButton.parentElement;
        const parent = current.parentElement;
        const prev = current.previousElementSibling;

        if (prev) {
          parent.insertBefore(current, prev);
        }

        parent
          .querySelectorAll(
            ".moveLeftButton, .moveRightButton, .removeBoardButton"
          )
          .forEach((button) => button.remove());
        setBoardEditingButtons();
      });
    }

    if (index !== total - 1) {
      const moveRightButton = document.createElement("button");
      moveRightButton.type = "button";
      moveRightButton.className = "moveRightButton";
      moveRightButton.innerHTML = "►";
      moveRightButton.title = "Move right";

      Object.assign(moveRightButton.style, {
        border: "none",
        width: "100%",
        fontSize: "15px",
        marginTop: "6px",
        display: "flex",
        justifyContent: "flex-end",
        cursor: "pointer",
      });

      board.querySelector("a").style.marginTop = "";

      if (index === 0) {
        board.querySelector("a").style.marginTop = "26px";
      }

      board.append(moveRightButton);

      moveRightButton.addEventListener("click", () => {
        const current = moveRightButton.parentElement;
        const parent = current.parentElement;
        const next = current.nextElementSibling;

        if (next && next.nextSibling) {
          parent.insertBefore(current, next.nextSibling);
        } else {
          parent.appendChild(current);
        }

        parent
          .querySelectorAll(
            ".moveLeftButton, .moveRightButton, .removeBoardButton"
          )
          .forEach((button) => button.remove());
        setBoardEditingButtons();
      });
    }

    const removeBoardButton = document.createElement("button");
    removeBoardButton.type = "button";
    removeBoardButton.className = "removeBoardButton";
    removeBoardButton.innerHTML = "REMOVE";

    Object.assign(removeBoardButton.style, {
      width: "50px",
      height: "50px",
      backgroundColor: "#f0f0f091",
      border: "none",
      fontSize: "10px",
      display: "flex",
      flexWrap: "wrap",
      alignContent: "center",
      justifyContent: "center",
      cursor: "pointer",
      position: "absolute",
      margin: "26px auto",
    });

    board.append(removeBoardButton);

    removeBoardButton.addEventListener("click", () => {
      removeBoardButton.parentElement.remove();
      document
        .querySelectorAll(
          ".moveLeftButton, .moveRightButton, .removeBoardButton"
        )
        .forEach((button) => button.remove());
      setBoardEditingButtons();
    });
  });
}

function setBookmarkBoardButton(bookmarkButton, isBookmarked) {
  const enabled = settingsValues.features.enableBoards;
  if (!enabled) return;

  bookmarkButton.style.backgroundColor = isBookmarked
    ? "#cacaca"
    : settingsValues.boardSettings.addButtonColor;
  bookmarkButton.innerHTML = `${isBookmarked ? "REMOVE" : "ADD"}`;
}

function setBookmarkThreadButton(bookmarkButton, isBookmarked) {
  const enabled = settingsValues.features.enableThreads;
  if (!enabled) return;

  bookmarkButton.style.backgroundColor = isBookmarked
    ? "#cacaca"
    : settingsValues.bookmarkSettings.buttonColor;
  bookmarkButton.innerHTML = `<p>${
    isBookmarked ? "UNBOOKMARK" : "BOOKMARK"
  }</p>`;
}

function setBookmarkedBoardList(bookmarkedBoardsHTML) {
  const enabled = settingsValues.features.enableBoards;
  if (!enabled) return;

  const bookmarkedBoards = document.querySelector(".bookmarkedBoards");
  if (!bookmarkedBoards) return;
  bookmarkedBoards.innerHTML = bookmarkedBoardsHTML;
  createOrderButton();
}

function setBookmarkedThreadList(bookmarkedThreadsHTML) {
  const enabled = settingsValues.features.enableThreads;
  if (!enabled) return;

  const bookmarkedRows = document.querySelector(".bookmarkedRows");
  if (!bookmarkedRows) return;

  const noBookmarks = document.createElement("div");
  noBookmarks.className = "noBookmarks";
  noBookmarks.innerHTML = "Empty";
  Object.assign(noBookmarks.style, {
    width: "100%",
    border: "1px #efefef solid",
    fontSize: "14px",
    color: "#b7b7b7",
    textAlign: "center",
    boxSizing: "border-box",
    padding: "10px",
  });

  bookmarkedRows.innerHTML = "";

  const hasBookmarks = bookmarkedThreadsHTML.childNodes.length > 0;
  if (!hasBookmarks) {
    bookmarkedRows.appendChild(noBookmarks);
  } else {
    bookmarkedRows.appendChild(bookmarkedThreadsHTML);
  }

  const bookmarkedCollapsedContent = document.querySelector(
    ".bookmarkedCollapsedContent"
  );
  if (!bookmarkedCollapsedContent) return;
  const deleteBookmarksButton = bookmarkedCollapsedContent.querySelector(
    ".deleteBookmarksButton"
  );
  if (!deleteBookmarksButton) return;
  bookmarkedCollapsedContent.style.display = "flex";
  deleteBookmarksButton.style.display = hasBookmarks ? "flex" : "none";
}

function setRecentThreadList(recentThreadsHTML) {
  const enabled = settingsValues.features.enableRecents;
  if (!enabled) return;

  const recentRows = document.querySelector(".recentRows");
  if (!recentRows) return;
  recentRows.innerHTML =
    recentThreadsHTML ||
    `<div class="noRecents" style="width: 100%; border: 1px #efefef solid; font-size: 14px; color: #b7b7b7; text-align: center; box-sizing: border-box; padding: 10px;">
                Empty
            </div>`;

  const recentCollapsedContent = document.querySelector(
    ".recentCollapsedContent"
  );
  if (!recentCollapsedContent) return;
  const deleteRecentsButton = recentCollapsedContent.querySelector(
    ".deleteRecentsButton"
  );
  if (!deleteRecentsButton) return;
  recentCollapsedContent.style.display = "flex";
  deleteRecentsButton.style.display = recentThreadsHTML ? "flex" : "none";
}

function addEventListeners() {
  const bookmarkButton = document.querySelector(".bookmarkButton");
  if (bookmarkButton) {
    bookmarkButton.addEventListener("click", function () {
      const topicDetails = extractTopicDetails();
      if (!topicDetails) return;

      updateBookmarkedThreads(topicDetails, bookmarkButton);
      const bookmarkedThreadsHTML = createBookmarkedThreadList();
      setBookmarkedThreadList(bookmarkedThreadsHTML);
    });
  }

  const bookmarkedCollapsible = document.querySelector(
    ".bookmarkedCollapsible"
  );
  if (bookmarkedCollapsible) {
    bookmarkedCollapsible.addEventListener("click", function () {
      const bookmarkedCollapsedContent =
        bookmarkedCollapsible.parentElement.querySelector(
          ".bookmarkedCollapsedContent"
        );
      if (bookmarkedCollapsedContent.style.display === "none") {
        bookmarkedCollapsedContent.style.display = "flex";
      } else {
        bookmarkedCollapsedContent.style.display = "none";
      }
    });
  }

  const recentCollapsible = document.querySelector(".recentCollapsible");
  if (recentCollapsible) {
    recentCollapsible.addEventListener("click", function () {
      const recentCollapsedContent =
        recentCollapsible.parentElement.querySelector(
          ".recentCollapsedContent"
        );
      if (recentCollapsedContent.style.display === "none") {
        recentCollapsedContent.style.display = "flex";
      } else {
        recentCollapsedContent.style.display = "none";
      }
    });
  }

  const deleteBookmarksButton = document.querySelector(
    ".deleteBookmarksButton"
  );
  if (deleteBookmarksButton) {
    deleteBookmarksButton.addEventListener("click", function () {
      const confirmDelete = confirm(
        "Are you sure you want to delete all bookmarks?"
      );
      if (!confirmDelete) return;
      setValue("bookmarks", []);
      const bookmarkedThreadsHTML = createBookmarkedThreadList();
      setBookmarkedThreadList(bookmarkedThreadsHTML);
      const bookmarkButton = document.querySelector(".bookmarkButton");
      if (bookmarkButton) {
        setBookmarkThreadButton(bookmarkButton, false);
      }
      deleteBookmarksButton.style.display = "none";

      setThreadBorders();
      noticePopup("Bookmarks cleared!");
    });
  }

  const deleteRecentsButton = document.querySelector(".deleteRecentsButton");
  if (deleteRecentsButton) {
    deleteRecentsButton.addEventListener("click", function () {
      const confirmDelete = confirm(
        "Are you sure you want to clear all recents?"
      );
      if (!confirmDelete) return;
      setValue("recents", []);
      setRecentThreadList("");
      setThreadBorders();
      noticePopup("Recent threads cleared!");
    });
  }
}

const settingsValues = getSettingsValues();
addCSS(css);
addSettings();
createAddBoardButton();
createBookmarkThreadButton();
createBookmarkAndHistorySection();
createOrderButton();
setThreadBorders();
updateRecentThreads();
addEventListeners();
