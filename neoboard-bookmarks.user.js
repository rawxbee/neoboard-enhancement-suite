// ==UserScript==
// @name         Neopets: Neoboard Bookmarks
// @version      1.5.1
// @author       sunbathr & rawbeee
// @description  Bookmarks for threads and boards. Look for the settings gear in the buffer to edit colors.
// @match        http://www.neopets.com/neoboards/*
// @require      http://code.jquery.com/jquery-latest.js
// @require      http://userscripts-mirror.org/scripts/source/107941.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

var BookmarkColors = GM_SuperValue.get("BookmarkedColorsNeopets", `#3B54B4`);
var BookmarkTextColors = GM_SuperValue.get("BookmarkedTextColorsNeopets", `#3B54B4`);

$(`<style type='text/css'>
#bookmarked_boards td {
  border: 1px solid #efefef;
  padding: 5px;
  font-family: "MuseoSansRounded500", 'Arial', sans-serif;
  valign : middle;
  font-size: 11px;
  width: 50px;
  height: 50px !important;
}
#bookmarked_boards td img {
  width: 50px;
}
#bookmarked_boards td a:link, #bookmarked_boards td a:visited {
  text-decoration: none;
  color: ` + BookmarkTextColors + ` !important;
  font-weight: bold;
  font-size: 15px;
  line-height: 25px;
}
#bookmarked_threads td {
  border: 1px solid #efefef;
  padding: 10px;
  font-family: "MuseoSansRounded500", 'Arial', sans-serif;
  valign : middle;
  font-size: 11px;
  width: 780px;
  text-align: center;
}
#bookmarked_threads td a:link, #bookmarked_threads td a:visited {
  text-decoration: none;
  color: ` + BookmarkTextColors + ` !important;
  font-size: 14px;
  line-height: 25px;
}
#neonav a:link, #neonav a:visited {
  text-decoration: none;
  color: ` + BookmarkTextColors + ` !important;
  font-size: 14px;
  line-height: 25px;
}
.collapsible_bookmarks {
  background-color: ` + BookmarkColors + `;
  color: white;
  cursor: pointer;
  padding: 5px;
  width: 100%;
  border: none;
  text-align: center;
  outline: none;
  font-size: 15px;
  font-weight: bold;
  font-family: "MuseoSansRounded500", 'Arial', sans-serif;
  border-radius: 3px;
}
.threadfollow {
  color: white;
  cursor: pointer;
  padding: 0px;
  border: none;
  text-align: center;
  outline: none;
  font-size: 12px;
  font-weight: bold;
  font-family: "MuseoSansRounded500", 'Arial', sans-serif;
  border-radius: 3px;
  width:214px;
  height: 31px;
  margin: 3px;
  padding-bottom: 35px;
}
.collapsiblefollow {
  color: white;
  cursor: pointer;
  border: none;
  text-align: center;
  outline: none;
  font-size: 9px;
  font-weight: bold;
  font-family: "MuseoSansRounded500", 'Arial', sans-serif;
  border-radius: 3px;
  width:25px;
  height: 25px;
  float: right;
  position: absolute;
  margin-left: -30px;
  margin-top: 4px;
}
.boardfollow {
  color: white;
  cursor: pointer;
  padding: 0px;
  border: none;
  text-align: center;
  outline: none;
  font-size: 12px;
  font-weight: bold;
  font-family: "MuseoSansRounded500", 'Arial', sans-serif;
  border-radius: 3px;
  width: 80px;
  height: 20px;
  float: right;
  padding-bottom: 10px;
  margin-top: 3px;
}

.active {
  background-color: ` + BookmarkColors + `;
}

.content_collapsed {
  display: none;
  overflow: hidden;
  font-size: 10px;
}
tr button p {
  margin-top: 6px;
}
.togglePopup__2020.settingspopup {
  max-width:40%;
  left: 30%;
  top: 27%;
z-index:100;
}
</style>`).appendTo("head");

var followedThreads = GM_SuperValue.get("BookmarkedThreadsNeopets", []);
var followedBoards = GM_SuperValue.get("BookmarkedBoardsNeopets", []);

