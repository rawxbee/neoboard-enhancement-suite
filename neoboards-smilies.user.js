// ==UserScript==
// @name         Neoboards: Smilies
// @version      2.0.1
// @description  Adds the entire smilie library to the neoboards. Embeds image links as images within replies (you can post images.neopets, pets.neopets and upload.neopets, etc).
// @author       sunbathr & rawbeee
// @match        *://www.neopets.com/neoboards/topic*
// @match        *://www.neopets.com/neoboards/create_topic*
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
      smilieSettings: getValue("smilieSettings", {
        enableSmilies: true,
        enableImageEmbeds: true,
      }),
    };
  }

  function addCSS(css) {
    const style = document.createElement("style");
    style.type = "text/css";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function addBasicStyles() {
    const cssText = `
.extraextrasmilies {
margin-top: 10px;
min-width: 288px;
}
.subnavc, .subnavp, .subnavp2p3, .subnavi, .subnavh, .subnavm, .subnavuser {
  float: left;
  overflow: hidden;
  padding: 8px;
}
.subnavd {
  float: left;
  overflow: hidden;
  padding: 10px 11px 10px 11px;
}

.subnav-c, .subnav-p, .subnav-p2p3, .subnav-i, .subnav-h, .subnav-m, .subnav-d, .subnav-user {
  display: none;
  position: absolute;
  border-radius: 15px;
  border: 1px solid #cacaca;
  background-color: white;
  overflow: auto;
  z-index: 1;
  padding: 2px;
  width: 300px;
}
.subnavc:hover .subnav-c, .subnavp:hover .subnav-p, .subnavp2p3:hover .subnav-p2p3, .subnavi:hover .subnav-i, .subnavh:hover .subnav-h, .subnavm:hover .subnav-m, .subnavd:hover .subnav-d, .subnavuser:hover .subnav-user {
  display: block;
}
.subnav-c {
  margin-left: -16px;
}
.subnav-p {
  margin-left: -52px;
}
.subnav-p2p3 {
  margin-left: -88px;
}
.subnav-i {
  margin-left: -124px;
}
.subnav-h {
  margin-left: -160px;
}
.subnav-m {
  margin-left: -196px;
}
.subnav-d {
  margin-left: -235px;
  margin-top: 2px;
}
.subnav-user {
  margin-left: -268px;
}
.subnav-c::-webkit-scrollbar, .subnav-m::-webkit-scrollbar, .subnav-h::-webkit-scrollbar, .subnav-i::-webkit-scrollbar, .subnav-p2p3::-webkit-scrollbar, .subnav-p::-webkit-scrollbar, .subnav-d::-webkit-scrollbar, .subnav-user::-webkit-scrollbar {
    display: none;  /* Safari and Chrome */
}
.topicReplyTitle {
display: none;
}
#boardTopic .topicReplyContainer .topicReplyRemainder, #boardCreateTopic .topicCreateContainer .topicCreateRemainder {
text-align: center;
}
@media screen and (max-width: 701px) {
    .topicReplyInput textarea {
        font-size: 16px !important;
    }
}
@media screen and (min-width: 701px) {
    #boardTopic .topicReplyContainer .topicReplyRemainder, #boardCreateTopic .topicCreateContainer .topicCreateRemainder {
        grid-column: auto !important;
        grid-row: 4 / 4 !important;
        margin: 10px auto !important;
    }
    }
/* Add grid layout for smilies */
.smilie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(36px, 1fr));
    gap: 6px;
    justify-items: center;
    align-items: center;
    padding: 6px 0;
}
`;
    addCSS(cssText);
  }

  function addSettingsStyles() {
    const settingsCSS = `
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
button:hover,
#saveSmilieSettings:hover,
#close_settings_pop:hover {
    filter: contrast(0.7) brightness(1.1);
    transition: filter 0.2s ease;
}
.smilie-settings-grid {
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px 15px;
  justify-content: center;
  align-items: center;
}

.smilie-settings-grid input[type="checkbox"] {
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
}
`;
    addCSS(settingsCSS);
  }

  function ensureSettingsMenuExists() {
    const subNav = document.querySelector(".navsub-left__2020");
    if (!subNav) return;
    if (subNav.querySelector("#settings_btn")) {
      const anchors = document.querySelector("#quick_settings");
      if (anchors) {
        anchors.innerHTML += ` | <a href='#S-Settings'>Smilies</a>`;
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
    <div id="quick_settings"><a href='#S-Settings'>Smilies</a></div>
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

  let lastFocusedTextArea = null;

  function trackFocusTargets() {
    const selectors = [
      'textarea[name="topic_title"]',
      "textarea#topic_title",
      'input[name="topic_title"]',
      "input#topic_title",
      'textarea[name="message"]',
      "textarea#message",
      'textarea[name="body"]',
    ];
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.addEventListener("focus", function () {
          lastFocusedTextArea = this;
        });
      });
    });
  }

  function insertSmiley(code) {
    let textarea = lastFocusedTextArea;
    if (!textarea || !document.body.contains(textarea)) {
      textarea =
        document.querySelector(
          'textarea[name="message"], textarea#message, textarea[name="body"]'
        ) ||
        document.querySelector(
          'textarea[name="topic_title"], textarea#topic_title, input[name="topic_title"], input#topic_title'
        );
    }
    if (textarea) {
      textarea.focus();
      if (
        typeof textarea.selectionStart === "number" &&
        typeof textarea.selectionEnd === "number"
      ) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = textarea.value.substring(0, start);
        const after = textarea.value.substring(end);
        textarea.value = before + code + after;
        const cursor = start + code.length;
        textarea.selectionStart = textarea.selectionEnd = cursor;
      } else if (document.selection) {
        textarea.focus();
        const sel = document.selection.createRange();
        sel.text = code;
      } else {
        textarea.value += code;
      }
    }
  }

  function createSmilieCategory({ navClass, img, dropdownClass, smilies }) {
    let mainImgTag;
    if (navClass === "subnavuser") {
      mainImgTag = `<img src="${img}" style="height: 20px;">`;
    } else if (navClass === "subnavd") {
      mainImgTag = `<img src="${img}" style="margin-top: 2px;">`;
    } else {
      mainImgTag = `<img src="${img}">`;
    }
    return `
<div class="${navClass}">
    ${mainImgTag}
    <div class="${dropdownClass}">
        <div class="smilie-grid">
${smilies
  .map((smiley) => {
    let styleAttr = smiley.style ? smiley.style : "";
    if (navClass === "subnavuser" && !/height\s*:\s*20px/.test(styleAttr)) {
      styleAttr = (styleAttr ? styleAttr + ";" : "") + "height: 20px;";
    }
    return `<a href="#" class="smiley" data-code="${smiley.code}"><img src="${
      smiley.img
    }" alt="${smiley.title ?? smiley.code}" title="${smiley.title ?? smiley.code}" border="0"${styleAttr ? ` style="${styleAttr}"` : ""}></a>`;
  })
  .join("\n")}
        </div>
    </div>
