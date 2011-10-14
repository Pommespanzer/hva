AbstractInventoryItemView = Backbone.View.extend({
    initialize: function () {
        _.bind(this, 'render', 'remove', 'use');

        this.model.bind('remove', this.remove);
        this.model.bind('change:use', this.use);

    },

    render: function () {
        throw new Error('AbstractInventoryItemView -> render() is not implemented');
    },

    use: function (inventoryModel, unitModel) {
        throw new Error('AbstractInventoryItemView -> use() is not implemented');
    },

    remove: function (inventoryModel) {
        var medipack = $('#' + inventoryModel.get('id'));

        if (medipack.length > 0) {
            medipack.remove();
        }
    }
});
