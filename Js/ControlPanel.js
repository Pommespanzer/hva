var ControlPanel = new function () {
    var _ammoSection = null;
    var _actionPointSection = null;
    var _weaponSection = null;
    var _currentAmmo = null;
    var _currentActionPoints = null;
    
    this.init = function () {
        _ammoSection = $('.ammo', $('#control-panel'));
        _actionPointSection = $('.actionPoints', $('#control-panel'));
        _weaponSection = $('.weapon', $('#control-panel'));
        
        _currentAmmo = $('.current-ammo', _ammoSection);
        _currentActionPoints = $('.current-actionPoints', _actionPointSection);
    };
    
    this.displayAll = function (unit) {
        var selectedUnit = Map.getSelectedUnit();
        
        if (null === selectedUnit || selectedUnit.getId() !== unit.getId()) {
            return;
        }
        
        this.displayAmmo(unit);
        this.displayActionPoints(unit);
    };
    
    this.displayAmmo = function (unit) {
        if (unit.getAmmo() <= 0) {
            _ammoSection.addClass('hide');
            _actionPointSection.addClass('hide');
            _weaponSection.addClass('hide');
            return;
        }
        _ammoSection.removeClass('hide');
        _actionPointSection.removeClass('hide');
        _weaponSection.removeClass('hide');
        
        var newWidth = unit.getAmmo() * unit.getAmmoQuotient();
        _currentAmmo.css('width', newWidth + '%');
    };
    
    this.displayActionPoints = function (unit) {
        var onePercent = 100 / unit.getTotalActionPoints();
        var newWidth = onePercent * unit.getCurrentActionPoints();
        _currentActionPoints.css('width', newWidth + '%');
    };
}();