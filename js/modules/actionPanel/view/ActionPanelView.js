var ActionPanelView = Backbone.View.extend({
    /**
     * Where to bind the action panel
     */
    el: $('body'),

    /**
     * Model of current selected unit.
     *
     * @var Object UnitModel
     */
    currentUnitModel: null,

    /**
     * All events for action panel
     */
    events: {
        'click #js-end-turn': 'endTurn',
        'click #js-back-to-menu': 'backToMenu',
        'click .js-weapon': 'selectWeapon',
        'click .js-inventory-item': 'selectInventory',
    },

    /**
     * INIT
     *
     * @return void
     */
    initialize: function () {
        _.bindAll(
            this,
            'render',
            'update',
            'endTurn',
            'backToMenu',
            'showEndTurnLink',
            'hideEndTurnLink',
            'selectWeapon',
            'selectInventory'
        );
    },

    /**
     * This method is called if an user clicked on the "end turn"
     * link in the action panel.
     *
     * @return void
     */
    endTurn: function () {
        this.hideEndTurnLink();
        var aiView = new AiView({
            facade: new AiFacade()
        });
    },

    /**
     * This method is called if an user clicked on the "back to menu"
     * link in the action panel.
     *
     * @return void
     */
    backToMenu: function () {
        $('#js-action-panel').hide();
        $('#battlefield').hide();

        menuView.show();
    },

    /**
     * This method hides the "end turn" link in the action panel.
     *
     * @return void
     */
    hideEndTurnLink: function () {
        mapView.blockEvents = true;
        $('#js-end-turn').parent('li').addClass('hide');
    },

    /**
     * This method shows the "end turn" link in the action panel.
     *
     * @return void
     */
    showEndTurnLink: function () {
        mapView.blockEvents = false;
        $('#js-end-turn').parent('li').removeClass('hide');
    },

    /**
     * This method is called if an user changes the weapon of an unit.
     *
     * @param Object event
     *
     * @return void
     */
    selectWeapon: function (event) {
        var htmlObject = $(event.target),
            weaponNr = htmlObject.attr('data-weaponNr'),
            allWeapons = this.currentUnitModel.get('weapons');
        this.currentUnitModel.setSelectedWeapon(allWeapons[weaponNr]);
    },

    selectInventory: function (event) {
        var htmlObject = $(event.target),
            inventoryItemId = htmlObject.attr('data-inventory-item');

        this.currentUnitModel.useInventoryItem(inventoryItemId);
    },

    /**
     * This method updates the armor and action points of a selected unit if something
     * happens (shooting, getting hit, moving, ...)
     *
     * @param object unitModel - model of current selected unit
     *
     * @return void
     */
    update: function (unitModel) {
        // if unit is not selected -> avoid updating
        if (!unitModel.isSelected() || unitModel.get('isEnemy')) {
            return;
        }

        this.currentUnitModel = unitModel;

        var weapons = $('#js-weapons'),
            status = $('#js-status'),
            inventory = $('#js-inventory');

        // unit is dead -> remove all status
        if (unitModel.getCurrentArmor() <= 0) {
            weapons.html('');
            status.html('');
            return;
        }

        var armorQuotient = 100 / unitModel.getTotalArmor(),
            newWidthArmor = unitModel.getCurrentArmor() * armorQuotient,
            onePercent = 100 / unitModel.getTotalActionPoints(),
            newWidthActionPoints = onePercent * unitModel.getCurrentActionPoints(),
            allWeapons = unitModel.get('weapons'),
            allInventoryItems = unitModel.get('inventory') ? unitModel.get('inventory') : [],
            weaponHtml = [],
            statusHtml = [],
            inventoryHtml = [],
            i;

        for (i = 0; i < allWeapons.length; i += 1) {
            weaponHtml.push('<li><a href="javascript:;" class="js-weapon" data-weaponNr=' + i + '>' + allWeapons[i].model.get('name') + '</a></li>');
        }
        weapons.html(weaponHtml.join(''));


        for (i = 0; i < allInventoryItems.length; i += 1) {
            inventoryHtml.push('<li><a href="javascript:;" class="js-inventory-item" data-inventory-item=' + allInventoryItems[i].get('id') + '>' + allInventoryItems[i].get('name') + '</a></li>');
        }
        inventory.html(inventoryHtml.join(''));


        statusHtml.push('<li>');
        statusHtml.push('<div class="max-armor">');
        statusHtml.push('<div class="current-armor" style="width: ' + newWidthArmor + '%"></div>');
        statusHtml.push('</div>');
        statusHtml.push('</li>');

        statusHtml.push('<li>');
        statusHtml.push('<div class="max-action-points">');
        statusHtml.push('<div class="current-action-points" style="width: ' + newWidthActionPoints + '%"></div>');
        statusHtml.push('</div>');
        statusHtml.push('</li>');

        status.html(statusHtml.join(''));
    },

    /**
     * This method renders the action panel.
     *
     * @return void
     */
    render: function () {
        var html = [];
        html.push('<div id="js-action-panel" class="action-panel">');

        html.push('<ul class="weapons-inventory">');
        html.push('<ul id="js-weapons" class="weapons"></ul>');
        html.push('<ul id="js-inventory" class="inventory"></ul>');
        html.push('</ul>');
        html.push('<ul id="js-status" class="status"></ul>');
        html.push('<ul class="actions">');
        html.push('<li><a href="javascript:;" id="js-end-turn">Zug beenden</a></li>');
        html.push('<li><a href="javascript:;" id="js-back-to-menu">Menü</a></li>');
        html.push('</ul>');

        html.push('</div>');

        this.el.append(html.join(''));
    }
});
