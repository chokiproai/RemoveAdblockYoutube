// ==UserScript==
// @name         Remove Adblock Thing
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes Adblock Thing
// @author       chokiproai
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://github.com/chokiproai/RemoveAdblockYoutube/raw/main/Youtube-Ad-blocker-Reminder-Remover.user.js
// @downloadURL  https://github.com/chokiproai/RemoveAdblockYoutube/raw/main/Youtube-Ad-blocker-Reminder-Remover.user.js
// @grant        none
// ==/UserScript==
function popupRemover() {
    setInterval(() => {
        const elementToRemove = document.querySelector('tp-yt-paper-dialog');
        if (elementToRemove) {
            elementToRemove.remove();
            setTimeout(() => {
                const playButton = document.querySelector('.ytp-play-button');
                if (playButton) {
                    playButton.click(); // Kích hoạt sự kiện click trên nút play
                } else {
                    console.log('Không tìm thấy nút phát.');
                }
            }, 1000); // Chờ 1 giây sau khi loại bỏ phần tử
        } else {
            console.log('Không tìm thấy phần tử cần xóa.');
        }
    }, 100); // Lặp lại sau mỗi 0.1 giây
}

// Gọi hàm popupRemover() để bắt đầu việc lặp lại
popupRemover();