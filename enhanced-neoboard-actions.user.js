// ==UserScript==
// @name         Neopets: Enhanced Neoboard Actions
// @version      1.3.1
// @description  Adds buttons to each post that allows you to respond to the specific user, mail the specific user, view the specific user's auctions/trades/shop and refresh the thread. The script will also auto-select your last used pen.
// @author       rawbeee & sunbathr
// @match        http://www.neopets.com/neoboards/topic*
// @require      http://code.jquery.com/jquery-latest.js
// @require      http://userscripts-mirror.org/scripts/source/107941.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==
$(`<style type='text/css'>
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
.reportButton-neoboards:hover {
  background-color: transparent !important;
  color: red !important;
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
div.rotateRefresh {
transform: rotate(-45deg);
transition-duration: 2s;

}
div.rotateRefresh:hover {
transform: rotate(315deg);
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
</style>`).appendTo("head");

function replyTo() {
    $(".boardPostByline").each(function(i, byline) {
        var user = $(byline).find( ".postAuthorName" ).text().replace(/[^a-zA-Z 0-9 _]+/g, '');
            $(byline).append(`<div class="replyTo" style="cursor: pointer; color: #999; font-size: 10px; position:absolute; bottom:0; right:8px;"><p>REPLY </p></div>`);
    });
$('.replyTo').click(function fillReply() {
    var form_obj	= document.message_form;
    var user = $(this).parent().find( ".postAuthorName" ).text();
    form_obj.message.value += "@" + user + " ";
    form_obj.message.focus();
     });
}
function userActions() {
    $(".postAuthorInfo").each(function(i, info) {
        var user = $(info).find( ".postAuthorName" ).text().replace(/[^a-zA-Z 0-9 _]+/g, '');
            $(info).append(
                `<span class="actions" style=>
<a href="/neomessages.phtml?type=send&recipient=${user}"<div class="actionbtn" style="cursor:pointer;"><img src="https://www.flaticon.com/svg/static/icons/svg/646/646094.svg" style="height:15px; width:15px;"></div></a>
<a href="/island/tradingpost.phtml?type=browse&criteria=owner&search_string=${user}"<div class="actionbtn" style="cursor:pointer;"><img src="https://www.flaticon.com/svg/static/icons/svg/876/876784.svg" style="height:15px; width:15px;"></div></a>
<a href="/genie.phtml?type=find_user&auction_username=${user}"<div class="actionbtn" style="cursor:pointer;"><img src="https://www.flaticon.com/svg/static/icons/svg/783/783196.svg" style="height:15px; width:15px;"></div></a>
<a href="/browseshop.phtml?owner=${user}"<div class="actionbtn" style="cursor:pointer;"><img src="https://www.flaticon.com/svg/static/icons/svg/1170/1170678.svg" style="height:15px; width:15px;"></div></a></span>`);
/* Mail, Auction, Shop icons by Freepik (https://www.flaticon.com/authors/freepik) */
/* Exchange icon by Becris (https://www.flaticon.com/authors/becris)*/
    });
}

function refreshThread() {
$(`.reportButton-neoboards`).before(`
<div class="rotateRefresh" onClick="location.reload();" style="position:absolute; bottom:20px; right:15.5px; cursor:pointer;">
<img src="https://www.flaticon.com/svg/static/icons/svg/117/117115.svg" style="height:15px; width:15px;"></div>`);
}
/* Icon by Vectors Market (https://www.flaticon.com/authors/vectors-market)*/

var pen = GM_SuperValue.get ("LastPen", 0)

function remLastPen() {
    $('input[type=radio][name="select_pen"]').click(function () {
    var clicked = $(this).attr("value")
    GM_SuperValue.set ("LastPen", clicked);
    });
}

function postLastPen() {
    var radBtn      = document.querySelector ('input[type=radio][name="select_pen"][value="' + pen + '"]');
    radBtn.checked  = true;
    };

document.addEventListener('DOMContentLoaded', replyTo);
document.addEventListener('DOMContentLoaded', userActions);
document.addEventListener('DOMContentLoaded', refreshThread);
document.addEventListener('DOMContentLoaded', postLastPen);
document.addEventListener('DOMContentLoaded', remLastPen);
