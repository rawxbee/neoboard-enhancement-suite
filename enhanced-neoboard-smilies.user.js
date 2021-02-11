// ==UserScript==
// @name         Neopets: Enhanced Neoboard Smilies
// @version      1.3.1
// @description  Adds the entire smilie library to the smilie section of the neoboards. Embeds image links from images.neopets or pets.neopets as images within replies, a search bar is available to find images.
// @author       sunbathr & rawbeee
// @match        http://www.neopets.com/neoboards/create_topic*
// @match        http://www.neopets.com/neoboards/topic*
// @require      http://code.jquery.com/jquery-latest.js
// @run-at       document-start
// ==/UserScript==
$(`<style type='text/css'>
.subnavc, .subnavp, .subnavp2p3, .subnavi, .subnavh, .subnavm, .subnavd, .subnavuser {
  float: left;
  overflow: hidden;
  padding: 1px;
}
.subnav-c, .subnav-p, .subnav-p2p3, .subnav-i, .subnav-h, .subnav-m, .subnav-d, .subnav-user {
  display: none;
  position: absolute;
  background-color: white;
  overflow: auto;
  z-index: 1;
  border-radius: 15px;
  border: 1px solid #cacaca;
  background-color: white;
  padding: 2px;
}
.subnavc:hover .subnav-c, .subnavp:hover .subnav-p, .subnavp2p3:hover .subnav-p2p3, .subnavi:hover .subnav-i, .subnavh:hover .subnav-h, .subnavm:hover .subnav-m, .subnavd:hover .subnav-d, .subnavuser:hover .subnav-user {
  display: block;
}
.subnav-c {
  left: 45px;
}
.subnav-p {
  left: 90px;
}
.subnav-p2p3 {
  left: 100px;
}
.subnav-i {
  left: 130px;
}
.subnav-h {
  left: 150px;
}
.subnav-m {
  left: 160px;
}
.subnav-d {
  left: 185px;
}
.subnav-user {
  left: 268px;
}
.subnav-c::-webkit-scrollbar, .subnav-m::-webkit-scrollbar, .subnav-h::-webkit-scrollbar, .subnav-i::-webkit-scrollbar, .subnav-p2p3::-webkit-scrollbar, .subnav-p::-webkit-scrollbar, .subnav-d::-webkit-scrollbar, .subnav-user::-webkit-scrollbar {
    display: none;  /* Safari and Chrome */
}
.replySmilies-neoboards, .topicCreateSmilies-neoboards {
  text-align: center;
  width: 200px;
}
.topicCreateIcons, .topicReplyIcons {
  margin-left: 40px !important;
}
</style>`).appendTo("head");

