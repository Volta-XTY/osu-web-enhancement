// ==UserScript==
// @name osu!web enhancement
// @namespace http://tampermonkey.net/
// @version 0.5
// @description Some small improvements to osu!web, featuring beatmapset filter and profile page improvement.
// @author VoltaXTY
// @match https://osu.ppy.sh/*
// @icon http://ppy.sh/favicon.ico
// @updateURL https://greasyfork.org/scripts/475417-osu-web-enhancement/code/osu!web%20enhancement.user.js
// @grant none
// @run-at document-end
// ==/UserScript==
console.log("osu!web enhancement loaded");
const svg_osu_miss = URL.createObjectURL(new Blob(
[`<svg viewBox="0 0 128 128" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
    <filter id="blur">
        <feFlood flood-color="red" flood-opacity="0.5" in="SourceGraphic" />
        <feComposite operator="in" in2="SourceGraphic" />
        <feGaussianBlur stdDeviation="6" />
        <feComponentTransfer result="glow1"> <feFuncA type="linear" slope="10" intercept="0" /> </feComponentTransfer>
        <feGaussianBlur in="glow1" stdDeviation="1" result="glow2" />
        <feMerge> <feMergeNode in="SourceGraphic" /> <feMergeNode in="glow2" /> </feMerge>
    </filter>
    <filter id="blur2"> <feGaussianBlur stdDeviation="0.2"/> </filter>
    <path id="cross" d="M 26 16 l -10 10 l 38 38 l -38 38 l 10 10 l 38 -38 l 38 38 l 10 -10 l -38 -38 l 38 -38 l -10 -10 l -38 38 Z" />
    <use href="#cross" stroke="red" stroke-width="2" fill="transparent" filter="url(#blur)"/>
    <use href="#cross" fill="white" stroke="transparent" filter="url(#blur2)"/>
</svg>`], {type: "image/svg+xml"}));
const svg_green_tick = URL.createObjectURL(new Blob([
`<svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
    <polyline points="2,8 6,14 14,2" stroke="#62ee56" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`], {type: "image/svg+xml"}));
