var Position = new function () {
    /**
     * This method returns the battlefield coordinates of a given pixel coordinates
     * 
     * @param integer x
     * @param integer y
     * 
     * @return object position {x: ?, y: ?}
     */
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