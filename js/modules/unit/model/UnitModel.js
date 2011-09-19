var UnitModel = Backbone.Model.extend({
    setId: function (id) {
        this.set({id: id});
    },

    setType: function (type) {
        this.set({type: type});
    },

    setPosition: function (x, y) {
        this.set({position: {x: x, y: y}});
    },

    getPosition: function () {
        return this.get('position');
    },

    setOrder: function (order) {
        this.set({order: order});
    },

    isEnemy: function (isEnemy) {
        this.set({isEnemy: isEnemy});
    },

    setSounds: function (sounds) {
        this.set({sounds: sounds});
    },

    setActionPoints: function (actionPoints) {
        this.set({totalActionPoints: actionPoints});
        this.set({currentActionPoints: actionPoints});
    },

    setCurrentActionPoints: function (actionPoints) {
        this.set({currentActionPoints: actionPoints});
    },

    getCurrentActionPoints: function () {
        return this.get('currentActionPoints');
    },

    getTotalActionPoints: function () {
        return this.get('totalActionPoints');  
    },

    setArmor: function (armor) {
        this.set({totalArmor: armor});
        this.set({currentArmor: armor});
    },

    setCurrentArmor: function (armor) {
        this.set({currentArmor: armor});

        if (armor <= 0) {
            this.set({destroyed: true});
        }
    },

    getTotalArmor: function () {
        return this.get('totalArmor');
    },

    getCurrentArmor: function () {
        return this.get('currentArmor');
    },

    addWeapon: function (weapon) {
        var weapons = this.get('weapons') ? this.get('weapons') : [];
        weapons.push(weapon);

        this.set({weapons: weapons});
    },

    setSpeed: function (speed) {
        this.set({speed: speed});
    },

    select: function () {
        this.set({select: true});
    },

    unselect: function () {
        this.set({select: false});
    },

    isSelected: function () {
        return this.get('select');  
    },

    move: function (wayPoints) {
        this.set({wayPoints: wayPoints});
    },

    attack: function (enemy) {
        this.set({enemy: enemy});
        this.trigger('attack');
    },

    isBusy: function (value) {
        this.set({isBusy: value});
    }
});