</div>`;
  }

  function getSmilieCategories() {
    const smiliesPath = "https://images.neopets.com/neoboards/smilies/";
    const themesPath = "https://images.neopets.com/themes/h5/basic/images/";

    return [
      {
        navClass: "subnavc",
        img: smiliesPath + "mrcoconut.gif",
        dropdownClass: "subnav-c",
        smilies: [
          { code: "*aaa*", img: smiliesPath + "aaa.gif" },
          { code: "*abigail*", img: smiliesPath + "abigail.gif" },
          { code: "*angrylawyerbot*", img: smiliesPath + "angrylawyerbot.gif" },
          { code: "*awakened*", img: smiliesPath + "awakened.gif" },
          { code: "*boatswain*", img: smiliesPath + "boatswain.gif" },
          { code: "*brutes*", img: smiliesPath + "brutes.gif" },
          { code: "*brynn*", img: smiliesPath + "brynn.gif" },
          { code: "*cabinboy*", img: smiliesPath + "cabinboy.gif" },
          { code: "*capn3legs*", img: smiliesPath + "capn3legs.gif" },
          { code: "*dreamy*", img: smiliesPath + "dreamy.gif" },
          { code: "*coltzan*", img: smiliesPath + "coltzan.gif" },
          { code: "*cook*", img: smiliesPath + "cook.gif" },
          { code: "*fyora*", img: smiliesPath + "fyora.gif" },
          { code: "*gunner*", img: smiliesPath + "gunner.gif" },
          { code: "*hanso*", img: smiliesPath + "hanso.gif" },
          { code: "*happiness*", img: smiliesPath + "happiness.gif" },
          { code: "*illusen*", img: smiliesPath + "illusen.gif" },
          { code: "*jazan*", img: smiliesPath + "jazan.gif" },
          { code: "*jhudora*", img: smiliesPath + "jhudora.gif" },
          { code: "*lawyerbot*", img: smiliesPath + "lawyerbot.gif" },
          { code: "*lulu*", img: smiliesPath + "lulu.gif" },
          { code: "*mate*", img: smiliesPath + "mate.gif" },
          { code: "*mipsy*", img: smiliesPath + "mipsy.gif" },
          { code: "*mrcoconut*", img: smiliesPath + "mrcoconut.gif" },
          { code: "*nabile*", img: smiliesPath + "nabile.gif" },
          { code: "*nox*", img: smiliesPath + "nox.gif" },
          { code: "*order*", img: smiliesPath + "order.gif" },
          { code: "*quartermaster*", img: smiliesPath + "quartermaster.gif" },
          { code: "*rigger*", img: smiliesPath + "rigger.gif" },
          { code: "*rohane*", img: smiliesPath + "rohane.gif" },
          { code: "*rower*", img: smiliesPath + "rower.gif" },
          { code: "*seekers*", img: smiliesPath + "seekers.gif" },
          { code: "*shopwiz*", img: smiliesPath + "shopwiz.gif" },
          { code: "*sloth*", img: smiliesPath + "sloth.gif" },
          { code: "*snowager*", img: smiliesPath + "snowager.gif" },
          { code: "*swabbie*", img: smiliesPath + "swabbie.gif" },
          { code: "*sway*", img: smiliesPath + "sway.gif" },
          { code: "*talinia*", img: smiliesPath + "talinia.gif" },
          { code: "*techomaster*", img: smiliesPath + "techomaster.gif" },
          { code: "*thieves*", img: smiliesPath + "thieves.gif" },
          { code: "*turmaculus*", img: smiliesPath + "turmaculus.gif" },
          { code: "*velm*", img: smiliesPath + "velm.gif" },
          { code: "*wizard*", img: smiliesPath + "wizard.gif" },
        ],
      },
      {
        navClass: "subnavp",
        img: smiliesPath + "lenny.gif",
        dropdownClass: "subnav-p",
        smilies: [
          { code: "*acara*", img: smiliesPath + "acara.gif" },
          { code: "*aisha*", img: smiliesPath + "aisha.gif" },
          { code: "*blumaroo*", img: smiliesPath + "blumaroo.gif" },
          { code: "*bori*", img: smiliesPath + "bori.gif" },
          { code: "*bruce*", img: smiliesPath + "bruce.gif" },
          { code: "*buzz*", img: smiliesPath + "buzz.gif" },
          { code: "*chia*", img: smiliesPath + "chia.gif" },
          { code: "*chomby*", img: smiliesPath + "chomby.gif" },
          { code: "*cybunny*", img: smiliesPath + "cybunny.gif" },
          { code: "*draik*", img: smiliesPath + "draik.gif" },
          { code: "*elephante*", img: smiliesPath + "elephante.gif" },
          { code: "*eyrie*", img: smiliesPath + "eyrie.gif" },
          { code: "*flotsam*", img: smiliesPath + "flotsam.gif" },
          { code: "*gelert*", img: smiliesPath + "gelert.gif" },
          { code: "*gnorbu*", img: smiliesPath + "gnorbu.gif" },
          { code: "*grarrl*", img: smiliesPath + "grarrl.gif" },
          { code: "*grundo*", img: smiliesPath + "grundo.gif" },
          { code: "*hissi*", img: smiliesPath + "hissi.gif" },
          { code: "*ixi*", img: smiliesPath + "ixi.gif" },
          { code: "*jetsam*", img: smiliesPath + "jetsam.gif" },
          { code: "*jubjub*", img: smiliesPath + "jubjub.gif" },
          { code: "*kacheek*", img: smiliesPath + "kacheek.gif" },
          { code: "*kau*", img: smiliesPath + "kau.gif" },
          { code: "*kiko*", img: smiliesPath + "kiko.gif" },
          { code: "*koi*", img: smiliesPath + "koi.gif" },
          { code: "*korbat*", img: smiliesPath + "korbat.gif" },
          { code: "*kougra*", img: smiliesPath + "kougra.gif" },
          { code: "*krawk*", img: smiliesPath + "krawk.gif" },
          { code: "*kyrii*", img: smiliesPath + "kyrii.gif" },
          { code: "*lenny*", img: smiliesPath + "lenny.gif" },
          { code: "*lupe*", img: smiliesPath + "lupe.gif" },
          { code: "*lutari*", img: smiliesPath + "lutari.gif" },
          { code: "*meerca*", img: smiliesPath + "meerca.gif" },
          { code: "*moehog*", img: smiliesPath + "moehog.gif" },
          { code: "*mynci*", img: smiliesPath + "mynci.gif" },
          { code: "*nimmo*", img: smiliesPath + "nimmo.gif" },
          { code: "*ogrin*", img: smiliesPath + "ogrin.gif" },
          { code: "*peophin*", img: smiliesPath + "peophin.gif" },
          { code: "*poogle*", img: smiliesPath + "poogle.gif" },
          { code: "*pteri*", img: smiliesPath + "pteri.gif" },
          { code: "*quiggle*", img: smiliesPath + "quiggle.gif" },
          { code: "*ruki*", img: smiliesPath + "ruki.gif" },
          { code: "*scorchio*", img: smiliesPath + "scorchio.gif" },
          { code: "*shoyru*", img: smiliesPath + "shoyru.gif" },
          { code: "*skeith*", img: smiliesPath + "skeith.gif" },
          { code: "*techo*", img: smiliesPath + "techo.gif" },
          { code: "*tonu*", img: smiliesPath + "tonu.gif" },
          { code: "*tuskaninny*", img: smiliesPath + "tuskaninny.gif" },
          { code: "*uni*", img: smiliesPath + "uni.gif" },
          { code: "*usul*", img: smiliesPath + "usul.gif" },
          { code: "*vandagyre*", img: smiliesPath + "vandagyre.gif" },
          { code: "*wocky*", img: smiliesPath + "wocky.gif" },
          { code: "*xweetok*", img: smiliesPath + "xweetok.gif" },
          { code: "*yurble*", img: smiliesPath + "yurble.gif" },
          { code: "*zafara*", img: smiliesPath + "zafara.gif" },
        ],
      },
      {
        navClass: "subnavp2p3",
        img: smiliesPath + "slorg.gif",
        dropdownClass: "subnav-p2p3",
        smilies: [
          { code: "*angelpuss*", img: smiliesPath + "angelpuss.gif" },
          { code: "*feepit*", img: smiliesPath + "feepit.gif" },
          { code: "*jellykacheek*", img: smiliesPath + "jellykacheek.gif" },
          { code: "*jimmi*", img: smiliesPath + "jimmi.gif" },
          { code: "*jinjah*", img: smiliesPath + "jinjah.gif" },
          { code: "*kadoatery*", img: smiliesPath + "kadoatery.gif" },
          { code: "*kadoatie*", img: smiliesPath + "kadoatie.gif" },
          { code: "*larnikin*", img: smiliesPath + "larnikin.gif" },
          { code: "*meepit*", img: smiliesPath + "meepit.gif" },
          { code: "*meowclops*", img: smiliesPath + "meowclops.gif" },
          { code: "*mootix*", img: smiliesPath + "mootix.gif" },
          { code: "*niptor*", img: smiliesPath + "niptor.gif" },
          { code: "*noil*", img: smiliesPath + "noil.gif" },
          { code: "*pinchit*", img: smiliesPath + "pinchit.gif" },
          { code: "*plumpy*", img: smiliesPath + "plumpy.gif" },
          { code: "*purplebug*", img: smiliesPath + "purplebug.gif" },
          { code: "*slorg*", img: smiliesPath + "slorg.gif" },
          { code: "*snowbunny*", img: smiliesPath + "snowbunny.gif" },
          { code: "*spyder*", img: smiliesPath + "spyder.gif" },
          { code: "*swipe*", img: smiliesPath + "swipe.gif" },
          { code: "*warf*", img: smiliesPath + "warf.gif" },
          { code: "*weewoo*", img: smiliesPath + "weewoo.gif" },
          { code: "*woogy*", img: smiliesPath + "woogy.gif" },
          { code: "*yooyu*", img: smiliesPath + "yooyu.gif" },
          { code: "*zomutt*", img: smiliesPath + "zomutt.gif" },
        ],
      },
      {
        navClass: "subnavi",
        img: smiliesPath + "babypb.gif",
        dropdownClass: "subnav-i",
        smilies: [
          { code: "*babypb*", img: smiliesPath + "babypb.gif" },
          { code: "*bacon*", img: smiliesPath + "bacon.gif" },
          { code: "*baf*", img: smiliesPath + "baf.gif" },
          { code: "*battleduck*", img: smiliesPath + "battleduck.gif" },
          { code: "*bdf*", img: smiliesPath + "bdf.gif" },
          { code: "*bef*", img: smiliesPath + "bef.gif" },
          { code: "*bff*", img: smiliesPath + "bff.gif" },
          { code: "*bgc*", img: smiliesPath + "bgc.gif" },
          { code: "*blf*", img: smiliesPath + "blf.gif" },
          { code: "*bluesand*", img: smiliesPath + "bluesand.gif" },
          { code: "*blurf*", img: smiliesPath + "blurf.gif" },
          { code: "*book*", img: smiliesPath + "book.gif" },
          { code: "*bwf*", img: smiliesPath + "bwf.gif" },
          { code: "*codestone*", img: smiliesPath + "codestone.gif" },
          { code: "*cookie*", img: smiliesPath + "cookie.gif" },
          { code: "*cupcake*", img: smiliesPath + "cupcake.gif" },
          { code: "*dariganpb*", img: smiliesPath + "dariganpb.gif" },
          { code: "*dbd*", img: smiliesPath + "dbd.gif" },
          { code: "*dubloon*", img: smiliesPath + "dubloon.gif" },
          { code: "*eventidepb*", img: smiliesPath + "eventidepb.gif" },
          { code: "*eventidepppb*", img: smiliesPath + "eventidepppb.gif" },
          { code: "*faeriepb*", img: smiliesPath + "faeriepb.gif" },
          { code: "*greensand*", img: smiliesPath + "greensand.gif" },
          { code: "*icecream*", img: smiliesPath + "icecream.gif" },
          { code: "*islandpb*", img: smiliesPath + "islandpb.gif" },
          { code: "*jelly*", img: smiliesPath + "jelly.gif" },
          { code: "*maractitepb*", img: smiliesPath + "maractitepb.gif" },
          { code: "*mspp*", img: smiliesPath + "mspp.gif" },
          { code: "*omelette*", img: smiliesPath + "omelette.gif" },
          { code: "*orangesand*", img: smiliesPath + "orangesand.gif" },
          { code: "*pie*", img: smiliesPath + "pie.gif" },
          { code: "*pinksand*", img: smiliesPath + "pinksand.gif" },
          { code: "*piratepb*", img: smiliesPath + "piratepb.gif" },
          { code: "*popcorn*", img: smiliesPath + "popcorn.gif" },
          { code: "*scroll*", img: smiliesPath + "scroll.gif" },
          { code: "*sock*", img: smiliesPath + "sock.gif" },
          { code: "*starberry*", img: smiliesPath + "starberry.gif" },
          { code: "*stonepie*", img: smiliesPath + "stonepie.gif" },
          { code: "*suap*", img: smiliesPath + "suap.gif" },
          { code: "*tigerfruit*", img: smiliesPath + "tigerfruit.gif" },
          { code: "*twirlyfruit*", img: smiliesPath + "twirlyfruit.gif" },
          { code: "*ummagine*", img: smiliesPath + "ummagine.gif" },
          { code: "*woodlandpb*", img: smiliesPath + "woodlandpb.gif" },
          { code: "*wraithpb*", img: smiliesPath + "wraithpb.gif" },
        ],
      },
      {
        navClass: "subnavh",
        img: smiliesPath + "web.gif",
        dropdownClass: "subnav-h",
        smilies: [
          { code: "*aishadow*", img: smiliesPath + "aishadow.gif" },
          { code: "*angrynegg*", img: smiliesPath + "angrynegg.gif" },
          { code: "*bauble*", img: smiliesPath + "bauble.gif" },
          { code: "*bballoon*", img: smiliesPath + "bballoon.gif" },
          { code: "*brownleaf*", img: smiliesPath + "brownleaf.gif" },
          { code: "*candle*", img: smiliesPath + "candle.gif" },
          { code: "*candycane*", img: smiliesPath + "candycane.gif" },
          { code: "*creepyspyder*", img: smiliesPath + "creepyspyder.gif" },
          { code: "*eekeek*", img: smiliesPath + "eekeek.gif" },
          { code: "*fence*", img: smiliesPath + "fence.gif" },
          { code: "*festivalnegg*", img: smiliesPath + "festivalnegg.gif" },
          { code: "*firecrackers*", img: smiliesPath + "firecrackers.gif", title: "*firecrackers* is unusable due to the filters :(" },
          { code: "*fishnegg*", img: smiliesPath + "fishnegg.gif" },
          { code: "*flower*", img: smiliesPath + "flower.gif" },
          { code: "*gballoon*", img: smiliesPath + "gballoon.gif" },
          { code: "*ghost*", img: smiliesPath + "ghost.gif" },
          { code: "*happynegg*", img: smiliesPath + "happynegg.gif" },
          { code: "*heart*", img: smiliesPath + "heart.gif" },
          { code: "*holly*", img: smiliesPath + "holly.gif" },
          { code: "*jackolantern*", img: smiliesPath + "jackolantern.gif" },
          { code: "*leafleft*", img: smiliesPath + "leafleft.gif" },
          { code: "*leafright*", img: smiliesPath + "leafright.gif" },
          { code: "*luckydraik*", img: smiliesPath + "luckydraik.gif" },
          { code: "*mistletoe*", img: smiliesPath + "mistletoe.gif" },
          { code: "*negg*", img: smiliesPath + "negg.gif" },
          { code: "*paperlantern*", img: smiliesPath + "paperlantern.gif" },
          { code: "*present*", img: smiliesPath + "present.gif" },
          { code: "*pumpkin*", img: smiliesPath + "pumpkin.gif" },
          { code: "*rballoon*", img: smiliesPath + "rballoon.gif" },
          { code: "*redleaf*", img: smiliesPath + "redleaf.gif" },
          { code: "*rednose*", img: smiliesPath + "rednose.gif" },
          { code: "*roses*", img: smiliesPath + "roses.gif" },
          { code: "*santa*", img: smiliesPath + "santa.gif" },
          { code: "*shamrock*", img: smiliesPath + "shamrock.gif" },
          { code: "*snowflake*", img: smiliesPath + "snowflake.gif" },
          { code: "*snowman*", img: smiliesPath + "snowman.gif" },
          { code: "*spyder*", img: smiliesPath + "spyder.gif" },
          { code: "*tombstone*", img: smiliesPath + "tombstone.gif" },
          { code: "*web*", img: smiliesPath + "web.gif" },
          { code: "*witch*", img: smiliesPath + "witchhat.gif" },
          { code: "*xmastree*", img: smiliesPath + "xmastree.gif" },
          { code: "*yballoon*", img: smiliesPath + "yballoon.gif" },
          { code: "*yellowleaf*", img: smiliesPath + "yellowleaf.gif" },
        ],
      },
      {
        navClass: "subnavm",
        img: smiliesPath + "moon.gif",
        dropdownClass: "subnav-m",
        smilies: [
          { code: "*altador*", img: smiliesPath + "altador.gif" },
          { code: "*brightvale*", img: smiliesPath + "brightvale.gif" },
          { code: "*dacardia*", img: smiliesPath + "dacardia.gif" },
          { code: "*darigan*", img: smiliesPath + "darigan.gif" },
          { code: "*faerieland*", img: smiliesPath + "faerieland.gif" },
          { code: "*haunted*", img: smiliesPath + "haunted.gif" },
          { code: "*kikolake*", img: smiliesPath + "kikolake.gif" },
          { code: "*krawkisland*", img: smiliesPath + "krawkisland.gif" },
          { code: "*kreludor*", img: smiliesPath + "kreludor.gif" },
          { code: "*lostdesert*", img: smiliesPath + "lostdesert.gif" },
          { code: "*maraqua*", img: smiliesPath + "maraqua.gif" },
          { code: "*meridell*", img: smiliesPath + "meridell.gif" },
          { code: "*mystery*", img: smiliesPath + "mystery.gif" },
          { code: "*moltara*", img: smiliesPath + "moltara.gif" },
          { code: "*rooisland*", img: smiliesPath + "rooisland.gif" },
          { code: "*shenkuu*", img: smiliesPath + "shenkuu.gif" },
          { code: "*terror*", img: smiliesPath + "terror.gif" },
          { code: "*tyrannia*", img: smiliesPath + "tyrannia.gif" },
          { code: "*virtupets*", img: smiliesPath + "virtupets.gif" },
          { code: "*air*", img: smiliesPath + "air.gif" },
          { code: "*dark*", img: smiliesPath + "dark.gif" },
          { code: "*earth*", img: smiliesPath + "earth.gif" },
          { code: "*fire*", img: smiliesPath + "fire.gif" },
          { code: "*light*", img: smiliesPath + "light.gif" },
          { code: "*physical*", img: smiliesPath + "physical.gif" },
          { code: "*water*", img: smiliesPath + "water.gif" },
          { code: "*0.o.0*", img: smiliesPath + "0.o.0.gif" },
          { code: "*carrot*", img: smiliesPath + "carrot.gif" },
          { code: "*catfish*", img: smiliesPath + "catfish.gif" },
          { code: "*cloud*", img: smiliesPath + "cloud.gif" },
          { code: "*rainbow*", img: smiliesPath + "rainbow.gif" },
          { code: "*coffee*", img: smiliesPath + "coffee.gif" },
          { code: "*dung*", img: smiliesPath + "dung.gif" },
          { code: "*genie*", img: smiliesPath + "genie.gif" },
          { code: "*indubitably*", img: smiliesPath + "indubitably.gif" },
          { code: "*kqdoor*", img: smiliesPath + "kqdoor.gif" },
          { code: "*kqkey*", img: smiliesPath + "kqkey.gif" },
          { code: "*map*", img: smiliesPath + "map.gif" },
          { code: "*moneybag*", img: smiliesPath + "moneybag.gif" },
          { code: "*monocle*", img: smiliesPath + "monocle.gif" },
          { code: "*moon*", img: smiliesPath + "moon.gif" },
          { code: "*raincloud*", img: smiliesPath + "raincloud.gif" },
          { code: "*star*", img: smiliesPath + "star.gif" },
          { code: "*sun*", img: smiliesPath + "sun.gif" },
          { code: "*tea*", img: smiliesPath + "tea.gif" },
          { code: "*tophat*", img: smiliesPath + "tophat.gif" },
          { code: "*yarn*", img: smiliesPath + "yarn.gif" },
        ],
      },
      {
        navClass: "subnavd",
        img: smiliesPath + "smiley.gif",
        dropdownClass: "subnav-d",
        smilies: [
          { code: ":)", img: smiliesPath + "smiley.gif" },
          { code: "0:-)", img: smiliesPath + "angel.gif" },
          { code: ":o", img: smiliesPath + "oh.gif" },
          { code: ":(", img: smiliesPath + "sad.gif" },
          { code: ":D", img: smiliesPath + "grin.gif" },
          { code: "B)", img: smiliesPath + "sunglasses.gif" },
          { code: ":P", img: smiliesPath + "tongue.gif" },
          { code: ":K", img: smiliesPath + "vampire.gif" },
          { code: ";)", img: smiliesPath + "winking.gif" },
          { code: "*yarr*", img: smiliesPath + "yarr.gif" },
          { code: ":*", img: smiliesPath + "kisskiss.gif" },
          { code: "*angry*", img: smiliesPath + "angry.gif" },
          { code: "*complain*", img: smiliesPath + "complain.gif" },
          { code: "*facepalm*", img: smiliesPath + "facepalm.gif" },
          { code: "*cough*", img: smiliesPath + "cough.gif" },
          { code: "*lol*", img: smiliesPath + "lol.gif" },
          { code: "*unsure*", img: smiliesPath + "unsure.gif" },
          { code: "*cry*", img: smiliesPath + "cry.gif" },
          { code: "*clap*", img: smiliesPath + "clap.gif" },
          { code: "*violin*", img: smiliesPath + "violin.gif" },
        ],
      },
      {
        navClass: "subnavuser",
        img: themesPath + "v3/profile-icon.svg",
        dropdownClass: "subnav-user",
        smilies: [
          {code: "https://neopets.com/neomessages.phtml?type=send&recipient=" + appInsightsUserName, img: themesPath + "/v3/neomail-icon.svg", style: "height: 20px;"},
          {code: "https://neopets.com/island/tradingpost.phtml?type=browse&criteria=owner&search_string=" + appInsightsUserName, img: themesPath + "tradingpost-icon.png", style: "height: 20px;"},
          {code: "https://neopets.com/genie.phtml?type=find_user&auction_username=" + appInsightsUserName, img: themesPath + "auction-icon.png", style: "height: 20px;"},
          {code:"https://neopets.com/browseshop.phtml?owner=" + appInsightsUserName, img: themesPath + "myshop-icon.png", style: "height: 20px;"},
          {code: "https://neopets.com/gallery/index.phtml?gu=" + appInsightsUserName, img: themesPath + "v3/gallery-icon.svg", style: "height: 20px;"},
          {code:`
