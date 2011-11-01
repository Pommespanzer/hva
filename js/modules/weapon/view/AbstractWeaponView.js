var AbstractWeaponView = Backbone.View.extend({
    /**
     * INIT
     *
     * @return void
     */
    initialize: function () {
        _.bind(
            this,
            'changeUsage',
            'addFirerange',
            'updateFirerange',
            'removeFirerange',
            'renderShot',
            'init'
        );

        this.model.bind('change:inUse', $.proxy(this.changeUsage, this));
        this.model.bind('change:position', this.updateFirerange);

        var uniqueId = Math.ceil(new Date().getMilliseconds() * Math.random() * 99999999999);
        this.model.setId(uniqueId);
        this.init();
    },

    /**
     * READY TO OVERWRITE IN THE CHILD-CLASS
     */
    init: function () {},

    /**
     * This method is called if an user changed the weapon of an unit.
     * It displays the range circle on the map or hides the range circle.
     *
     * @param WeaponModel weaponModel
     * @param bool inUser - true if weapon in use - false otherwise
     *
     * @return void
     */
    changeUsage: function (weaponModel, inUse) {
        if (inUse) {
            this.addFirerange();
            return;
        }

        this.removeFirerange();
    },

    /**
     * This method displays the fire range of the weapon.
     *
     * @return void
     */
    addFirerange: function () {
        var padding = this.model.get('range') * 25,
            position = this.model.get('position'),
            x = (position.x * 25 - padding),
            y = (position.y * 25 - padding);

        $('#battlefield').append(
            '<div id="fr-' + this.model.get('id') + '" class="firerange" style="top: ' + y + 'px; left: ' + x + 'px; padding: ' + padding + 'px"></div>'
        );
    },

    /**
     * This method updates (repaint) the fire range of the current weapon.
     * This happens if an unit moves.
     *
     * @return void
     */
    updateFirerange: function (weaponModel, position) {
        var padding = weaponModel.get('range') * 25;
        $('#fr-' + weaponModel.get('id')).css({left: (position.x - padding), top: (position.y - padding)});
    },

    /**
     * This method removes the fire range of the current weapon.
     * This happens if the unit dies, changes the weapon or
     * the user select an other unit.
     *
     * @return void
     */
    removeFirerange: function () {
        $('#fr-' + this.model.get('id')).remove();
    }
});
