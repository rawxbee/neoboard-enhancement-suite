// ==UserScript==
// @name         Neopets: Highlight Followed Users
// @description  Underlines topics made by followed users, highlights their replies
// @version      1.0.1
// @author       sunbathr & rawbeee
// @match        http://www.neopets.com/neoboards/boardlist*
// @match        http://www.neopets.com/neoboards/topic*
// @require      http://code.jquery.com/jquery-latest.js
// @require      http://userscripts-mirror.org/scripts/source/107941.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==
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
.follow {
transition-duration: 0.2s;
}
.follow:hover {
transform: translateY(-2px);
}
.boardPostByline {
transition: background-color 1s ease;
}
</style>`).appendTo("head");

var followedUsers = GM_SuperValue.get("FollowedUsersNeopets", []);

function highlightFollowedUsers() {
  $("#boardList li").each(function(i, board) {
      if($.inArray($(board).find( ".author" ).text().replace(/[^a-zA-Z 0-9 _]+/g, ''), followedUsers) !== -1) {
          $(board).find( ".boardTopicTitle span" ).css("border-bottom", "3px solid #91bab3");
      }
  });
}


function followToggle() {
    $(".boardPostByline").each(function(i, byline) {
        var user = $(byline).find( ".postAuthorName" ).text().replace(/[^a-zA-Z 0-9 _]+/g, '');
        if($.inArray(user, followedUsers) !== -1) {
            $(byline).append( '<div class="follow" style="cursor: pointer; color: #999; font-size: 10px; position:absolute; bottom:0;"><p>UNFOLLOW</p></div>' );
            $(byline).css("background-color", "#edfcf8");
        }
        else {
            $(byline).append( '<div class="follow" style="cursor: pointer; color: #999; font-size: 10px; position:absolute; bottom:0;"><p>FOLLOW</p></div>' );
            $(byline).css("background-color", "#f3f3f3");
        }
    });
    $('.follow').click(function() {
         var updatingUser = $(this).parent().find( ".postAuthorName" ).text();
         if($.inArray(updatingUser, followedUsers) !== -1) {
             var newFollowedUsers = followedUsers.filter(function(elem) {
                 return elem != updatingUser;
             });
             followedUsers = newFollowedUsers;
         }
         else {
             followedUsers.push(updatingUser);
         }
        GM_SuperValue.set ("FollowedUsersNeopets", followedUsers);
        $(".follow").remove();
        followToggle();
     });
}

document.addEventListener('DOMContentLoaded', highlightFollowedUsers);
document.addEventListener('DOMContentLoaded', followToggle);
