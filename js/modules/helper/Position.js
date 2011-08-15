var Position = new function () {
    this.byCoordinates = function (x, y) {
        var pageX = window.pageXOffset;
        var pageY = window.pageYOffset;

        var mapOffset = $('#battlefield').offset();

        var positionX = x - mapOffset.left + pageX;
        var positionY = y - mapOffset.top + pageY;

        x = Math.floor(positionX / 50);
        y = Math.floor(positionY / 50);

        return {
            x: x,
            y: y
        };
    };
}();