function displayBookmarks() {
    var bookmarked_thread_html = ``;
    followedThreads.forEach(function(entry) {
    var populate = `<tr id="bookmarked_threads">
                        <td class="bookmark" style="padding: 3px !important; font-size: 14px; width: 100%;">
                        ${entry}
                        </td>
                    </tr>`;
    bookmarked_thread_html += populate;
    });
    var bookmarked_board_html = ``;
    followedBoards.forEach(function(entree) {
    var popul8 = `${entree}`;
    bookmarked_board_html += popul8;
});
  var recently_viewed_section = `
                <center><div class="bookmarkedbt" style="margin: 10px;">
                <table>
<tr id="bookmarked_boards" style="display: flex; flex-wrap: wrap; justify-content: center;">
${bookmarked_board_html}
</tr>
<tr id="bookmarked_threads" style="display: flex; flex-wrap: wrap; justify-content: center;">
    <td colspan="12" style="border: 0px;">
        <button type="button" class="collapsible_bookmarks">Bookmarked Threads</button>
            <div class="content_collapsed">
                <table style="width:100%;">
                ${bookmarked_thread_html}
                </table>
            </div>
     </td>
</tr>
                </table></div></center>`;
  $("#boardIndex").before(recently_viewed_section);
  $("#boardTopic").before(recently_viewed_section);
  $("#boardList").before(recently_viewed_section);
  $("#boardCreateTopic").before(recently_viewed_section);
}

function displayBookmarkedThreads() {
var coll = document.getElementsByClassName("collapsible_bookmarks");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
}

function followBoardsToggle() {
    $(`.boardIcon.premiumLockedIcon`).parent().prev().remove();
    $(`.boardIcon.premiumLockedIcon`).parent().remove();
    $("#boardIndex ul li .boardDesc").each(function(i, index) {
        var board = $(index).find("a h4").text();
        var link = $(index).html().match(/(?<=<a href=").*?(?="><h4>)/g)[0];
        var icon = $(index).parent().html().match(/(?<=url\().*?(?=\))/g);
        var html = `<td><a href="${link}"><img src="${icon}" title="${board}"></a><br></td>`;
        if($.inArray(html, followedBoards) !== -1) {
            $(index).append( '<button type="button" class="boardfollow" style="background-color: #cacaca;"><p style="margin:3px;">REMOVE</p></button>' );
        }
        else {
            $(index).append( `<button type="button" class="boardfollow" style="background-color: ` + BookmarkColors + `;"><p style="margin:3px;">ADD</p></button>` );
        }
    });
    $('.boardfollow').click(function() {
        var updatingboard = $(this).parent().parent().find( ".boardDesc a h4" ).text();
        var updatinglink = $(this).parent().parent().find( ".boardDesc" ).html().match(/(?<=<a href=").*?(?="><h4>)/g)[0];
        var updatingicon = $(this).parent().parent().html().match(/(?<=url\().*?(?=\))/g);
        var updatinghtml = `<td><a href="${updatinglink}"><img src="${updatingicon}" title="${updatingboard}"></a><br></td>`;
         if($.inArray(updatinghtml, followedBoards) !== -1) {
             var newFollowedBoards = followedBoards.filter(function(elem) {
                 return elem != updatinghtml;
             });
             followedBoards = newFollowedBoards;
         }
         else {
             followedBoards.push(updatinghtml);
         }
        GM_SuperValue.set ("BookmarkedBoardsNeopets", followedBoards);
        $(".boardfollow").remove();
        followBoardsToggle();
        $(".threadfollow").remove();
        followThreadsToggle();
        $(".bookmarkedbt").remove();
        $("#neonav").remove();
        displayBookmarks();
        displayBookmarkedThreads();
        $(".collapsiblefollow").remove();
        followThreadsToggleCollapsible();
     });
}

