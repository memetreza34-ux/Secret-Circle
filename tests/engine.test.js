'use strict';
const assert=require('node:assert/strict');
const E=require('../game-engine.js');
const entries=[['Router','Netzwerk'],['Sensor','Messung'],['Kabel','Verbindung']];
assert.deepEqual(E.normalizePlayers(' Alex\nSam, Mika '),['Alex','Sam','Mika']);
assert.throws(()=>E.normalizePlayers(['Alex','alex','Sam']),/Doppelter/);
assert.equal(E.parseCustomEntries('Mond | Nacht\nSonne | Tag').length,2);
const options={players:['Alex','Sam','Mika','Lina'],entries,categoryId:'technik',category:'Technik',imposterCount:1,useHint:true,roundSeconds:180,maxRounds:3,seed:'repeatable'};
const a=E.createGame(options),b=E.createGame(options);
assert.deepEqual(a.revealOrder,b.revealOrder);assert.deepEqual(a.imposters,b.imposters);assert.equal(a.word,b.word);assert.equal(a.roundNumber,1);assert.equal(a.maxRounds,3);
let game=a;for(let i=0;i<4;i++)game=E.advanceReveal(game);assert.equal(game.phase,'discussion');game=E.beginVoting(game);assert.equal(game.phase,'voting');
const imposter=game.imposters[0],civilians=game.players.filter(player=>player!==imposter);
for(const voter of game.players){const target=voter===imposter?civilians[0]:imposter;game=E.castVote(game,voter,target)}
assert.equal(Object.keys(game.votes).length,4);game=E.finalizeVote(game);assert.equal(game.phase,'completed');assert.equal(game.voteResult.caught,true);for(const player of civilians)assert.equal(game.scores[player],1);
const board=E.leaderboard(game);assert.equal(board[0].score,1);const next=E.createGame(E.nextRoundOptions(game,entries,'next-seed'));assert.equal(next.roundNumber,2);assert.deepEqual(next.scores,game.scores);assert.equal(next.matchId,game.matchId);assert.equal(E.matchComplete(game),false);
let tie=E.createGame({...options,seed:'tie'});for(let i=0;i<4;i++)tie=E.advanceReveal(tie);tie=E.beginVoting(tie);const[p1,p2,p3,p4]=tie.players;tie=E.castVote(tie,p1,p2);tie=E.castVote(tie,p2,p1);tie=E.castVote(tie,p3,p4);tie=E.castVote(tie,p4,p3);tie=E.finalizeVote(tie);assert.equal(tie.voteResult.accused,null);for(const name of tie.imposters)assert.equal(tie.scores[name],2);
let invalid=E.createGame(options);for(let i=0;i<4;i++)invalid=E.advanceReveal(invalid);invalid=E.beginVoting(invalid);assert.throws(()=>E.castVote(invalid,'Alex','Alex'),/nicht für sich selbst/);assert.throws(()=>E.finalizeVote(invalid),/Alle Personen/);
assert.deepEqual(E.restoreGame(JSON.stringify(game)),game);assert.equal(E.historyEntry(game).caught,true);assert.throws(()=>E.restoreGame({...game,votes:{Alex:'Alex'}}),/Stimme/);
console.log(JSON.stringify({ok:true,deterministic:true,multiround:true,voting:true,scoring:true,ties:true,persistence:true},null,2));
