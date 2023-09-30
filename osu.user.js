// ==UserScript==
// @name osu!web enhancement
// @namespace http://tampermonkey.net/
// @version 0.6.1.3
// @description Some small improvements to osu!web, featuring beatmapset filter and profile page improvement.
// @author VoltaXTY
// @match https://osu.ppy.sh/*
// @match https://lazer.ppy.sh/*
// @icon http://ppy.sh/favicon.ico
// @updateURL https://greasyfork.org/scripts/475417-osu-web-enhancement/code/osu!web%20enhancement.user.js
// @grant none
// @run-at document-end
// ==/UserScript==
const ShowPopup = (m, t = "info") => {
    window.popup(m, t);
    [["info", console.log], ["warning", console.warn], ["danger", console.error]].find(g => g[0] === t)[1](m);
}
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
`<svg viewBox="0 0 18 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
    <polyline points="2,8 7,14 16,2" stroke="#62ee56" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
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
    flex-direction: row;
}
.play-detail__before{
    flex-grow: 1;
}
.mania-max{
    animation: 0.16s infinite alternate rainbow;
}
.mania-300{
    color: #fbff00;
}
.osu-100, .fruits-100, .taiko-150{
    color: #67ff5b;
}
.mania-200{
    color: #6cd800;
}
.osu-300, .fruits-300, .taiko-300{
    color: #7dfbff;
}
.mania-100{
    color: #257aea;
}
.mania-50{
    color: #d2d2d2;
}
.osu-50, .fruits-50-miss{
    color: #ffbf00;
}
.mania-miss, .taiko-miss, .fruits-miss{
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
.play-detail__Accuracy, .play-detail__Accuracy2, .combo, .max-combo, .play-detail__combo{
    display: inline-block;
    width: auto;
}
.play-detail__Accuracy{
    text-align: left;
    color: #fc2;
}
.play-detail__Accuracy2{
    text-align: left;
    color: rgb(142, 249, 241);
}
.play-detail__combo, .play-detail__Accuracy2, .play-detail__Accuracy{
    margin-right: 13px;
}
.play-detail__combo{
    text-align: right;
}
.combo, .max-combo{
    margin: 0px 1px;
}
.max-combo, .legacy-perfect-combo{
    color: hsl(var(--hsl-lime-1));
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
    mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));
    -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));
}
@media(max-width: 900px){
    .play-detail__group--background, .beatmap-playcount__background{
        background-position-y: 0%;
        mask-image: linear-gradient(to bottom, #0007, #0004);
        -webkit-mask-image: linear-gradient(to bottom, #0007, #0004);
        width: 100%;
    }
    .lost-pp{
        left: 3px;
    }
    .play-detail__group.play-detail__group--bottom{
        z-index: 1;
    }
    .play-detail__before{
        flex-grow: 0;
    }
}
.play-detail.play-detail--highlightable.play-detail--pin-sortable.js-score-pin-sortable .play-detail__group--background{
    left: 20px;
}
.beatmap-playcount__background{
    width: 100%;
    border-radius: 6px;
    mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3));
    -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3));
}
.beatmap-playcount__info, .beatmap-playcount__detail-count, .play-detail__group.play-detail__group--top *{
    z-index: 1;
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
a.beatmap-download-link:hover, a.beatmap-pack-item-download-link span:hover{
    color: #fff;
}
a.beatmap-pack-item-download-link span{
    color: hsl(var(--hsl-l1));
}
.play-detail.play-detail--highlightable.audio-player{
    max-width: none;
    height: unset;
    padding: unset;
    align-items: unset;
}
.play-detail.play-detail--highlightable.audio-player__button{
    align-items: unset;
    padding: unset;
}
.play-detail.play-detail--highlightable.audio-player__button:hover{
    color: unset;
}
`;
let scriptContent = 
String.raw`console.log("page script injected from osu!web enhancement");
if(window.oldXHROpen === undefined){
    window.oldXHROpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function() {
        this.addEventListener("load", function() {
            const url = this.responseURL;
            const trreg = /https:\/\/(?<subdomain>osu|lazer)\.ppy\.sh\/users\/(?<id>[0-9]+)\/extra-pages\/(?<type>top_ranks|historical)\?mode=(?<mode>osu|taiko|fruits|mania)/.exec(url);
            const adreg = /https:\/\/(?<subdomain>osu|lazer)\.ppy\.sh\/users\/(?<id>[0-9]+)\/scores\/(?<type>firsts|best|recent|pinned)\?mode=(?<mode>osu|taiko|fruits|mania)&limit=[0-9]*&offset=[0-9]*/.exec(url);
            let reg = trreg ?? (adreg ?? null);
            if(!reg){
                const bmsreg = /https:\/\/(?:osu|lazer)\.ppy\.sh\/beatmapsets\/search\?/;
                return;
            }
            let info = {
                type: reg.groups.type,
                userId: Number(reg.groups.id),
                mode: reg.groups.mode,
                subdomain: reg.groups.subdomain,
            };
            const responseBody = this.responseText;
            info.data = JSON.parse(responseBody);
            info.id = "osu!web enhancement";
            window.postMessage(info, "*");
        });
        return oldXHROpen.apply(this, arguments);
    };
}`;
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
    for(let child of children) if(child) ele.append(child);
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
            case 0x0b: {
                const l = new ULEB128(arr, iter).value;
                const bv = new Uint8Array(arr.buffer, iter.nxtpos, Number(l));
                this.value = new TextDecoder().decode(bv);
                iter.nxtpos += Number(l);
                break;
            }
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
const bmsReg = /https:\/\/(?:osu|lazer)\.ppy\.sh\/beatmapsets\/([0-9]+)/;
const bmsdlReg = /https:\/\/(?:osu|lazer)\.ppy\.sh\/beatmapsets\/([0-9]+)\/download/;
const bmReg = /https:\/\/(?:osu|lazer)\.ppy\.sh\/beatmapsets\/(?:[0-9]+)#(?:mania|osu|fruits|taiko)\/([0-9]+)/;
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
        if(iter.nxtpos !== length) ShowPopup("There are still remaining unread bytes, something may be wrong.", "danger");
        ShowPopup(`Finished reading osu!.db in ${performance.now() - start} ms.`);
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
const CheckForUpdate = () => {
    const verReg = /<dd class="script-show-version"><span>([0-9\.]+)<\/span><\/dd>/;
    fetch("https://greasyfork.org/en/scripts/475417-osu-web-enhancement", {
        credentials: "omit"
    }).then(response => response.text()).then((html) => {
        const ver = verReg.exec(html);
        if(ver){
            const result = (() => {
                const verList = ver[1].split(".");
                const thisVer = GM_info.script.version;
                console.log(`latest version is: ${ver[1]}, current version is: ${thisVer}`);
                const thisVerList = thisVer.split(".");
                for(let i = 0; i < verList.length; i++){
                    if(Number(verList[i]) > Number(thisVerList[i] ?? 0)) return true;
                    else if(Number(verList[i]) < Number(thisVerList[i] ?? 0)) return false;
                }
                return false;
            })();
            if(result){
                const a = HTML("a", {href: "https://greasyfork.org/scripts/475417-osu-web-enhancement/code/osu!web%20enhancement.user.js", download: "", style: "display:none;"});
                a.click();
            }
            else{
                ShowPopup("The lastest version is already installed!")
            }
        }
    });
};
const AddMenu = () => {
    const menuId = "osu-web-enhancement-toolbar";
    if(!window.menuEventListener){
        window.addEventListener("click", (ev) => {
            const fid = ev.target?.dataset?.functionId;
            if(fid) switch(fid){
                case "import-osu-db-button": document.getElementById("osu-db-input")?.click(); break;
                case "check-for-update-button": CheckForUpdate(); break;
            }
        });
        window.menuEventListener = true;
    }
    if(document.getElementById(menuId)) return;
    const anc = document.querySelector("div.nav2__col.nav2__col--menu.js-react--quick-search-button");
    const i = HTML("input", {type: "file", id: "osu-db-input", accept: ".db", eventListener: [{
        type: "change",
        listener: SelectOsuDb,
        options: false,
    }]});
    const menuClass = "simple-menu simple-menu--nav2 simple-menu--nav2-left-aligned simple-menu--nav2-transparent js-menu";
    const menuItemClass = "simple-menu__item u-section-community--before-bg-normal";
    const menuTgtId = "osu-web-enhancement";
    anc.insertAdjacentElement("beforebegin",
        HTML("div", {class: "nav2__col nav2__col--menu", id: menuId},
            HTML("div", {class: "nav2__menu-link-main js-menu", "data-menu-target": `nav2-menu-popup-${menuTgtId}`, "data-menu-show-delay":"0", style:"flex-direction: column; cursor: default;"}, 
                HTML("span", {style: "flex-grow: 1;"}),
                HTML("span", {style: "font-size: 10px;"}, HTML("osu!web")),
                HTML("span", {style: "font-size: 10px;"}, HTML("enhancement")),
                HTML("span", {style: "flex-grow: 1;"}),
            ),
            HTML("div", {class: "nav2__menu-popup"},
                HTML("div", {class: `${menuClass}`, "data-menu-id": `nav2-menu-popup-${menuTgtId}`, "data-visibility": "hidden"},
                    HTML("div", {class: `${menuItemClass}`, style: "cursor: pointer;", "data-function-id": "import-osu-db-button", }, HTML("Import osu!.db")),
                    HTML("div", {class: `${menuItemClass}`, style: "cursor: pointer;", "data-function-id": "check-for-update-button"}, HTML("Check for update")),
                    HTML("a", {class: `${menuItemClass}`, style: "cursor: pointer;", href: "https://greasyfork.org/en/scripts/475417-osu-web-enhancement", target: "_blank"}, HTML("Go to GreasyFork page"))
                ),
            )
        )
    );
    const mobMenuItmCls = "navbar-mobile-item__submenu-item js-click-menu--close";
    const mob = document.querySelector(`div.mobile-menu__item.js-click-menu[data-click-menu-id="mobile-nav"]`);
    mob.insertAdjacentElement("beforeend",
        HTML("div", {class: "navbar-mobile-item"},
            HTML("div", {class: "navbar-mobile-item__main js-click-menu", "data-click-menu-target": `nav-mobile-${menuTgtId}`, style: "cursor: pointer;"},
                HTML("span", {class: "navbar-mobile-item__icon navbar-mobile-item__icon--closed"},
                    HTML("i", {class: "fas fa-chevron-right"})
                ),
                HTML("span", {class: "navbar-mobile-item__icon navbar-mobile-item__icon--opened"},
                    HTML("i", {class: "fas fa-chevron-down"})
                ),
                HTML("osu!web enhancement"),
            ),
            HTML("ul", {class: "navbar-mobile-item__submenu js-click-menu", "data-click-menu-id": `nav-mobile-${menuTgtId}`, "data-visibility": "hidden"},
                HTML("li", {}, HTML("div", {class: mobMenuItmCls, style: "cursor: pointer;", "data-function-id": "import-osu-db-button",}, HTML("Import osu!.db"))),
                HTML("li", {}, HTML("div", {class: mobMenuItmCls, style: "cursor: pointer;", "data-function-id": "check-for-update-button"}, HTML("Check for update"))),
                HTML("a", {class: `${mobMenuItmCls}`, style: "cursor: pointer;", href: "https://greasyfork.org/en/scripts/475417-osu-web-enhancement", target: "_blank"}, HTML("Go to GreasyFork page"))
            )
        )
    );
    document.body.appendChild(i);
};
const FilterBeatmapSet = () => {
    document.querySelectorAll(".beatmapsets__item").forEach((item) => {
        const bmsID = Number(bmsReg.exec(item.innerHTML)?.[1]);
        if(bmsID && beatmapsets.has(bmsID)){
            item.classList.add("owned-beatmapset");
        }
    });
    document.querySelectorAll("div.bbcode a, a.osu-md__link").forEach(item => {
        if(item.classList.contains("owned-beatmap-link") || item.classList.contains("beatmap-download-link")) return;
        const e = bmsReg.exec(item.href);
        if(e && beatmapsets.has(Number(e[1]))){
            item.classList.add("owned-beatmap-link");
            if(item.nextElementSibling?.classList?.contains("beatmap-download-link")) item.nextElementSibling.remove();
            const box = item.getBoundingClientRect();
            const size = Math.round(box.height / 16 * 14);
            const vert = Math.round(size * 4 / 14) / 2;
            item.after(HTML("img", {src: svg_green_tick, title: "Owned", alt: "owned beatmap", style: `margin: 0px 5px; width: ${size}px; height: ${size}px; vertical-align: -${vert}px;`}));
        }else if(e && !item.nextElementSibling?.classList?.contains("beatmap-download-link")){
            item.after(
                HTML("a", {class: "beatmap-download-link", href: `https://osu.ppy.sh/beatmapsets/${e[1]}/download`, download: ""},
                    HTML("span", {class: "fas fa-file-download", title: "Download"})
                )
            );
        }
    });
    document.querySelectorAll("li.beatmap-pack-items__set").forEach(item => {
        if(item.classList.contains("owned-beatmap-pack-item")) return;
        const a = item.querySelector("a.beatmap-pack-items__link");
        const e = bmsReg.exec(a.href);
        if(e && beatmapsets.has(Number(e[1]))){
            item.classList.add("owned-beatmap-pack-item");
            const span = item.querySelector("span.fal");
            span.setAttribute("title", "Owned");
            span.dataset.origTitle = "owned";
            span.setAttribute("class", "");
            span.append(HTML("img", {src: svg_green_tick, alt: "owned beatmap", style: `width: 16px; height: 16px; vertical-align: -2px;`}));
            const parent = item.querySelector(".beatmap-pack-item-download-link");
            if(parent){
                console.assert(parent.parentElement === item, "unexpected error occurred!");
                item.insertBefore(span, parent);
                parent.remove();
            }
        }else if(e){
            const icon = item.querySelector(".beatmap-pack-items__icon");
            icon.setAttribute("title", "Download");
            icon.setAttribute("class", "fas fa-file-download beatmap-pack-items__icon");
            if(icon.parentElement === item){
                const dl = HTML("a", {class: "beatmap-pack-item-download-link", href: `https://osu.ppy.sh/beatmapsets/${e[1]}/download`, download: ""});
                item.insertBefore(dl, icon);
                dl.append(icon);
            }
        }
    })
};
const AdjustStyle = (modestr, sectionName) => {
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
    let ll = [];
    switch(modestr){
        case "mania": ll = [".mania-300", ".mania-200", ".mania-100", ".mania-50", ".mania-miss"]; break;
        case "fruits": ll = [".fruits-300", ".fruits-100", ".fruits-50-miss", ".fruits-miss"]; break;
        case "taiko": ll = [".taiko-300", ".taiko-150", ".taiko-miss"]; break;
        case "osu": ll = [".osu-300", ".osu-100", ".osu-50", ".osu-miss"]; break;
    }
    class FasterCalc{
        _map = new Map();
        Calculate = (ele) => {
            const t = ele.textContent;
            let w = 0, changed = false;
            for(const c of t){
                let wc = this._map.get(c);
                if(!wc){
                    if(!changed) changed = ele.cloneNode(true);
                    ele.textContent = c;
                    wc = ele.clientWidth;
                    this._map.set(c, wc);
                }
                w += wc;
            }
            if(changed){
                ele.insertAdjacentElement("afterend", changed);
                ele.remove();
            }
            return w;
        };
    };
    let past = performance.now(), curr;
    let fc = new FasterCalc();
    ll.forEach((str) =>
        s.insertRule(
            `${sectionSelector} ${str} + .score-detail-data-text {
                width: ${[...document.querySelectorAll(`${sectionSelector} ${str} + .score-detail-data-text`)].reduce((max, ele) => { const w = fc.Calculate(ele); return w > max ? w : max }, 0) + 2}px;
            }` ,0
        )
    );
    curr = performance.now();
    console.log(`AdjustStyle Stage 1: ${curr - past}ms`);
    past = performance.now();
    fc = new FasterCalc();
    [".play-detail__combo", ".play-detail__Accuracy", ".play-detail__Accuracy2"].forEach((str) =>
        s.insertRule(
            `${sectionSelector} ${str}{
                min-width: ${Math.ceil([...document.querySelectorAll(`${sectionSelector} ${str}`)].reduce((max, ele) => {const w = fc.Calculate(ele); return w > max ? w : max;}, 0)) + 1}px;
            }`
            ,0
        )
    );
    curr = performance.now();
    console.log(`AdjustStyle Stage 2: ${curr - past}ms`);
    past = performance.now();
    [".play-detail__pp"].forEach((str) =>
        s.insertRule(
            `${sectionSelector} ${str}{
                min-width: ${Math.ceil([...document.querySelectorAll(`${sectionSelector} ${str}`)].reduce((max, ele) => {const w = ele.clientWidth; return w > max ? w : max;}, 0)) + 1}px;
            }`
            ,0
        )
    );
    curr = performance.now();
    console.log(`AdjustStyle Stage 3: ${curr - past}ms`);
    past = performance.now();
};
const TopRanksWorker = (userId, modestr, addedNodes = [document.body]) => {
    const isLazer = window.location.hostname.split(".")[0] === "lazer"; // assume that hostname can only be osu.ppy.sh or lazer.ppy.sh
    const subdomain = isLazer ? "lazer": "osu";
    let sectionNames = new Set();
    const GetSection = (ele) => {
        let count = 0;
        while(ele){
            if(ele.tagName === "DIV" && ele.className === "js-sortable--page") return ele.dataset.pageId;
            ele = ele.parentElement;
            count++;
            if(count > 50) console.log(ele);
        }
    };
    addedNodes.forEach((eles) => {
        if(eles instanceof Element) eles.querySelectorAll(":scope div.play-detail.play-detail--highlightable").forEach((ele) => {
            if(ele.getAttribute("improved") !== null) return;
            const a = ele.querySelector(":scope time.js-timeago");
            const t = a.getAttribute("datetime");
            const data = messageCache.get(`${userId},${modestr},${subdomain},${t}`);
            if(data){
                sectionNames.add(GetSection(ele));
                ListItemWorker(ele, data, isLazer);
            }
        });
    });
    sectionNames.forEach(sectionName => AdjustStyle(modestr, sectionName));
};
const DiffToColour = (diff, stops = [0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9], vals = ['#4290FB', '#4FC0FF', '#4FFFD5', '#7CFF4F', '#F6F05C', '#FF8068', '#FF4E6F', '#C645B8', '#6563DE', '#18158E', '#000000']) => {
    const len = stops.length;
    diff = Math.min(Math.max(diff, stops[0]), stops[len - 1]);
    let r = stops.findIndex(stop => stop > diff);
    if(r === -1) r = len - 1;
    const d = stops[r] - stops[r - 1];
    return `#${[[1, 3], [3, 5], [5, 7]]
        .map(_ => [Number.parseInt(vals[r].slice(..._), 16), Number.parseInt(vals[r-1].slice(..._), 16)])
        .map(_ => Math.round((_[0] ** 2.2 * (diff - stops[r-1]) / d + _[1] ** 2.2 * (stops[r] - diff) / d) ** (1 / 2.2)).toString(16).padStart(2, "0")) 
        .join("")
    }`;
};
const ListItemWorker = (ele, data, isLazer) => {
    if(ele.getAttribute("improved") !== null) return;
    ele.setAttribute("improved", "");
    if(data.pp){
        data.pp = Number(data.pp);
        const pptext = ele.querySelector(".play-detail__pp > span").childNodes[0];
        pptext.nodeValue = data.pp >= 1 ? data.pp.toPrecision(5) : (data.pp < 0.00005 ? 0 : data.pp.toFixed(4));
        if(data.weight) pptext.title = `${data.weight.pp >= 1 ? data.weight.pp.toPrecision(5) : (data.weight.pp < 0.00005 ? 0 : data.weight.pp.toFixed(4))} of total pp`;
    }
    const left = ele.querySelector("div.play-detail__group.play-detail__group--top");
    const leftc = HTML("div", {class: "play-detail__group--background", style: `background-image: url(https://assets.ppy.sh/beatmaps/${data.beatmap.beatmapset_id}/covers/card@2x.jpg);`});
    left.insertAdjacentElement("beforebegin", leftc);
    const detail= ele.querySelector("div.play-detail__score-detail-top-right");
    const du = detail.children[0];
    if(!detail.children[1]) detail.append(HTML("div", {classList: "play-detail__pp-weight"}));
    const db = detail.children[1];
    data.statistics.perfect ??= 0, data.statistics.great ??= 0, data.statistics.good ??= 0, data.statistics.ok ??= 0, data.statistics.meh ??= 0, data.statistics.miss ??= 0;
    const bmName = ele.querySelector("span.play-detail__beatmap");
    const sr = HTML("div", {class: `difficulty-badge ${data.beatmap.difficulty_rating >= 6.7 ? "difficulty-badge--expert-plus" : ""}`, style: `--bg: ${DiffToColour(data.beatmap.difficulty_rating)}`},
        HTML("span", {class: "difficulty-badge__icon"}, HTML("span", {class: "fas fa-star"})),
        HTML("span", {class: "difficulty-badge__rating"}, HTML(`${data.beatmap.difficulty_rating.toFixed(2)}`))
    );
    /*
    const ic = ele;
    ic.classList.add("audio-player", "js-audio--player");
    ic.setAttribute("data-audio-url", `https://b.ppy.sh/preview/${data.beatmap.beatmapset_id}.mp3`)
    ic.setAttribute("data-audio-state", "paused");
    const gr = ele;
    gr.classList.add("audio-player__button", "audio-player__button--play", "js-audio--play");
    */
    bmName.parentElement.insertBefore(sr, bmName);
    const bma = ele.querySelector("a.play-detail__title");
    bma.onclick = (e) => {e.stopPropagation();};
    switch(data.ruleset_id){
        case 0:{
            du.replaceChildren(
                HTML("span", {class: "play-detail__before"}),
                HTML("span", {class: "play-detail__Accuracy", title: `${isLazer ? "V2" : "V1"} Accuracy`}, HTML(`${(data.accuracy * 100).toFixed(2)}%`)),
                HTML("span", {class: "play-detail__combo", title: `Combo${isLazer ? "/Max Combo" : ""}`}, 
                    HTML("span", {class: `combo ${isLazer ?(data.max_combo === (data.maximum_statistics.great ?? 0) + (data.maximum_statistics.legacy_combo_increase ?? 0) ? "legacy-perfect-combo" : ""):(data.legacy_perfect ? "legacy-perfect-combo" : "")}`}, HTML(`${data.max_combo}`)),
                    isLazer ? HTML("/") : null,
                    isLazer ? HTML("span", {class: "max-combo"}, HTML(`${(data.maximum_statistics.great ?? 0) + (data.maximum_statistics.legacy_combo_increase ?? 0)}`)) : null,
                    HTML("x"),
                ),
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
            const cur = [data.statistics.great ?? 0, data.statistics.ok ?? 0, data.statistics.miss ?? 0];
            const mx = cur[0] + cur[1] + cur[2];
            du.replaceChildren(
                HTML("span", {class: "play-detail__before"}),
                HTML("span", {class: "play-detail__Accuracy"}, HTML(`Acc: ${(data.accuracy * 100).toFixed(2)}%`)),
                HTML("span", {class: "play-detail__combo", title: `Combo/Max Combo`},
                    HTML("span", {class: `combo ${(data.max_combo === mx ? "legacy-perfect-combo" : "")}`}, HTML(`${data.max_combo}`)),
                    HTML("/"),
                    HTML("span", {class: "max-combo"}, HTML(`${mx}`)),
                    HTML("x"),
                ),
            );
            db.replaceChildren(
                HTML("span", {class: "score-detail score-detail-taiko-300"},
                        HTML("span", {class: "taiko-300"}, HTML("300")),
                        HTML("span", {class: "score-detail-data-text"}, HTML(data.statistics.great ?? 0))
                ),
                HTML("span", {class: "score-detail score-detail-taiko-150"},
                        HTML("span", {class: "taiko-150"}, HTML("150")),
                        HTML("span", {class: "score-detail-data-text"}, HTML(data.statistics.ok ?? 0))
                ),
                HTML("span", {class: "score-detail score-detail-fruits-combo"},
                    HTML("span", {class: "taiko-miss"}, HTML("miss")),
                    HTML("span", {class: "score-detail-data-text"}, HTML(data.statistics.miss ?? 0))
                ),
            );
            break;
        }
        case 2:{
            if (isLazer) {
                const cur = [data.statistics.great ?? 0, data.statistics.large_tick_hit ?? 0, data.statistics.small_tick_hit ?? 0];
                const mx = [data.maximum_statistics.great ?? 0, data.maximum_statistics.large_tick_hit ?? 0, data.maximum_statistics.small_tick_hit ?? 0];
                du.replaceChildren(
                    HTML("span", {class: "play-detail__before"}),
                    HTML("span", {class: "play-detail__Accuracy"}, HTML(`Acc: ${(data.accuracy * 100).toFixed(2)}%`)),
                    HTML("span", {class: "play-detail__combo", title: `Combo/Max Combo`}, 
                        HTML("span", {class: `combo ${(data.max_combo === mx[0] + mx[1] ? "legacy-perfect-combo" : "")}`}, HTML(`${data.max_combo}`)),
                        isLazer ? HTML("/") : null,
                        isLazer ? HTML("span", {class: "max-combo"}, HTML(`${mx[0] + mx[1]}`)) : null,
                        HTML("x"),
                    ),
                );
                db.replaceChildren(
                    HTML("span", {class: "score-detail score-detail-fruits-300"},
                        HTML("span", {class: "fruits-300"}, HTML("fruits")),
                        HTML("span", {class: "score-detail-data-text"}, HTML(cur[0] + "/" + mx[0]))
                    ),
                    HTML("span", {class: "score-detail score-detail-fruits-100"},
                        HTML("span", {class: "fruits-100"}, HTML("ticks")),
                        HTML("span", {class: "score-detail-data-text"}, HTML(cur[1] + "/" + mx[1]))
                    ),
                    HTML("span", {class: "score-detail score-detail-fruits-50-miss"},
                        HTML("span", {class: "fruits-50-miss"}, HTML("drops")),
                        HTML("span", {class: "score-detail-data-text"}, HTML(cur[2] + "/" + mx[2]))
                    )
                );
            } else {
                du.replaceChildren(
                    HTML("span", {class: "play-detail__before"}),
                    HTML("span", {class: "play-detail__Accuracy"}, HTML(`Acc: ${(data.accuracy * 100).toFixed(2)}%`)),
                );
                db.replaceChildren(
                    HTML("span", {class: "score-detail score-detail-fruits-300"},
                        HTML("span", {class: "fruits-300"}, HTML("FRUIT")),
                        HTML("span", {class: "score-detail-data-text"}, HTML(data.statistics.great ?? 0))
                    ),
                    HTML("span", {class: "score-detail score-detail-fruits-100"},
                        HTML("span", {class: "fruits-100"}, HTML("tick")),
                        HTML("span", {class: "score-detail-data-text"}, HTML(data.statistics.large_tick_hit ?? 0))
                    ),
                    HTML("span", {class: "score-detail score-detail-fruits-50-miss"},
                        HTML("span", {class: "fruits-50-miss"}, HTML("miss")),
                        HTML("span", {class: "score-detail-data-text"}, HTML(data.statistics.small_tick_miss ?? 0))
                    ),
                    HTML("span", {class: "score-detail score-detail-fruits-miss"},
                        HTML("span", {class: "fruits-miss"}, HTML("MISS")),
                        HTML("span", {class: "score-detail-data-text"}, HTML(data.statistics.miss ?? 0))
                    )
                );
            }
            break;
        }
        case 3:{
            const v2acc = (320*data.statistics.perfect+300*data.statistics.great+200*data.statistics.good+100*data.statistics.ok+50*data.statistics.meh)/(320*(data.statistics.perfect+data.statistics.great+data.statistics.good+data.statistics.ok+data.statistics.meh+data.statistics.miss));
            const MCombo = (data.maximum_statistics.perfect ?? 0) + (data.maximum_statistics.legacy_combo_increase ?? 0);
            const isMCombo = isLazer ? data.max_combo >= MCombo : data.legacy_perfect;
            du.replaceChildren(
                HTML("span", {class: "play-detail__before"}),
                HTML("span", {class: "play-detail__Accuracy2", title: `pp Accuracy`}, HTML(`${(v2acc * 100).toFixed(2)}%`)),
                HTML("span", {class: "play-detail__Accuracy", title: `Score${isLazer ? "V2" : "V1"} Accuracy`}, HTML(`${(data.accuracy * 100).toFixed(2)}%`)),
                HTML("span", {class: "play-detail__combo", title: `Combo${isLazer ? "/Max Combo" : ""}`}, 
                    HTML("span", {class: `combo ${isMCombo ? "legacy-perfect-combo" : ""}`}, HTML(`${data.max_combo}`)),
                    isLazer ? HTML("/") : null,
                    isLazer ? HTML("span", {class: "max-combo"}, HTML(MCombo)) : null,
                    HTML("x"),
                ),
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
                    HTML("span", {class: "score-detail-data-text"}, HTML(`${M_300 >= 1000 ? Math.round(M_300) : (M_300 < 1 ? M_300.toFixed(2): M_300.toPrecision(3))}`))
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
const messageCache = new Map();
window.messageCache = messageCache;
const profUrlReg = /https:\/\/(?:osu|lazer)\.ppy\.sh\/users\/[0-9]+(?:|\/osu|\/taiko|\/fruits|\/mania)/;
const ImproveProfile = (mulist) => {
    let initData, wloc = window.location.toString();
    if(!profUrlReg.exec(wloc)) return;
    const initDataEle = document.querySelector(".js-react--profile-page.osu-layout.osu-layout--full");
    if(!initDataEle) return;
    initData = JSON.parse(initDataEle.dataset.initialData);
    const userId = initData.user.id, modestr = initData.current_mode;
    if(initData !== lastInitData){
        let ppDiv;
        document.querySelectorAll("div.value-display.value-display--plain").forEach((ele) => {
            if(ele.querySelector("div.value-display__label").textContent === "pp") ppDiv = ele;
        });
        if(ppDiv){
            const ttscore = initData.user.statistics.total_score;
            const lvl = initData.user.statistics.level.current;
            const upgradescore = Math.round(OsuLevelToExp(lvl + 1) - OsuLevelToExp(lvl));
            const lvlscore = ttscore - Math.round(OsuLevelToExp(lvl));
            lastInitData = initData;
            document.querySelector("div.bar__text").textContent = `${OsuExpValToStr(lvlscore)}/${OsuExpValToStr(upgradescore)} (${(lvlscore/upgradescore * 100).toPrecision(3)}%)`;
            const _pp = initData.user.statistics.pp;
            ppDiv.querySelector(".value-display__value > div").textContent = _pp >= 1 ? _pp.toPrecision(6) : (_pp < 0.000005 ? 0 : _pp.toFixed(5));
        }
    }
    if(mulist !== undefined) mulist.forEach((record) => {
        if(record.type === "childList" && record.addedNodes) TopRanksWorker(userId, modestr, record.addedNodes);
    });
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
        if(item.getAttribute("improved") !== null) continue;
        item.setAttribute("improved", "");
        const a = item.querySelector("a");
        const bms = bmsReg.exec(a.href);
        if(!bms?.[1]) continue;
        const d = item.querySelector("div.beatmap-playcount__detail");
        const b = HTML("div", {class: "beatmap-playcount__background", style: `background-image: url(https://assets.ppy.sh/beatmaps/${bms[1]}/covers/card@2x.jpg)`});
        if(d.childElementCount > 0) d.insertBefore(b, d.children[0]);
        else d.append(b);
    }
}
const CloseScoreCardPopup = () => {
    document.querySelector("div.score-card-popup-window").remove();
}
const ShowScoreCardPopup = () => {
    const p = document.querySelector("div.js-portal");
    if(!p) return;
    document.body.append(
        HTML("div", {class: "score-card-popup-window"},
            HTML("div", {class: "score-card-popup-menu"},
                HTML("button", {class: "score-card-close-button", eventListener: {type: "click", listener: CloseScoreCardPopup}}),
                HTML("button", {class: "score-card-copy-to-clipboard-button", ev}),
            ),
            HTML("div", {class: "score-card"},
            )
        )
    );
};
const AddPopupButton = () => {
    const p = document.querySelector("div.js-portal")?.querySelector("div.simple-menu");
    if(!p || p.querySelector("button.score-card-popup-button")) return;
    p.append(HTML("button", {class: "score-card-popup-button simple-menu__item", type: "button", eventListener: [{type: "click", listener: ShowScoreCardPopup}]}, HTML("Popup")));
};
const OnMutation = (mulist) => {
    mut.disconnect();
    AddMenu();
    FilterBeatmapSet();
    ImproveBeatmapPlaycountItems();
    ImproveProfile(mulist);
    //AddPopupButton();
    mut.observe(document, {childList: true, subtree: true});
};
const MessageFilter = (message) => {
    info = `${message.userId},${message.mode},${message.subdomain}`;
    switch(message.type){
        case "beatmapset_download_complete": OnBeatmapsetDownload(message); break;
        case "top_ranks":
            [message.data.pinned.items, message.data.best.items, message.data.firsts.items].forEach(items => items.forEach(item => {
                messageCache.set(`${info},${item.ended_at}`, item);
            }));
            TopRanksWorker(message.userId, message.mode);
            break;
        case "firsts": case "pinned": case "best": case "recent":
            message.data.forEach(item => { messageCache.set(`${info},${item.ended_at}`, item); });
            TopRanksWorker(message.userId, message.mode);
            break;
        case "historical":
            message.data.recent.items.forEach(item => { messageCache.set(`${info},${item.ended_at}`, item); });
            TopRanksWorker(message.userId, message.mode);
            break;
    }
}
const WindowMessageFilter = (event) => {
    if(event.source === window && event?.data?.id === "osu!web enhancement"){
        MessageFilter(event.data);
    }
}
const OnClick = (event) => {
    let t = event.target;
    while(t){
        if(t.tagName === "A"){
            const e = bmsdlReg.exec(t.href);
            if(!e) continue;
            beatmapsets.add(Number(e[1]));
            FilterBeatmapSet();
            break;
        }
        t = t.parentElement;
    }
}
//document.addEventListener("click", OnClick);
window.addEventListener("message", WindowMessageFilter);
const mut = new MutationObserver(OnMutation);
mut.observe(document, {childList: true, subtree: true});
InsertStyleSheet();
//{id, mode} -> (bmid -> record)
console.log("osu!web enhancement loaded");