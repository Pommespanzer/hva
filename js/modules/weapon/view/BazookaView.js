var BazookaView = AbstractWeaponView.extend({
    /**
     * INIT - call by AbstractWeaponView
     */
    init: function () {
        this.model.setName('bazooka');
        this.model.setRange(7);
        this.model.setActionPoints(10);
        this.model.setFirepower(400);
        this.model.setFirespeed(300);
        this.model.setImage('');
    },

    /**
     * This method renders the shot for the bazooka weapon.
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
            style = 'position: absolute; -moz-transform: rotate(' + angle + 'deg); -webkit-transform: rotate(' + angle + 'deg); top: ' + (position.y * 25 + 12) + 'px; left: ' + (position.x * 25 + 6) + 'px';

        // render shot
        $('#battlefield').append(
            '<div class="' + clazz + '" style="' + style + '"></div>'
        );

        return $('.' + this.model.get('name') + '.' + uniqueId);
    }
});
