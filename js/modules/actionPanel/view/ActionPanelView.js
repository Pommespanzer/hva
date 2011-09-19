var ActionPanelView = Backbone.View.extend({
    /**
     * Where to bind the action panel
     */
    el: $('body'),
    
    /**
     * All events for action panel
     */
    events: {
        'click #js-end-turn': 'endTurn'    
    },
    
    /**
     * INIT
     * 
     * @return void
     */
    initialize: function () {
        _.bindAll(this, 'render', 'update', 'endTurn', 'showEndTurnLink', 'hideEndTurnLink');
        this.render();
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
     * This method hides the "end turn" link in the action panel.
     * 
     * @return void
     */
    hideEndTurnLink: function () {
        $('#js-end-turn').addClass('hide');
    },
    
    /**
     * This method shows the "end turn" link in the action panel.
     * 
     * @return void
     */
    showEndTurnLink: function () {
        $('#js-end-turn').removeClass('hide');
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
        
        var weapons = $('#weapons'),
            status = $('#status');
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
            weaponHtml = [],
            statusHtml = [];
        
        var i;
        for (i = 0; i < allWeapons.length; i += 1) {
            weaponHtml.push('<li>' + allWeapons[i].name + '</li>');
        }
        weapons.html(weaponHtml.join(''));
        
        statusHtml.push('<li>');
        statusHtml.push('<div id="total-armor">');
        statusHtml.push('<div id="current-armor" style="width: ' + newWidthArmor + '%"></div>');
        statusHtml.push('</div>');
        statusHtml.push('</li>');
        
        statusHtml.push('<li>');
        statusHtml.push('<div id="total-actionPoints">');
        statusHtml.push('<div id="current-actionPoints" style="width: ' + newWidthActionPoints + '%"></div>');
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
        html.push('<div id="control-panel">');
        
        html.push('<ul id="weapons"></ul>');
        html.push('<ul id="status"></ul>');
        html.push('<ul id="common-actions">');
        html.push('<li><a href="javascript:;" id="js-end-turn">Zug beenden</a></li>');
        html.push('</ul>');
        
        html.push('</div>');
        
        this.el.append(html.join(''));
    }
});