function smile() {
    var smilies = `<div class="extraextrasmilies" style="text-align: center; margin-left:10px;">
<div class="subnavc">
    <img src="http://images.neopets.com/neoboards/smilies/mrcoconut.gif">
    <div class="subnav-c"><center>
<table style="width:100%; text-align: center;">
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*aaa*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/aaa.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*abigail*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/abigail.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*angrylawyerbot*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/angrylawyerbot.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*awakened*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/awakened.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*boatswain*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/boatswain.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*brutes*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/brutes.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*brynn*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/brynn.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*cabinboy*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/cabinboy.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*capn3legs*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/capn3legs.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*dreamy*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/dreamy.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*coltzan*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/coltzan.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*cook*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/cook.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*fyora*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/fyora.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*gunner*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/gunner.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*hanso*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/hanso.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*happiness*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/happiness.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*illusen*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/illusen.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*jazan*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/jazan.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*jhudora*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/jhudora.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*lawyerbot*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/lawyerbot.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*mate*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/mate.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*mipsy*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/mipsy.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*mrcoconut*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/mrcoconut.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*nabile*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/nabile.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*nox*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/nox.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*order*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/order.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*quartermaster*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/quartermaster.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*rigger*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/rigger.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*rohane*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/rohane.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*rower*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/rower.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*seekers*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/seekers.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*shopwiz*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/shopwiz.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*sloth*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/sloth.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*snowager*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/snowager.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*swabbie*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/swabbie.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*sway*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/sway.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*talinia*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/talinia.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*techomaster*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/techomaster.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*thieves*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/thieves.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*turmaculus*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/turmaculus.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*velm*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/velm.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*wizard*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/wizard.gif" alt="" border="0"></a></td>
</tr>
</center>
</table>

    </div>
  </div>
<div class="subnavp">
    <img src="http://images.neopets.com/neoboards/smilies/lenny.gif">
    <div class="subnav-p"><center>
<table style="width:100%; text-align: center;">
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*acara*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/acara.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*aisha*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/aisha.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*blumaroo*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/blumaroo.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*bori*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/bori.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*bruce*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/bruce.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*buzz*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/buzz.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*chia*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/chia.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*chomby*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/chomby.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*cybunny*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/cybunny.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*draik*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/draik.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*elephante*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/elephante.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*eyrie*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/eyrie.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*flotsam*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/flotsam.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*gelert*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/gelert.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*gnorbu*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/gnorbu.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*grarrl*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/grarrl.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*grundo*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/grundo.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*hissi*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/hissi.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*ixi*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/ixi.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*jetsam*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/jetsam.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*jubjub*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/jubjub.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*kacheek*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/kacheek.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*kau*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/kau.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*kiko*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/kiko.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*koi*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/koi.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*korbat*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/korbat.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*kougra*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/kougra.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*krawk*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/krawk.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*kyrii*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/kyrii.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*lenny*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/lenny.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*lupe*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/lupe.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*lutari*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/lutari.gif" alt="" border="0"></a></td>

</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*meerca*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/meerca.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*moehog*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/moehog.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*mynci*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/mynci.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*nimmo*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/nimmo.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*ogrin*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/ogrin.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*peophin*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/peophin.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*poogle*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/poogle.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*pteri*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/pteri.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*quiggle*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/quiggle.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*ruki*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/ruki.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*scorchio*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/scorchio.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*shoyru*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/shoyru.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*skeith*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/skeith.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*techo*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/techo.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*tonu*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/tonu.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*tuskaninny*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/tuskaninny.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*uni*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/uni.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*usul*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/usul.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*vandagyre*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/vandagyre.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*wocky*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/wocky.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*xweetok*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/xweetok.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*yurble*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/yurble.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*zafara*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/zafara.gif" alt="" border="0"></a></td>
</tr>
</center>
</table>

    </div>
  </div>
<div class="subnavp2p3">
    <img src="http://images.neopets.com/neoboards/smilies/slorg.gif">
    <div class="subnav-p2p3"><center>
<table style="width:100%; text-align: center;">
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*angelpuss*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/angelpuss.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*feepit*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/feepit.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*jellykacheek*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/jellykacheek.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*jimmi*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/jimmi.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*jinjah*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/jinjah.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*kadoatery*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/kadoatery.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*kadoatie*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/kadoatie.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*larnikin*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/larnikin.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*meepit*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/meepit.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*meowclops*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/meowclops.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*mootix*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/mootix.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*niptor*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/niptor.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*noil*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/noil.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*pinchit*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/pinchit.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*plumpy*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/plumpy.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*purplebug*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/purplebug.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*slorg*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/slorg.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*snowbunny*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/snowbunny.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*spyder*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/spyder.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*swipe*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/swipe.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*warf*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/warf.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*weewoo*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/weewoo.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*woogy*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/woogy.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*yooyu*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/yooyu.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*zomutt*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/zomutt.gif" alt="" border="0"></a></td>
</tr>
</center>
</table>

    </div>
  </div>
<div class="subnavi">
    <img src="http://images.neopets.com/neoboards/smilies/babypb.gif">
    <div class="subnav-i"><center>
<table style="width:100%; text-align: center;">
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*babypb*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/babypb.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*bacon*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/bacon.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*baf*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/baf.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*battleduck*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/battleduck.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*bdf*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/bdf.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*bef*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/bef.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*bff*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/bff.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*bgc*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/bgc.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*blf*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/blf.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*bluesand*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/bluesand.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*blurf*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/blurf.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*book*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/book.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*bwf*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/bwf.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*codestone*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/codestone.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*cookie*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/cookie.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*cupcake*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/cupcake.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*dariganpb*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/dariganpb.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*dbd*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/dbd.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*dubloon*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/dubloon.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*eventidepb*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/eventidepb.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*eventidepppb*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/eventidepppb.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*faeriepb*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/faeriepb.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*greensand*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/greensand.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*icecream*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/icecream.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*islandpb*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/islandpb.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*jelly*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/jelly.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*maractitepb*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/maractitepb.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*mspp*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/mspp.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*omelette*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/omelette.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*orangesand*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/orangesand.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*pie*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/pie.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*pinksand*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/pinksand.gif" alt="" border="0"></a></td>

</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*piratepb*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/piratepb.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*popcorn*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/popcorn.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*scroll*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/scroll.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*sock*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/sock.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*starberry*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/starberry.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*stonepie*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/stonepie.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*suap*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/suap.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*tigerfruit*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/tigerfruit.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*twirlyfruit*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/twirlyfruit.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*ummagine*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/ummagine.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*woodlandpb*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/woodlandpb.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*wraithpb*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/wraithpb.gif" alt="" border="0"></a></td>
</tr>
</center>
</table>

    </div>
  </div>
<div class="subnavh">
    <img src="http://images.neopets.com/neoboards/smilies/web.gif">
    <div class="subnav-h"><center>
<table style="width:100%; text-align: center;">
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*aishadow*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/aishadow.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*angrynegg*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/angrynegg.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*bauble*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/bauble.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*bballoon*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/bballoon.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*brownleaf*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/brownleaf.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*candle*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/candle.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*candycane*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/candycane.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*creepyspyder*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/creepyspyder.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*eekeek*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/eekeek.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*fence*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/fence.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*festivalnegg*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/festivalnegg.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*firecrackers*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/firecrackers.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*fishnegg*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/fishnegg.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*flower*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/flower.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*gballoon*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/gballoon.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*ghost*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/ghost.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*happynegg*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/happynegg.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*heart*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/heart.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*holly*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/holly.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*jackolantern*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/jackolantern.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*leafleft*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/leafleft.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*leafright*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/leafright.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*luckydraik*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/luckydraik.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*mistletoe*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/mistletoe.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*negg*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/negg.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*paperlantern*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/paperlantern.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*present*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/present.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*pumpkin*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/pumpkin.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*rballoon*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/rballoon.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*redleaf*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/redleaf.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*rednose*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/rednose.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*roses*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/roses.gif" alt="" border="0"></a></td>

</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*santa*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/santa.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*shamrock*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/shamrock.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*snowflake*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/snowflake.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*snowman*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/snowman.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*spyder*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/spyder.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*tombstone*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/tombstone.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*web*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/web.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*witch*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/witchhat.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*xmastree*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/xmastree.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*yballoon*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/yballoon.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*yellowleaf*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/yellowleaf.gif" alt="" border="0"></a></td>
</tr>

</center>
</table>

    </div>
  </div>
<div class="subnavm">
    <img src="http://images.neopets.com/neoboards/smilies/moon.gif">
    <div class="subnav-m"><center>
<table style="width:100%; text-align: center;">
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*altador*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/altador.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*brightvale*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/brightvale.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*darigan*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/darigan.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*faerieland*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/faerieland.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*haunted*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/haunted.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*kikolake*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/kikolake.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*krawkisland*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/krawkisland.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*kreludor*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/kreludor.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*lostdesert*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/lostdesert.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*maraqua*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/maraqua.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*meridell*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/meridell.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*mystery*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/mystery.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*moltara*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/moltara.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*rooisland*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/rooisland.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*shenkuu*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/shenkuu.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*terror*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/terror.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*tyrannia*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/tyrannia.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*virtupets*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/virtupets.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*air*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/air.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*dark*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/dark.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*earth*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/earth.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*fire*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/fire.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*light*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/light.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*physical*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/physical.gif" alt="" border="0"></a></td>

</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*water*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/water.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*0.o.0*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/0.o.0.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*carrot*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/carrot.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*catfish*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/catfish.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*cloud*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/cloud.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*coffee*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/coffee.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*dung*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/dung.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*genie*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/genie.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*indubitably*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/indubitably.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*kqdoor*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/kqdoor.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*kqkey*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/kqkey.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*map*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/map.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*moneybag*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/moneybag.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*monocle*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/monocle.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*moon*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/moon.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*raincloud*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/raincloud.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*star*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/star.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*sun*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/sun.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*tea*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/tea.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*tophat*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/tophat.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*yarn*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/yarn.gif" alt="" border="0"></a></td>
</tr>
</center>
</table>

    </div>
  </div>

<div class="subnavd">
    <img src="http://images.neopets.com/neoboards/smilies/smiley.gif" style="padding-top: 3px; padding-bottom: 3px;" alt="" border="0">
    <div class="subnav-d"><center>
<table style="width:100%; text-align: center;">
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;:)&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/smiley.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;0:-)&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/angel.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;:o&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/oh.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;:(&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/sad.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;:D&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/grin.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;B)&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/sunglasses.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;:P&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/tongue.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;:K&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/vampire.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;;)&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/winking.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*yarr*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/yarr.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;:*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/kisskiss.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*angry*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/angry.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*complain*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/complain.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*facepalm*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/facepalm.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*cough*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/cough.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*lol*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/lol.gif" alt="" border="0"></a></td>
</tr>
<tr>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*unsure*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/unsure.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*cry*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/cry.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*clap*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/clap.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*violin*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/violin.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;*violin*&quot;); return false;"><img src="http://images.neopets.com/neoboards/smilies/violin.gif" alt="" border="0"></a></td>
      <td><a href="#" class="smiley" onclick="insertSmiley(&quot;‎&quot;); return false;"><img src="http://images.neopets.com/themes/h5/basic/images/plus-circle.svg" title="This is an empty character that can be used after links to avoid breaking fonts :)" style="height: 20px;" alt="" border="0"></a></td>
</tr>
</center>
</table>

    </div>
  </div>

<div class="subnavuser">
    <img src="http://images.neopets.com/themes/h5/basic/images/v3/profile-icon.svg" style="height: 20px;" alt="" border="0">
    <div class="subnav-user"><center>
<table style="width:100%; text-align: center;">
<tr>
       <td><a href="#" class="smiley" onclick="insertSmiley(&quot;‎ http://www.neopets.com/neomessages.phtml?type=send&recipient=`
    + appInsightsUserName + ` ‎&quot;); return false;"><img src="http://images.neopets.com/themes/h5/basic/images/v3/neomail-icon.svg" style="height: 20px;" alt="" border="0"></a></td>
       <td><a href="#" class="smiley" onclick="insertSmiley(&quot;‎ http://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=owner&search_string=`
    + appInsightsUserName + ` ‎&quot;); return false;"><img src="http://images.neopets.com/themes/h5/basic/images/tradingpost-icon.png" style="height: 20px;" alt="" border="0"></a></td>
       <td><a href="#" class="smiley" onclick="insertSmiley(&quot;‎ http://www.neopets.com/genie.phtml?type=find_user&auction_username=`
    + appInsightsUserName + ` ‎&quot;); return false;"><img src="http://images.neopets.com/themes/h5/basic/images/auction-icon.png" style="height: 20px;" alt="" border="0"></a></td>
       <td><a href="#" class="smiley" onclick="insertSmiley(&quot;‎ http://www.neopets.com/browseshop.phtml?owner=`
    + appInsightsUserName + ` ‎&quot;); return false;"><img src="http://images.neopets.com/themes/h5/basic/images/myshop-icon.png" style="height: 20px;" alt="" border="0"></a></td>
       <td><a href="#" class="smiley" onclick="insertSmiley(&quot;‎ http://www.neopets.com/gallery/index.phtml?gu=`
    + appInsightsUserName + ` ‎&quot;); return false;"><img src="http://images.neopets.com/themes/h5/basic/images/v3/gallery-icon.svg" style="height: 20px;" alt="" border="0"></a></td>
</tr>
</center>
</table>

    </div>
  </div>`;

$(`div.container.theme-bg`).append(`<div class="buffbuffer" style="height: 110px;"></div>`);
$(`.replySmilies-neoboards`).html(smilies);
$(`.topicCreateSmilies-neoboards`).html(smilies);
}

