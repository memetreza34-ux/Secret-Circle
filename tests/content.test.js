'use strict';
const assert=require('node:assert/strict');
const C=require('../word-packs.js');
assert.equal(C.validatePacks(),true);
assert.equal(C.VERSION,'2026.08-rc1');
assert.equal(C.METADATA.reviewStatus,'internal_family_friendly');
assert.equal(C.METADATA.externalEditorialReview,false);
assert.equal(C.METADATA.packCount,8);
assert.equal(C.METADATA.entryCount,80);
assert.equal(C.allEntries().length,80);
for(const [id,entries] of Object.entries(C.PACKS)){assert.ok(C.LABELS[id]);assert.equal(entries.length,10);assert.equal(new Set(entries.map(entry=>entry[0].toLocaleLowerCase('de-DE'))).size,entries.length);assert.ok(entries.every(([word,hint])=>word.length>=2&&hint.length>=2))}
console.log(JSON.stringify({ok:true,version:C.VERSION,packs:C.METADATA.packCount,entries:C.METADATA.entryCount,familyFriendly:true,externalReview:false},null,2));
