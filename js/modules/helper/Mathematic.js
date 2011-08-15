var Mathematic = new function () {
    this.getAngle = function (startPosition, goalPosition) {
        var angle = Math.acos((goalPosition.y - startPosition.y) / Math.sqrt((goalPosition.x - startPosition.x) * (goalPosition.x - startPosition.x) + (goalPosition.y - startPosition.y) * (goalPosition.y - startPosition.y)));

        if (goalPosition.x >= startPosition.x) {
            angle = -angle * 360 / (2 * Math.PI) - 90;
        } else {
            angle = angle * 360 / (2 * Math.PI) - 90;
        }

        return angle;
    };
}();