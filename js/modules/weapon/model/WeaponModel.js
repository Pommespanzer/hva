var WeaponModel = Backbone.Model.extend({
    setId: function (id) {
        this.set({id: id});
    },

    setRange: function (range) {
        this.set({range: range});
    },

    setFirepower: function (firepower) {
        this.set({firepower: firepower});
    },

    setImage: function (image) {
        this.set({image: image});
    },

    setName: function (name) {
        this.set({name: name});
    },

    setActionPoints: function (actionPoints) {
        this.set({actionPoints: actionPoints});
    },

    setFirespeed: function (firespeed) {
        this.set({firespeed: firespeed});
    },

    backToHolster: function () {
        this.set({inUse: false});
    },

    use: function () {
        this.set({inUse: true});
    },

    setPosition: function (position) {
        this.set({position: position});
    }
});
