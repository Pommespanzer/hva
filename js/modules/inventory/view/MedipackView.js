var MedipackView = AbstractInventoryItemView.extend({
    render: function () {
        var position = this.model.get('position'),
            style = 'top: ' + (position.y * 25) + 'px; left: ' + (position.x * 25) + 'px';

        $('#battlefield').append(
            '<div id="' + this.model.get('id') + '" class="medipack" style="' + style + '"></div>'
        );
    },

    use: function (inventoryItemModel, unitModel) {
        unitModel.setCurrentArmor(unitModel.get('totalArmor'));
        unitModel.removeInventoryItem(inventoryItemModel.get('id'));
    }
});
