Ext.define('Ung.apps.bandwidthcontrol.ConfWizardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.app-tunnel-vpn-wizard',

    control: {
        '#': {
            afterrender: 'onAfterRender'
        },
        'window > panel': {
            activate: 'onActivateCard'
        }
    },

    onAfterRender: function () {
    },

    onActivateCard: function (panel) {
        var vm = this.getViewModel(),
            layout = this.getView().getLayout();

        vm.set('prevBtn', layout.getPrev());
        if (layout.getPrev()) {
            vm.set('prevBtnText', layout.getPrev().getTitle());
        }
        vm.set('nextBtn', layout.getNext());
        if (layout.getNext()) {
            vm.set('nextBtnText', layout.getNext().getTitle());
        }
    },

    onNext: function () {
        var v = this.getView(),
            vm = this.getViewModel(),
            activeItem = v.getLayout().getActiveItem();

        if (activeItem.getItemId() === 'welcome') {
            v.getLayout().next();
        }

        if (activeItem.getItemId() === 'vpn-service') {
            v.getLayout().next();
        }

        if (activeItem.getItemId() === 'upload') {
            var settings = this.getView().appManager.getSettings();
            var tunnel = null, i=0;
            // Set username/password of tunnel if specified
            if (vm.get('username') != null && vm.get('password') != null) {
                if ( settings.tunnels != null && settings.tunnels.list != null ) {
                    for (i=0; i< settings.tunnels.list.length ; i++) {
                        tunnel = settings.tunnels.list[i];
                        if (tunnel['tunnelId'] == vm.get('tunnelId')) {
                            tunnel['username'] = vm.get('username');
                            tunnel['password'] = vm.get('password');
                        }
                    }
                }
            }
            // Enable tunnel
            if ( settings.tunnels != null && settings.tunnels.list != null ) {
                for (i=0; i< settings.tunnels.list.length ; i++) {
                    tunnel = settings.tunnels.list[i];
                    if (tunnel['tunnelId'] == vm.get('tunnelId')) {
                        tunnel['enabled'] = true;
                    }
                }
            }
            // Save new settings
            this.getView().appManager.setSettings(settings);

            v.getLayout().next();
        }
    },

    onPrev: function () {
        var v = this.getView();
        if (v.getLayout().getPrev()) {
            v.getLayout().prev();
        }
    },

    uploadFile: function(cmp) {
        var form = Ext.ComponentQuery.query('form[name=upload_form]')[0];
        var file = Ext.ComponentQuery.query('textfield[name=upload_file]')[0].value;
        if ( file == null || file.length === 0 ) {
            Ext.MessageBox.alert('Select File'.t(), 'Please choose a file to upload.'.t());
            return;
        }
        Ext.MessageBox.wait('Uploading...'.t(), 'Please wait'.t());
        form.submit({
            url: "upload",
            success: Ext.bind(function( form, action ) {
                var tunnelId = this.getView().appManager.getNewTunnelId();
                this.getViewModel().set("tunnelId",tunnelId);
                Ext.MessageBox.alert('Configuration Import Success'.t(), action.result.msg);
            }, this),
            failure: Ext.bind(function( form, action ) {
                Ext.MessageBox.alert('Configuration Import Failure'.t(), action.result.msg);
            }, this)
        });
    },
    
    onFinish: function () {
        // fire finish event to reload settings ant try to start app
        this.getView().fireEvent('finish');
        this.getView().close();
    }});