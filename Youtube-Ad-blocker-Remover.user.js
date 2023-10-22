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
    //
    //      Config
    //

    // Enable The Undetected Adblocker
    const adblocker = true;

    // Enable The Popup remover
    const removePopup = true;

    // Enable debug messages into the console
    const debug = true;

    //
    //      CODE
    //

    // Specify domains and JSON paths to remove
    const domainsToRemove = [
        '*.youtube-nocookie.com/*'
    ];
    const jsonPathsToRemove = [
        'playerResponse.adPlacements',
        'playerResponse.playerAds',
        'adPlacements',
        'playerAds',
        'playerConfig',
        'auxiliaryUi.messageRenderers.enforcementMessageViewModel'
    ];

    // Observe config
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

    //This is used to check if the video has been unpaused already
    let unpausedAfterSkip = 0;

    if (debug) console.log("Remove Adblock Thing: Remove Adblock Thing: Script started");
    // Old variable but could work in some cases
    window.__ytplayer_adblockDetected = false;

    if (adblocker) addblocker();
    if (removePopup) newPopupRemover();

    // New popupRemover function
    function newPopupRemover() {
        setInterval(() => {
            const elementToRemove = document.querySelector('tp-yt-paper-dialog');
            if (elementToRemove) {
                elementToRemove.remove();
                setTimeout(() => {
                    const playButton = document.querySelector('.ytp-play-button');
                    if (playButton) {
                        playButton.click();
                    } else {
                        console.log('Không tìm thấy nút phát.');
                    }
                }, 1000);
            } else {
                console.log('Không tìm thấy phần tử cần xóa.');
            }
        }, 100);
    }

    // undetected adblocker method
    function addblocker() {
        setInterval(() => {
            const skipBtn = document.querySelector('.videoAdUiSkipButton,.ytp-ad-skip-button');
            const ad = [...document.querySelectorAll('.ad-showing')][0];
            const sidAd = document.querySelector('ytd-action-companion-ad-renderer');
            const displayAd = document.querySelector('div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint');
            const sparklesContainer = document.querySelector('div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer');
            const mainContainer = document.querySelector('div#main-container.style-scope.ytd-promoted-video-renderer');
            const feedAd = document.querySelector('ytd-in-feed-ad-layout-renderer');
            if (ad) {
                document.querySelector('video').playbackRate = 10;
                document.querySelector('video').volume = 0;
                if (skipBtn) {
                    skipBtn.click();
                }
            }
            if (sidAd) {
                sidAd.remove();
            }
            if (displayAd) {
                displayAd.remove();
            }
            if (sparklesContainer) {
                sparklesContainer.remove();
            }
            if (mainContainer) {
                mainContainer.remove();
            }
            if (feedAd) {
                feedAd.remove();
            }
        }, 50);
    }

    // Unpause the video Works most of the time
    function unPauseVideo() {
        // Simulate pressing the "k" key to unpause the video
        document.dispatchEvent(keyEvent);
        unpausedAfterSkip = 0;
        if (debug) console.log("Remove Adblock Thing: Unpaused video using 'k' key");
    }

    function removeJsonPaths(domains, jsonPaths) {
        const currentDomain = window.location.hostname;
        if (!domains.includes(currentDomain)) return;

        jsonPaths.forEach(jsonPath => {
            const pathParts = jsonPath.split('.');
            let obj = window;
            for (const part of pathParts) {
                if (obj.hasOwnProperty(part)) {
                    obj = obj[part];
                } else {
                    break;
                }
            }
            obj = undefined;
        });
    }

    // Observe and remove ads when new content is loaded dynamically
    const observer = new MutationObserver(() => {
        removeJsonPaths(domainsToRemove, jsonPathsToRemove);
    });

    if (removePopup) observer.observe(document.body, observerConfig);

})();
