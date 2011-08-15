var AbstractRangeView = Backbone.View.extend({
    el: $('#battlefield'),
    
    className: null,
    
    initialize: function () {
        _.bindAll(this, 'render');
    },
    
    remove: function () {
        $('.' + this.className, this.el).remove();
    },
    
    render: function (unitId, x, y, range) {
        var selectedUnit = Map.getSelectedUnit();
        if (selectedUnit.getId() !== unitId) {
            return;
        }
        
        this.remove();
        
        if (range === 0) {
            return;
        }
        
        var padding = range * 50;
        
        var xPos = (x * 50 - padding);
        var yPos = (y * 50 - padding);

        this.el.append('<div class="' + this.className +' ' + this.className + '-' + unitId + '" style="top: ' + yPos + 'px; left: ' + xPos + 'px; padding: ' + padding + 'px"></div>');
    }
});