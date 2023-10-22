// ==UserScript==
// @name         Remove Adblock Thing
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes Adblock Thing
// @author       chokiproai
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://github.com/chokiproai/RemoveAdblockYoutube/raw/main/Youtube-Ad-blocker-Remover.user.js
// @downloadURL  https://github.com/chokiproai/RemoveAdblockYoutube/raw/main/Youtube-Ad-blocker-Remover.user.js
// @grant        none
// ==/UserScript==
(function() {
    const config = {
        adblocker: true,
        removePopup: true,
        debug: true,
    };

    const domainsToRemove = ['*.youtube-nocookie.com/*'];
    const jsonPathsToRemove = [
        'playerResponse.adPlacements',
        'playerResponse.playerAds',
        'adPlacements',
        'playerAds',
        'playerConfig',
        'auxiliaryUi.messageRenderers.enforcementMessageViewModel'
    ];

    const observerConfig = {
        childList: true,
        subtree: true
    };

    const keyEvent = new KeyboardEvent("keydown", {
        key: "k",
        code: "KeyK",
        keyCode: 75,
        which: 75,
        bubbles: true,
        cancelable: true,
        view: window
    });

    const mouseEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
    });

    if (config.debug) console.log("Remove Adblock Thing: Script started");
    window.__ytplayer_adblockDetected = false;

    if (config.adblocker) removeAdblockerStuff();
    if (config.removePopup) removePopups();

    const observer = new MutationObserver(() => {
        removeJsonPaths(domainsToRemove, jsonPathsToRemove);
    });

    observer.observe(document.body, observerConfig);

    function removePopups() {
        setInterval(() => {
            const fullScreenButton = document.querySelector(".ytp-fullscreen-button");
            const modalOverlay = document.querySelector("tp-yt-iron-overlay-backdrop");
            const popup = document.querySelector(".style-scope ytd-enforcement-message-view-model");
            const elementToRemove = document.querySelector('tp-yt-paper-dialog');
            const popupButton = document.getElementById("dismiss-button");

            const video1 = document.querySelector("#movie_player > video.html5-main-video");
            const video2 = document.querySelector("#movie_player > .html5-video-container > video");

            const bodyStyle = document.body.style;
            bodyStyle.setProperty('overflow-y', 'scroll', 'important');

            if (modalOverlay) {
                modalOverlay.removeAttribute("opened");
                modalOverlay.remove();
            }

            if (popup) {
                if (config.debug) console.log("Remove Adblock Thing: Popup detected, removing...");
                if (popupButton) popupButton.click();
                popup.remove();
                unpausedAfterSkip = 2;

                fullScreenButton.dispatchEvent(mouseEvent);

                setTimeout(() => {
                    fullScreenButton.dispatchEvent(mouseEvent);
                }, 500);

                if (config.debug) console.log("Remove Adblock Thing: Popup removed");
            }

            if (!unpausedAfterSkip > 0) return;

            if (video1) {
                if (video1.paused) unPauseVideo();
                else if (unpausedAfterSkip > 0) unpausedAfterSkip--;
            }
            if (video2) {
                if (video2.paused) unPauseVideo();
                else if (unpausedAfterSkip > 0) unpausedAfterSkip--;
            }

        }, 1000);
    }

    function removeAdblockerStuff() {
        setInterval(() => {
            const skipBtn = document.querySelector('.videoAdUiSkipButton,.ytp-ad-skip-button');
            const ad = document.querySelector('.ad-showing');
            const sidAd = document.querySelector('ytd-action-companion-ad-renderer');
            const displayAd = document.querySelector('div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint');
            const sparklesContainer = document.querySelector('div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer');
            const mainContainer = document.querySelector('div#main-container.style-scope.ytd-promoted-video-renderer');
            const feedAd = document.querySelector('ytd-in-feed-ad-layout-renderer');
            const mastheadAd = document.querySelector('.ytd-video-masthead-ad-v3-renderer');

            if (ad) {
                const video = document.querySelector('video');
                video.playbackRate = 10;
                video.volume = 0;
                video.currentTime = video.duration;
                skipBtn?.click();
            }

            [sidAd, displayAd, sparklesContainer, mainContainer, feedAd, mastheadAd].forEach(el => {
                if (el) el.remove();
            });
        }, 50);
    }

    function unPauseVideo() {
        document.dispatchEvent(keyEvent);
        unpausedAfterSkip = 0;
        if (config.debug) console.log("Remove Adblock Thing: Unpaused video using 'k' key");
    }

    function removeJsonPaths(domains, jsonPaths) {
        const currentDomain = window.location.hostname;
        if (!domains.includes(currentDomain)) return;

        jsonPaths.forEach(jsonPath => {
            let obj = window;
            for (const part of jsonPath.split('.')) {
                if (!obj.hasOwnProperty(part)) break;
                obj = obj[part];
            }
            obj = undefined;
        });
    }
})();
