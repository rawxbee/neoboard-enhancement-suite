// ==UserScript==
// @name         Neopets: Follow or Block Users
// @description  Follow users (highlight posts, underline boards); block users (hide posts, boards). Customize using settings gear!
// @version      1.4.0
// @author       sunbathr & rawbeee
// @match        *://www.neopets.com/neoboards/*
// @match        *://neopets.com/neoboards/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://images.neopets.com/themes/h5/altadorcup/images/settings-icon.png
// @run-at       document-end
// ==/UserScript==

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
// !!!!!!!!!!!!!!!!!!!! BEFORE UPDATING !!!!!!!!!!!!!!!!!!!!! //
// !!!!!!!!!!!!! SAVE YOUR BLOCK LIST SOMEWHERE !!!!!!!!!!!!! //
// !!!!!!! THIS UPDATE CHANGES HOW STORAGE IS HANDLED !!!!!!! //
// !!!!!!! YOU WILL NEED TO REBLOCK AND REFOLLOW USERS !!!!!! //
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //

function setValue(key, value) {
    GM_setValue(key, JSON.stringify(value));
}

function getValue(key, defaultValue) {
    const value = GM_getValue(key);
    if (value === undefined) {
        return defaultValue;
    }
    try {
        return JSON.parse(value);
    } catch (e) {
        return defaultValue;
    }
}

var FollowedBylineColors = getValue("FollowedBylineColorsNeopets", "#EDFCF8");
var FollowedUnderlineColors = getValue("FollowedUnderlineColorsNeopets", "#3B54B4");

$(`<style type='text/css'>
.postAuthorPetIcon img {
  border: 0px !important;
  border-radius: 3px;
}
div.boardPostByline {
  position: relative;
}
div.boardPost {
  position: relative;
}
div.postPetInfo {
  margin-bottom: 10px;
}
div.postPet {
  margin: 0px 0px 10px 0px;
}
.follow, .block {
transition-duration: 0.2s;
}
.follow:hover, .block:hover {
transform: translateY(-2px);
}
.boardPostByline {
transition: background-color 1s ease;
}
#settings_pop {
transform: translate(-50%, -50%);
margin-top: 0px !important;
margin-left: 0px !important;
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
#nes_settings {
  max-height: 300px;
  overflow-y: auto;
}
</style>`).appendTo("head");

var followedUsers = getValue("FollowedUsersNeopets", []);
var blockedUsers = getValue("BlockedUsersNeopets", []);

function highlightFollowedUsers() {
  $("#boardList li").each(function(i, board) {
      var user = $(board).find( ".author" ).text().replace(/[^a-zA-Z 0-9 _]+/g, '');
      if($.inArray(user, followedUsers) !== -1) {
          $(board).find( ".boardTopicTitle span" ).css("border-bottom", `3px solid` + FollowedUnderlineColors + ``);
      }
      /* blocked users */
      if ((user.length > 0) &&($.inArray(user, blockedUsers) !== -1)) {
          $(board).remove();
      }
  });
}


function followToggle() {
    $("#boardTopic li").each(function(i, post) {
        var user = $(post).find(".postAuthorName").text().replace(/[^a-zA-Z0-9_]+/g, '');
        var byline = $(post).find(".boardPostByline");

        if (blockedUsers.includes(user)) {
            $(post).remove();
            return;
        }

        byline.find(".follow-block-wrapper").remove();

        var wrapper = $(`
            <div class="follow-block-wrapper" style="position:absolute; bottom:0; left:5px; display:flex; gap:6px;">
                <div class="follow" style="cursor:pointer; font-size:10px; color:#999;"><p>${followedUsers.includes(user) ? "UNFOLLOW" : "FOLLOW"}</p></div>
                <div style="font-size:16px; color:#999;"> | </div>
                <div class="block" style="cursor:pointer; font-size:10px; color:#999;"><p>BLOCK</p></div>
            </div>
        `);

        byline.append(wrapper);

        if (followedUsers.includes(user)) {
            byline.css("background-color", FollowedBylineColors);
        } else {
            byline.css("background-color", "#f3f3f3");
        }

        var followBtn = wrapper.find(".follow");
        var blockBtn = wrapper.find(".block");

        followBtn.off().click(function () {
            if (followedUsers.includes(user)) {
                followedUsers = followedUsers.filter(u => u !== user);
            } else {
                followedUsers.push(user);
            }
            setValue("FollowedUsersNeopets", followedUsers);
            followToggle();
        });

        blockBtn.off().click(function () {
            if (confirm(`Are you sure you want to block '${user}'?`)) {
                if (!blockedUsers.includes(user)) {
                    blockedUsers.push(user);
                    setValue("BlockedUsersNeopets", blockedUsers);
                }
                $("#boardTopic li").each(function(i, p) {
                    var postUser = $(p).find(".postAuthorName").text().replace(/[^a-zA-Z0-9_]+/g, '');
                    if (postUser === user) {
                        $(p).remove();
                    }
                });
            }
        });
    });
}


