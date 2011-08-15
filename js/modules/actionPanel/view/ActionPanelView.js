var ActionPanelView = Backbone.View.extend({
    el: $('body'),
        
    initialize: function () {
        _.bindAll(this, 'render', 'update');
        this.render();
    },
    
    update: function (unitModel) {
        // if unit is not selected -> avoid updating
        if (false === unitModel.isSelected()) {
            return;
        }
        
        var weapons = $('#weapons');
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
    
    render: function () {
        var html = [];
        html.push('<div id="control-panel">');
        
        html.push('<ul id="weapons"></ul>');
        html.push('<ul id="status"></ul>');
        html.push('<ul id="common-actions">');
        html.push('<li><a href="javascript:;" class="finish-turn">Zug beenden</a></li>');
        html.push('</ul>');
        
        html.push('</div>');
        
        this.el.append(html.join(''));
    }
});