(function(e){function t(t){for(var r,s,i=t[0],c=t[1],u=t[2],d=0,m=[];d<i.length;d++)s=i[d],a[s]&&m.push(a[s][0]),a[s]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);l&&l(t);while(m.length)m.shift()();return o.push.apply(o,u||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],r=!0,i=1;i<n.length;i++){var c=n[i];0!==a[c]&&(r=!1)}r&&(o.splice(t--,1),e=s(s.s=n[0]))}return e}var r={},a={app:0},o=[];function s(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=r,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)s.d(n,r,function(t){return e[t]}.bind(null,r));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=t,i=i.slice();for(var u=0;u<i.length;u++)t(i[u]);var l=c;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"0135":function(e,t,n){},1:function(e,t){},1546:function(e,t,n){"use strict";var r=n("304d"),a=n.n(r);a.a},2:function(e,t){},3:function(e,t){},"304d":function(e,t,n){},4678:function(e,t,n){var r={"./af":"2bfb","./af.js":"2bfb","./ar":"8e73","./ar-dz":"a356","./ar-dz.js":"a356","./ar-kw":"423e","./ar-kw.js":"423e","./ar-ly":"1cfd","./ar-ly.js":"1cfd","./ar-ma":"0a84","./ar-ma.js":"0a84","./ar-sa":"8230","./ar-sa.js":"8230","./ar-tn":"6d83","./ar-tn.js":"6d83","./ar.js":"8e73","./az":"485c","./az.js":"485c","./be":"1fc1","./be.js":"1fc1","./bg":"84aa","./bg.js":"84aa","./bm":"a7fa","./bm.js":"a7fa","./bn":"9043","./bn.js":"9043","./bo":"d26a","./bo.js":"d26a","./br":"6887","./br.js":"6887","./bs":"2554","./bs.js":"2554","./ca":"d716","./ca.js":"d716","./cs":"3c0d","./cs.js":"3c0d","./cv":"03ec","./cv.js":"03ec","./cy":"9797","./cy.js":"9797","./da":"0f14","./da.js":"0f14","./de":"b469","./de-at":"b3eb","./de-at.js":"b3eb","./de-ch":"bb71","./de-ch.js":"bb71","./de.js":"b469","./dv":"598a","./dv.js":"598a","./el":"8d47","./el.js":"8d47","./en-SG":"cdab","./en-SG.js":"cdab","./en-au":"0e6b","./en-au.js":"0e6b","./en-ca":"3886","./en-ca.js":"3886","./en-gb":"39a6","./en-gb.js":"39a6","./en-ie":"e1d3","./en-ie.js":"e1d3","./en-il":"7333","./en-il.js":"7333","./en-nz":"6f50","./en-nz.js":"6f50","./eo":"65db","./eo.js":"65db","./es":"898b","./es-do":"0a3c","./es-do.js":"0a3c","./es-us":"55c9","./es-us.js":"55c9","./es.js":"898b","./et":"ec18","./et.js":"ec18","./eu":"0ff2","./eu.js":"0ff2","./fa":"8df4","./fa.js":"8df4","./fi":"81e9","./fi.js":"81e9","./fo":"0721","./fo.js":"0721","./fr":"9f26","./fr-ca":"d9f8","./fr-ca.js":"d9f8","./fr-ch":"0e49","./fr-ch.js":"0e49","./fr.js":"9f26","./fy":"7118","./fy.js":"7118","./ga":"5120","./ga.js":"5120","./gd":"f6b4","./gd.js":"f6b4","./gl":"8840","./gl.js":"8840","./gom-latn":"0caa","./gom-latn.js":"0caa","./gu":"e0c5","./gu.js":"e0c5","./he":"c7aa","./he.js":"c7aa","./hi":"dc4d","./hi.js":"dc4d","./hr":"4ba9","./hr.js":"4ba9","./hu":"5b14","./hu.js":"5b14","./hy-am":"d6b6","./hy-am.js":"d6b6","./id":"5038","./id.js":"5038","./is":"0558","./is.js":"0558","./it":"6e98","./it-ch":"6f12","./it-ch.js":"6f12","./it.js":"6e98","./ja":"079e","./ja.js":"079e","./jv":"b540","./jv.js":"b540","./ka":"201b","./ka.js":"201b","./kk":"6d79","./kk.js":"6d79","./km":"e81d","./km.js":"e81d","./kn":"3e92","./kn.js":"3e92","./ko":"22f8","./ko.js":"22f8","./ku":"2421","./ku.js":"2421","./ky":"9609","./ky.js":"9609","./lb":"440c","./lb.js":"440c","./lo":"b29d","./lo.js":"b29d","./lt":"26f9","./lt.js":"26f9","./lv":"b97c","./lv.js":"b97c","./me":"293c","./me.js":"293c","./mi":"688b","./mi.js":"688b","./mk":"6909","./mk.js":"6909","./ml":"02fb","./ml.js":"02fb","./mn":"958b","./mn.js":"958b","./mr":"39bd","./mr.js":"39bd","./ms":"ebe4","./ms-my":"6403","./ms-my.js":"6403","./ms.js":"ebe4","./mt":"1b45","./mt.js":"1b45","./my":"8689","./my.js":"8689","./nb":"6ce3","./nb.js":"6ce3","./ne":"3a39","./ne.js":"3a39","./nl":"facd","./nl-be":"db29","./nl-be.js":"db29","./nl.js":"facd","./nn":"b84c","./nn.js":"b84c","./pa-in":"f3ff","./pa-in.js":"f3ff","./pl":"8d57","./pl.js":"8d57","./pt":"f260","./pt-br":"d2d4","./pt-br.js":"d2d4","./pt.js":"f260","./ro":"972c","./ro.js":"972c","./ru":"957c","./ru.js":"957c","./sd":"6784","./sd.js":"6784","./se":"ffff","./se.js":"ffff","./si":"eda5","./si.js":"eda5","./sk":"7be6","./sk.js":"7be6","./sl":"8155","./sl.js":"8155","./sq":"c8f3","./sq.js":"c8f3","./sr":"cf1e","./sr-cyrl":"13e9","./sr-cyrl.js":"13e9","./sr.js":"cf1e","./ss":"52bd","./ss.js":"52bd","./sv":"5fbd","./sv.js":"5fbd","./sw":"74dc","./sw.js":"74dc","./ta":"3de5","./ta.js":"3de5","./te":"5cbb","./te.js":"5cbb","./tet":"576c","./tet.js":"576c","./tg":"3b1b","./tg.js":"3b1b","./th":"10e8","./th.js":"10e8","./tl-ph":"0f38","./tl-ph.js":"0f38","./tlh":"cf75","./tlh.js":"cf75","./tr":"0e81","./tr.js":"0e81","./tzl":"cf51","./tzl.js":"cf51","./tzm":"c109","./tzm-latn":"b53d","./tzm-latn.js":"b53d","./tzm.js":"c109","./ug-cn":"6117","./ug-cn.js":"6117","./uk":"ada2","./uk.js":"ada2","./ur":"5294","./ur.js":"5294","./uz":"2e8c","./uz-latn":"010e","./uz-latn.js":"010e","./uz.js":"2e8c","./vi":"2921","./vi.js":"2921","./x-pseudo":"fd7e","./x-pseudo.js":"fd7e","./yo":"7f33","./yo.js":"7f33","./zh-cn":"5c3a","./zh-cn.js":"5c3a","./zh-hk":"49ab","./zh-hk.js":"49ab","./zh-tw":"90ea","./zh-tw.js":"90ea"};function a(e){var t=o(e);return n(t)}function o(e){var t=r[e];if(!(t+1)){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}return t}a.keys=function(){return Object.keys(r)},a.resolve=o,e.exports=a,a.id="4678"},"4efd":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("f751"),n("097d");var r=n("2b0e"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("router-view")},o=[],s=(n("5c0b"),n("2877")),i={},c=Object(s["a"])(i,a,o,!1,null,null,null),u=c.exports,l=n("8c4f"),d=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("router-link",{attrs:{to:"/"}},[e._v("\n    Home\n  ")]),n(e.page,{tag:"component"})],1)},m=[],f={props:["page"],data:function(){return{show:!0}},methods:{}},p=f,h=Object(s["a"])(p,d,m,!1,null,null,null),v=(h.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"play-layout"},[n(e.page,{tag:"component"})],1)}),g=[],b={props:["page"],data:function(){return{show:!0}},methods:{}},j=b,y=Object(s["a"])(j,v,g,!1,null,null,null),w=y.exports,R=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.isDataReady?n("div",{staticClass:"play"},[e.store.user?[n("b",[e._v("Welcome "+e._s(e.store.user.nickname))]),null==e.store.room?void 0:0==e.store.room.isGameEnded?[n("br"),n("p",[e._v("you are in room "+e._s(e.store.room.roomId))]),0==e.store.room.isGameLaunched?[n("p",[e._v("Waiting for your opponent")]),n("button",{on:{click:function(t){return e.leaveRoom()}}},[e._v("leave room")])]:[n("GamePlayArea")]]:e.store.room.winner==e.store.user._id?[n("p",[e._v("YOU WIN !")])]:e.store.room.loser==e.store.user._id?[n("p",[e._v("YOU LOSE !")])]:[n("p",[e._v("Weird State")])]]:[n("b",[e._v("You are not logged in")]),n("br"),n("button",{on:{click:function(t){return e.guestJoinAsPlayer()}}},[e._v("join game as Guest")])],n("div",{staticClass:"debug",on:{"":function(e){}}},[e._v("debug")]),n("button",{on:{click:function(t){return e.logout()}}},[e._v("Logout")]),n("textarea",{directives:[{name:"model",rawName:"v-model",value:e.otherId,expression:"otherId"}],attrs:{id:"otherId"},domProps:{value:e.otherId},on:{input:function(t){t.target.composing||(e.otherId=t.target.value)}}}),n("button",{attrs:{id:"connect"},on:{click:function(t){return e.signal()}}},[e._v("Connect")]),n("video",{attrs:{muted:"muted"},domProps:{muted:!0}})],2):e._e()},k=[],x=n("795b"),_=n.n(x),C=n("f499"),O=n.n(C),S=(n("96cf"),n("3b8d")),A=(n("28a5"),n("bc3a")),P=n.n(A),D=n("8ded"),I=n.n(D),N="https://".concat(location.host.split(":")[0],":4000/"),z=n("8055")(N+"play",{rejectUnauthorized:!1});function E(e,t){return G.apply(this,arguments)}function G(){return G=Object(S["a"])(regeneratorRuntime.mark(function e(t,n){var r;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,P.a.post(N+t,n,{headers:{Authorization:I.a.get("authToken")}});case 3:return r=e.sent,e.abrupt("return",r.data);case 7:throw e.prev=7,e.t0=e["catch"](0),console.log("e: ",e.t0),401===e.t0.response.status&&(I.a.remove("authToken"),window.location="/login",console.log("path: "+t),console.log("data: "+n)),e.t0;case 12:return e.abrupt("return",res.data);case 13:case"end":return e.stop()}},e,null,[[0,7]])})),G.apply(this,arguments)}function T(e,t){return L.apply(this,arguments)}function L(){return L=Object(S["a"])(regeneratorRuntime.mark(function e(t,n){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",new _.a(function(e){z.emit(t,n,I.a.get("authToken"),function(t){e(t)})}));case 1:case"end":return e.stop()}},e)})),L.apply(this,arguments)}function $(e,t){z.on(e,t)}var U,M=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"gameplay-area"},[e.store.isGameEnded?n("div",{staticClass:"finished"},[e._v("End of Game")]):e._e(),n("PlayerSide")],1)},J=[],W=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"player-side play-corner",class:e.store.canPlay?"can-play":""},[n("div",{staticClass:"action-play-area"},[e._v("action play area")]),n("div",{staticClass:"damage-number-feedback"}),n("div",{staticClass:"playable-cards-section"},[n("div",{staticClass:"top-row"},[n("PlayableGameCard",{attrs:{card:e.playerData.currentCards[0],index:0,isPlayerSide:!0}})],1),n("div",{staticClass:"bottom-row"},[n("PlayableGameCard",{attrs:{card:e.playerData.currentCards[1],index:1,isPlayerSide:!0}}),n("PlayableGameCard",{attrs:{card:e.playerData.currentCards[2],index:2,isPlayerSide:!0}})],1)]),n("div",{staticClass:"playable-shield-section"},[n("PlayableShield",{attrs:{playerData:e.playerData}})],1),n("div",{staticClass:"healthbar-controller"},[e._v(e._s(e.playerData.currentHp)+" / "+e._s(e.playerData.maxHp))])])},Y=[],q=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"playable-game-card"},[null!=e.card?n("div",{staticClass:"game-card",class:e.getElementClass()+e.getSelectedClass(),on:{click:function(t){return e.playCard(e.index)}}},[n("img",{staticClass:"card-image",attrs:{src:e.getImagePath()}}),n("div",{staticClass:"value top"},[e._v(e._s(e.card.value))]),n("div",{staticClass:"value bottom"},[e._v(e._s(e.card.value))])]):n("div",{staticClass:"game-card empty"},[n("img",{staticClass:"card-image",attrs:{src:"/images/card_rock.png"}})])])},H=[],F={props:["card","index","isPlayerSide"],methods:{getElementClass:function(){return this.card.element.toLowerCase()},getSelectedClass:function(){return 1==this.isPlayerSide&&"ATTACK"==this.store.selectedAction&&this.store.selectedCardIndex==this.index?" selected":""},getImagePath:function(){return"ROCK"==this.card.element?"/images/card_rock.png":"SCISSOR"==this.card.element?"/images/card_scissor.png":"PAPER"==this.card.element?"/images/card_paper.png":void 0}}},K=F,V=(n("1546"),Object(s["a"])(K,q,H,!1,null,null,null)),B=V.exports,Q=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"playable-shield"},[e.playerData.canPlayShield?n("div",{staticClass:"shield",on:{click:function(t){return e.playShield()}}},[e._v("shield")]):e._e()])},X=[],Z={props:[]},ee=Z,te=Object(s["a"])(ee,Q,X,!1,null,null,null),ne=te.exports,re={components:{PlayableGameCard:B,PlayableShield:ne},computed:{}},ae=re,oe=(n("be6f"),Object(s["a"])(ae,W,Y,!1,null,null,null)),se=oe.exports,ie={components:{PlayerSide:se}},ce=ie,ue=Object(s["a"])(ce,M,J,!1,null,null,null),le=ue.exports,de=n("051a"),me=n.n(de);window.playRoomEmit=T;var fe,pe,he={components:{GamePlayArea:le},data:function(){return{isDataReady:!1,myData:"",otherId:""}},created:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){var t=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return $("signal-emitted",function(e,n){t.isAdmin!=e&&(console.log("signal-emitted data: ",n),t.isAdmin?U.signal(n.client.playerData.signal):0==t.isAdmin&&U.signal(n.admin.playerData.signal))}),$("user-joined-room",function(e){console.log("user-joined-room: ",e)}),$("game-countdown",function(e){var t=e.time;console.log("Countdown started : ",t)}),$("game-started",function(e){console.log("game-started"),t.setRoom(e)}),$("new-round",function(e){e.roundTime;t.store.canPlay=!0,console.log("new-round")}),$("end-round",function(e){console.log("end-round: ",e),t.store.canPlay=!1,t.setRoom(e)}),e.next=8,this.simplePeerSetupClient();case 8:return e.next=10,this.guestJoinAsPlayer();case 10:return console.log("guestJoinAsPlayer"),this.isDataReady=!0,e.next=14,this.simplePeerSetupAdmin();case 14:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),methods:{simplePeerSetupAdmin:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(!this.isAdmin){e.next=7;break}return e.next=3,navigator.mediaDevices.getUserMedia({video:!0,audio:!0});case 3:t=e.sent,U=new me.a({initiator:!0,trickle:!0,stream:t}),U.on("error",function(e){return console.log("error",e)}),U.on("signal",function(e){console.log("SIGNAL:  ",O()(e)),T("submit-signal",{signal:e},function(){console.log("emitted")}),console.log("WTF")});case 7:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),simplePeerSetupClient:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:0==this.isAdmin&&(U=new me.a({initiator:!1,trickle:!1}),U.on("stream",function(e){console.log("receveing the vid");var t=document.querySelector("video");"srcObject"in t?t.srcObject=e:t.src=window.URL.createObjectURL(e),t.play(),t.muted=!1}),U.on("error",function(e){return console.log("error",e)}),U.on("signal",function(e){console.log("SIGNAL:  ",O()(e)),T("submit-signal",{signal:e})}));case 1:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),signal:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:console.log("peer: ",U),U.signal(JSON.parse(this.otherId));case 2:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),debug:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:T("debug",{},function(e){var t=e.socket;console.log("socket: ",t)});case 1:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}(),joinAsPlayer:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){var t=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",new _.a(function(e){T("join-room",{roomId:t.roomId,isAdmin:t.isAdmin,rtcData:"rtcdata"},function(n,r){var a=n.room,o=n.user,s=n.message;0!=r?(console.log("room is: ",a),console.log("user is: ",o),t.setRoom(a),t.setUser(o),0==t.isAdmin&&a.admin&&null!=a.admin.playerData.signal&&U.signal(a.admin.playerData.signal),e()):console.log(s)})}));case 1:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}(),guestJoinAsPlayer:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(null!=I.a.get("authToken")){e.next=3;break}return e.next=3,this.logAsGuest();case 3:return e.next=5,this.joinAsPlayer();case 5:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),leaveRoom:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:console.log("leave"),T("leave-room",{});case 2:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}(),logout:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:I.a.set("authToken",null),window.location.reload();case 2:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}()},computed:{roomId:function(){return this.$route.params.roomId},role:function(){return this.$route.params.role},isAdmin:function(){return"admin"==this.role}}},ve=he,ge=(n("dfbc"),Object(s["a"])(ve,R,k,!1,null,null,null)),be=(ge.exports,function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.isDataReady?n("section",[n("div",[e._v("Room is "+e._s(e.room.name))]),null==e.store.connectedConvo?n("div",[n("p",[e._v("Not Connected to any room")]),n("button",{on:{click:function(t){return e.joinRoom()}}},[e._v("Join Room")])]):n("div",[n("p",[e._v("You are connected to the room: "+e._s(e.store.connectedRoom.name))]),n("video",{attrs:{muted:"muted"},domProps:{muted:!0}}),n("button",{on:{click:function(t){return e.leaveRoom()}}},[e._v("Leave Room")]),e.incomingSignals.length>0?n("div",[n("p",[e._v("Someone is calling !")]),n("button",{on:{click:function(t){return e.acceptCall()}}},[e._v("Answer Call")])]):e._e()])]):e._e()}),je=[],ye=(n("ac6a"),n("06db"),n("5df3"),n("768b")),we={data:function(){return{isDataReady:!1,newRoomName:"",room:null,incomingSignals:[]}},created:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.logAsGuestIf();case 2:return e.next=4,this.fetchAllData();case 4:return e.next=6,T("setup-convos",{});case 6:return e.next=8,this.simplePeerSetup();case 8:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),methods:{fetchAllData:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){var t,n,r;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,_.a.all([this.storeConnectedRoom(),E("get-room",{socketRoomId:this.socketRoomId})]);case 2:t=e.sent,n=Object(ye["a"])(t,2),n[0],r=n[1].room,this.room=r,this.isDataReady=!0;case 8:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),simplePeerSetup:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){var t=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:fe=new me.a({initiator:!1,trickle:!1}),fe.on("stream",function(e){console.log("receiving the vid");var t=document.querySelector("video");"srcObject"in t?t.srcObject=e:t.src=window.URL.createObjectURL(e),t.play(),t.muted=!1}),fe.on("error",function(e){return console.log("error",e)}),fe.on("signal",function(e){console.log("SIGNAL:  ",O()(e)),T("transmit-signal",{signal:e})}),$("signal-emitted-to-client",function(e){var n=e.signal;t.incomingSignals.push(n)});case 5:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}(),acceptCall:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:console.log("accepting: ",this.incomingSignals),this.incomingSignals.forEach(function(e){fe.signal(e)});case 2:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),joinRoom:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,E("client/join-convo",{socketRoomId:this.socketRoomId});case 2:return e.next=4,this.fetchAllData();case 4:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),leaveRoom:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,E("client/leave-convo",{});case 2:return e.next=4,this.fetchAllData();case 4:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()},computed:{socketRoomId:function(){return this.$route.params.socketRoomId}}},Re=we,ke=Object(s["a"])(Re,be,je,!1,null,"d4bb6124",null),xe=ke.exports,_e=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.isDataReady?n("section",[n("div",[e._v("ADMIN - Room is "+e._s(e.room.name))]),n("h3",[e._v("Waiting clients:")]),e._l(e.convos,function(t){return n("div",[e._v(e._s(t.clientId)+" "+e._s(t.state)+" "+e._s(t.adminId))])}),n("h3",[e._v("Connected admins:")]),e._l(e.room.admins,function(t){return n("div",[e._v(e._s(t))])}),n("br"),n("br"),n("br"),n("br"),n("br"),null==e.store.connectedRoom?n("div",[n("p",[e._v("You haven't joined a room")]),n("button",{on:{click:function(t){return e.joinRoom()}}},[e._v("Join Room")])]):n("div",[n("p",[e._v("You have joined the room "+e._s(e.store.connectedRoom.name))]),n("button",{on:{click:function(t){return e.leaveRoom()}}},[e._v("Leave Room")]),null==e.store.connectedConvo?n("div",[n("p",[e._v("Not having any conversation")]),n("button",{on:{click:function(t){return e.nextConvo()}}},[e._v("Start Next Conversation")])]):n("div",[n("p",[e._v("You are having conversation with: "+e._s(e.store.connectedConvo.clientId))]),n("button",{on:{click:function(t){return e.endConvo()}}},[e._v("End Conversation")]),null!=e.incomingSignal?n("div",[n("p",[e._v("Someone is calling !")]),n("button",{on:{click:function(t){return e.acceptCall()}}},[e._v("Answer Call")])]):e._e()])])],2):e._e()},Ce=[],Oe={data:function(){return{isDataReady:!1,newRoomName:"",room:null,convos:[],incomingSignal:null}},created:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.logAsGuestIf();case 2:return e.next=4,this.fetchAllData();case 4:return e.next=6,T("setup-convos",{});case 6:return e.next=8,this.simplePeerSetup();case 8:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),methods:{fetchAllData:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){var t,n,r,a,o;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,_.a.all([this.storeConnectedRoom(),E("admin/get-room",{socketRoomId:this.socketRoomId})]);case 2:t=e.sent,n=Object(ye["a"])(t,2),n[0],r=n[1],a=r.room,o=r.convos,this.room=a,this.convos=o,this.isDataReady=!0;case 11:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),simplePeerSetup:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){var t,n=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,navigator.mediaDevices.getUserMedia({video:!0,audio:!0});case 2:t=e.sent,pe=new me.a({initiator:!0,trickle:!0,stream:t}),pe.on("error",function(e){return console.log("error",e)}),pe.on("signal",function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return console.log("SIGNAL:  ",O()(t)),e.next=3,T("transmit-signal",{signal:t});case 3:console.log("WTF");case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()),$("signal-emitted-to-admin",function(e){var t=e.signal;n.incomingSignal=t});case 7:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}(),acceptCall:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:console.log("accepting: ",this.incomingSignal),pe.signal(this.incomingSignal);case 2:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),joinRoom:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,E("admin/join-room",{socketRoomId:this.socketRoomId});case 2:return e.next=4,this.fetchAllData();case 4:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),endConvo:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,E("admin/end-convo",{});case 2:return e.next=4,this.fetchAllData();case 4:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),nextConvo:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,E("admin/next-convo",{});case 2:return e.next=4,this.fetchAllData();case 4:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),leaveRoom:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,E("admin/leave-room",{});case 2:return e.next=4,this.fetchAllData();case 4:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()},computed:{socketRoomId:function(){return this.$route.params.socketRoomId}}},Se=Oe,Ae=Object(s["a"])(Se,_e,Ce,!1,null,"0b89b903",null),Pe=Ae.exports,De=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",[e._v("sup brah"),n("div",{staticClass:"create"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.newRoomName,expression:"newRoomName"}],domProps:{value:e.newRoomName},on:{input:function(t){t.target.composing||(e.newRoomName=t.target.value)}}}),n("button",{on:{click:function(t){return e.clickCreateNewRoom()}}},[e._v("Create New")])]),n("div",{staticClass:"list"},e._l(e.rooms,function(t){return n("div",{staticClass:"item"},[n("router-link",{attrs:{to:"play/"+t.socketRoomId+"/client"}},[e._v(e._s(t.name))])],1)}),0)])},Ie=[],Ne={data:function(){return{newRoomName:"",rooms:[]}},created:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.logAsGuestIf();case 2:return e.next=4,this.fetchAllData();case 4:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),methods:{clickCreateNewRoom:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,E("create-room",{name:this.newRoomName});case 2:return e.next=4,this.fetchAllData();case 4:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),fetchAllData:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){var t,n;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,E("list-rooms");case 2:t=e.sent,n=t.rooms,this.rooms=n;case 5:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()}},ze=Ne,Ee=Object(s["a"])(ze,De,Ie,!1,null,"731724ac",null),Ge=Ee.exports;r["a"].use(l["a"]);var Te=new l["a"]({mode:"history",base:"/",routes:[{path:"/",redirect:"/dashboard"},{path:"/dashboard",component:w,props:{page:Ge}},{path:"/play/:socketRoomId/client",component:w,props:{page:xe}},{path:"/play/:socketRoomId/admin",component:w,props:{page:Pe}}]}),Le=n("c1df"),$e=n.n(Le),Ue=(n("7514"),{user:null,room:null,selectedAction:null,selectedCardIndex:null,canPlay:!1,connectedConvo:null,connectedRoom:null});r["a"].mixin({data:function(){return{store:Ue}},methods:{storeConnectedRoom:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,E("get-current-convo",{});case 2:t=e.sent,null!=t.message?(console.log(t.message),this.store.connectedRoom=null,this.store.connectedConvo=null):(this.store.connectedRoom=t.room,this.store.connectedConvo=t.convo);case 4:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),logAsGuestIf:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){var t,n;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(null==I.a.get("authToken")){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,E("log-as-guest");case 4:return t=e.sent,n=t.authToken,I.a.set("authToken",n),e.next=9,this.storeMyProfile();case 9:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),storeMyProfile:function(){var e=Object(S["a"])(regeneratorRuntime.mark(function e(){var t,n;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,E("my-profile",{});case 3:t=e.sent,n=t.user,t.room,this.setUser(n),e.next=11;break;case 9:e.prev=9,e.t0=e["catch"](0);case 11:case"end":return e.stop()}},e,this,[[0,9]])}));function t(){return e.apply(this,arguments)}return t}(),setUser:function(e){this.store.user=e},setRoom:function(e){this.store.room=e},getPlayerData:function(){var e=this;return this.store.room.players.find(function(t){return t._id==e.store.user._id}).playerData},getOpponentData:function(){var e=this;return this.store.room.players.find(function(t){return t._id!=e.store.user._id}).playerData},playCard:function(e){T("play-card",{index:e}),this.store.selectedAction="ATTACK",this.store.selectedCardIndex=e},playShield:function(){T("play-shield",{}),this.store.selectedAction="SHIELD",this.store.selectedCardIndex=null}},computed:{canPlay:function(){return 1==this.store.user.isVerified||1==this.store.user.isGuest},playerData:function(){return this.getPlayerData()}}}),r["a"].mixin({methods:{moment:$e.a}}),r["a"].config.productionTip=!1,new r["a"]({router:Te,render:function(e){return e(u)}}).$mount("#app")},"5c0b":function(e,t,n){"use strict";var r=n("5e27"),a=n.n(r);a.a},"5e27":function(e,t,n){},be6f:function(e,t,n){"use strict";var r=n("0135"),a=n.n(r);a.a},dfbc:function(e,t,n){"use strict";var r=n("4efd"),a=n.n(r);a.a}});
//# sourceMappingURL=app.e57ec72d.js.map