const inj_style = 
`#osu-db-input{
    display: none;
}
.osu-db-button{
    align-items: center;
    padding: 10px;
}
.osu-db-button:hover{
    cursor: pointer;
}
.beatmapsets__item.owned-beatmapset{
    opacity: 1.0;
}
.beatmapsets__item.owned-beatmapset .beatmapset-panel__menu-container{
    background-color: #87dda8;
}
.beatmapsets__item.owned-beatmapset .fas, .beatmapsets__item.owned-beatmapset .far{
    color: #5c9170;
}
.owned-beatmap-link{
    color: #87dda8;
}
.play-detail__accuracy{
    margin: 0px 12px;
}
.play-detail__accuracy.ppAcc{
    color: #8ef9f1;
    padding: 0;
}
.play-detail__weighted-pp{
    margin: 0px;
}
.play-detail__pp{
    flex-direction: column;
}
.lost-pp{
    font-size: 10px;
    position: relative;
    right: 7px;
    font-weight: 600;
}
.score-detail{
    display: inline-block;
}
.score-detail-data-text{
    margin-left: 5px;
    margin-right: 10px;
    width: auto;
    display: inline-block;
}
@keyframes rainbow{
    0%{
        color: #be19ff;
    }
    25%{
        color: #0075ff;
    }
    50%{
        color: #4ddf86;
    }
    75%{
        color: #e9ea00;
    }
    100%{
        color: #ff7800;
    }
}
.play-detail__accuracy-and-weighted-pp{
    display: flex;
    flex-direction: row-reverse;
}
.mania-max{
    animation: 0.16s infinite alternate rainbow;
}
.mania-300{
    color: #fbff00;
}
.osu-100{
    color: #67ff5b;
}
.mania-200{
    color: #6cd800;
}
.osu-300{
    color: #7dfbff;
}
.mania-100{
    color: #257aea;
}
.mania-50{
    color: #d2d2d2;
}
.osu-50{
    color: #ffbf00;
}
.mania-miss{
    color: #cc2626;
}
.mania-max, .mania-300, .mania-200, .mania-100, .mania-50, .mania-miss, .osu-300, .osu-100, .osu-50, .osu-miss{
    font-weight: 600;
}
.score-detail-data-text{
    font-weight: 500;
}
.osu-miss{
    display: inline-block;
}
.osu-miss > img{
    width: 14px;
    height: 14px;
    bottom: 1px;
    position: relative;
} 
div.bar__exp-info{
    position: relative;
    bottom: 100%;
}
.play-detail__group--background, .beatmap-playcount__background{
    position: absolute;
    width: 90%;
    height: 100%;
    left: 0px;
    margin: 0px;
    pointer-events: none;
    z-index: 1;
    border-radius: 10px 0px 0px 10px;
    background-size: cover;
    background-position-y: -100%;
    mask-image: linear-gradient(to right, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0));
    -webkit-mask-image: linear-gradient(to right, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0));
}
.beatmap-playcount__background{
    width: 100%;
    border-radius: 6px;
    mask-image: linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.05));
    -webkit-mask-image: linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.05));
}
.beatmap-playcount__info, .beatmap-playcount__detail-count{
    z-index: 1;
}
.play-detail__group.play-detail__group--top *{
    z-index: 3;
}
div.play-detail-list time.js-timeago, span.beatmap-playcount__mapper, span.beatmap-playcount__mapper > a{
    color: #ccc;
}
button.show-more-link{
    z-index: 4;
}
a.beatmap-download-link{
    margin: 0px 5px;
    color: hsl(var(--hsl-l1));
}
a.beatmap-download-link:hover{
    color: #fff;
}
`;
let scriptContent = 
String.raw`console.log("page script injected from osu!web enhancement");
let oldXHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function() {
    this.addEventListener("load", function() {
        const url = this.responseURL;
        const trreg = /https:\/\/osu\.ppy\.sh\/users\/([0-9]+)\/extra-pages\/(top_ranks|historical)\?mode=(osu|taiko|fruits|mania)/.exec(url);
        const adreg = /https:\/\/osu\.ppy\.sh\/users\/([0-9]+)\/scores\/(firsts|best|recent|pinned)\?mode=(osu|taiko|fruits|mania)&limit=[0-9]*&offset=[0-9]*/.exec(url);
        let info;
        if(trreg) info = {
            type: trreg[2],
            userId: Number(trreg[1]),
            mode: trreg[3],
        }
        else{
            if(adreg) info = {
                type: adreg[2],
                userId: Number(adreg[1]),
                mode: adreg[3], 
            }
            else return;
        }
        const responseBody = this.responseText;
        info.data = JSON.parse(responseBody);
        info.id = "osu!web enhancement";
        window.postMessage(info, "*");
    });
    return oldXHROpen.apply(this, arguments);
};`;
const scriptId = "osu-web-enhancement-XHR-script";
if(!document.querySelector(`script#${scriptId}`)){
    const script = document.createElement("script");
    script.textContent = scriptContent;
    document.body.appendChild(script);
}
const HTML = (tagname, attrs, ...children) => {
    if(attrs === undefined) return document.createTextNode(tagname);
    const ele = document.createElement(tagname);
    if(attrs) for(let [key, value] of Object.entries(attrs)){
        if(key === "eventListener"){
            for(let listener of value){
                ele.addEventListener(listener.type, listener.listener, listener.options);
            }
        }
        else ele.setAttribute(key, value);
    }
    for(let child of children) ele.append(child);
    return ele;
};
const html = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html;
    return t.content.firstElementChild;
};
const PostMessage = (msg) => { console.error(msg); };
const OsuMod = {
    NoFail:         1 << 0,
    Easy:           1 << 1,
    TouchDevice:    1 << 2,
    NoVideo:        1 << 2,
    Hidden:         1 << 3,
    HardRock:       1 << 4,
    SuddenDeath:    1 << 5,
    DoubleTime:     1 << 6,
    Relax:          1 << 7,
    HalfTime:       1 << 8,
    Nightcore:      1 << 9, // always with DT
    Flashlight:     1 << 10,
    Autoplay:       1 << 11,
    SpunOut:        1 << 12,
    Autopilot:      1 << 13,
    Perfect:        1 << 14,
    Key4:           1 << 15,
    Key5:           1 << 16,
    Key6:           1 << 17,
    Key7:           1 << 18,
    Key8:           1 << 19,
    KeyMod:         1 << 19 | 1 << 18 | 1 << 17 | 1 << 16 | 1 << 15,
    FadeIn:         1 << 20,
    Random:         1 << 21,
    Cinema:         1 << 22,
    TargetPractice: 1 << 23,
    Key9:           1 << 24,
    Coop:           1 << 25,
    Key1:           1 << 26,
    Key3:           1 << 27,
    Key2:           1 << 28,
    ScoreV2:        1 << 29,
    Mirror:         1 << 30,
};
class Byte{ value = 0; constructor(arr, iter){ this.value = arr[iter.nxtpos++]; } };
class RankedStatus extends Byte{
    constructor(arr, iter){
        super(arr, iter);
        switch(this.value){
            case 1: this.description = "unsubmitted"; break;
            case 2: this.description = "pending/wip/graveyard"; break;
            case 3: this.description = "unused"; break;
            case 4: this.description = "ranked"; break;
            case 5: this.description = "approved"; break;
            case 6: this.description = "qualified"; break;
            case 7: this.description = "loved"; break;
            default: this.description = "unknown"; this.value = 0;
        }
    }
};
class OsuMode extends Byte{
    constructor(arr, iter){
        super(arr, iter);
        switch(this.value){
            case 1: this.description = "taiko"; break;
            case 2: this.description = "catch"; break;
            case 3: this.description = "mania"; break;
            default: this.value = 0; this.description = "osu";
        }
    }
};
class Grade extends Byte{
    constructor(arr, iter){
        super(arr, iter);
        switch(this.value){
            case 0: this.description = "SSH"; break;
            case 1: this.description = "SH"; break;
            case 2: this.description = "SS"; break;
            case 3: this.description = "S"; break;
            case 4: this.description = "A"; break;
            case 5: this.description = "B"; break;
            case 6: this.description = "C"; break;
            case 7: this.description = "D"; break;
            default: this.description = "not played";
        }
    }
};
class Short{ value = 0; constructor(arr, iter){ this.value = arr[iter.nxtpos++] | arr[iter.nxtpos++] << 8; } };
class Int{ value = 0; constructor(arr, iter){ this.value = arr[iter.nxtpos++] | arr[iter.nxtpos++] << 8 | arr[iter.nxtpos++] << 16 | arr[iter.nxtpos++] << 24; } };
class Long{ value = 0n; constructor(arr, iter){ this.value = new DataView(arr.buffer, iter.nxtpos, 8).getBigUint64(0, true); iter.nxtpos += 8; } };
class ULEB128{
    value = 0n;
    constructor(arr, iter){
        let shift = 0n;
        while(true){
            let peek = BigInt(arr[iter.nxtpos++]);
            this.value |= (peek & 0x7Fn) << shift;
            if((peek & 0x80n) === 0n) break;
            shift += 7n;
        }
    }
};
class Single{ value = 0; constructor(arr, iter){ this.value = new DataView(arr.buffer, iter.nxtpos, 4).getFloat32(0, true); iter.nxtpos += 4; } };
class Double{ value = 0; constructor(arr, iter){ this.value = new DataView(arr.buffer, iter.nxtpos, 8).getFloat64(0, true); iter.nxtpos += 8; } };
class Boolean{ value = false; constructor(arr, iter){ this.value = arr[iter.nxtpos++] !== 0x00; } };
class OString{
    value = "";
    constructor(arr, iter){
        switch(arr[iter.nxtpos++]){
            case 0: break;
            case 0x0b:
                const l = new ULEB128(arr, iter).value;
                const bv = new Uint8Array(arr.buffer, iter.nxtpos, Number(l));
                this.value = new TextDecoder().decode(bv);
                iter.nxtpos += Number(l);
                break;
            default: console.assert(false, `error occurred while parsing osu string with the first byte.`);
        }
    }
};
class IntDouble{
    int = 0;
    double = 0;
    constructor(arr, iter){
        const m1 = arr[iter.nxtpos++];
        console.assert(m1 === 0x08, `error occurred while parsing Int-Double pair at ${iter.nxtpos - 1} with value 0x${m1.toString(16)}: should be 0x8.`);
        this.int = new Int(arr, iter).value;
        const m2 = arr[iter.nxtpos++];
        console.assert(m2 === 0x0d, `error occurred while parsing Int-Double pair at ${iter.nxtpos - 1} with value 0x${m1.toString(16)}: should be 0x8.`);
        this.double = new Double(arr, iter).value;
    }
};
class IntDoubleArray extends Array{
    constructor(arr, iter){
        super(new Int(arr, iter).value);
        for(let i = 0; i < this.length; i++) this[i] = new IntDouble(arr, iter);
    }
};
class TimingPoint{
    BPM = 0;
    offset = 0;
    notInherited = false;
    constructor(arr, iter){
        this.BPM = new Double(arr, iter).value;
        this.offset = new Double(arr, iter).value;
        this.notInherited = new Boolean(arr, iter).value;
    }
};
class TimingPointArray extends Array{
    constructor(arr, iter){
        super(new Int(arr, iter).value);
        for(let i = 0; i < this.length; i++) this[i] = new TimingPoint(arr, iter);
    }
};
class DateTime extends Long{};
class Beatmap{
    constructor(arr, iter){
        if(iter.osuVersion < 20191106) this.bytes = new Int(arr, iter);
        this.artistName = new OString(arr, iter);
        this.artistNameUnicode = new OString(arr, iter);
        this.songTitle = new OString(arr, iter);
        this.songTitleUnicode = new OString(arr, iter);
        this.creatorName = new OString(arr, iter);
        this.difficultyName = new OString(arr, iter);
        this.audioFilename = new OString(arr, iter);
        this.MD5Hash = new OString(arr, iter);
        this.beatmapFilename = new OString(arr, iter);
        this.rankedStatus = new RankedStatus(arr, iter);
        this.hitcircleCount = new Short(arr, iter);
        this.sliderCount = new Short(arr, iter);
        this.spinnerCount = new Short(arr, iter);
        this.lastModified = new Long(arr, iter);
        this.AR = iter.osuVersion < 20140609 ? new Byte(arr, iter) : new Single(arr, iter);
        this.CS = iter.osuVersion < 20140609 ? new Byte(arr, iter) : new Single(arr, iter);
        this.HP = iter.osuVersion < 20140609 ? new Byte(arr, iter) : new Single(arr, iter);
        this.OD = iter.osuVersion < 20140609 ? new Byte(arr, iter) : new Single(arr, iter);
        this.sliderVelocity = new Double(arr, iter);
        if(iter.osuVersion >= 20140609) this.osuSRInfoArr = new IntDoubleArray(arr, iter);
        if(iter.osuVersion >= 20140609) this.taikoSRInfoArr = new IntDoubleArray(arr, iter);
        if(iter.osuVersion >= 20140609) this.catchSRInfoArr = new IntDoubleArray(arr, iter);
        if(iter.osuVersion >= 20140609) this.maniaSRInfoArr = new IntDoubleArray(arr, iter);
        this.drainTime = new Int(arr, iter);
        this.totalTime = new Int(arr, iter);
        this.audioPreviewTime = new Int(arr, iter);
        this.timingPointArr = new TimingPointArray(arr, iter);
        this.difficultyID = new Int(arr, iter);
        this.beatmapID = new Int(arr, iter);
        this.threadID = new Int(arr, iter);
        this.osuGrade = new Grade(arr, iter);
        this.taikoGrade = new Grade(arr, iter);
        this.catchGrade = new Grade(arr, iter);
        this.maniaGrade = new Grade(arr, iter);
        this.offsetLocal = new Short(arr, iter);
        this.stackLeniency = new Single(arr, iter);
        this.mode = new OsuMode(arr, iter);
        this.sourceStr = new OString(arr, iter);
        this.tagStr = new OString(arr, iter);
        this.offsetOnline = new Short(arr, iter);
        this.titleFont = new OString(arr, iter);
        this.unplayed = new Boolean(arr, iter);
        this.lastTimePlayed = new Long(arr, iter);
        this.isOsz2 = new Boolean(arr, iter);
        this.folderName = new OString(arr, iter);
        this.lastTimeChecked = new Long(arr, iter);
        this.ignoreBeatmapSound = new Boolean(arr, iter);
        this.ignoreBeatmapSkin = new Boolean(arr, iter);
        this.disableStoryboard = new Boolean(arr, iter);
        this.disableVideo = new Boolean(arr, iter);
        this.visualOverride = new Boolean(arr, iter);
        if(iter.osuVersion < 20140609) this.uselessShort = new Short(arr, iter);
        this.lastModified = new Int(arr, iter);
        this.scrollSpeedMania = new Byte(arr, iter);
    }
};
class BeatmapArray extends Array{
    constructor(arr, iter){
        super(new Int(arr, iter).value);
        for(let i = 0; i < this.length; i++) this[i] = new Beatmap(arr, iter);
    }
};
class OsuDb{
    constructor(arr, iter){
        this.version = new Int(arr, iter);
        iter.osuVersion = this.version.value;
        this.folderCount = new Int(arr, iter);
        this.accountUnlocked = new Boolean(arr, iter);
        this.timeTillUnlock = new DateTime(arr, iter);
        this.playerName = new OString(arr, iter);
        this.beatmapArray = new BeatmapArray(arr, iter);
        this.permission = new Int(arr, iter);
    }
};
const beatmapsets = new Set();
const beatmaps = new Set();
const bmsReg = /https:\/\/osu\.ppy\.sh\/beatmapsets\/([0-9]+)/;
const bmReg = /https:\/\/osu\.ppy\.sh\/beatmapsets\/(?:[0-9]+)#(?:mania|osu|fruits|taiko)\/([0-9]+)/;
const BeatmapsetRefresh = () => {
    for(const bm of window.osudb.beatmapArray){
        beatmaps.add(bm.difficultyID.value);
        beatmapsets.add(bm.beatmapID.value);
    }
    OnMutation();
};
const NewOsuDb = (r) => {
    return new Promise((resolve, reject) => {
        const start = performance.now();
        const result = new Uint8Array(r.result);
        const length = result.length;
        console.log(`start reading osu!.db(${length} Bytes).`);
        const iter = {
            nxtpos: 0,
        };
        window.osudb = new OsuDb(result, iter);
        console.assert(iter.nxtpos === length, "there are still remaining unread bytes, something may be wrong. iter: %o", iter);
        console.log(`finished reading osu!.db in ${performance.now() - start} ms.`);
        resolve();
    })
};
const ReadOsuDb = (file) => {
    if(file.name !== "osu!.db"){ console.assert( false, "filename should be 'osu!.db'."); return; }
    const r = new FileReader();
    r.onload = () => {
        NewOsuDb(r);
        BeatmapsetRefresh();
    };
    r.onerror = () => console.assert(false, "error occurred while reading file.");
    r.readAsArrayBuffer(file);
};
const SelectOsuDb = (event) => {
    const t = event.target;
    const l = t.files;
    console.assert(l && l.length === 1, "No file or multiple files are selected.");
    ReadOsuDb(l[0]);
};
const PlaceSelectOsuDbButton = () => {
    if(document.querySelector(".osu-db-button")) return;
    const i = HTML("input", {type: "file", id: "osu-db-input", accept: ".db", eventListener: [{
        type: "change",
        listener: SelectOsuDb,
        options: false,
    }]});
    const d = HTML("div", {class: "osu-db-button nav2__col nav2__col--menu", eventListener: [{
        type: "click",
        listener: () => {if(i) i.click();},
        options: false,
    }]}, HTML("osu!.db"));
    document.body.appendChild(i);
    const a = document.querySelector("div.nav2__col.nav2__col--menu");
    a.parentElement.insertBefore(d, a);
};
const FilterBeatmapSet = () => {
    document.querySelectorAll(".beatmapsets__item").forEach((item) => {
        const bmsID = Number(bmsReg.exec(item.innerHTML)?.[1]);
        if(bmsID && beatmapsets.has(bmsID)){
            item.classList.add("owned-beatmapset");
        }
    });
    document.querySelectorAll("div.bbcode a").forEach(item => {
        if(item.classList.contains("owned-beatmap-link") || item.classList.contains("beatmap-download-link")) return;
        const e = bmsReg.exec(item.href);
        if(e && beatmapsets.has(Number(e[1]))){
            item.classList.add("owned-beatmap-link");
            if(item.nextElementSibling?.classList?.contains("beatmap-download-link")) item.nextElementSibling.remove();
            item.after(HTML("img", {src: svg_green_tick, alt: "owned beatmap", class: "fa-green-tick"}));
        }else if(e && !item.nextElementSibling?.classList?.contains("beatmap-download-link")){
            item.after(
                HTML("a", {class: "beatmap-download-link", href: `https://osu.ppy.sh/beatmapsets/${e[1]}/download`, download: ""},
                    HTML("span", {class: "fas fa-file-download"})
                )
            );
        }
    })
};
const AdjustStyle = (modeId, sectionName) => {
    const styleSheetId = `userscript-generated-stylesheet-${sectionName}`;
    let e = document.getElementById(styleSheetId);
    if(!e){
        e = document.createElement("style");
        e.id = styleSheetId;
        document.head.appendChild(e);
    }
    const s = e.sheet;
    while(s.cssRules.length) s.deleteRule(0);
    const sectionSelector = `div.js-sortable--page[data-page-id="${sectionName}"]`;
    let ll;
    switch(modeId){
        case 3: ll = [".mania-300", ".mania-200", ".mania-100", ".mania-50", ".mania-miss"]; break;
        case 0: ll = [".osu-300", ".osu-100", ".osu-50", ".osu-miss"]; break;
        default: ll = [];
    }
    ll.forEach((str) =>
        s.insertRule(
            `${sectionSelector} ${str} + .score-detail-data-text {
                width: ${[...document.querySelectorAll(`${sectionSelector} ${str} + .score-detail-data-text`)].reduce((max, ele) => ele.clientWidth > max ? ele.clientWidth : max, 0) + 2}px;
            }` ,0
        )
    );
    s.insertRule(
        `${sectionSelector} .play-detail__pp{
            width: ${[...document.querySelectorAll(`${sectionSelector} .play-detail__pp`)].reduce((max, ele) => ele.clientWidth > max ? ele.clientWidth : max, 0) + 1}px;
        }`
        ,0
    );
};
const TopRanksWorker = (items, tabId, sectionName = "top_ranks") => {
    if(!items.length) return true;
    const tabEle = document.querySelector(`div.js-sortable--page[data-page-id="${sectionName}"]`);
    if(!tabEle) return false;
    const listEle = tabEle.querySelectorAll(`.title.title--page-extra-small + div.play-detail-list.u-relative`)?.[tabId];
    if(!listEle) return false;
    let completed = true;
    for(const item of [...listEle.querySelectorAll(".play-detail.play-detail--highlightable")]){
        const a = item.querySelector("a.play-detail__title")
        const bm = bmReg.exec(a.href)[1];
        const data = items.find(item => item.beatmap_id === Number(bm));
        if(!data) completed = false;
        else ListItemWorker(item, data);
    }
    if(!completed) return false;
    AdjustStyle(items[0].ruleset_id, sectionName, tabId);
    return true;
};
const ListItemWorker = (ele, data) => {
    if(ele.classList.contains("improved")) return;
    ele.classList.add("improved");
    if(data.pp){
        const pptext = ele.querySelector(".play-detail__pp > span").childNodes[0];
        pptext.nodeValue = Number(data.pp).toPrecision(5);
    }
    const left = ele.querySelector("div.play-detail__group.play-detail__group--top");
    const leftc = HTML("div", {class: "play-detail__group--background", style: `background-image: url(https://assets.ppy.sh/beatmaps/${data.beatmap.beatmapset_id}/covers/card@2x.jpg);`});
    left.parentElement.insertBefore(leftc, left);
    const detail= ele.querySelector("div.play-detail__score-detail-top-right");
    const du = detail.children[0];
    if(!detail.children[1]) detail.append(HTML("div", {classList: "play-detail__pp-weight"}));
    const db = detail.children[1];
    data.statistics.perfect ??= 0, data.statistics.great ??= 0, data.statistics.good ??= 0, data.statistics.ok ??= 0, data.statistics.meh ??= 0, data.statistics.miss ??= 0;
    switch(data.ruleset_id){
        case 0:{
            du.replaceChildren(
                HTML("span", {class: "play-detail__accuracy"}, HTML(`V1Acc: ${(data.accuracy * 100).toFixed(2)}%`)),
            );
            const m_300 = HTML("span", {class: "score-detail score-detail-osu-300"}, 
                HTML("span", {class: "osu-300"}, 
                    HTML("300")
                ),
                HTML("span", {class: "score-detail-data-text"},
                    HTML(`${data.statistics.great + data.statistics.perfect}`)
                )
            );
            const s100 = HTML("span", {class: "score-detail score-detail-osu-100"}, 
                HTML("span", {class: "osu-100"}, 
                    HTML("100")
                ),
                HTML("span", {class: "score-detail-data-text"},
                    HTML(`${data.statistics.ok + data.statistics.good}`)
                )
            );
            const s50 = HTML("span", {class: "score-detail score-detail-osu-50"}, 
                HTML("span", {class: "osu-50"}, 
                    HTML("50")
                ),
                HTML("span", {class: "score-detail-data-text"},
                    HTML(`${data.statistics.meh}`)
                )
            );
            const s0 = HTML("span", {class: "score-detail score-detail-osu-miss"},
                HTML("span", {class: "osu-miss"},
                    HTML("img", {src: svg_osu_miss, alt: "miss"})
                ),
                HTML("span", {class: "score-detail-data-text"},
                    HTML(`${data.statistics.miss}`)
                )
            );
            db.replaceChildren(m_300, s100, s50, s0);
            break;
        }
        case 1:{
            break;
        }
        case 2:{
            break;
        }
        case 3:{
            const v2acc = (320*data.statistics.perfect+300*data.statistics.great+200*data.statistics.good+100*data.statistics.ok+50*data.statistics.meh)/(320*(data.statistics.perfect+data.statistics.great+data.statistics.good+data.statistics.ok+data.statistics.meh+data.statistics.miss));
            du.replaceChildren(
                HTML("span", {class: "play-detail__accuracy"}, HTML(`V1Acc: ${(data.accuracy * 100).toFixed(2)}%`)),
                HTML("span", {class: "play-detail__accuracy ppAcc"}, HTML(`PPAcc: ${(v2acc * 100).toFixed(2)}%`)),
            );
            if(data.pp){
                const lostpp = data.pp * (0.2 / (Math.min(Math.max(v2acc, 0.8), 1) - 0.8) - 1);
                ele.querySelector(".play-detail__pp").appendChild(HTML("span", {class: "lost-pp"}, HTML(`-${lostpp.toPrecision(4)}`)));
            }
            const M_300 = Number(data.statistics.perfect) / Math.max(Number(data.statistics.great), 1);
            db.replaceChildren(
                HTML("span", {class: "score-detail score-detail-mania-max-300"},
                    HTML("span", {class: "mania-max"}, HTML("M")),
                    HTML("/"),
                    HTML("span", {class: "mania-300"}, HTML("300")),
                    HTML("span", {class: "score-detail-data-text"}, HTML(`${M_300.toFixed(2)}`))
                ),
                HTML("span", {class: "score-detail score-detail-mania-max-200"},
                    HTML("span", {class: "mania-200"}, HTML("200")),
                    HTML("span", {class: "score-detail-data-text"}, HTML(data.statistics.good))
                ),
                HTML("span", {class: "score-detail score-detail-mania-max-100"},
                    HTML("span", {class: "mania-100"}, HTML("100")),
                    HTML("span", {class: "score-detail-data-text"}, HTML(data.statistics.ok))
                ),
                HTML("span", {class: "score-detail score-detail-mania-max-50"},
                    HTML("span", {class: "mania-50"}, HTML("50")),
                    HTML("span", {class: "score-detail-data-text"}, HTML(data.statistics.meh))
                ),
                HTML("span", {class: "score-detail score-detail-mania-max-0"},
                    HTML("span", {class: "mania-miss"}, HTML("miss")),
                    HTML("span", {class: "score-detail-data-text"}, HTML(data.statistics.miss))
                )
            );
            break;
        }
    }
}
let lastLocationStr = "";
let lastInitData;
const OsuLevelToExp = (n) => {
    if(n <= 100) return 5000 / 3 * (4 * n ** 3 - 3 * n ** 2 - n) + 1.25 * 1.8 ** (n - 60);
    else return 26_931_190_827 + 99_999_999_999 * (n - 100);
}
const OsuExpValToStr = (num) => {
    let exp = Math.log10(num);
    if(exp >= 12){
        return `${(num / 10 ** 12).toPrecision(4)}T`;
    }
    else if(exp >= 9){
        return `${(num / 10 ** 9).toPrecision(4)}B`;
    }
    else if(exp >= 6){
        return `${(num / 10 ** 6).toPrecision(4)}M`;
    }
    else if(exp >= 4){
        return `${(num / 10 ** 3).toPrecision(4)}K`;
    }
    else return `${num}`;
}
const ImproveProfile = (message) => {
    let initData;
    if(window.location.toString() === lastLocationStr){
        initData = lastInitData;
    }
    else{
        initData = JSON.parse(document.querySelector(".js-react--profile-page.osu-layout.osu-layout--full").dataset.initialData);
        lastLocationStr = window.location.toString();
        lastInitData = initData;
    }
    const userId = initData.user.id;
    const modestr = initData.current_mode;
    if(!(userId === message.userId && modestr === message.mode)) return;
    const ttscore = initData.user.statistics.total_score;
    const lvl = initData.user.statistics.level.current;
    const upgradescore = Math.round(OsuLevelToExp(lvl + 1) - OsuLevelToExp(lvl));
    const lvlscore = ttscore - Math.round(OsuLevelToExp(lvl));
    document.querySelector("div.bar__text").textContent = `${OsuExpValToStr(lvlscore)}/${OsuExpValToStr(upgradescore)} (${(lvlscore/upgradescore * 100).toPrecision(3)}%)`;
    let ppDiv;
    document.querySelectorAll("div.value-display.value-display--plain").forEach((ele) => {
        if(ele.querySelector("div.value-display__label").textContent === "pp") ppDiv = ele;
    });
    ppDiv.querySelector(".value-display__value > div").textContent = Number(initData.user.statistics.pp).toPrecision(6);
    //document.querySelector(".value-display.value-display--plain.value-display--plain-wide").textContent = 
    const obcb = () => {
        ob.disconnect();
        let result = true;
        switch(message.type){
            case "top_ranks":
                result &&= TopRanksWorker(message.data.pinned.items, 0);
                result &&= TopRanksWorker(message.data.best.items, 1);
                result &&= TopRanksWorker(message.data.firsts.items, 2);
                break;
            case "firsts":
                result &&= TopRanksWorker(message.data, 2);
                break;
            case "pinned":
                result &&= TopRanksWorker(message.data, 0);
                break;
            case "best":
                result &&= TopRanksWorker(message.data, 1);
                break;
            case "historical":
                result &&= TopRanksWorker(message.data.recent.items, 0, "historical");
                break;
            case "recent":
                result &&= TopRanksWorker(message.data, 0, "historical");
                break;
        }
        if(!result) ob.observe(document, {subtree: true, childList: true});
    };
    const ob = new MutationObserver(obcb);
    ob.observe(document, {subtree: true, childList: true});
    obcb();
}
let wloc = "";
const WindowLocationChanged = () => {
    if(window.location !== wloc){
        wloc = window.location;
        return true;
    }
    else return false;
}
const InsertStyleSheet = () => {
    //const sheetId = "osu-web-enhancement-general-stylesheet";
    const s = new CSSStyleSheet();
    s.replaceSync(inj_style);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, s];
}
const OnBeatmapsetDownload = (message) => {
    beatmapsets.add(message.beatmapsetId);
}
const ImproveBeatmapPlaycountItems = () => {
    for(const item of [...document.querySelectorAll("div.beatmap-playcount")]){
        if(item.classList.contains("improved")) continue;
        else item.classList.add("improved");
        const a = item.querySelector("a");
        const bms = bmsReg.exec(a.href);
        if(!bms?.[1]) continue;
        const d = item.querySelector("div.beatmap-playcount__detail");
        const b = HTML("div", {class: "beatmap-playcount__background", style: `background-image: url(https://assets.ppy.sh/beatmaps/${bms[1]}/covers/card@2x.jpg)`});
        if(d.childElementCount > 0) d.insertBefore(b, d.children[0]);
        else d.append(b);
    }
}
const OnMutation = (mulist) => {
    mut.disconnect();
    PlaceSelectOsuDbButton();
    FilterBeatmapSet();
    ImproveBeatmapPlaycountItems();
    mut.observe(document, {childList: true, subtree: true});
};
const MessageFilter = (message) => {
    switch(message.type){
        case "beatmapset_download_complete": OnBeatmapsetDownload(message); break;
    }
}
const WindowMessageFilter = (event) => {
    if(event.source === window && event?.data?.id === "osu!web enhancement"){
        ImproveProfile(event.data);
    }
}
window.addEventListener("message", WindowMessageFilter);
const mut = new MutationObserver(OnMutation);
mut.observe(document, {childList: true, subtree: true});
InsertStyleSheet();