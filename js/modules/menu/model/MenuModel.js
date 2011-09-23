var MenuModel = Backbone.Model.extend({
    save: function (units, obstacles) {
        if (typeof(localStorage) === 'undefined') {
            alert('Dein Browser unterstützt kein HTML5 local storage');
            return;
        }

        try {
            localStorage.setItem('hva', JSON.stringify({units: units, obstacles: obstacles}));
        } catch (e) {
            if (e == QUOTA_EXCEEDED_ERR) {
                alert('Es konnte nicht gespeichert werden');
            }
        }
    },

    load: function () {
        var data = localStorage.getItem('hva');
        return JSON.parse(data);
    }
});