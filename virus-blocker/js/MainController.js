Ext.define('Ung.apps.virusblocker.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.app-virus-blocker',

    control: {
        '#': {
            afterrender: 'getSettings',
        },
        '#advanced': {
            activate: Ung.controller.Global.onSubtabActivate,
            beforetabchange: Ung.controller.Global.onBeforeSubtabChange
        }
    },

    getSettings: function () {
        var v = this.getView(), vm = this.getViewModel();

        // set the enabled custom block page based on URL existance
        vm.bind('{settings.customBlockPageUrl}', function (url) {
            vm.set('settings.customBlockPageEnabled', url.length > 0);
        });

        v.setLoading(true);
        Ext.Deferred.sequence([
            Rpc.asyncPromise(v.appManager, 'getSettings'),
            Rpc.asyncPromise(v.appManager, 'isFileScannerAvailable')
        ])
        .then( function(result){
            if(Util.isDestroyed(v, vm)){
                return;
            }

            vm.set('settings', result[0]);
            vm.set('isFileScannerAvailable', result[1]);

            vm.set('panel.saveDisabled', false);
            v.setLoading(false);
        },function(ex){
            if(!Util.isDestroyed(v, vm)){
                vm.set('panel.saveDisabled', true);
                v.setLoading(false);
            }
            Util.handleException(ex);
        });
    },

    setSettings: function () {
        var me = this, v = this.getView(), vm = this.getViewModel();

        v.query('ungrid').forEach(function (grid) {
            var store = grid.getStore();
            if (store.getModifiedRecords().length > 0 ||
                store.getNewRecords().length > 0 ||
                store.getRemovedRecords().length > 0 ||
                store.isReordered) {
                store.each(function (record) {
                    if (record.get('markedForDelete')) {
                        record.drop();
                    }
                });
                store.isReordered = undefined;
                vm.set(grid.listProperty, Ext.Array.pluck(store.getRange(), 'data'));
            }
        });

        v.setLoading(true);
        Rpc.asyncData(v.appManager, 'setSettings', vm.get('settings'))
        .then(function(result){
            if(Util.isDestroyed(v, vm)){
                return;
            }
            Util.successToast('Settings saved');
            vm.set('panel.saveDisabled', false);
            v.setLoading(false);

            me.getSettings();
            Ext.fireEvent('resetfields', v);
        }, function(ex) {
            if(!Util.isDestroyed(v, vm)){
                vm.set('panel.saveDisabled', true);
                v.setLoading(false);
            }
            Util.handleException(ex);
        });
    }

});
