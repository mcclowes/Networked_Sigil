var frame_time=.06,maxHandSize=10,canvasWidth=720,canvasHeight=800,player_card_value=1,enemy_card_value=1,center_mod=1.5,enemy_mod=1.5,shield_mod=1.3,freeze_mod=.2,rock_mod=.4,fs=require("fs"),file="json/card_data.json",cards=[{name:"Fire Blast",rarity:"Basic",effects:["Deal 1 damage"]},{name:"Floods",rarity:"Rare",effects:["Destroy all pieces","End your turn"]},{name:"Armour Up",rarity:"Basic",effects:["Shield a piece","Draw a card"]},{name:"Flurry",rarity:"Rare",effects:["Deal 2 damage to your pieces","Deal 2 damage to enemy pieces"]},{name:"Sabotage",rarity:"Elite",effects:["Remove 5 shields"]},{name:"Summer",rarity:"Basic",effects:["Thaw 1 square","Draw a card"]},{name:"Ice Blast",rarity:"Basic",effects:["Freeze a square"]},{name:"Sacrifice",rarity:"Rare",effects:["Destroy a piece of yours","Draw 3 cards"]},{name:"Boulder",rarity:"Rare",effects:["Discard a card","Block a square"]},{name:"Frost",rarity:"Basic",effects:["Freeze all squares"]},{name:"Taxes",rarity:"Rare",effects:["Discard 2 cards","Shield 3 pieces"]},{name:"Barrage",rarity:"Basic",effects:["Damage all pieces","Discard 2 cards"]},{name:"Bezerker",rarity:"Rare",effects:["Discard a card","Deal 1 damage","If you have the least pieces return this card to your hand"]},{name:"Reckless",rarity:"Rare",effects:["Your opponent draws 2 cards","Destroy a piece"]}];"undefined"!=typeof global&&(frame_time=45),function(){for(var e=0,t=["ms","moz","webkit","o"],s=0;s<t.length&&!global.requestAnimationFrame;++s)global.requestAnimationFrame=global[t[s]+"RequestAnimationFrame"],global.cancelAnimationFrame=global[t[s]+"CancelAnimationFrame"]||global[t[s]+"CancelRequestAnimationFrame"];global.requestAnimationFrame||(global.requestAnimationFrame=function(t,s){var a=Date.now(),r=Math.max(0,frame_time-(a-e)),i=global.setTimeout(function(){t(a+r)},r);return e=a+r,i}),global.cancelAnimationFrame||(global.cancelAnimationFrame=function(e){clearTimeout(e)})}(),Number.prototype.fixed=function(e){return e=e||3,parseFloat(this.toFixed(e))};var shuffle=function(e){for(var t,s,a=e.length;a;t=Math.floor(Math.random()*a),s=e[--a],e[a]=e[t],e[t]=s);return e},scale_number=function(e,t){return 0>e?Number(-Math.pow(e,t)):Number(Math.pow(e,t))},create_card_array=function(e){for(var t=[],s=0;s<e.length;s++)t.push(create_card(e[s]));return t},create_card=function(e){return new game_card(void 0!==e.cardName?e.cardName:e)},game_core=function(e,t,s,a,r,i,l,o){player_card_value=e,enemy_card_value=t,center_mod=s,enemy_mod=a,shield_mod=r,freeze_mod=i,rock_mod=l,this.mmr,this.instance=o,this.server=void 0!==this.instance,this.world={width:canvasWidth,height:canvasHeight},this.board=new game_board,this.end_turn_button=new end_turn_button,this.turn=1,this.players={self:new game_player(this),other:new game_player(this)},this.local_time=.016,this._dt=(new Date).getTime(),this._dte=(new Date).getTime(),this.client_create_configuration(),this.server_updates=[],this.client_connect_to_server(),this.client_create_ping_timer()};"undefined"!=typeof global&&(module.exports=global.game_core=game_core);var game_board=function(){this.w=400,this.h=400,this.x=canvasWidth/2-this.w/2,this.y=canvasWidth/2-this.h/2,this.board_state={results:[],frost:[],rock:[],shields:[]},this.board_distance=0;for(var e=0;4>e;e++){this.board_state.results[e]=[],this.board_state.frost[e]=[],this.board_state.rock[e]=[],this.board_state.shields[e]=[];for(var t=0;4>t;t++)this.board_state.results[e][t]=0,this.board_state.frost[e][t]=0,this.board_state.rock[e][t]=0,this.board_state.shields[e][t]=0}};game_board.prototype.reduce_state=function(){for(var e=0;4>e;e++)for(var t=0;4>t;t++)this.board_state.frost[e][t]>0&&this.board_state.frost[e][t]--,this.board_state.rock[e][t]>0&&this.board_state.rock[e][t]--},game_board.prototype.check_win=function(){return void 0!==this.checkRows()?this.checkRows():void 0!==this.checkCols()?this.checkCols():void 0!==this.checkDiagonals()?this.checkDiagonals():void 0},game_board.prototype.checkRows=function(){for(var e=0;4>e;e++){var t=this.board_state.results[e][0]+this.board_state.results[e][1]+this.board_state.results[e][2]+this.board_state.results[e][3];if(4===t||-4===t)return this.board_state.results[e][0]}},game_board.prototype.checkCols=function(){for(var e=0;4>e;e++){var t=this.board_state.results[0][e]+this.board_state.results[1][e]+this.board_state.results[2][e]+this.board_state.results[3][e];if(4===t||-4===t)return this.board_state.results[0][e]}},game_board.prototype.checkDiagonals=function(){var e=this.board_state.results[0][0]+this.board_state.results[1][1]+this.board_state.results[2][2]+this.board_state.results[3][3];return 4===e||-4===e?this.board_state.results[1][1]:(e=this.board_state.results[0][3]+this.board_state.results[1][2]+this.board_state.results[2][1]+this.board_state.results[3][0],4===e||-4===e?this.board_state.results[1][1]:void 0)},game_core.prototype.checkFreeSquare=function(){for(var e=0,t=0;4>t;t++)for(var s=0;4>s;s++)0===this.board.board_state.results[t][s]&&0===this.board.board_state.frost[t][s]&&0===this.board.board_state.rock[t][s]&&e++;return e},game_core.prototype.checkEnemySquare=function(){for(var e=0;4>e;e++)for(var t=0;4>t;t++)if(this.players.self.host===!0&&1===this.board.board_state.results[e][t]||this.players.self.host===!1&&-1===this.board.board_state.results[e][t])return!0;return!1},game_core.prototype.checkSelfSquare=function(){for(var e=0;4>e;e++)for(var t=0;4>t;t++)if(this.players.self.host===!0&&-1===this.board.board_state.results[e][t]||this.players.self.host===!1&&1===this.board.board_state.results[e][t])return!0;return!1},game_core.prototype.checkShield=function(){for(var e=0;4>e;e++)for(var t=0;4>t;t++)if(0!==this.board.board_state.shields[e][t])return!0;return!1},game_core.prototype.checkUnshielded=function(){for(var e=0;4>e;e++)for(var t=0;4>t;t++)if(0===this.board.board_state.shields[e][t]&&0!==this.board.board_state.results[e][t])return!0;return!1},game_core.prototype.checkFrozen=function(){for(var e=0;4>e;e++)for(var t=0;4>t;t++)if(0!==this.board.board_state.frost[e][t])return!0;return!1},game_core.prototype.evaluate_square=function(e,t){var s=this.board.board_state.results[e][t];return s=10*s,this.board.board_state.shields[e][t]>0&&(s*=shield_mod),(1===e||2===e)&&(1===t||2===t)&&(s*=center_mod),this.players.self.host===!0&&0>s||this.players.self.host===!1&&s>0?s=enemy_mod*s:0===s&&(this.board.board_state.frost[e][t]>0?s=this.board.board_state.frost[e][t]%2===0?this.players.self.host===!0?freeze_mod:-freeze_mod:this.players.self.host===!0?-freeze_mod:freeze_mod:this.board.board_state.rock[e][t]>0&&(s=this.board.board_state.rock[e][t]%2===0?this.players.self.host===!0?rock_mod:-rock_mod:this.players.self.host===!0?-rock_mod:rock_mod)),Number(s).toFixed(0)},game_core.prototype.checkDistance=function(){var e=Number(this.evaluate_square(0,0))+Number(this.evaluate_square(0,1))+Number(this.evaluate_square(0,2))+Number(this.evaluate_square(0,3)),t=Number(this.evaluate_square(1,0))+Number(this.evaluate_square(1,1))+Number(this.evaluate_square(1,2))+Number(this.evaluate_square(1,3)),s=Number(this.evaluate_square(2,0))+Number(this.evaluate_square(2,1))+Number(this.evaluate_square(2,2))+Number(this.evaluate_square(2,3)),a=Number(this.evaluate_square(3,0))+Number(this.evaluate_square(3,1))+Number(this.evaluate_square(3,2))+Number(this.evaluate_square(3,3)),r=Number(this.evaluate_square(0,0))+Number(this.evaluate_square(1,0))+Number(this.evaluate_square(2,0))+Number(this.evaluate_square(3,0)),i=Number(this.evaluate_square(0,1))+Number(this.evaluate_square(1,1))+Number(this.evaluate_square(2,1))+Number(this.evaluate_square(3,1)),l=Number(this.evaluate_square(0,2))+Number(this.evaluate_square(1,2))+Number(this.evaluate_square(2,2))+Number(this.evaluate_square(3,2)),o=Number(this.evaluate_square(0,3))+Number(this.evaluate_square(1,3))+Number(this.evaluate_square(2,3))+Number(this.evaluate_square(3,3)),h=Number(this.evaluate_square(0,0))+Number(this.evaluate_square(1,1))+Number(this.evaluate_square(2,2))+Number(this.evaluate_square(3,3)),n=Number(this.evaluate_square(0,3))+Number(this.evaluate_square(1,2))+Number(this.evaluate_square(2,1))+Number(this.evaluate_square(3,0));return e=Number(scale_number(e,2)),t=Number(scale_number(t,2)),s=Number(scale_number(s,2)),a=Number(scale_number(a,2)),r=Number(scale_number(r,2)),i=Number(scale_number(i,2)),l=Number(scale_number(l,2)),o=Number(scale_number(o,2)),h=Number(scale_number(h,2)),n=Number(scale_number(n,2)),value=e+t+s+a+r+i+l+o+h+n,value},game_core.prototype.choose_square=function(e){for(var t=0;4>t;t++)for(var s=0;4>s;s++){var a=0,r=0;if((this.players.self.player_state.destroyingA>0||this.players.self.player_state.damagingA>0)&&0!==this.board.board_state.results[t][s]||(this.players.self.player_state.destroyingS>0||this.players.self.player_state.damagingS>0)&&(this.players.self.host===!0&&1===this.board.board_state.results[t][s]||this.players.self.host===!1&&-1===this.board.board_state.results[t][s])||(this.players.self.player_state.destroyingE>0||this.players.self.player_state.damagingE>0)&&(this.players.self.host===!0&&-1===this.board.board_state.results[t][s]||this.players.self.host===!1&&1===this.board.board_state.results[t][s])||this.players.self.player_state.freezing>0&&0===this.board.board_state.results[t][s]&&0===this.board.board_state.frost[t][s]&&0===this.board.board_state.rock[t][s]||this.players.self.player_state.thawing>0&&this.board.board_state.frost[t][s]>0||this.players.self.player_state.blocking>0&&0===this.board.board_state.results[t][s]&&0===this.board.board_state.frost[t][s]&&0===this.board.board_state.rock[t][s]||this.players.self.player_state.shielding>0&&0===this.board.board_state.shields[t][s]&&0!==this.board.board_state.results[t][s]||this.players.self.player_state.deshielding>0&&this.board.board_state.shields[t][s]>0||this.players.self.player_state.pieces_to_play>0&&0===this.board.board_state.results[t][s]&&0===this.board.board_state.frost[t][s]&&0===this.board.board_state.rock[t][s]){var i=this.board.board_state;if(this.players.self.player_state.freezing>0){if(0!==this.board.board_state.results[t][s]||0!==this.board.board_state.frost[t][s]||0!==this.board.board_state.rock[t][s])continue;i.frost[t][s]=4}else if(this.players.self.player_state.thawing>0){if(!(this.board.board_state.frost[t][s]>0))continue;a=i.frost[t][s],i.frost[t][s]=0}else if(this.players.self.player_state.blocking>0){if(0!==this.board.board_state.results[t][s]||0!==this.board.board_state.frost[t][s]||0!==this.board.board_state.rock[t][s])continue;i.rock[t][s]=6}else if(this.players.self.player_state.shielding>0){if(0!==this.board.board_state.shields[t][s]||0===this.board.board_state.results[t][s])continue;i.shields[t][s]=1}else if(this.players.self.player_state.deshielding>0){if(!(this.board.board_state.shields[t][s]>0))continue;i.shields[t][s]=0}else if(this.players.self.player_state.destroyingA>0){if(0===this.board.board_state.results[t][s])continue;a=i.shields[t][s],r=i.results[t][s],i.results[t][s]=0,i.shields[t][s]=0}else if(this.players.self.player_state.destroyingS>0){if(!(this.players.self.host===!0&&1===this.board.board_state.results[t][s]||this.players.self.host===!1&&-1===this.board.board_state.results[t][s]))continue;a=i.shields[t][s],i.results[t][s]=0,i.shields[t][s]=0}else if(this.players.self.player_state.destroyingE>0){if(!(this.players.self.host===!0&&-1===this.board.board_state.results[t][s]||this.players.self.host===!1&&1===this.board.board_state.results[t][s]))continue;a=i.shields[t][s],i.results[t][s]=0,i.shields[t][s]=0}else if(this.players.self.player_state.damagingA>0){if(0===this.board.board_state.results[t][s])continue;a=i.shields[t][s],r=i.results[t][s],1===i.shields[t][s]?i.shields[t][s]=0:i.results[t][s]=0}else if(this.players.self.player_state.damagingS>0){if(!(this.players.self.host===!0&&1===this.board.board_state.results[t][s]||this.players.self.host===!1&&-1===this.board.board_state.results[t][s]))continue;a=i.shields[t][s],1===i.shields[t][s]?i.shields[t][s]=0:i.results[t][s]=0}else if(this.players.self.player_state.damagingE>0){if(!(this.players.self.host===!0&&-1===this.board.board_state.results[t][s]||this.players.self.host===!1&&1===this.board.board_state.results[t][s]))continue;a=i.shields[t][s],1===i.shields[t][s]?i.shields[t][s]=0:i.results[t][s]=0}else if(this.players.self.player_state.pieces_to_play>0){if(0!==this.board.board_state.results[t][s]||0!==this.board.board_state.frost[t][s]||0!==this.board.board_state.rock[t][s])continue;i.results[t][s]=this.players.self.host===!0?1:-1}var l=this.checkDistance();(this.players.self.host===!0&&(void 0!==e&&(l>=e.distance||void 0===e.distance)||void 0===e)||this.players.self.host===!1&&(void 0!==e&&(l<=e.distance||void 0===e.distance)||void 0===e))&&(e={x:t,y:s,distance:l},console.log("Moves distance = "+e.distance+" >>>>>> "+t+", "+s)),this.players.self.player_state.freezing>0?i.frost[t][s]=0:this.players.self.player_state.thawing>0?i.frost[t][s]=a:this.players.self.player_state.blocking>0?i.rock[t][s]=0:this.players.self.player_state.shielding>0?i.shields[t][s]=0:this.players.self.player_state.deshielding>0?i.shields[t][s]=1:this.players.self.player_state.destroyingA>0?(i.results[t][s]=r,i.shields[t][s]=a):this.players.self.player_state.destroyingS>0?(i.results[t][s]=this.players.self.host===!0?1:-1,i.shields[t][s]=a):this.players.self.player_state.destroyingE>0?(i.results[t][s]=this.players.self.host===!0?-1:1,i.shields[t][s]=a):this.players.self.player_state.damagingA>0?(i.results[t][s]=r,i.shields[t][s]=a):this.players.self.player_state.damagingS>0?(i.shields[t][s]=a,i.results[t][s]=this.players.self.host===!0?1:-1):this.players.self.player_state.damagingE>0?(i.shields[t][s]=a,i.results[t][s]=this.players.self.host===!0?-1:1):this.players.self.player_state.pieces_to_play>0&&(i.results[t][s]=0)}}return e},game_core.prototype.resolve_card=function(e,t,s){if(t.player_state.discarding>0)return void t.player_state.discarding--;cardEffects=[];for(var a=0;a<cards.length;a++)cards[a].name===e.cardName&&(cardEffects=cards[a].effects);var r=new RegExp("^if$","i"),i=new RegExp("^least$","i"),l=new RegExp("^deal$|^damage$","i");destroy=new RegExp("^destroy$|^remove$","i"),draw=new RegExp("^draw$|^draws$","i"),one=new RegExp("^a$|^1$","i"),every=new RegExp("^all$|^every$","i"),endTurn=new RegExp("^end$","i"),targetSelf=new RegExp("^you$|^your$|^yours$","i"),targetEnemy=new RegExp("^enemy$|^opponent$","i"),freeze=new RegExp("^freeze$","i"),thaw=new RegExp("^thaw$","i"),shield=new RegExp("^shield$|^shields$","i"),block=new RegExp("^block$","i"),discard=new RegExp("^discard$","i"),piece=new RegExp("^piece$|pieces$","i"),hand=new RegExp("^hand$|^hands$","i");for(var o=0;o<cardEffects.length;o++){var h=cardEffects[o].split(" ");if(h[0]&&h[0].match(endTurn))t.player_state.cards_to_play=0,t.player_state.pieces_to_play=0;else if(h[0]&&h[0].match(l))if(h[1]&&h[1].match(one))h[4]&&h[4].match(targetSelf)?t.player_state.damagingS=1:h[4]&&h[4].match(targetEnemy)?t.player_state.damagingE=1:t.player_state.damagingA=1;else if(h[1]&&h[1].match(every))for(var n=0;4>n;n++)for(var d=0;4>d;d++)1===this.board.board_state.shields[n][d]?this.board.board_state.shields[n][d]=0:0!==this.board.board_state.results[n][d]&&(this.board.board_state.results[n][d]=0);else h[4]&&h[4].match(targetSelf)?t.player_state.damagingS=h[1]:h[4]&&h[4].match(targetEnemy)?t.player_state.damagingE=h[1]:t.player_state.damagingA=h[1];else if(h[0]&&h[0].match(destroy))if(h[2]&&h[2].match(shield))if(h[1]&&h[1].match(one))t.player_state.deshielding=1;else if(h[1]&&h[1].match(every))for(var n=0;4>n;n++)for(var d=0;4>d;d++)this.board.board_state.shields[n][d]=0;else t.player_state.deshielding=h[1];else if(h[1]&&h[1].match(one))h[4]&&h[4].match(targetSelf)?t.player_state.destroyingS=1:h[4]&&h[4].match(targetEnemy)?t.player_state.destroyingE=1:t.player_state.destroyingA=1;else if(h[1]&&h[1].match(every))for(var n=0;4>n;n++)for(var d=0;4>d;d++)this.board.board_state.results[n][d]=0,this.board.board_state.shields[n][d]=0;else h[4]&&h[4].match(targetSelf)?t.player_state.destroyingS=h[1]:h[4]&&h[4].match(targetEnemy)?t.player_state.destroyingE=h[1]:t.player_state.destroyingA=h[1];else if(h[0]&&h[0].match(draw));else if(h[0]&&h[0].match(freeze))if(h[1]&&h[1].match(one))t.player_state.freezing=1;else if(h[1]&&h[1].match(every))for(var o=0;4>o;o++)for(var a=0;4>a;a++)0===this.board.board_state.results[o][a]&&0===this.board.board_state.rock[o][a]&&(this.board.board_state.frost[o][a]=4);else t.player_state.freezing=h[1];else if(h[0]&&h[0].match(thaw))if(h[1]&&h[1].match(one))t.player_state.thawing=1;else if(h[1]&&h[1].match(every))for(var o=0;4>o;o++)for(var a=0;4>a;a++)this.board.board_state.frost[o][a]>=1&&(this.board.board_state.frost[o][a]=0);else t.player_state.thawing=h[1];else if(h[0]&&h[0].match(block))if(h[1]&&h[1].match(one))t.player_state.blocking=1;else if(h[1]&&h[1].match(every))for(var o=0;4>o;o++)for(var a=0;4>a;a++)0===this.board.board_state.results[o][a]&&0===this.board.board_state.frost[o][a]&&(this.board.board_state.rock[o][a]=6);else t.player_state.blocking=h[1];else if(h[0]&&h[0].match(shield))if(h[1]&&h[1].match(one))t.player_state.shielding=1;else if(h[1]&&h[1].match(every))for(var o=0;4>o;o++)for(var a=0;4>a;a++)0===this.board.board_state.shields[o][a]&&(this.board.board_state.shields[o][a]=1);else t.player_state.shielding=h[1];else if(h[0]&&h[0].match(discard));else if(h[0]&&h[0].match(targetSelf))h[1]&&h[1].match(targetEnemy);else if(h[0]&&h[0].match(r)&&h[1]&&h[1].match(targetSelf)&&h[4]&&h[4].match(i))if(h[5]&&h[5].match(piece))for(var _=0,o=0;4>o;o++)for(var a=0;4>a;a++)_+=this.board.board_state.results[o][a];else h[3]&&h[3].match(shield)&&t.hand.push(e)}},game_core.prototype.evaluate_game_state=function(){return temp_move=this.choose_square(),board_score=void 0===temp_move?0:Number(temp_move.distance),this.players.self.host===!1&&(board_score=-board_score),player_hand_value=this.players.self.hand.length*player_card_value,enemy_hand_value=this.players.other.hand.length*enemy_card_value,state_score=board_score+player_hand_value+enemy_hand_value,state_score},game_core.prototype.choose_card=function(e){temp_player_state={cards_to_play:this.players.self.player_state.cards_to_play,pieces_to_play:this.players.self.player_state.pieces_to_play,damagingA:this.players.self.player_state.damagingA,damagingE:this.players.self.player_state.damagingE,damagingS:this.players.self.player_state.damagingS,destroyingA:this.players.self.player_state.destroyingA,destroyingE:this.players.self.player_state.destroyingE,destroyingS:this.players.self.player_state.destroyingS,discarding:this.players.self.player_state.discarding,shielding:this.players.self.player_state.shielding,deshielding:this.players.self.player_state.deshielding,freezing:this.players.self.player_state.freezing,thawing:this.players.self.player_state.thawing,blocking:this.players.self.player_state.blocking};for(var t=Number(this.evaluate_game_state()),s={card:void 0,score:t},a=0;a<this.players.self.hand.length;a++)this.resolve_card(this.players.self.hand[a],this.players.self,this.players.other),temp_score=Number(this.evaluate_game_state()),(e===!0&&temp_score>=s.score||e===!1&&temp_score<=s.score)&&(s={card:a,score:temp_score}),this.players.self.player_state={cards_to_play:temp_player_state.cards_to_play,pieces_to_play:temp_player_state.pieces_to_play,damagingA:temp_player_state.damagingA,damagingE:temp_player_state.damagingE,damagingS:temp_player_state.damagingS,destroyingA:temp_player_state.destroyingA,destroyingE:temp_player_state.destroyingE,destroyingS:temp_player_state.destroyingS,discarding:temp_player_state.discarding,shielding:temp_player_state.shielding,deshielding:temp_player_state.deshielding,freezing:temp_player_state.freezing,thawing:temp_player_state.thawing,blocking:temp_player_state.blocking};if(void 0!==s.card&&e===!0){console.log("Playing "+this.players.self.hand[s.card].cardName+" for >>> "+(s.score-t));for(var r=JSON.parse(fs.readFileSync(file)),a=0;a<r.length;a++)r[a].name===this.players.self.hand[s.card].cardName&&(r[a].count++,r[a].total=r[a].total+(s.score-t),r[a].min>s.score-t&&(r[a].min=s.score-t),r[a].max<s.score-t&&(r[a].max=s.score-t));fs.writeFileSync(file,JSON.stringify(r))}return s.card};var end_turn_button=function(){this.w=100,this.h=50,this.x=20,this.text="End Turn"},game_card=function(e){this.cardName=e,this.cardImage="",this.pos={x:0,y:0},this.size={x:140,y:210,hx:0,hy:0},this.size.hx=this.size.x/2,this.size.hy=this.size.y/2},game_player=function(e,t){this.instance=t,this.state="not-connected",this.id="",this.player_state={cards_to_play:0,pieces_to_play:0,damagingA:0,damagingE:0,damagingS:0,destroyingA:0,destroyingE:0,destroyingS:0,discarding:0,shielding:0,deshielding:0,freezing:0,thawing:0,blocking:0},this.deck=[],this.hand=[];var s=["Fire Blast","Fire Blast","Fire Blast","Ice Blast","Ice Blast","Frost","Summer","Summer","Sabotage","Armour Up","Armour Up","Taxes","Flurry","Sacrifice","Boulder","Floods","Floods","Barrage","Barrage","Bezerker","Bezerker","Reckless"];s=shuffle(s),this.deck=create_card_array(s),this.inputs=[]};game_core.prototype.update=function(e){(e-this.lastframetime>1e3||void 0===this.lastframetime)&&(this.lastframetime=e,this.client_update()),this.updateid=global.requestAnimationFrame(this.update.bind(this),this.viewport)},game_core.prototype.stop_update=function(){global.cancelAnimationFrame(this.updateid)},game_core.prototype.client_onserverupdate_recieved=function(e){var t=this.players.self.host?this.players.self:this.players.other,s=this.players.self.host?this.players.other:this.players.self,a=this.players.self;this.server_time=e.t,this.client_time=this.server_time-this.net_offset/1e3,e=JSON.parse(e),this.turn=e.tu,this.board.board_state=e.bo,t.player_state=e.hp,t.hand=create_card_array(e.hh),t.deck=create_card_array(e.hd),s.player_state=e.cp,s.hand=create_card_array(e.ch),s.deck=create_card_array(e.cd),this.players.self.last_input_seq=e.his,this.players.other.last_input_seq=e.cis,this.server_time=e.t},game_core.prototype.client_update=function(){if(!(this.players.self.host===!0&&-1===this.turn||this.players.self.host===!1&&1===this.turn||"hosting.waiting for a player"===this.players.self.state)){var e="";if(this.players.self.player_state.cards_to_play>0||this.players.self.player_state.discarding>0){var t=this.players.self.player_state.discarding>0?this.choose_card(!1):this.choose_card(!0);void 0===t?e="ca-skip":this.players.self.hand[t]&&(e="ca-"+this.players.self.hand[t].cardName)}else if(this.players.self.player_state.pieces_to_play>0||this.players.self.player_state.destroyingA>0||this.players.self.player_state.destroyingE>0||this.players.self.player_state.destroyingS>0||this.players.self.player_state.damagingA>0||this.players.self.player_state.damagingE>0||this.players.self.player_state.damagingS>0||this.players.self.player_state.freezing>0||this.players.self.player_state.thawing>0||this.players.self.player_state.blocking>0||this.players.self.player_state.shielding>0||this.players.self.player_state.deshielding>0){var s=void 0;if(s=this.choose_square(s),void 0===s)return;e="sq-"+(s.x+1)+(s.y+1)}else""===e&&(e="en");this.input_seq+=1;var a="i."+e+"."+this.local_time.toFixed(3).replace(".","-")+"."+this.input_seq;this.socket.send(a)}},game_core.prototype.create_timer=function(){setInterval(function(){this._dt=(new Date).getTime()-this._dte,this._dte=(new Date).getTime(),this.local_time+=this._dt/1e3}.bind(this),4)},game_core.prototype.client_create_ping_timer=function(){setInterval(function(){this.last_ping_time=(new Date).getTime(),this.socket.send("p."+this.last_ping_time)}.bind(this),1e3)},game_core.prototype.client_create_configuration=function(){this.input_seq=0,this.net_latency=.001,this.net_ping=.001,this.last_ping_time=.001,this.net_offset=100,this.client_time=.01,this.server_time=.01,this.lit=0,this.llt=(new Date).getTime()},game_core.prototype.client_onreadygame=function(e){var t=parseFloat(e.replace("-",".")),s=this.players.self.host?this.players.self:this.players.other,a=this.players.self.host?this.players.other:this.players.self;this.local_time=t+this.net_latency,s.state="local_pos(hosting)",a.state="local_pos(joined)",this.players.self.state="YOU "+this.players.self.state},game_core.prototype.client_onjoingame=function(e){this.players.self.host=!1,this.players.self.state="connected.joined.waiting"},game_core.prototype.client_onhostgame=function(e){var t=parseFloat(e.replace("-","."));this.local_time=t+this.net_latency,this.players.self.host=!0,this.players.self.state="hosting.waiting for a player"},game_core.prototype.client_onconnected=function(e){console.log(this.mmr),this.players.self.id=e.id,this.players.self.state="connected",this.players.self.online=!0},game_core.prototype.client_onping=function(e){this.net_ping=(new Date).getTime()-parseFloat(e),this.net_latency=this.net_ping/2},game_core.prototype.client_onnetmessage=function(e){var t=e.split("."),s=t[0],a=t[1]||null,r=t[2]||null;switch(s){case"s":switch(a){case"h":this.client_onhostgame(r);break;case"j":this.client_onjoingame(r);break;case"r":this.client_onreadygame(r);break;case"e":this.client_ondisconnect(r);break;case"p":this.client_onping(r)}}},game_core.prototype.client_ondisconnect=function(e){this.players.self.state="not-connected",this.players.self.online=!1,this.players.other.state="not-connected"},game_core.prototype.client_connect_to_server=function(){};