var MachineGunView = AbstractWeaponView.extend({
    /**
     * INIT - call by AbstractWeaponView
     */
    init: function () {
        this.model.setName('mg');
        this.model.setRange(5);
        this.model.setActionPoints(5);
        this.model.setFirepower(200);
        this.model.setFirespeed(200);
        this.model.setImage('');
    },

    /**
     * This method rendes the shot for the ma
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