function addImages() {
    $("div.boardPostMessage").find("a").each(function(i, message) {
        var link  = $(message);
        if (link.text().length > 0 && (link.text().indexOf('images.neopets') != -1 || link.text().indexOf('pets.neopets') != -1)) {
            $(link).replaceWith('<img src="' + link.text() + '" style="max-width: 100%; padding: 5px;">');
        }
    });
}

function addSearch() {
    var html = `<div id="slothsearch" style="margin-top: 30px; margin-left:-10px;">
<form method="get" action="http://www.drsloth.com/process/" data-abide="" novalidate="novalidate" target="_blank">
          <div class="row">
            <div class="small-8 columns">
              <input id="search-tagged" name="tagged" type="text" value="" style="border: 1px solid #cacaca; border-radius: 5px;" title="Try including 'animated' to find gifs">
            </div>
          <input type="submit" value="Search DrSloth" class="slothsearchbutton topicReplySubmit topicCreateSubmit" style="margin: 5px; width: 115px; font-size: 14px; height: 25px;">
        </form>
        </div>`;
    $(`.replySmilies-neoboards`).append(html)
    $(`.topicCreateSmilies-neoboards`).append(html)
}

document.addEventListener('DOMContentLoaded', smile);
document.addEventListener('DOMContentLoaded', addSearch);
document.addEventListener('DOMContentLoaded', addImages);
