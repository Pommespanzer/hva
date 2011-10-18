var Mathematic = {
    /**
     * This method calculates the angle between to positions.
     * This is necessary if one unit attacks an other.
     *
     * @param object startPosition
     * @param object goalPosition
     *
     * @return float angle
     */
    getAngle: function (startPosition, goalPosition) {
        var angle = Math.acos((goalPosition.y - startPosition.y) / Math.sqrt((goalPosition.x - startPosition.x) * (goalPosition.x - startPosition.x) + (goalPosition.y - startPosition.y) * (goalPosition.y - startPosition.y)));

        if (goalPosition.x >= startPosition.x) {
            angle = -angle * 360 / (2 * Math.PI) - 90;
        } else {
            angle = angle * 360 / (2 * Math.PI) - 90;
        }

        return angle;
    },

    /**
     * This method calculates the distance between two coordinates
     *
     * @param object startPosition
     * @param object goalPosition
     *
     * @return integer distance
     */
    getDistance: function (startPosition, goalPosition) {
        return Math.sqrt((goalPosition.x - startPosition.x) * (goalPosition.x - startPosition.x) + (goalPosition.y - startPosition.y) * (goalPosition.y - startPosition.y));
    }
};
