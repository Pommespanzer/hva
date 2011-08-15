var ObstacleModel = Backbone.Model.extend({
    setId: function (id) {
        this.set({id: id});
    },
    
    setPosition: function (x, y) {
        this.set({x: x, y: y});
    },
    
    getPosition: function () {
        return {
            x: this.get('x'),
            y: this.get('y')
        }
    }
});