function followThreadsToggle() {
    $(".topicTitle").each(function(i, title) {
        var thread = $(`.topicNavTop`).html().match(/(?<=<\/a>\n\t\t\t\t).*?(?=\n\t\t\t<\/div>)/g)[0];
        var thread_title = thread.replace("Topic: ", "").replace("<h1>", "").replace("</h1>", "").replace(/(?<=&amp;).*?(?=">)/);
        if($.inArray(thread_title, followedThreads) !== -1) {
            $(title).after( '<button type="button" class="threadfollow" style="background-color: #cacaca;"><p>UNBOOKMARK</p></button>' );
        }
        else {
            $(title).after( `<button type="button" class="threadfollow" style="background-color: ` + BookmarkColors + `;"><p>BOOKMARK</p></button>` );
        }
    });
    $('.threadfollow').click(function() {
         var updating = $(`.topicNavTop`).html().match(/(?<=<\/a>\n\t\t\t\t).*?(?=\n\t\t\t<\/div>)/g)[0];
         var updatingThread = updating.replace("Topic: ", "").replace("<h1>", "").replace("</h1>", "").replace(/(?<=&amp;).*?(?=">)/);
         if($.inArray(updatingThread, followedThreads) !== -1) {
             var newFollowedThreads = followedThreads.filter(function(elem) {
                 return elem != updatingThread;
             });
             followedThreads = newFollowedThreads;
         }
         else {
             followedThreads.push(updatingThread);
         }
        GM_SuperValue.set ("BookmarkedThreadsNeopets", followedThreads);
        $(".threadfollow").remove();
        followThreadsToggle();
        $(".bookmarkedbt").remove();
        $("#neonav").remove();
        displayBookmarks();
        displayBookmarkedThreads();
        $(".collapsiblefollow").remove();
        followThreadsToggleCollapsible();
        $(".content_collapsed").css("display", "block");
     });
}
function followThreadsToggleCollapsible() {
    $(".bookmark").each(function(i, bookmark) {
            $(bookmark).parent().append( '<button type="button" class="collapsiblefollow" style="background-color: #cacaca;"><p>X</p></button>' );
    });
    $('.collapsiblefollow').click(function() {
         var updatingThread = $(this).parent().find( ".bookmark" ).html().replace(/(\n\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s)/g, ``);
         if($.inArray(updatingThread, followedThreads) !== -1) {
             var newFollowedThreads = followedThreads.filter(function(elem) {
                 return elem != updatingThread;
             });
             followedThreads = newFollowedThreads;
         }
         else {
             followedThreads.push(updatingThread);
         }
        GM_SuperValue.set ("BookmarkedThreadsNeopets", followedThreads);
        $(".threadfollow").remove();
        followThreadsToggle();
        $(".bookmarkedbt").remove();
        $("#neonav").remove();
        displayBookmarks();
        displayBookmarkedThreads();
        $(".collapsiblefollow").remove();
        followThreadsToggleCollapsible();
        $(".content_collapsed").css("display", "block");
     });
}

function addSettings() {
    var settings_pop = `<div class="togglePopup__2020 movePopup__2020 settingspopup" id="settings_pop" style="display:none;">
		<div class="popup-header__2020">
			<h3>Neoboard-enhancement-suite Settings</h3>


<div class="popup-header-pattern__2020"></div>
		</div>
		<div class="popup-body__2020" style="background-color: #f0f0f0; border: solid 2px #f0f0f0;">
<font style="font-size:10pt;">Enter your choice of color in hex format and save. Refresh to view changes.</font>
<div id="nes_settings">

</div>
		</div>
		<div class="popup-footer__2020 popup-grid3__2020">
			<div class="popup-footer-pattern__2020"></div>
		</div>
	</div>`;

    var settings = `
<h4>Neoboard Bookmarks Colors:</h4>

<table style="margin-left: auto; margin-right: auto;">
<tr class="bookmark_update">
<p><td><label for="BookmarksColor">Bookmark Buttons:</label></td>
<td><input type="text" id="BookmarksColor" name="BookmarksColor" value="` + BookmarkColors + `"></td>
<td><button id="saveBookmarksColorButton">Save</button></td>
</tr>
<tr class="bookmarktext_update">
<td><label for="BookmarksTextColor">Bookmarks Text:</label></td>
<td><input type="text" id="BookmarksTextColor" name="BookmarksTextColor" value="` + BookmarkTextColors + `"></td>
<td><button id="saveBookmarksTextColorButton">Save</button></td>
</tr>
</table></p><p></p>`;

    if ($("#settings_pop").length > 0) {
        $("#nes_settings").append(settings);
    }
    else {
        $(`.navsub-left__2020`).append(`<span class="settings_btn" id="settings_btn" style="cursor:pointer;"><img src="http://images.neopets.com/themes/h5/basic/images/v3/settings-icon.svg" style="height:30px; width:30px;"></span>`);
        $(settings_pop).appendTo("body");
        $("#nes_settings").append(settings);

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
    document.getElementById ("saveBookmarksColorButton").addEventListener ("click", saveBookmarksColor);
    document.getElementById ("saveBookmarksTextColorButton").addEventListener ("click", saveBookmarksTextColor);
}
function saveBookmarksColor() {
    var clicked_bc = document.getElementById("BookmarksColor").value;
    GM_SuperValue.set ("BookmarkedColorsNeopets", clicked_bc);
   $(".bookmark_update").after(`<tr><td></td><td><font style="font-size: 10pt; color:` + clicked_bc + `;">Updated.</font></td><td></td></tr>`);

}
function saveBookmarksTextColor() {
    var clicked_btc = document.getElementById("BookmarksTextColor").value;
    GM_SuperValue.set ("BookmarkedTextColorsNeopets", clicked_btc);
    $(".bookmarktext_update").after(`<tr><td></td><td><font style="font-size: 10pt; color:` + clicked_btc + `;">Updated.</font></td><td></td></tr>`);
}



document.addEventListener('DOMContentLoaded', displayBookmarks);
document.addEventListener('DOMContentLoaded', displayBookmarkedThreads);
document.addEventListener('DOMContentLoaded', followBoardsToggle);
document.addEventListener('DOMContentLoaded', followThreadsToggle);
document.addEventListener('DOMContentLoaded', followThreadsToggleCollapsible);
document.addEventListener('DOMContentLoaded', addSettings);
