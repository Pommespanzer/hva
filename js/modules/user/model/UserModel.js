var UserModel = Backbone.Model.extend({
    setName: function ($name) {
        this.set({name: $name});
    },

    getName: function () {
        return this.get('name');
    }
});