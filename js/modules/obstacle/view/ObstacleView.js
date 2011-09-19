var ObstacleView = Backbone.View.extend({
    /**
     * Wrapper of obstacle
     */
    tagName: 'div',
    
    /**
     * INIT
     * 
     * @return void
     */
    initialize: function () {
        _.bindAll(this, 'render');
    },
    
    /**
     * This method renders the obstacle.
     * 
     * @return void
     */
    render: function () {
        this.el.className = 'obstacle';
        this.el.style.left = (this.model.get('x') * 50) + 'px';
        this.el.style.top = (this.model.get('y') * 50) + 'px';
        
        $(this.el).html('&nbsp;');
        return this;
    }
});