‎`, img: themesPath + "plus-circle.svg", style: "height: 20px;", title: "This is a newline + an empty character that can be used after links to avoid breaking fonts :)"},
        ],
      },
    ];
  }

  function createSmilieInterface() {
    const settingsValues = getSettingsValues();
    if (!settingsValues.smilieSettings.enableSmilies) return;

    const categories = getSmilieCategories();
    const smilies = `<div class="extraextrasmilies">
${categories.map(createSmilieCategory).join("\n")}
</div>`;

    addBufferSpace();
    insertSmiliesIntoPage(smilies);
    removeExistingSmilies();
  }

  function addBufferSpace() {
    let container = document.querySelector("div.container.theme-bg");
    if (container && !container.querySelector(".buffbuffer")) {
      let buff = document.createElement("div");
      buff.className = "buffbuffer";
      buff.style.height = "120px";
      container.appendChild(buff);
    }
  }

  function insertSmiliesIntoPage(smilies) {
    let replyRemainder = document.querySelector(".topicReplyRemainder");
    if (replyRemainder) replyRemainder.insertAdjacentHTML("beforeend", smilies);
    let topicCreateRemainder = document.querySelector(".topicCreateRemainder");
    if (topicCreateRemainder)
      topicCreateRemainder.insertAdjacentHTML("beforeend", smilies);
  }

  function removeExistingSmilies() {
    let replySmilies = document.querySelector(".replySmilies-neoboards");
    if (replySmilies) replySmilies.remove();
  }

  function addImageEmbeds() {
    const settingsValues = getSettingsValues();
    if (!settingsValues.smilieSettings.enableImageEmbeds) return;

    document.querySelectorAll("div.boardPostMessage").forEach((node) => {
      node.innerHTML = node.innerHTML.replace(
        /(?<!")(https?:\/\/[^"'<\s]+\.(?:png|jpg|jpeg|gif|svg))/gim,
        '<img src="$1" style="max-width: 100%; padding: 5px;"/>'
      );
    });
  }

  function addSmilieSettings() {
    ensureSettingsMenuExists();

    const settingsNone = document.getElementById("settings_none");
    if (settingsNone) settingsNone.remove();

    var nesSettings = document.getElementById("nes_settings");
    if (!nesSettings) return;

    if (nesSettings.dataset.smilieSettingsAdded === "1") return;
    nesSettings.dataset.smilieSettingsAdded = "1";

    const settingsValues = getSettingsValues();

    const settingsContainer = document.createElement("div");
    settingsContainer.id = "smilie-settings";
    settingsContainer.className = "settings-container";
    settingsContainer.innerHTML = "<h2 id='S-Settings'>Smilies</h2>";

    const settingsSection = document.createElement("div");
    settingsSection.id = "smilie-features-settings";
    settingsSection.className = "settings-section";
    settingsSection.innerHTML = `<h4 style="margin-bottom: 10px;">Features:</h4>
        <div class="smilie-settings-grid">
            <label for="EnableSmilies">Enable Smilies:</label>
            <input type="checkbox" id="EnableSmilies" ${
              settingsValues.smilieSettings.enableSmilies ? "checked" : ""
            }>

            <label for="EnableImageEmbeds">Enable Image Embeds:</label>
            <input type="checkbox" id="EnableImageEmbeds" ${
              settingsValues.smilieSettings.enableImageEmbeds ? "checked" : ""
            }>
        </div>
        <div style="text-align:center;margin-top:8px;">
            <button id="saveSmilieSettings" style="background: #e0e0e0; border: 2px solid #9f9f9f; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;">Save</button>
        </div>`;

    settingsContainer.appendChild(settingsSection);
    nesSettings.insertAdjacentElement("beforeend", settingsContainer);

    const saveSmilieSettings = document.getElementById("saveSmilieSettings");
    if (saveSmilieSettings) {
      saveSmilieSettings.addEventListener("click", function () {
        const enableSmilies = document.getElementById("EnableSmilies").checked;
        const enableImageEmbeds =
          document.getElementById("EnableImageEmbeds").checked;

        const updatedSmilieSettings = {
          enableSmilies,
          enableImageEmbeds,
        };

        setValue("smilieSettings", updatedSmilieSettings);
        noticePopup(
          "Smilie settings saved! Refresh the page for changes to take effect."
        );
      });
    }
  }

  function addEventListeners() {
    document.body.addEventListener("click", function (e) {
      if (e.target.closest(".smiley")) {
        e.preventDefault();
        const code = e.target.closest(".smiley").getAttribute("data-code");
        insertSmiley(code);
      }
    });
  }

  addBasicStyles();
  addSettingsStyles();
  addSmilieSettings();
  createSmilieInterface();
  addImageEmbeds();
  addEventListeners();
  trackFocusTargets();
})();
