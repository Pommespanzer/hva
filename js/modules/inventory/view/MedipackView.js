var MedipackView = AbstractInventoryItemView.extend({
    render: function () {
        var position = this.model.get('position'),
            style = 'top: ' + (position.y * 50) + 'px; left: ' + (position.x * 50) + 'px';

        $('#battlefield').append(
            '<div id="' + this.model.get('id') + '" class="medipack" style="' + style + '">MPkg</div>'
        );
    },

    use: function (inventoryModel, unitModel) {
        unitModel.setCurrentArmor(unitModel.get('totalArmor'));
        unitModel.removeInventoryItem(inventoryModel.get('id'));
    }
});
