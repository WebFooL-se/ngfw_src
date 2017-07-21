Ext.define('Ung.view.main.SupportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.support',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        }
    },

    onBeforeRender: function(){
        var me = this,
            view = me.getView(),
            vm = me.getViewModel();

        Ext.Deferred.sequence([
            Rpc.directPromise('rpc.systemManager.getSettings'),
        ], this).then(function (result) {
            me.getView().setLoading(false);
            vm.set({
                systemSettings: result[0]
            });

            if(vm.get('systemSettings')['supportEnabled'] == false){
                vm.set('enableSupport', true);
            }else{
                me.openSupportWindow();
            }
        });
    },

    openSupportWindow: function(){
        var me = this,
            view = this.getView();

        var query = 'action=support';
        query += '&' + Util.getAbout();
        query += '&fragment=' + view.fragment.substr(1);

        window.location.hash = view.fragment;
        window.open(Util.getStoreUrl() + '?' + query);
    },

    cancelHandler: function(btn){
        btn.up('window').close();
    },
    noSupportHandler: function(btn){
        this.openSupportWindow();
        btn.up('window').close();        
    },
    yesSupportHandler: function(btn){
        var me = this,
            view = me.getView(),
            vm = me.getViewModel();

        var systemSettings = vm.get('systemSettings');
        systemSettings.supportEnabled = true;

        Ext.Deferred.sequence([
            Rpc.asyncPromise('rpc.systemManager.setSettings', systemSettings)
        ], this).then(function () {
            view.setLoading(false);
            Util.successToast('Remote Support Access enabled!');
            this.openSupportWindow();
            btn.up('window').close();        
        }, function (ex) {
            view.setLoading(false);
            console.error(ex);
            Util.handleException(ex);
        });
    }
});
