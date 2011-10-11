var PistolView = Backbone.View.extend({
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

        this.model.setName('p9');
        this.model.setRange(3);
        this.model.setActionPoints(1);
        this.model.setFirepower(50);
        this.model.setFirespeed(200);
        this.model.setImage('');
    },

    /**
     * This method rendes the shot for the ma
     */
    renderShot: function (position, angle, isEnemy) {
        var uniqueId = Math.ceil(new Date().getMilliseconds() * Math.random() * 99999999999),
            clazz = this.model.get('name') + ' ' + uniqueId + ' ' + (isEnemy ? 'enemy' : ''),
            style = 'position: absolute; -moz-transform: rotate(' + angle + 'deg); -webkit-transform: rotate(' + angle + 'deg); top: ' + (position.y * 50 + 25) + 'px; left: ' + (position.x * 50 + 12) + 'px';

        // render shot
        $('#battlefield').append(
            '<div class="' + clazz + '" style="' + style + '"></div>'
        );

        return $('.' + this.model.get('name') + '.' + uniqueId);
    }
});
