var WeaponModel = Backbone.Model.extend({
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
    }
});
