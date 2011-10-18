var ObstacleModel = Backbone.Model.extend({
    /**
     * This method sets the id of an obstacle.
     *
     * @param id
     *
     * @return void
     */
    setId: function (id) {
        this.set({id: id});
    },

    /**
     * This method sets the position of an obstacle.
     *
     * @param integer x - x position of obstacle
     * @param integer y - y position of obstacle
     *
     * @return void
     */
    setPosition: function (x, y) {
        this.set({x: x, y: y});
    },

    /**
     * This method returns the position of an obstacle.
     *
     * @return object position - {x: ?, y: ?}
     */
    getPosition: function () {
        return {
            x: this.get('x'),
            y: this.get('y')
        };
    }
});
