var DoubleBazookaView = Backbone.View.extend({
    /**
     * INIT
     *
     * @return void
     */
    initialize: function () {
        _.bindAll(
            this,
            'renderShot'
        );

        this.model.setName('bazooka');
        this.model.setRange(6);
        this.model.setActionPoints(5);
        this.model.setFirepower(800);
        this.model.setFirespeed(300);
        this.model.setImage('');
    },

    /**
     * This method rendes the shot for the ma
     */
    renderShot: function (position, angle, isEnemy) {
        var uniqueId = Math.ceil(new Date().getMilliseconds() * Math.random() * 99999999999),
            clazz = this.model.get('name') + ' ' + uniqueId + ' ' + (isEnemy ? 'enemy' : ''),
            styleShot1 = 'position: absolute; -moz-transform: rotate(' + angle + 'deg); -webkit-transform: rotate(' + angle + 'deg); top: ' + (position.y * 50 + 10) + 'px; left: ' + (position.x * 50 + 10) + 'px',
            styleShot2 = 'position: absolute; -moz-transform: rotate(' + angle + 'deg); -webkit-transform: rotate(' + angle + 'deg); top: ' + (position.y * 50 + 40) + 'px; left: ' + (position.x * 50 + 10) + 'px';

        // render shot
        $('#battlefield').append(
            '<div class="' + clazz + '" style="' + styleShot1 + '"></div>' +
            '<div class="' + clazz + '" style="' + styleShot2 + '"></div>'
        );

        return $('.' + this.model.get('name') + '.' + uniqueId);
    }
});