function addSettings() {
        var settings_pop = `<div class="togglePopup__2020 movePopup__2020 settingspopup" id="settings_pop" style="display:none;">
		<div class="popup-header__2020">
			<h3 style="margin-bottom: 0px;">Neoboard-enhancement-suite Settings</h3>

<div class="popup-header-pattern__2020"></div>
		</div>
		<div class="popup-body__2020 id="settings-body" style="background-color: #f0f0f0; border: solid 2px #f0f0f0;">
<a href="http://www.neopets.com/neoboards/index.phtml">Index</a> | <a href="http://www.neopets.com/neoboards/preferences.phtml">Preferences</a> | <a href="https://github.com/rawxbee/neoboard-enhancement-suite">Suite</a>
<div id="nes_settings">
</div>
		</div>
		<div class="popup-footer__2020 popup-grid3__2020">
			<div class="popup-footer-pattern__2020"></div>
		</div>
	</div>`;

    var settings_follow = `
<h4 style="margin-bottom: 5px;">Neoboard Followed Users Colors:</h4>
<font style="font-size:10pt;">Enter your choice of color in hex format and save.</font>
<table style="margin-left: auto; margin-right: auto;">
<tr class="byline_update">
<p><td><label for="FollowedBylineColor">Followed Byline:</label></td>
<td><input type="text" id="FollowedBylineColor" name="FollowedByline" value="` + FollowedBylineColors + `"></td>
<td><button id="saveFollowedBylineColorButton">Save</button></td>
</tr>
<tr class="underline_update">
<td><label for="FollowedUnderline">Followed Underline:</label></td>
<td><input type="text" id="FollowedUnderlineColor" name="FollowedUnderlineColor" value="` + FollowedUnderlineColors + `"></td>
<td><button id="saveFollowedUnderlineColorButton">Save</button></td>
</tr>
</table></p><p></p>`;

        var settings_followed_users = `
<h4 style="margin-bottom: 5px;">Neoboard Followed Users:</h4>
<font style="font-size:10pt;">Enter a comma-separated list of users to follow. Do not include spaces.</font>
<table style="margin-left: auto; margin-right: auto;">
<tr class="followed_users_update">
<p><td><label for="followedUsersList">Followed users:</label></td>
<td><input type="text" id="followedUsersList" name="FollowedUsers" value="` + followedUsers.join(",") + `"></td>
<td><button id="saveFollowedUsersList">Save</button></td>
</tr>
</table></p><p></p>`;

        var settings_block = `
<h4 style="margin-bottom: 5px;">Neoboard Blocked Users:</h4>
<font style="font-size:10pt;">Enter a comma-separated list of users to block. Do not include spaces.</font>
<table style="margin-left: auto; margin-right: auto;">
<tr class="blocked_users_update">
<p><td><label for="blockedUsersList">Blocked users:</label></td>
<td><input type="text" id="blockedUsersList" name="BlockedUsers" value="` + blockedUsers.join(",") + `"></td>
<td><button id="saveBlockedUsersList">Save</button></td>
</tr>
</table></p><p></p>`;
    if ($("#settings_pop").length > 0) {
        $("#nes_settings").append(settings_follow);
        $("#nes_settings").append(settings_followed_users);
        $("#nes_settings").append(settings_block);
        $("#settings_none").remove();
    }
    else {
        $(`.navsub-left__2020`).append(`<span class="settings_btn" id="settings_btn" style="cursor:pointer;"><img src="http://images.neopets.com/themes/h5/basic/images/v3/settings-icon.svg" style="height:30px; width:30px;"></span>`);
        $(settings_pop).appendTo("body");
        $("#nes_settings").append(settings_follow);
        $("#nes_settings").append(settings_followed_users);
        $("#nes_settings").append(settings_block);

        var modal = document.getElementById("settings_pop");
        var btn = document.getElementById("settings_btn");

        $('#settings_btn').click(function() {
            if (modal.style.display !== "none"){
                modal.style.display = "none";
            } else {
                modal.style.display = "block";
            }
        });

        $('html').click(function(event) {
            if ($(event.target).closest('#settings_btn, #settings_pop').length === 0) {
                modal.style.display = "none";
            }
        });
    }
    document.getElementById ("saveFollowedBylineColorButton").addEventListener ("click", saveFollowedBylineColor);
    document.getElementById ("saveFollowedUnderlineColorButton").addEventListener ("click", saveFollowedUnderlineColor);
    document.getElementById ("saveFollowedUsersList").addEventListener ("click", saveFollowedUsersList);
    document.getElementById ("saveBlockedUsersList").addEventListener ("click", saveBlockedUsersList);
}

function saveFollowedBylineColor() {
    var clicked_bc = document.getElementById("FollowedBylineColor").value;
    setValue("FollowedBylineColorsNeopets", clicked_bc);
    $(".byline_update").after(`<tr><td></td><td><font style="font-size: 10pt; color:` + clicked_bc + `;">Updated.<br>Refresh to view changes.</font></td><td></td></tr>`);
}

function saveFollowedUnderlineColor() {
    var clicked_uc = document.getElementById("FollowedUnderlineColor").value;
    setValue("FollowedUnderlineColorsNeopets", clicked_uc);
    $(".underline_update").after(`<tr><td></td><td><font style="font-size: 10pt; color:` + clicked_uc + `;">Updated.<br>Refresh to view changes.</font></td><td></td></tr>`);
}

function saveFollowedUsersList() {
    var clicked_fu = document.getElementById("followedUsersList").value.split(",").filter(x => x.trim() !== "");
    setValue("FollowedUsersNeopets", clicked_fu);
    followedUsers = clicked_fu;
    $(".followed_users_update").after(`<tr><td></td><td><font style="font-size: 10pt;">Updated.<br>Refresh to view changes.</font></td><td></td></tr>`);
}

function saveBlockedUsersList() {
    var clicked_bc = document.getElementById("blockedUsersList").value.split(",").filter(x => x.trim() !== "");
    setValue("BlockedUsersNeopets", clicked_bc);
    $(".blocked_users_update").after(`<tr><td></td><td><font style="font-size: 10pt;">Updated.<br>Refresh to view changes.</font></td><td></td></tr>`);
}

highlightFollowedUsers();
followToggle();
addSettings();
