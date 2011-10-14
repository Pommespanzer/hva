var InventoryModel = Backbone.Model.extend({
    generateId: function (position) {
        var id = 'inventory-' + position.x + '_' + position.y;
        this.set({id: id});

        this.setPosition(position);
    },

    setName: function (name) {
        this.set({name: name});
    },

    setPosition: function (position) {
        this.set({position: position});
    },

    use: function (unitModel) {
        this.set({use: unitModel});
    },

    remove: function() {
        this.set({remove: true});
    }
});
