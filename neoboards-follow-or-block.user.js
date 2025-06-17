// ==UserScript==
// @name         Neoboards: Follow or Block
// @description  Follow (highlights messages and threads) and block users (hides messages and boards).
// @version      2.0.2
// @author       sunbathr & rawbeee
// @match        *://www.neopets.com/neoboards/*
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://images.neopets.com/themes/h5/altadorcup/images/settings-icon.png
// @run-at       document-end
// ==/UserScript==

(function () {
  "use strict";

  function isGMAvailable() {
    return (
      typeof GM_setValue === "function" && typeof GM_getValue === "function"
    );
  }

  function setValue(key, value) {
    if (isGMAvailable()) {
      GM_setValue(key, JSON.stringify(value));
    } else if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  function getValue(key, defaultValue) {
    if (isGMAvailable()) {
      const value = GM_getValue(key);
      if (value === undefined) return defaultValue;
      try {
        return JSON.parse(value);
      } catch (e) {
        return defaultValue;
      }
    } else if (typeof localStorage !== "undefined") {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;
      try {
        return JSON.parse(value);
      } catch (e) {
        return defaultValue;
      }
    }
    return defaultValue;
  }

  function getSettingsValues() {
    return {
      followedBylineColors: getValue("FollowedBylineColorsNeopets", "#EDFCF8"),
      followedUnderlineColors: getValue(
        "FollowedUnderlineColorsNeopets",
        "#EDFCF8"
      ),
      blockedBylineColors: getValue("BlockedBylineColorsNeopets", "#FFE6E6"),
      blockedUnderlineColors: getValue(
        "BlockedUnderlineColorsNeopets",
        "#FFE6E6"
      ),
      followedUsers: getValue("FollowedUsersNeopets", []),
      blockedUsers: getValue("BlockedUsersNeopets", []),
      highlightFollowedBoards: getValue("HighlightFollowedBoards", true),
      highlightFollowedReplies: getValue("HighlightFollowedReplies", true),
      highlightBlockedBoards: getValue("HighlightBlockedBoards", true),
      highlightBlockedReplies: getValue("HighlightBlockedReplies", true),
      hideBlockedBoards: getValue("HideBlockedBoards", true),
      hideBlockedReplies: getValue("HideBlockedReplies", true),
    };
  }

  const settings = getSettingsValues();
  const userWord = (count) => (count === 1 ? "user" : "users");

  function addCSS(css) {
    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  const cssText = `
        div.boardPostByline { position: relative; }
        div.boardPost { position: relative; }
        div.postPetInfo { margin-bottom: 10px; }
        div.postPet { margin: 0px 0px 10px 0px; }
        .follow, .block { transition-duration: 0.2s; }
        .follow:hover, .block:hover { transform: translateY(-2px); }
        .boardPostByline { transition: background-color 1s ease; }
        @media screen and (max-width: 700px) {
            .nesPopup input { font-size: 16px !important; }
        }
    `;

  function normalizeUsername(name) {
    return (name || "").replace(/[^a-zA-Z0-9_]+/g, "");
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
        anchors.innerHTML += ` | <a href='#FB-Settings'>Follow or Block</a>`;
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
            <div id="quick_settings"><a href='#FB-Settings'>Follow or Block</a></div>
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

  function updateAllBylineColors() {
    document.querySelectorAll(".boardPostByline").forEach(function (byline) {
      const user = normalizeUsername(
        byline.parentElement?.querySelector(".postAuthorName")?.textContent
      );
      if (
        settings.followedUsers.includes(user) &&
        settings.highlightFollowedReplies
      ) {
        byline.style.backgroundColor = settings.followedBylineColors;
      } else if (
        settings.blockedUsers.includes(user) &&
        settings.highlightBlockedReplies &&
        !settings.hideBlockedReplies
      ) {
        byline.style.backgroundColor = settings.blockedBylineColors;
      } else {
        byline.style.backgroundColor = "#f3f3f3";
      }
    });
  }

  function updateAllUnderlineColors() {
  const boardList = document.querySelectorAll("#boardList li");
  let visibleIndex = 0;
  
  boardList.forEach(function (board) {
    const authorElem = board.querySelector(".author a");
    if (!authorElem) return;
    var user = normalizeUsername(authorElem.textContent);
    
    if (board.style.display === "none") return;

    if (
      settings.followedUsers.includes(user) &&
      settings.highlightFollowedBoards
    ) {
      board.style.backgroundColor = settings.followedUnderlineColors;
    } else if (
      settings.blockedUsers.includes(user) &&
      settings.highlightBlockedBoards &&
      !settings.hideBlockedBoards
    ) {
      board.style.backgroundColor = settings.blockedUnderlineColors;
    } else {
      const computedStyle = window.getComputedStyle(board);
      const currentBgColor = computedStyle.backgroundColor;
      
      const isNativeColor = 
        currentBgColor === "rgb(211, 239, 255)" || 
        currentBgColor === "rgb(207, 255, 208)" ||
        currentBgColor === "rgba(211, 239, 255, 1)" ||
        currentBgColor === "rgba(207, 255, 208, 1)";
      
      if (!isNativeColor) {
        board.style.backgroundColor = visibleIndex % 2 === 0 ? "#f3f3f3" : "#ffffff";
      }
    }
    
    visibleIndex++;
  });
}


  function highlightFollowedUsers() {
  const boardList = document.querySelectorAll("#boardList li");
  let visibleIndex = 0;
  
  boardList.forEach(function (board) {
    const authorElem = board.querySelector(".author a");
    if (!authorElem) return;
    var user = normalizeUsername(authorElem.textContent);

    if (user.length > 0 && settings.blockedUsers.includes(user)) {
      board.style.display = settings.hideBlockedBoards ? "none" : "";
    } else {
      board.style.display = "";
    }

    if (board.style.display === "none") return;

    if (
      settings.followedUsers.includes(user) &&
      settings.highlightFollowedBoards
    ) {
      board.style.backgroundColor = settings.followedUnderlineColors;
    } else if (
      settings.blockedUsers.includes(user) &&
      settings.highlightBlockedBoards &&
      !settings.hideBlockedBoards
    ) {
      board.style.backgroundColor = settings.blockedUnderlineColors;
    } else {
      const computedStyle = window.getComputedStyle(board);
      const currentBgColor = computedStyle.backgroundColor;
      
      const isNativeColor = 
        currentBgColor === "rgb(211, 239, 255)" || 
        currentBgColor === "rgb(207, 255, 208)" ||
        currentBgColor === "rgba(211, 239, 255, 1)" ||
        currentBgColor === "rgba(207, 255, 208, 1)";
      
      if (!isNativeColor) {
        board.style.backgroundColor = visibleIndex % 2 === 0 ? "#f3f3f3" : "#ffffff";
      }
    }
    
    visibleIndex++;
  });
}

  function createFollowBlockControls() {
    const posts = document.querySelectorAll("#boardTopic li");
    posts.forEach(function (post) {
      const authorElem = post.querySelector(".postAuthorName");
      if (!authorElem) return;
      var user = normalizeUsername(authorElem.textContent);
      var byline = post.querySelector(".boardPostByline");
      if (!byline) return;

      if (settings.blockedUsers.includes(user)) {
        post.style.display = settings.hideBlockedReplies ? "none" : "";
        if (settings.hideBlockedReplies) return;
      } else {
        post.style.display = "";
      }

      const oldWrapper = byline.querySelector(".follow-block-wrapper");
      if (oldWrapper) oldWrapper.remove();

      var wrapper = document.createElement("div");
      wrapper.className = "follow-block-wrapper";
      Object.assign(wrapper.style, {
        position: "absolute",
        bottom: "-3px",
        left: "5px",
        display: "flex",
        gap: "6px",
      });

      var followDiv = document.createElement("div");
      followDiv.className = "follow";
      Object.assign(followDiv.style, {
        cursor: "pointer",
        fontSize: "10px",
        color: "#999",
      });
      followDiv.innerHTML = `<p>${
        settings.followedUsers.includes(user) ? "UNFOLLOW" : "FOLLOW"
      }</p>`;

      var sepDiv = document.createElement("div");
      Object.assign(sepDiv.style, {
        fontSize: "16px",
        color: "#999",
      });
      sepDiv.textContent = " | ";

      var blockDiv = document.createElement("div");
      blockDiv.className = "block";
      Object.assign(blockDiv.style, {
        cursor: "pointer",
        fontSize: "10px",
        color: "#999",
      });
      blockDiv.innerHTML = `<p>${
        settings.blockedUsers.includes(user) ? "UNBLOCK" : "BLOCK"
      }</p>`;

      wrapper.appendChild(followDiv);
      wrapper.appendChild(sepDiv);
      wrapper.appendChild(blockDiv);
      byline.appendChild(wrapper);

      if (
        settings.followedUsers.includes(user) &&
        settings.highlightFollowedReplies
      ) {
        byline.style.backgroundColor = settings.followedBylineColors;
      } else if (
        settings.blockedUsers.includes(user) &&
        settings.highlightBlockedReplies &&
        !settings.hideBlockedReplies
      ) {
        byline.style.backgroundColor = settings.blockedBylineColors;
      } else {
        byline.style.backgroundColor = "#f3f3f3";
      }

      followDiv.onclick = function () {
        if (settings.followedUsers.includes(user)) {
          settings.followedUsers = settings.followedUsers.filter(
            (u) => u !== user
          );
        } else {
          settings.followedUsers.push(user);
        }
        setValue("FollowedUsersNeopets", settings.followedUsers);
        var input = document.getElementById("followedUsersList");
        if (input) input.value = settings.followedUsers.join(",");
        createFollowBlockControls();
      };

      blockDiv.onclick = function () {
        const isBlocked = settings.blockedUsers.includes(user);

        if (isBlocked) {
          if (confirm(`Are you sure you want to unblock '${user}'?`)) {
            settings.blockedUsers = settings.blockedUsers.filter(
              (u) => u !== user
            );
            setValue("BlockedUsersNeopets", settings.blockedUsers);
            noticePopup(`Unblocked user '${user}'.`);
            var input = document.getElementById("blockedUsersList");
            if (input) input.value = settings.blockedUsers.join(",");

            createFollowBlockControls();
            highlightFollowedUsers();
          }
        } else {
          if (confirm(`Are you sure you want to block '${user}'?`)) {
            settings.blockedUsers.push(user);
            setValue("BlockedUsersNeopets", settings.blockedUsers);
            noticePopup(`Blocked user '${user}'.`);
            var input = document.getElementById("blockedUsersList");
            if (input) input.value = settings.blockedUsers.join(",");

            document.querySelectorAll("#boardTopic li").forEach(function (p) {
              const postUserElem = p.querySelector(".postAuthorName");
              if (!postUserElem) return;
              var postUser = normalizeUsername(postUserElem.textContent);
              if (postUser === user) {
                p.style.display = settings.hideBlockedReplies ? "none" : "";
              }
            });

            createFollowBlockControls();
          }
        }
      };
    });
  }

  function createUserListBrowser(type) {
    const storageKey =
      type === "followed" ? "FollowedUsersNeopets" : "BlockedUsersNeopets";
    const modalId = type + "_users_browser";
    let users = getValue(storageKey, []);

    const oldModal = document.getElementById(modalId);
    if (oldModal) oldModal.remove();

    const settingsPop = document.getElementById("settings_pop");
    if (settingsPop) settingsPop.style.display = "none";

    const modal = document.createElement("div");
    modal.className = "nesPopup";
    modal.id = modalId;
    Object.assign(modal.style, {
      display: "block",
      background: "#f0f0f0",
      borderRadius: "18px",
      border: "3px solid #b7b7b7",
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
      zIndex: "99999",
    });

    const bodyContent = createUserBrowserBody(type);
    const footerContent = createUserBrowserFooter(type);

    modal.innerHTML = `
            <div class="popup-header__2020">
                <h3 id="${type}_users_modal_header" style="margin-bottom: 0px;">Manage ${
      type.charAt(0).toUpperCase() + type.slice(1)
    } ${userWord(users.length)} (${users.length})</h3>
                <div class="popup-header-pattern__2020"></div>
            </div>
            <div class="nesPopupBody" style="background-color: #f0f0f0; max-height: 400px; padding: 15px;">
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

    setupUserBrowserEvents(type, storageKey);
  }

  function createUserBrowserBody(type) {
    return `
            <div style="position: sticky; top: 0px; z-index: 5;">
                <div style="margin-bottom: 10px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                    <button id="select_all_${type}_users" style="background: #2196f3; color: white; border: 2px solid #333; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; width: 120px;">Select All</button>
                    <button id="deselect_all_${type}_users" style="background: #666; color: white; border: 2px solid #333; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; width: 120px;">Deselect All</button>
                </div>
            </div>
            <div id="${type}_users_list_container" style="display: flex; justify-content: center;">
                <div id="${type}_users_list"
                    style="background: #f9f9f9; border: 1px solid #ddd; border-radius: 4px; width: 80%; margin: 0 auto; padding: 10px 0; text-align: center; display: flex; flex-direction: column; align-items: center; max-height: 300px; overflow-y: auto;">
                </div>
            </div>
        `;
  }

  function createUserBrowserFooter(type) {
    return `
            <button id="add_${type}_user" style="width: 85px; background: #4caf50; color: white; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600;">Add</button>
            <button id="delete_selected_${type}_users" style="width: 85px; background: #d32f2f; color: white; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600;">Delete</button>
            <button id="close_${type}_users_browser" style="width: 85px; background: #666; color: white; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px; fontWeight: 600;">Close</button>
        `;
  }

  function setupUserBrowserEvents(type, storageKey) {
    function renderUserList() {
      const users = getValue(storageKey, []);
      const listDiv = document.getElementById(`${type}_users_list`);
      listDiv.innerHTML = "";

      if (users.length === 0) {
        const noUsersDiv = document.createElement("div");
        Object.assign(noUsersDiv.style, {
          width: "95%",
          maxWidth: "340px",
          minWidth: "220px",
          background: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: "5px",
          margin: "4px 0",
          padding: "20px",
          boxSizing: "border-box",
          textAlign: "center",
          color: "#999",
          fontSize: "14px",
        });
        noUsersDiv.textContent = `No ${type} users.`;
        listDiv.appendChild(noUsersDiv);
      } else {
        users
          .slice()
          .sort((a, b) => a.localeCompare(b))
          .forEach((user) => {
            const row = document.createElement("div");
            Object.assign(row.style, {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0",
              width: "95%",
              maxWidth: "340px",
              minWidth: "220px",
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "5px",
              margin: "4px 0",
              padding: "6px 10px 6px 10px",
              boxSizing: "border-box",
            });
            row.innerHTML = `
                        <span style="font-family: "MuseoSansRounded500", 'Arial', sans-serif; font-size: 14px; font-weight: bold; text-align:left; flex:1 1 auto;">${user}</span>
                        <input type="checkbox" class="${type}_users_checkbox" data-username="${user}" style="margin-left:12px; margin-right:2px;">
                    `;
            listDiv.appendChild(row);
          });
      }

      const header = document.getElementById(`${type}_users_modal_header`);
      if (header) {
        header.textContent = `Manage ${
          type.charAt(0).toUpperCase() + type.slice(1)
        } Users (${users.length})`;
      }
    }

    renderUserList();

    document.getElementById(`select_all_${type}_users`).onclick = () => {
      document
        .querySelectorAll(`.${type}_users_checkbox`)
        .forEach((cb) => (cb.checked = true));
    };
    document.getElementById(`deselect_all_${type}_users`).onclick = () => {
      document
        .querySelectorAll(`.${type}_users_checkbox`)
        .forEach((cb) => (cb.checked = false));
    };

    document.getElementById(`delete_selected_${type}_users`).onclick = () => {
      const selected = Array.from(
        document.querySelectorAll(`.${type}_users_checkbox:checked`)
      ).map((cb) => cb.dataset.username);
      if (!selected.length) {
        alert("No users selected for deletion.");
        return;
      }
      if (
        !confirm(
          `Delete ${selected.length} selected ${userWord(
            selected.length
          )} from your ${type} list?`
        )
      )
        return;
      const users = getValue(storageKey, []);
      const updated = users.filter((u) => !selected.includes(u));
      setValue(storageKey, updated);
      if (type === "followed") {
        settings.followedUsers = updated;
        const input = document.getElementById("followedUsersList");
        if (input) input.value = updated.join(",");
      } else {
        settings.blockedUsers = updated;
        const input = document.getElementById("blockedUsersList");
        if (input) input.value = updated.join(",");
      }
      renderUserList();
      highlightFollowedUsers();
      createFollowBlockControls();
      noticePopup(
        `Deleted ${selected.length} ${userWord(
          selected.length
        )} from your ${type} list.`
      );
      if (updated.length === 0) {
        renderUserList();
      }
    };

    setupAddUserModal(type, storageKey, renderUserList);
    setupCloseBrowserModal(type);
  }

  function setupAddUserModal(type, storageKey, renderUserList) {
    document.getElementById(`add_${type}_user`).onclick = () => {
      const existingBrowserModal = document.getElementById(
        `${type}_users_browser`
      );
      if (existingBrowserModal) existingBrowserModal.remove();

      const addModal = document.createElement("div");
      addModal.className = "nesPopup";
      addModal.id = `${type}_add_user_modal`;
      Object.assign(addModal.style, {
        display: "block",
        background: "#f0f0f0",
        borderRadius: "18px",
        border: "3px solid #b7b7b7",
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
        zIndex: "100000",
      });
      addModal.innerHTML = `
                <div class="popup-header__2020">
                    <h3 style="margin-bottom: 0px;">Add to ${
                      type.charAt(0).toUpperCase() + type.slice(1)
                    } User(s)</h3>
                    <div class="popup-header-pattern__2020"></div>
                </div>
                <div class="nesPopupBody" style="background-color: #f9f9f9; max-height: 200px; padding: 20px;">
                    <div style="font-size: 12pt; margin-bottom: 10px;">Enter a comma-separated list of usernames to add. Do not include spaces.</div>
                    <input type="text" id="add_${type}_user_input" style="width: 90%; padding: 7px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;" placeholder="username1,username2">
                </div>
                <div class="popup-footer__2020">
                    <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; padding: 5px; gap: 10px;">
                        <button id="save_add_${type}_user" style="width: 85px; background: #4caf50; color: white; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600;">Save</button>
                        <button id="close_add_${type}_user" style="width: 85px; background: #666; color: white; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600;">Close</button>
                    </div>
                    <div class="popup-footer-pattern__2020"></div>
                </div>
            `;
      document.body.appendChild(addModal);

      document.getElementById(`close_add_${type}_user`).onclick = () => {
        addModal.remove();
        createUserListBrowser(type);
      };

      document.getElementById(`save_add_${type}_user`).onclick = () => {
        const input = document.getElementById(`add_${type}_user_input`);
        if (!input) return;
        const newUsers = input.value
          .split(",")
          .map((u) => u.trim())
          .filter((u) => u.length > 0);
        if (!newUsers.length) {
          alert("Please enter at least one username.");
          return;
        }
        let current = getValue(storageKey, []);
        let added = 0;
        newUsers.forEach((u) => {
          if (!current.includes(u)) {
            current.push(u);
            added++;
          }
        });
        setValue(storageKey, current);
        if (type === "followed") {
          settings.followedUsers = current;
          const inputBox = document.getElementById("followedUsersList");
          if (inputBox) inputBox.value = current.join(",");
        } else {
          settings.blockedUsers = current;
          const inputBox = document.getElementById("blockedUsersList");
          if (inputBox) inputBox.value = current.join(",");
        }
        highlightFollowedUsers();
        createFollowBlockControls();
        addModal.remove();
        createUserListBrowser(type);
        if (added > 0) {
          noticePopup(
            `Added ${added} user${added > 1 ? "s" : ""} to your ${type} list.`
          );
        } else {
          alert("There are no new users to add.");
        }
      };
    };
  }

  function setupCloseBrowserModal(type) {
    document.getElementById(`close_${type}_users_browser`).onclick = () => {
      document.getElementById(`${type}_users_browser`).remove();
      const settingsPop = document.getElementById("settings_pop");
      if (settingsPop) settingsPop.style.display = "block";
    };
  }

  function addFollowBlockSettings() {
    ensureSettingsMenuExists();

    const settingsNone = document.getElementById("settings_none");
    if (settingsNone) settingsNone.remove();

    var nesSettings = document.getElementById("nes_settings");
    if (!nesSettings) return;

    if (nesSettings.dataset.fbSettingsAdded === "1") return;
    nesSettings.dataset.fbSettingsAdded = "1";

    const settingsContainer = document.createElement("div");
    settingsContainer.id = "follow-block-settings";
    settingsContainer.className = "settings-container";
    settingsContainer.innerHTML = "<h2 id='FB-Settings'>Follow or Block</h2>";

    const settingsCSS = createSettingsCSS();
    addCSS(settingsCSS);

    createDisplaySettingsSection(settingsContainer);
    createFollowedColorSettingsSection(settingsContainer);
    createBlockedColorSettingsSection(settingsContainer);
    createFollowedUsersSection(settingsContainer);
    createBlockedUsersSection(settingsContainer);

    nesSettings.appendChild(settingsContainer);
    setupSettingsEventListeners();
  }

  function createSettingsCSS() {
    return `
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
            #settings_pop a:link, #settings_pop a:visited {
                color: #3b54b4 !important;
                text-decoration: none !important;
                font-size: 14px;
            }
            button:hover {
                filter: contrast(0.7) brightness(1.1);
                transition: filter 0.2s ease;
            }
        `;
  }

  function createDisplaySettingsSection(container) {
    const settingsSection = document.createElement("div");
    settingsSection.className = "settings-section";
    settingsSection.innerHTML = `
            <h4 style="margin-bottom: 5px;">Display Settings:</h4>
            <table style="margin-left: auto; margin-right: auto;">
                <tbody>
                    <tr>
                        <td><label for="highlightFollowedBoards">Highlight followed user threads:</label></td>
                        <td><input type="checkbox" id="highlightFollowedBoards" name="highlightFollowedBoards" ${
                          settings.highlightFollowedBoards ? "checked" : ""
                        }></td>
                    </tr>
                    <tr>
                        <td><label for="highlightFollowedReplies">Highlight followed user messages:</label></td>
                        <td><input type="checkbox" id="highlightFollowedReplies" name="highlightFollowedReplies" ${
                          settings.highlightFollowedReplies ? "checked" : ""
                        }></td>
                    </tr>
                    <tr>
                        <td><label for="highlightBlockedBoards">Highlight blocked user threads:</label></td>
                        <td><input type="checkbox" id="highlightBlockedBoards" name="highlightBlockedBoards" ${
                          settings.highlightBlockedBoards ? "checked" : ""
                        }></td>
                    </tr>
                    <tr>
                        <td><label for="highlightBlockedReplies">Highlight blocked user messages:</label></td>
                        <td><input type="checkbox" id="highlightBlockedReplies" name="highlightBlockedReplies" ${
                          settings.highlightBlockedReplies ? "checked" : ""
                        }></td>
                    </tr>
                    <tr>
                        <td><label for="hideBlockedBoards">Hide blocked user threads:</label></td>
                        <td><input type="checkbox" id="hideBlockedBoards" name="hideBlockedBoards" ${
                          settings.hideBlockedBoards ? "checked" : ""
                        }></td>
                    </tr>
                    <tr>
                        <td><label for="hideBlockedReplies">Hide blocked user messages:</label></td>
                        <td><input type="checkbox" id="hideBlockedReplies" name="hideBlockedReplies" ${
                          settings.hideBlockedReplies ? "checked" : ""
                        }></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align: center; padding-top: 10px;">
                            <button id="saveFBDisplaySettingsButton" style="background: #efefef; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;">Save</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    container.appendChild(settingsSection);
  }

  function createFollowedColorSettingsSection(container) {
    const settingsSection = document.createElement("div");
    settingsSection.className = "settings-section";
    settingsSection.innerHTML = `
            <h4 style="margin-bottom: 5px;">Followed User Colors:</h4>
            <table style="margin-left: auto; margin-right: auto;">
                <tr class="byline_update">
                    <td><label for="FollowedBylineColor">Message Highlight:</label></td>
                    <td><input type="color" id="FollowedBylineColor" style="width: 80px; border: 1px solid #ccc; border-radius: 3px;" name="FollowedByline" value="${settings.followedBylineColors}"></td>
                </tr>
                <tr class="underline_update">
                    <td><label for="FollowedUnderlineColor">Thread Highlight:</label></td>
                    <td><input type="color" id="FollowedUnderlineColor" style="width: 80px; border: 1px solid #ccc; border-radius: 3px;" name="FollowedUnderlineColor" value="${settings.followedUnderlineColors}"></td>
                </tr>
            </table>
            <div style="text-align:center;margin-top:8px;">
                <button id="saveFollowedColorsButton" style="background: #efefef; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;">Save</button>
            </div>
        `;
    container.appendChild(settingsSection);
  }

  function createBlockedColorSettingsSection(container) {
    const settingsSection = document.createElement("div");
    settingsSection.className = "settings-section";
    settingsSection.innerHTML = `
            <h4 style="margin-bottom: 5px;">Blocked User Colors:</h4>
            <table style="margin-left: auto; margin-right: auto;">
                <tr class="blocked_byline_update">
                    <td><label for="BlockedBylineColor">Message Highlight:</label></td>
                    <td><input type="color" id="BlockedBylineColor" style="width: 80px; border: 1px solid #ccc; border-radius: 3px;" name="BlockedByline" value="${settings.blockedBylineColors}"></td>
                </tr>
                <tr class="blocked_underline_update">
                    <td><label for="BlockedUnderlineColor">Thread Highlight:</label></td>
                    <td><input type="color" id="BlockedUnderlineColor" style="width: 80px; border: 1px solid #ccc; border-radius: 3px;" name="BlockedUnderlineColor" value="${settings.blockedUnderlineColors}"></td>
                </tr>
            </table>
            <div style="text-align:center;margin-top:8px;">
                <button id="saveBlockedColorsButton" style="background: #efefef; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;">Save</button>
            </div>
        `;
    container.appendChild(settingsSection);
  }

  function createFollowedUsersSection(container) {
    const settingsSection = document.createElement("div");
    settingsSection.className = "settings-section";
    settingsSection.innerHTML = `
            <h4 style="margin-bottom: 5px;">Followed Users:</h4>
            <div style="font-size:10pt;">Enter a comma-separated list of users to follow. Do not include spaces.</div>
            <table style="margin-left: auto; margin-right: auto;">
                <tr class="followed_users_update">
                    <td><label for="followedUsersList">Following:</label></td>
                    <td><input type="text" id="followedUsersList" name="FollowedUsers" value="${settings.followedUsers.join(
                      ","
                    )}"></td>
                </tr>
            </table>
            <div style="text-align:center;margin-top:8px;">
                <button id="saveFollowedUsersList" style="background: #efefef; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;">Save</button>
            </div>
            <div style="text-align:center;margin-top:8px;">
                <button id="manageFollowedUsersList" title="Manage followed users" style="width: 180px; height: 40px; background: #23708c; color: white; border: 2px solid #363636; padding: 0px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; box-sizing: border-box;">Manage Followed List</button>
            </div>
        `;
    container.appendChild(settingsSection);
  }

  function createBlockedUsersSection(container) {
    const settingsSection = document.createElement("div");
    settingsSection.className = "settings-section";
    settingsSection.innerHTML = `
            <h4 style="margin-bottom: 5px;">Blocked Users:</h4>
            <div style="font-size:10pt;">Enter a comma-separated list of users to block. Do not include spaces.</div>
            <table style="margin-left: auto; margin-right: auto;">
                <tr class="blocked_users_update">
                    <td><label for="blockedUsersList">Blocking:</label></td>
                    <td><input type="text" id="blockedUsersList" name="BlockedUsers" value="${settings.blockedUsers.join(
                      ","
                    )}"></td>
                </tr>
            </table>
            <div style="text-align:center;margin-top:8px;">
                <button id="saveBlockedUsersList" style="background: #efefef; border: 2px solid #363636; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;">Save</button>
            </div>
            <div style="text-align:center;margin-top:8px;">
                <button id="manageBlockedUsersList" title="Manage blocked users" style="width: 180px; height: 40px; background: #23708c; color: white; border: 2px solid #363636; padding: 0px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; box-sizing: border-box;">Manage Blocked List</button>
            </div>
        `;
    container.appendChild(settingsSection);
  }

  function setupSettingsEventListeners() {
    document
      .getElementById("saveFollowedColorsButton")
      .addEventListener("click", function () {
        var bylineColor = document.getElementById("FollowedBylineColor").value;
        var underlineColor = document.getElementById(
          "FollowedUnderlineColor"
        ).value;
        setValue("FollowedBylineColorsNeopets", bylineColor);
        setValue("FollowedUnderlineColorsNeopets", underlineColor);
        settings.followedBylineColors = bylineColor;
        settings.followedUnderlineColors = underlineColor;
        updateAllBylineColors();
        updateAllUnderlineColors();
        noticePopup("Followed user colors updated.");
      });

    document
      .getElementById("saveBlockedColorsButton")
      .addEventListener("click", function () {
        var bylineColor = document.getElementById("BlockedBylineColor").value;
        var underlineColor = document.getElementById(
          "BlockedUnderlineColor"
        ).value;
        setValue("BlockedBylineColorsNeopets", bylineColor);
        setValue("BlockedUnderlineColorsNeopets", underlineColor);
        settings.blockedBylineColors = bylineColor;
        settings.blockedUnderlineColors = underlineColor;
        updateAllBylineColors();
        updateAllUnderlineColors();
        noticePopup("Blocked user colors updated.");
      });

    document
      .getElementById("saveFollowedUsersList")
      .addEventListener("click", saveFollowedUsersList);
    document
      .getElementById("saveBlockedUsersList")
      .addEventListener("click", saveBlockedUsersList);

    document
      .getElementById("manageFollowedUsersList")
      .addEventListener("click", function () {
        createUserListBrowser("followed");
      });
    document
      .getElementById("manageBlockedUsersList")
      .addEventListener("click", function () {
        createUserListBrowser("blocked");
      });

    document
      .getElementById("saveFBDisplaySettingsButton")
      .addEventListener("click", function () {
        settings.highlightFollowedBoards = document.getElementById(
          "highlightFollowedBoards"
        ).checked;
        settings.highlightFollowedReplies = document.getElementById(
          "highlightFollowedReplies"
        ).checked;
        settings.highlightBlockedBoards = document.getElementById(
          "highlightBlockedBoards"
        ).checked;
        settings.highlightBlockedReplies = document.getElementById(
          "highlightBlockedReplies"
        ).checked;
        settings.hideBlockedBoards =
          document.getElementById("hideBlockedBoards").checked;
        settings.hideBlockedReplies =
          document.getElementById("hideBlockedReplies").checked;
        setValue("HighlightFollowedBoards", settings.highlightFollowedBoards);
        setValue("HighlightFollowedReplies", settings.highlightFollowedReplies);
        setValue("HighlightBlockedBoards", settings.highlightBlockedBoards);
        setValue("HighlightBlockedReplies", settings.highlightBlockedReplies);
        setValue("HideBlockedBoards", settings.hideBlockedBoards);
        setValue("HideBlockedReplies", settings.hideBlockedReplies);
        highlightFollowedUsers();
        createFollowBlockControls();
        updateAllBylineColors();
        updateAllUnderlineColors();
        noticePopup("Display settings updated.");
      });
  }

  function saveFollowedUsersList() {
    var clicked_fu = document
      .getElementById("followedUsersList")
      .value.split(",")
      .map((u) => normalizeUsername(u))
      .filter((x) => x.trim() !== "");
    setValue("FollowedUsersNeopets", clicked_fu);
    settings.followedUsers = clicked_fu;
    highlightFollowedUsers();
    createFollowBlockControls();
    noticePopup("Followed users updated.");
  }

  function saveBlockedUsersList() {
    var clicked_bc = document
      .getElementById("blockedUsersList")
      .value.split(",")
      .map((u) => normalizeUsername(u))
      .filter((x) => x.trim() !== "");
    setValue("BlockedUsersNeopets", clicked_bc);
    settings.blockedUsers = clicked_bc;
    highlightFollowedUsers();
    createFollowBlockControls();
    noticePopup("Blocked users updated.");
  }

  addCSS(cssText);
  highlightFollowedUsers();
  createFollowBlockControls();
  addFollowBlockSettings();
})();
