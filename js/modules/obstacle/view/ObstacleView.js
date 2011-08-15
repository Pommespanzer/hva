var ObstacleView = Backbone.View.extend({
    tagName: 'div',
    
    initialize: function () {
        _.bindAll(this, 'render');
    },
    
    render: function () {
        this.el.className = 'obstacle';
        this.el.style.left = (this.model.get('x') * 50) + 'px';
        this.el.style.top = (this.model.get('y') * 50) + 'px';
        
        $(this.el).html('&nbsp;');
        return this;
    }
});