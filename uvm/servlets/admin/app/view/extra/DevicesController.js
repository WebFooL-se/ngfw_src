Ext.define('Ung.view.extra.DevicesController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.devices',

    control: {
        '#': {
            deactivate: 'onDeactivate'
        },
        '#devicesgrid': {
            afterrender: 'getDevices'
        }
    },

    onDeactivate: function (view) {
        view.destroy();
    },

    getDevices: function () {
        var me = this,
            grid = me.getView().down('#devicesgrid');

        me.getView().setLoading(true);
        Rpc.asyncData('rpc.deviceTable.getDevices')
            .then(function(result) {
                me.getView().setLoading(false);
                Ext.getStore('devices').loadData(result.list);
                grid.getSelectionModel().select(0);
            });
    },

    resetView: function( btn ){
        var grid = this.getView().down('#devicesgrid');
        Ext.state.Manager.clear(grid.stateId);
        grid.reconfigure(null, grid.initialConfig.columns);
    },


    saveDevices: function () {
        var me = this,
            store = me.getView().down('ungrid').getStore(),
            list = [];

        me.getView().query('ungrid').forEach(function (grid) {
            var store = grid.getStore();

            var filters = store.getFilters().clone();
            store.clearFilter();

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
                list = Ext.Array.pluck(store.getRange(), 'data');
            }

            filters.each( function(filter){
                store.addFilter(filter);
            });
        });

        me.getView().setLoading(true);
        Rpc.asyncData('rpc.deviceTable.setDevices', {
            javaClass: 'java.util.LinkedList',
            list: list
        }).then(function(result, ex) {
             me.getDevices();
        }, function (ex) {
            Util.handleException(ex);
        }).always(function () {
            me.getView().setLoading(false);
        });
   }
});
