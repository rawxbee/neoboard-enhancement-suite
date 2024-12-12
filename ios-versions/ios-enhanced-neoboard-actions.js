// ==UserScript==
// @name         Neopets: Enhanced Neoboard Actions Test
// @version      1.7.0
// @description  Adds buttons to each post that allows you to respond to the specific user, mail the specific user, view the specific user's auctions/trades/shop and refresh the thread. The script will also auto-select your last used pen.
// @author       rawbeee & sunbathr
// @match        *://www.neopets.com/neoboards/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-end
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
.neoboardPenTitle {
  display: none
</style>`).appendTo("head");

String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

function addImpress() {
    $(".boardPostMessage").each(function(i, message) {
        var text = $(message).html();
        var array = text.match(/(http|https)?:\/\/(impress|impress\-2020)\.openneo\.net\/user\S*?\/(closet|lists)|(impress|impress\-2020)\.openneo\.net\/user\S*?\/(closet|lists)|(http|https)?:\/\/(impress|impress\-2020)\.openneo\.net\/outfits\/\d+|(impress|impress\-2020)\.openneo\.net\/outfits\/\d+/g);
	if (!Array.isArray(array) || !array.length) {
            return;
        }
        else {
        unique(array).forEach(function(link) {
            var newlink = link.replace('http://', '').replace('https://', '');
            var embed = '<a href="https://' + newlink + '" target="_blank">' + link + '</a>';
            text = text.replaceAll(link, embed);
            });
        }
        if (text != -1) {
            $(message).replaceWith('<div class="boardPostMessage">' + text + '</div>');
        }

    });
}

addImpress();

function userActions() {
    $(".postAuthorInfo").each(function(i, info) {
        var user = $(info).find( ".postAuthorName" ).text().replace(/[^a-zA-Z 0-9 _]+/g, '');
            $(info).append(
                `<span class="actions" style=>
<a href="/neomessages.phtml?type=send&recipient=${user}"<div class="actionbtn" style="cursor:pointer;"><img src="http://images.neopets.com/themes/h5/basic/images/v3/neomail-icon.svg" style="height:20px; width:20px;"></div></a>
<a href="/island/tradingpost.phtml?type=browse&criteria=owner&search_string=${user}"<div class="actionbtn" style="cursor:pointer;"><img src="http://images.neopets.com/themes/h5/basic/images/tradingpost-icon.png" style="height:20px; width:20px;"></div></a>
<a href="/genie.phtml?type=find_user&auction_username=${user}"<div class="actionbtn" style="cursor:pointer;"><img src="http://images.neopets.com/themes/h5/basic/images/auction-icon.png" style="height:20px; width:20px;"></div></a>
<a href="/browseshop.phtml?owner=${user}"<div class="actionbtn" style="cursor:pointer;"><img src="http://images.neopets.com/themes/h5/basic/images/myshop-icon.png" style="height:20px; width:20px;"></div></a>
<a href="/gallery/index.phtml?gu=${user}"<div class="actionbtn" style="cursor:pointer;"><img src="http://images.neopets.com/themes/h5/basic/images/v3/gallery-icon.svg" style="height:20px; width:20px;"></div></a></span>`);
/* Mail, Auction, Shop, Gallery icons by Freepik (https://www.flaticon.com/authors/freepik) */
/* Exchange icon by Becris (https://www.flaticon.com/authors/becris)*/
    });
}

userActions();

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

replyTo();

function remLastPen() {
    $('input[type=radio][name="select_pen"]').click(function () {
    var clicked = $(this).attr("value")
    GM.setValue("LastPen", clicked);
    });
}
remLastPen();

function addModes() {
    $(".neoboardPens").prepend(`
<div class="neoboardPen">
   <img src="http://images.neopets.com/neoboards/smilies/map.gif" border="0">
      <label class="neoboardPenLabel" for="select_!">Remember</label>
         <input class="" type="radio" name="select_mode" value="0" title="When this mode is selected, clicking a pen will remember it for future page loads">
</div>
<p><div class="neoboardPen">
   <img src="http://images.neopets.com/neoboards/smilies/indubitably.gif" border="0">
      <label class="neoboardPenLabel" for="select_!">Random</label>
         <input class="" type="radio" name="select_mode" value="1" title="When this mode is selected, a random pen is selected for future page loads">
</div>`);

    $('input[type=radio][name="select_mode"]').click(function () {
        var clicked = $(this).attr("value")
        GM.setValue("Mode", clicked);
    });
}

addModes();

const penvar = async () => {
    const result = await GM.getValue("LastPen", 0);
    return result;
}

const modevar = async () => {
    const result = await GM.getValue("Mode", 0);
    return result;
}

function getPenVars() {
    Promise.all([penvar(1), modevar(1)]).then(result => {
        var pen = result[0];
        var mode = result[1];
            if (mode != 1) {
                var radBtn       = document.querySelector ('input[type=radio][name="select_pen"][value="' + pen + '"]');
                radBtn.checked   = true;
                var radBtn2      = document.querySelector ('input[type=radio][name="select_mode"][value="' + mode + '"]');
                radBtn2.checked  = true;
            }
            else {
                var max           = $( ".neoboardPen" ).length - 1;
                var rand_pen      = Math.floor(Math.random() * Math.floor(max));
                var rradBtn       = document.querySelector ('input[type=radio][name="select_pen"][value="' + rand_pen + '"]');
                rradBtn.checked   = true;
                var rradBtn2      = document.querySelector ('input[type=radio][name="select_mode"][value="' + mode + '"]');
                rradBtn2.checked  = true;

            }
    });
}
getPenVars();
