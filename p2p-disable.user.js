// ==UserScript==
// @name         Force P2P Upload Disabled
// ---- tvwiki
// @match        https://tvwiki31.net/*
// @match        https://tvwiki32.net/*
// @match        https://tvwiki33.net/*
// @match        https://tvwiki34.net/*
// @match        https://tvwiki35.net/*
// @match        https://player.bunny-frame.online/*
// @match        https://*.bunny-frame.online/*
// ---- newtoki (toki)
// @match        https://sbxh8.com/*
// @match        https://sbxh9.com/*
// @match        https://sbxh10.com/*
// @match        https://toki25.com/*
// @match        https://toki26.com/*
// @match        https://toki27.com/*
// @match        https://toki28.com/*
// @match        https://aniplayer1.site/*
// @match        https://*.anilife.app/*
// ---- anilife
// @match        https://anilife.app/*
// @match        https://*.gcdn.app/*
// @match        https://gcdn.app/*
// ---- other...
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

(() => {
    const win = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
    // isP2PUploadDisabled : 업로드만 비활성화
    // isP2PDisabled : P2P 자체 비활성화
    // true : 업로드만 비활성화 / false : P2P 전체 비활성화
    // anilife 는 Enable/Disable 만 있으므로, 이 변수와 상관 없음
    const uploadOnly = false;
    const isVar = (uploadOnly ? "isP2PUploadDisabled" : "isP2PDisabled");

    function install_defaultSiteHook() {
        Object.defineProperty(Object.prototype, isVar, {
            configurable: true,
            get() {
                return true;
            },
            set(_) {
                // ignore
            }
        });
        console.log(`[P2P] Object.prototype ${isVar} forced true`);
    }

    function install_anilifeHook() {
        // URLSearchParams.get("_p2p")
        const origGet = win.URLSearchParams.prototype.get;
        win.URLSearchParams.prototype.get = function(name) {
            if (name === "_p2p") {
                console.log("[P2P] URLSearchParams.get(_p2p) => 0");
                return "0";
            }
            return origGet.call(this, name);
        };

        // prototype
        Object.defineProperty(Object.prototype, "p2pEnabled", {
            configurable: true,
            get() {
                return false;
            },
            set(v) {
                console.log("[P2P] p2pEnabled set blocked:", v, "=> false");
            }
        });

        console.log("[P2P] hooks installed", location.href);
    }

    if (location.hostname.includes('anilife.app')) {
        install_anilifeHook();
    } else {
        install_defaultSiteHook();
    }

})();
