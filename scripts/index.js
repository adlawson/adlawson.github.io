'use strict';

var life = require('conway');
var please = require('pleasejs');

module.exports = (function (htmlElement, clickElement, opts, initialState) {

    var ctx = htmlElement.getContext('2d');
    var isPlaying = false;
    var settings = {
        height: document.documentElement.clientHeight,
        width: document.documentElement.clientWidth,
        clickClass: opts.clickClass || "playing",
        size: opts.size || 5,
        timeout: opts.timeout, // or requestAnimationFrame
        colors: please.make_color({
            base_color: opts.color || '000',
            colors_returned: 6
        })
    };

    htmlElement.height = settings.height;
    htmlElement.width = settings.width;

    clickElement.addEventListener('click', clickToggle);

    function clickToggle(event) {
        event.preventDefault();
        if (!isPlaying) {
            isPlaying = true;
            event.target.classList.add(settings.clickClass);
            life(renderToCanvas, loopFn, initialState);
        }
    }

    function pickColor() {
        return settings.colors[Math.floor(Math.random() * settings.colors.length)]
    }

    function renderToCanvas(x, y, active) {
        var screenX = (x * settings.size) + Math.floor(settings.width / 2);
        var screenY = (y * settings.size) + Math.floor(settings.height / 2);
        if (active) {
            ctx.beginPath();
            ctx.fillStyle = pickColor();
            ctx.fillRect(screenX, screenY, settings.size, settings.size);
            ctx.closePath();
        } else {
            ctx.clearRect(screenX, screenY, settings.size, settings.size);
        }
    }

    function loopFn(hasChanged, next) {
        if (hasChanged) {
            if (settings.timeout) {
                // Only use to reduce speed
                setTimeout(next, settings.timeout);
            } else {
                global.requestAnimationFrame(next);
            }
        }
    }

});
