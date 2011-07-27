var ControlPanel = new function () {
    'use strict';
    
    /**
     * Ammo section of the unit-status-section.
     * 
     * @var object _ammoSection
     */
    var _ammoSection = null;
    
    /**
     * Action point section of the unit-status-section.
     * 
     * @var object _actionPointSection
     */
    var _actionPointSection = null;
    
    /**
     * HTML part of the current ammo of a selected unit.
     * 
     * @var object _currentAmmo
     */
    var _currentAmmo = null;
    
    /**
     * HTML part of the current action points of a selected unit.
     * 
     * @var object _currentActionPoints
     */
    var _currentActionPoints = null;
    
    /**
     * Init stuff
     */
    this.init = function () {
        _ammoSection = document.querySelector('.ammo');
        _actionPointSection = document.querySelector('.actionPoints');
        
        _currentAmmo = document.querySelector('.current-ammo');
        _currentActionPoints = document.querySelector('.current-actionPoints');
    };
    
    /**
     * Hide the status section. It contains hiding the ammo and action point
     * section as well.
     * 
     * @return void
     */
    this.hideStatusSection = function () {
        _ammoSection.classList.add('hide');
        _actionPointSection.classList.add('hide');
    };
    
    /**
     * Show the status section. It contains showing the ammo and action point
     * section as well.
     * 
     * @return void
     */
    this.showStatusSection = function () {
        _ammoSection.classList.remove('hide');
        _actionPointSection.classList.remove('hide');
    };
    
    /**
     * Calculate and render the current status of the ammo and the action points
     * of the selected unit.
     * 
     * @param object unit - Unit-class
     * 
     * @return void
     */
    this.displayAll = function (unit) {
        var selectedUnit = Map.getSelectedUnit();
        
        if (null === selectedUnit || selectedUnit.getId() !== unit.getId()) {
            return;
        }
        
        this.displayAmmo(unit);
        this.displayActionPoints(unit);
    };
    
    /**
     * Calculate and render the current ammo of the selected unit.
     * 
     * @param object unit - Unit-class
     * 
     * @return void
     */
    this.displayAmmo = function (unit) {
        if (unit.getAmmo() <= 0) {
            this.hideStatusSection();
            return;
        }
        
        this.showStatusSection();
        
        var newWidth = unit.getAmmo() * unit.getAmmoQuotient();
        _currentAmmo.style.width = newWidth + '%';
    };
    
    /**
     * Calculate and render the current action points of the selected unit.
     * 
     * @param object unit - Unit-class
     * 
     * @return void
     */
    this.displayActionPoints = function (unit) {
        var onePercent = 100 / unit.getTotalActionPoints();
        var newWidth = onePercent * unit.getCurrentActionPoints();
        _currentActionPoints.style.width = newWidth + '%';
    };
}();