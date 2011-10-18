var Position = {
    /**
     * This method returns the battlefield coordinates of a given pixel coordinates
     *
     * @param integer x
     * @param integer y
     *
     * @return object position {x: ?, y: ?}
     */
    byCoordinates: function (x, y) {
        var pageX = window.pageXOffset,
            pageY = window.pageYOffset,
            mapOffset = $('#battlefield').offset(),
            positionX = x - mapOffset.left + pageX,
            positionY = y - mapOffset.top + pageY;

        x = Math.floor(positionX / 50);
        y = Math.floor(positionY / 50);

        return {
            x: x,
            y: y
        };
    }
};
