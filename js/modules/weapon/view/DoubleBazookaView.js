var DoubleBazookaView = AbstractWeaponView.extend({
    /**
     * INIT - call by AbstractWeaponView
     */
    init: function () {
        this.model.setName('bazooka');
        this.model.setRange(6);
        this.model.setActionPoints(10);
        this.model.setFirepower(800);
        this.model.setFirespeed(300);
        this.model.setImage('');
    },

    /**
     * This method renders the shot for the double bazooka weapon.
     *
     * @param object position - {x: ?, y: ?}
     * @param float angle - angle of the shot
     * @param bool isEnemy
     *
     * @return void
     */
    renderShot: function (position, angle, isEnemy) {
        var uniqueId = Math.ceil(new Date().getMilliseconds() * Math.random() * 99999999999),
            clazz = this.model.get('name') + ' ' + uniqueId + ' ' + (isEnemy ? 'enemy' : ''),
            styleShot1 = 'position: absolute; -moz-transform: rotate(' + angle + 'deg); -webkit-transform: rotate(' + angle + 'deg); top: ' + (position.y * 25 + 5) + 'px; left: ' + (position.x * 25 + 5) + 'px',
            styleShot2 = 'position: absolute; -moz-transform: rotate(' + angle + 'deg); -webkit-transform: rotate(' + angle + 'deg); top: ' + (position.y * 25 + 20) + 'px; left: ' + (position.x * 25 + 5) + 'px';

        // render shot
        $('#battlefield').append(
            '<div class="' + clazz + '" style="' + styleShot1 + '"></div>' +
            '<div class="' + clazz + '" style="' + styleShot2 + '"></div>'
        );

        return $('.' + this.model.get('name') + '.' + uniqueId);
    }
});
