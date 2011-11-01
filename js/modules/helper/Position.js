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

        x = Math.floor(positionX / 25);
        y = Math.floor(positionY / 25);

        if (y > 23) {
            y = 23;
        }

        if (x > 31) {
            x = 31;
        }

        return {
            x: x,
            y: y
        };
    }
};
