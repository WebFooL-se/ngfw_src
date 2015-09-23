Ext.define('Webui.untangle-node-captive-portal.settings', {
    extend:'Ung.NodeWin',
    panelCaptiveStatus: null,
    gridCaptiveStatus: null,

    panelCaptureRules: null,
    gridCaptureRules: null,

    panelPassedHosts: null,
    panelUserAuthentication: null,
    panelCaptivePage: null,

    gridUserEventLog: null,
    gridRuleEventLog: null,
    initComponent: function() {
        Ung.Main.getNetworkSettings(true);

        this.buildCaptiveStatus();
        this.buildCaptureRules();
        this.buildPassedHosts();
        this.buildCaptivePage();
        this.buildUserAuthentication();

        this.buildTabPanel([ this.panelCaptiveStatus, this.panelCaptureRules, this.panelPassedHosts, this.panelCaptivePage,
                             this.panelUserAuthentication]);
        this.callParent(arguments);
    },
    getMatchers: function () {
        return [
            {name:"DST_ADDR",displayName: this.i18n._("Destination Address"), type: "text", visible: true, vtype:"ipMatcher"},
            {name:"DST_PORT",displayName: this.i18n._("Destination Port"), type: "text",vtype:"portMatcher", visible: true},
            {name:"DST_INTF",displayName: this.i18n._("Destination Interface"), type: "checkgroup", values: Ung.Util.getInterfaceList(true, false), visible: true},
            {name:"SRC_ADDR",displayName: this.i18n._("Source Address"), type: "text", visible: true, vtype:"ipMatcher"},
            {name:"SRC_PORT",displayName: this.i18n._("Source Port"), type: "text",vtype:"portMatcher", visible: rpc.isExpertMode},
            {name:"SRC_INTF",displayName: this.i18n._("Source Interface"), type: "checkgroup", values: Ung.Util.getInterfaceList(true, false), visible: true},
            {name:"PROTOCOL",displayName: this.i18n._("Protocol"), type: "checkgroup", values: [["TCP","TCP"],["UDP","UDP"],["any", this.i18n._("any")]], visible: true},
            {name:"USERNAME",displayName: this.i18n._("Username"), type: "editor", editor: Ext.create('Ung.UserEditorWindow',{}), visible: true},
            {name:"CLIENT_HOSTNAME",displayName: this.i18n._("Client Hostname"), type: "text", visible: true},
            {name:"SERVER_HOSTNAME",displayName: this.i18n._("Server Hostname"), type: "text", visible: rpc.isExpertMode},
            {name:"SRC_MAC", displayName: this.i18n._("Client MAC Address"), type: "text", visible: true },
            {name:"DST_MAC", displayName: this.i18n._("Server MAC Address"), type: "text", visible: true },
            {name:"CLIENT_MAC_VENDOR",displayName: this.i18n._("Client MAC Vendor"), type: "text", visible: true},
            {name:"SERVER_MAC_VENDOR",displayName: this.i18n._("Server MAC Vendor"), type: "text", visible: true},
            {name:"CLIENT_IN_PENALTY_BOX",displayName: this.i18n._("Client in Penalty Box"), type: "boolean", visible: true},
            {name:"SERVER_IN_PENALTY_BOX",displayName: this.i18n._("Server in Penalty Box"), type: "boolean", visible: true},
            {name:"CLIENT_HAS_NO_QUOTA",displayName: this.i18n._("Client has no Quota"), type: "boolean", visible: true},
            {name:"SERVER_HAS_NO_QUOTA",displayName: this.i18n._("Server has no Quota"), type: "boolean", visible: true},
            {name:"CLIENT_QUOTA_EXCEEDED",displayName: this.i18n._("Client has exceeded Quota"), type: "boolean", visible: true},
            {name:"SERVER_QUOTA_EXCEEDED",displayName: this.i18n._("Server has exceeded Quota"), type: "boolean", visible: true},
            {name:"CLIENT_QUOTA_ATTAINMENT",displayName: this.i18n._("Client Quota Attainment"), type: "text", visible: true},
            {name:"SERVER_QUOTA_ATTAINMENT",displayName: this.i18n._("Server Quota Attainment"), type: "text", visible: true},
            {name:"DIRECTORY_CONNECTOR_GROUP",displayName: this.i18n._("Directory Connector: User in Group"), type: "editor", editor: Ext.create('Ung.GroupEditorWindow',{}), visible: true},
            {name:"HTTP_HOST",displayName: this.i18n._("HTTP: Hostname"), type: "text", visible: true},
            {name:"HTTP_REFERER",displayName: this.i18n._("HTTP: Referer"), type: "text", visible: true},
            {name:"HTTP_USER_AGENT",displayName: this.i18n._("HTTP: Client User Agent"), type: "text", visible: true},
            {name:"HTTP_USER_AGENT_OS",displayName: this.i18n._("HTTP: Client User OS"), type: "text", visible: true}
        ];
    },
    buildCaptiveStatus: function() {
        this.buildGridCaptiveStatus();
        this.panelCaptiveStatus = Ext.create('Ext.panel.Panel', {
            name: 'Status',
            helpSource: 'captive_portal_status',
            title: this.i18n._('Status'),
            layout: { type: 'vbox', align: 'stretch' },
            cls: 'ung-panel',
            items: [{
                xtype: 'fieldset',
                title: this.i18n._('Status'),
                flex: 0,
                html: this.i18n._('Captive Portal allows administrators to require network users to complete a defined process, such as logging in or accepting a network usage policy, before accessing the internet.')
             }, this.gridCaptiveStatus]
        });
    },

    buildGridCaptiveStatus: function() {
        this.gridCaptiveStatus = Ext.create('Ung.grid.Panel',{
            flex: 1,
            name: "gridCaptiveStatus",
            settingsCmp: this,
            hasAdd: false,
            hasEdit: false,
            hasDelete: false,
            hasRefresh: true,
            title: this.i18n._("Active Sessions"),
            qtip: this.i18n._("The Active Sessions list shows authenticated users."),
            dataFn: this.getRpcNode().getActiveUsers,
            recordJavaClass: "com.untangle.node.captive_portal.CaptureUserEntry",
            fields: [{
                name: "userAddress",
                sortType: 'asIp'
            },{
                name: "userName"
            },{
                name: "sessionCreation"
            },{
                name: "sessionActivity"
            },{
                name: "sessionCounter"
            },{
                name: "id"
            }],
            columns: [{
                header: this.i18n._("IP Address"),
                dataIndex:'userAddress',
                width: 150
            },{
                header: this.i18n._("User Name"),
                dataIndex:'userName',
                width: 200
            },{
                header: this.i18n._("Login Time"),
                dataIndex:'sessionCreation',
                width: 180,
                renderer: function(value) { return i18n.timestampFormat(value); }
            },
            //{
            // hidden because last activity is not used for timeout (the host table lastSessionTime is) so this is confusing users
            //     header: this.i18n._("Last Activity"),
            //     dataIndex:'sessionActivity',
            //     width: 180,
            //     renderer: function(value) { return i18n.timestampFormat(value); }
            //},
            {
                header: this.i18n._("Session Count"),
                dataIndex:'sessionCounter',
                width: 120
            },{
                header: this.i18n._("Logout"),
                xtype: 'actioncolumn',
                width: 80,
                iconCls: 'icon-delete-row',
                tooltip: this.i18n._("Click to logout"),
                handler: Ext.bind(function(view, rowIndex, colIndex, item, e, record) {
                    this.getRpcNode().userAdminLogout(Ext.bind(function(result, exception) {
                        if(Ung.Util.handleException(exception)) return;
                        this.gridCaptiveStatus.reload();
                    },this), record.get("userAddress"));
                }, this)
            }]
        });
    },

    buildCaptureRules: function() {
        this.panelCaptureRules = Ext.create('Ext.panel.Panel',{
            name: 'panelCaptureRules',
            helpSource: 'captive_portal_capture_rules',
            title: this.i18n._('Capture Rules'),
            layout: { type: 'vbox', align: 'stretch' },
            cls: 'ung-panel',
            items: [{
                xtype: 'fieldset',
                title: this.i18n._('Capture Rules'),
                flex: 0,
                html: this.i18n._("Network access is controlled based on the set of rules defined below. To learn more click on the <b>Help</b> button below.")
            },  this.gridCaptureRules= Ext.create('Ung.grid.Panel',{
                flex: 1,
                name: 'Rules',
                settingsCmp: this,
                hasReorder: true,
                addAtTop: false,
                title: this.i18n._("Rules"),
                dataProperty:'captureRules',
                recordJavaClass: "com.untangle.node.captive_portal.CaptureRule",
                emptyRow: {
                    "ruleId": 0,
                    "enabled": true,
                    "capture": false,
                    "description": ""
                },
                fields: [{
                    name: 'ruleId'
                }, {
                    name: 'enabled'
                }, {
                    name: 'capture'
                }, {
                    name: 'matchers'
                },{
                    name: 'description'
                }, {
                    name: 'javaClass'
                }],
                columns: [{
                    header: this.i18n._("Rule Id"),
                    width: 50,
                    dataIndex: 'ruleId',
                    renderer: function(value) {
                        if (value < 0) {
                            return i18n._("new");
                        } else {
                            return value;
                        }
                    }
                },{
                    xtype:'checkcolumn',
                    header: this.i18n._("Enable"),
                    dataIndex: 'enabled',
                    resizable: false,
                    width:55
                },{
                    header: this.i18n._("Description"),
                    width: 200,
                    dataIndex: 'description',
                    flex:1
                },{
                    xtype:'checkcolumn',
                    header: this.i18n._("Capture"),
                    dataIndex: 'capture',
                    resizable: false,
                    width:55
                }],
                rowEditorInputLines: [{
                    xtype:'checkbox',
                    name: "Enable Rule",
                    dataIndex: "enabled",
                    fieldLabel: this.i18n._("Enable Rule")
                },{
                    xtype:'textfield',
                    name: "Description",
                    dataIndex: "description",
                    fieldLabel: this.i18n._("Description"),
                    emptyText: this.i18n._("[no description]"),
                    width: 500
                },{
                    xtype:'fieldset',
                    title: this.i18n._("If all of the following conditions are met:"),
                    items:[{
                        xtype:'rulebuilder',
                        settingsCmp: this,
                        javaClass: "com.untangle.node.captive_portal.CaptureRuleMatcher",
                        dataIndex: "matchers",
                        matchers: this.getMatchers()
                    }]
                },{
                    xtype: 'fieldset',
                    title: this.i18n._('Perform the following action(s):'),
                    items: [{
                        xtype: "combo",
                        name: "actionType",
                        allowBlank: false,
                        dataIndex: "capture",
                        fieldLabel: this.i18n._("Action Type"),
                        editable: false,
                        store: [[true,i18n._('Capture')], [false,i18n._('Pass')]],
                        queryMode: 'local'
                    }]
                }]
            })]
        });
    },

    buildPassedHosts: function() {
        this.gridPassedClients = this.buildGridPassedList( "gridPassedClients",
            this.i18n._( "Pass Listed Client Addresses"),
            "passedClients",
            this.i18n._("Pass Listed Client Addresses is a list of Client IPs that are not subjected to the Captive Portal."));

        this.gridPassedServers = this.buildGridPassedList( "gridPassedServers",
            this.i18n._( "Pass Listed Server Addresses"),
            "passedServers",
            this.i18n._("Pass Listed Server Addresses is a list of Server IPs that unauthenticated clients can access without authentication."));

        this.panelPassedHosts = Ext.create('Ext.panel.Panel',{
            name: "panelPassedHosts",
            helpSource: "captive_portal_passed_hosts",
            title: this.i18n._("Passed Hosts"),
            layout: { type: 'vbox', align: 'stretch' },
            cls: "ung-panel",
            items: [{
                xtype: 'fieldset',
                title: this.i18n._('Passed Hosts'),
                flex: 0,
                html: this.i18n._("The pass lists provide a quick alternative way to allow access from specific clients, or to specific servers.")
            }, this.gridPassedClients, this.gridPassedServers ]
        });
    },

    buildGridPassedList: function( name, title, dataProperty , tooltip) {
        return Ext.create('Ung.grid.Panel', {
            flex: 1,
            margin: (name=='gridPassedServers')?'5 0 0 0': 0,
            title: this.i18n._(title),
            name: name,
            tooltip: tooltip,
            settingsCmp: this,
            hasEdit: false,
            columnsDefaultSortable: false,
            dataProperty: dataProperty,
            recordJavaClass: "com.untangle.node.captive_portal.PassedAddress",
            emptyRow: {
                "live": true,
                "log": false,
                "address": "0.0.0.0",
                "description": ""
            },
            fields: [{
                name: "id"
            },{
                name: "live"
            },{
                name: "log"
            },{
                name: "address",
                sortType: 'asIp'
            }, {
                name: "description"
            }],
            columns: [{
                xtype:'checkcolumn',
                header: this.i18n._("Enable"),
                dataIndex: "live",
                resizable: false,
                width:55
            }, {
                xtype:'checkcolumn',
                header: this.i18n._("Log"),
                dataIndex: "log",
                resizable: false,
                width:55
            }, {
                header: this.i18n._("Address"),
                width: 200,
                dataIndex: "address",
                editor:{
                    xtype:'textfield',
                    emptyText: this.i18n._("[enter address]"),
                    vtype: 'ipMatcher',
                    allowBlank: false
                }
            }, {
                header: this.i18n._("Description"),
                width: 400,
                flex:1,
                dataIndex: "description",
                editor: {
                    xtype:'textfield',
                    emptyText: this.i18n._("[no description]")
                }
            }]
        });
    },

    buildUserAuthentication: function() {
        var onUpdateAuthenticationType = Ext.bind(function( elem, checked ) {
            if ( checked ) {
                this.settings.authenticationType = elem.inputValue;
            }
        }, this);

        var onRenderAuthenticationType = Ext.bind(function( elem ) {
            elem.setValue(this.settings.authenticationType);
            elem.clearDirty();
        }, this);
        var directoryConnectorLicense;
        try {
            directoryConnectorLicense = Ung.Main.getLicenseManager().isLicenseValid("untangle-node-adconnector") || Ung.Main.getLicenseManager().isLicenseValid("untangle-node-directory-connector");
        } catch (e) {
            Ung.Util.rpcExHandler(e);
        }
        this.panelUserAuthentication = Ext.create('Ext.panel.Panel',{
            name: "panelUserAuthentication",
            helpSource: "captive_portal_user_authentication",
            title: this.i18n._("User Authentication"),
            autoScroll: true,
            border: false,
            cls: "ung-panel",
            items: [{
                xtype: "fieldset",
                title: this.i18n._( "User Authentication" ),
                items: [{
                    xtype: "radio",
                    boxLabel: this.i18n._("None"),
                    hideLabel: true,
                    name: "authenticationType",
                    inputValue: "NONE",
                    listeners: {
                        "change": onUpdateAuthenticationType,
                        "afterrender": onRenderAuthenticationType
                    }
                },{
                    xtype: "radio",
                    boxLabel: this.i18n._("Local Directory"),
                    hideLabel: true,
                    name: "authenticationType",
                    inputValue: "LOCAL_DIRECTORY",
                    listeners: {
                        "change": onUpdateAuthenticationType,
                        "afterrender": onRenderAuthenticationType
                    }
                },{
                    xtype: "button",
                    name: "configureLocalDirectory",
                    text: this.i18n._("Configure Local Directory"),
                    handler: Ext.bind(this.configureLocalDirectory, this )
                },{
                    xtype: "radio",
                    style: {marginTop: '15px'},
                    boxLabel: Ext.String.format( this.i18n._("RADIUS {0}(requires Directory Connector) {1}"),"<i>", "</i>" ),
                    hideLabel: true,
                    disabled: !directoryConnectorLicense,
                    name: "authenticationType",
                    inputValue: "RADIUS",
                    listeners: {
                        "change": onUpdateAuthenticationType,
                        "afterrender": onRenderAuthenticationType
                    }
                },{
                    xtype: "button",
                    disabled: !directoryConnectorLicense,
                    name: "configureRadiusServer",
                    text: this.i18n._("Configure RADIUS"),
                    handler: Ext.bind(this.configureRadius, this )
                },{
                    xtype: "radio",
                    style: {marginTop: '15px'},
                    boxLabel: Ext.String.format( this.i18n._("Active Directory {0}(requires Directory Connector) {1}"),"<i>", "</i>" ),
                    hideLabel: true,
                    disabled: !directoryConnectorLicense,
                    name: "authenticationType",
                    inputValue: "ACTIVE_DIRECTORY",
                    listeners: {
                        "change": onUpdateAuthenticationType,
                        "afterrender": onRenderAuthenticationType
                    }
                },{
                    xtype: "button",
                    disabled: !directoryConnectorLicense,
                    name: "configureActiveDirectory",
                    text: this.i18n._("Configure Active Directory"),
                    handler: Ext.bind(this.configureActiveDirectory, this )
                }]
            },{
                xtype: "fieldset",
                title: this.i18n._( "Session Settings" ),
                items: [{
                    xtype: 'container',
                    layout: 'column',
                    margin: '0 0 5 0',
                    items: [{
                        xtype: "numberfield",
                        allowBlank: false,
                        name: "idleTimeout",
                        minValue: 0,
                        hideTrigger:true,
                        invalidText: this.i18n._( "The Idle Timeout must be 0 or greater." ),
                        fieldLabel: this.i18n._( "Idle Timeout (minutes)" ),
                        labelWidth: 150,
                        width: 250,
                        value: this.settings.idleTimeout / 60,
                        listeners: {
                            "change": Ext.bind(function( elem, newValue ) {
                                this.settings.idleTimeout = newValue * 60;
                            }, this)
                        }
                    },{
                        xtype: 'label',
                        html: this.i18n._( "Clients will be unauthenticated after this amount of idle time. They may re-authenticate immediately.  Use zero to disable." ),
                        cls: 'boxlabel'
                    }]
                },{
                    xtype: 'container',
                    layout: 'column',
                    margin: '0 0 5 0',
                    items: [{
                        xtype: "numberfield",
                        allowBlank: false,
                        name: "userTimeout",
                        maxValue: 525600,
                        minValue: 5,
                        hideTrigger:true,
                        fieldLabel: this.i18n._( "Timeout (minutes)" ),
                        labelWidth: 150,
                        width: 250,
                        invalidText: this.i18n._( "The Timeout must be more than 5 minutes and less than 525600 minutes." ),
                        value: this.settings.userTimeout / 60,
                        listeners: {
                            "change": Ext.bind(function( elem, newValue ) {
                                this.settings.userTimeout = newValue * 60;
                            }, this)
                        }
                    },{
                        xtype: 'label',
                        html: this.i18n._( "Clients will be unauthenticated after this amount of time regardless of activity. They may re-authenticate immediately." ),
                        cls: 'boxlabel'
                    }]
                },{
                    xtype: "checkbox",
                    boxLabel: this.i18n._("Allow Concurrent Logins"),
                    tooltip: this.i18n._("This will allow multiple hosts to use the same username & password concurrently."),
                    hideLabel: true,
                    checked: this.settings.concurrentLoginsEnabled,
                    listeners: {
                        "change": Ext.bind(function(elem, checked) {
                            this.settings.concurrentLoginsEnabled = checked;
                        }, this)
                    }
                },{
                    xtype: "checkbox",
                    boxLabel: this.i18n._("Allow Cookie-based authentication"),
                    tooltip: this.i18n._("This will allow authenicated clients to continue to access even after session idle and timeout values."),
                    hideLabel: true,
                    checked: this.settings.sessionCookiesEnabled,
                    listeners: {
                        "change": Ext.bind(function(elem, checked) {
                            this.settings.sessionCookiesEnabled = checked;
                        }, this)
                    }
                },{
                    xtype: 'container',
                    layout: 'column',
                    margin: '0 0 5 0',
                    items: [{
                        xtype: "numberfield",
                        allowBlank: false,
                        name: "sessionCookiesTimeout",
                        maxValue: 525600,
                        minValue: 5,
                        hideTrigger:true,
                        fieldLabel: this.i18n._( "Cookie Timeout (minutes)" ),
                        labelWidth: 150,
                        width: 250,
                        invalidText: this.i18n._( "The Cookie Timeout must be more than 5 minutes and less than 525600 minutes." ),
                        value: this.settings.sessionCookiesTimeout / 60,
                        listeners: {
                            "change": Ext.bind(function( elem, newValue ) {
                                this.settings.sessionCookiesTimeout = newValue * 60;
                            }, this)
                        }
                    },{
                        xtype: 'label',
                        name: "sessionCookiesTimeoutLabel",
                        html: this.i18n._( "Clients will be unauthenticated after this amount of time regardless of activity. They may re-authenticate immediately." ),
                        cls: 'boxlabel'
                    }]
                }]
            }]
        });
    },
    captivePageHideComponents: function( currentValue ) {
        var values = [ "BASIC_LOGIN", "BASIC_MESSAGE", "CUSTOM" ];
        for ( var c = 0 ; c < values.length ; c++ ) {
            var item = values[c];
            Ext.each( this.panelCaptivePage.query('[pageType=' + item+']'), Ext.bind(function( component ) {
                if ( component.isVisible ) {
                    component.setVisible( currentValue == item );
                } else {
                    component.setVisible( currentValue == item );
                }
            }, this));

            Ext.each( this.panelCaptivePage.query('[optionType=CERT_DETECTION]'), Ext.bind(function( component ) {
                if ( currentValue == "CUSTOM" ) {
                    component.setVisible( false );
                } else {
                    component.setVisible( true );
                }
            }, this));
        }
    },
    buildCaptivePage: function() {
        var onUpdatePageType = Ext.bind(function( elem, checked ) {
            if ( checked ) {
                this.settings.pageType = elem.inputValue;
                this.captivePageHideComponents( elem.inputValue );
            }
        }, this);

        var onUpdateCertificateDetection = Ext.bind(function( elem, checked ) {
            if (checked ) {
                this.settings.certificateDetection = elem.inputValue;
            }
        }, this);

        this.panelCaptivePage = Ext.create('Ext.panel.Panel',{
            name: "panelCaptivePage",
            helpSource: "captive_portal_captive_page",
            title: this.i18n._("Captive Page"),
            autoScroll: true,
            border: false,
            cls: "ung-panel",
            listeners: {
                "afterrender": Ext.bind(function () {
                    this.panelCaptivePage.down('radio[name="pageType"]').setValue(this.settings.pageType);
                    this.panelCaptivePage.down('radio[name="certificateDetection"]').setValue(this.settings.certificateDetection);
                    this.captivePageHideComponents(this.settings.pageType );
                    Ung.Util.clearDirty(this.panelCaptivePage);
                }, this)
            },
            items: [{
                xtype: "fieldset",
                title: this.i18n._( "Captive Page" ),
                items: [{
                    xtype: "radio",
                    boxLabel: this.i18n._("Basic Message"),
                    hideLabel: true,
                    name: "pageType",
                    inputValue: "BASIC_MESSAGE",
                    listeners: {
                        "change": onUpdatePageType
                    }
                },{
                    xtype: "radio",
                    boxLabel: this.i18n._("Basic Login"),
                    hideLabel: true,
                    name: "pageType",
                    inputValue: "BASIC_LOGIN",
                    listeners: {
                        "change": onUpdatePageType
                    }
                },{
                    xtype: "radio",
                    boxLabel: this.i18n._("Custom"),
                    hideLabel: true,
                    name: "pageType",
                    inputValue: "CUSTOM",
                    listeners: {
                        "change": onUpdatePageType
                    }
                },{
                    xtype: "fieldset",
                    autoScroll: false,
                    title: this.i18n._( "Captive Portal Page Configuration" ),
                    items: [{
                        xtype: "textfield",
                        allowBlank: false,
                        name: "basicLoginPageTitle",
                        fieldLabel: this.i18n._("Page Title"),
                        pageType: "BASIC_LOGIN",
                        value: this.settings.basicLoginPageTitle,
                        listeners: {
                            "change": Ext.bind(function( elem, newValue ) {
                                this.settings.basicLoginPageTitle = newValue;
                            }, this)
                        }
                    },{
                        xtype: "textfield",
                        allowBlank: false,
                        name: "basicLoginPageWelcome",
                        fieldLabel: this.i18n._("Welcome Text"),
                        width: 400,
                        pageType: "BASIC_LOGIN",
                        value: this.settings.basicLoginPageWelcome,
                        listeners: {
                            "change": Ext.bind(function( elem, newValue ) {
                                this.settings.basicLoginPageWelcome = newValue;
                            }, this)
                        }
                    },{
                        xtype: "textfield",
                        allowBlank: false,
                        name: "basicLoginUsername",
                        fieldLabel: this.i18n._("Username Text"),
                        pageType: "BASIC_LOGIN",
                        value: this.settings.basicLoginUsername,
                        listeners: {
                            "change": Ext.bind(function( elem, newValue ) {
                                this.settings.basicLoginUsername = newValue;
                            }, this)
                        }
                    },{
                        xtype: "textfield",
                        allowBlank: false,
                        name: "basicLoginPassword",
                        fieldLabel: this.i18n._("Password Text"),
                        pageType: "BASIC_LOGIN",
                        value: this.settings.basicLoginPassword,
                        listeners: {
                            "change": Ext.bind(function( elem, newValue ) {
                                this.settings.basicLoginPassword = newValue;
                            }, this)
                        }
                    },{
                        xtype: "textarea",
                        allowBlank: true,
                        name: "basicLoginMessageText",
                        width: 600,
                        height: 200,
                        fieldLabel: this.i18n._("Message Text"),
                        pageType: "BASIC_LOGIN",
                        value: this.settings.basicLoginMessageText,
                        listeners: {
                            "change": Ext.bind(function( elem, newValue ) {
                                this.settings.basicLoginMessageText = newValue;
                            }, this)
                        }
                    },{
                        xtype: "textfield",
                        allowBlank: false,
                        name: "basicLoginFooter",
                        fieldLabel: this.i18n._("Lower Text"),
                        width: 600,
                        pageType: "BASIC_LOGIN",
                        value: this.settings.basicLoginFooter,
                        listeners: {
                            "change": Ext.bind(function( elem, newValue ) {
                                this.settings.basicLoginFooter = newValue;
                            }, this)
                        }
                    },{
                        xtype: "textfield",
                        allowBlank: false,
                        name: "basicMessagePageTitle",
                        fieldLabel: this.i18n._("Page Title"),
                        pageType: "BASIC_MESSAGE",
                        width: 400,
                        value: this.settings.basicMessagePageTitle,
                        listeners: {
                            "change": Ext.bind(function( elem, newValue ) {
                                this.settings.basicMessagePageTitle = newValue;
                            }, this)
                        }
                    },{
                        xtype: "textfield",
                        allowBlank: false,
                        name: "basicMessagePageWelcome",
                        fieldLabel: this.i18n._("Welcome Text"),
                        width: 400,
                        pageType: "BASIC_MESSAGE",
                        value: this.settings.basicMessagePageWelcome,
                        listeners: {
                            "change": Ext.bind(function( elem, newValue ) {
                                this.settings.basicMessagePageWelcome = newValue;
                            }, this)
                        }
                    },{
                        xtype: "textarea",
                        allowBlank: false,
                        name: "basicMessageMessageText",
                        width: 400,
                        height: 250,
                        fieldLabel: this.i18n._("Message Text"),
                        pageType: "BASIC_MESSAGE",
                        value: this.settings.basicMessageMessageText,
                        listeners: {
                            "change": Ext.bind(function( elem, newValue ) {
                                this.settings.basicMessageMessageText = newValue;
                            }, this)
                        }
                    },{
                        xtype: "checkbox",
                        allowBlank: false,
                        name: "basicMessageAgreeBox",
                        fieldLabel: this.i18n._("Agree Checkbox"),
                        pageType: "BASIC_MESSAGE",
                        checked: this.settings.basicMessageAgreeBox,
                        listeners: {
                            "change": Ext.bind(function(elem, checked) {
                                this.settings.basicMessageAgreeBox = checked;
                            }, this)
                        }
                    },{
                        xtype: "textfield",
                        allowBlank: false,
                        name: "basicMessageAgreeText",
                        fieldLabel: this.i18n._("Agree Text"),
                        width: 400,
                        pageType: "BASIC_MESSAGE",
                        value: this.settings.basicMessageAgreeText,
                        listeners: {
                            "change": Ext.bind(function( elem, newValue ) {
                                this.settings.basicMessageAgreeText = newValue;
                            }, this)
                        }
                    },{
                        xtype: "textfield",
                        allowBlank: false,
                        name: "basicMessageFooter",
                        fieldLabel: this.i18n._("Lower Text"),
                        width: 400,
                        pageType: "BASIC_MESSAGE",
                        value: this.settings.basicMessageFooter,
                        listeners: {
                            "change": Ext.bind(function( elem, newValue ) {
                                this.settings.basicMessageFooter = newValue;
                            }, this)
                        }
                    },{
                        xtype: "form",
                        bodyStyle: "padding:0px 0px 10px 25px",
                        pageType: "CUSTOM",
                        name: "upload_form",
                        url: "/capture/handler.py/custom_upload",
                        border: false,
                        items: [{
                            xtype: 'fileuploadfield',
                            name: "upload_file",
                            allowBlank:false,
                            width: 500
                        },{
                            xtype: 'hidden',
                            name: 'appid',
                            value: this.nodeId
                        },{
                            xtype: "button",
                            name: "upload",
                            text: i18n._("Upload Custom File"),
                            handler: Ext.bind(this.onUploadCustomFile, this)
                        }]
                    },{
                        xtype: "form",
                        bodyPadding: "10px 0px 0px 25px",
                        pageType: "CUSTOM",
                        name: "remove_form",
                        url: "/capture/handler.py/custom_remove",
                        border: false,
                        items: [{
                            xtype: "label",
                            forId: "custom_file",
                            text: "Active Custom File"
                        },{
                            xtype: 'textfield',
                            readOnly: true,
                            name: "custom_file",
                            value: this.settings.customFilename,
                            width: 500
                        },{
                            xtype: 'hidden',
                            name: 'appid',
                            value: this.nodeId
                        },{
                            xtype: "button",
                            name: "remove",
                            text: i18n._("Remove Custom File"),
                            handler: Ext.bind(this.onRemoveCustomFile, this)
                        }]
                    }]
                },{
                    xtype: "fieldset",
                    title: this.i18n._( "HTTPS/SSL Root Certificate Detection" ),
                    optionType: "CERT_DETECTION",
                    items: [{
                        xtype: "radio",
                        boxLabel: this.i18n._("Disable certificate detection."),
                        hideLabel: true,
                        name: "certificateDetection",
                        inputValue: "DISABLE_DETECTION",
                        listeners: {
                            "change": onUpdateCertificateDetection
                        }
                    },{
                        xtype: "radio",
                        boxLabel: this.i18n._("Check certificate. Show warning when not detected."),
                        hideLabel: true,
                        name: "certificateDetection",
                        inputValue: "CHECK_CERTIFICATE",
                        listeners: {
                            "change": onUpdateCertificateDetection
                        }
                    },{
                        xtype: "radio",
                        boxLabel: this.i18n._("Require certificate. Prohibit login when not detected."),
                        hideLabel: true,
                        name: "certificateDetection",
                        inputValue: "REQUIRE_CERTIFICATE",
                        listeners: {
                            "change": onUpdateCertificateDetection
                        }
                    }]
                },{
                    xtype: "button",
                    name: "viewPage",
                    text: i18n._("Preview Captive Portal Page"),
                    handler: Ext.bind(function() {
                        var nodeCmp = Ung.Node.getCmp(this.nodeId);
                        if ( !nodeCmp.isRunning() ) {
                            Ext.MessageBox.alert(this.i18n._("Captive Portal is Disabled"),
                                    this.i18n._("You must turn on the Captive Portal to preview the Captive Page." ));
                            return;
                        }

                        if ( this.isDirty()) {
                            Ext.MessageBox.alert(this.i18n._("Unsaved Changes"),
                                    this.i18n._("You must save your settings before previewing the page." ));
                            return;
                        }
                        window.open("/capture/handler.py/index?appid=" + this.nodeId , "_blank");
                    }, this)
                }]
            },{
                xtype: "fieldset",
                title: this.i18n._( "Session Redirect" ),
                items: [{
                    xtype: "checkbox",
                    boxLabel: this.i18n._("Always use HTTPS for the capture page redirect"),
                    hideLabel: true,
                    checked: this.settings.alwaysUseSecureCapture,
                    listeners: {
                        "change": Ext.bind(function(elem, checked) {
                            this.settings.alwaysUseSecureCapture = checked;
                        }, this)
                    }
                },{
                    xtype: "textfield",
                    name: "redirectUrl",
                    width: 600,
                    fieldLabel: this.i18n._("Redirect URL"),
                    value: this.settings.redirectUrl,
                    listeners: {
                        "change": Ext.bind(function( elem, newValue ) {
                            useValue = newValue;
                            if ((newValue.length > 0) && (newValue.indexOf("http://") != 0) && (newValue.indexOf("https://") != 0)) useValue = ("http://" + newValue);
                            this.settings.redirectUrl = useValue;
                        }, this)
                    }
                },{
                    xtype: 'component',
                    margin:'10 0 0 0',
                    html: this.i18n._('<B>NOTE:</B> The Redirect URL field must start with http:// or https:// and allows you to specify a page to display immediately after user authentication.  If you leave this field blank, users will instead be forwarded to their original destination.')
                }]
            }]
        });
    },

    onUploadCustomFile: function() {
        var form = this.panelCaptivePage.down('form[name="upload_form"]').getForm();
        if (form.isValid() === false) {
            Ext.MessageBox.show({
                title: this.i18n._("Missing Filename"),
                msg: this.i18n._("Click the Browse button to select a custom file to upload"),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return;
        }
        form.submit({
            waitMsg: this.i18n._("Please wait while uploading your custom captive portal page..."),
            success: Ext.bind(this.uploadCustomFileSuccess, this ),
            failure: Ext.bind(this.uploadCustomFileFailure, this )
        });
    },

    uploadCustomFileSuccess: function(origin,reply) {
        this.settings.customFilename = reply.result.filename;
        var worker = this.panelCaptivePage.down('textfield[name="custom_file"]');
        worker.setValue(reply.result.filename);
        Ext.Msg.show({
            title: this.i18n._("Custom Page Upload Success"),
            msg: this.i18n._(reply.result.msg),
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO
        });
    },

    uploadCustomFileFailure: function(origin,reply) {
        Ext.MessageBox.show({
            title: this.i18n._("Custom Page Upload Failure"),
            msg: this.i18n._(reply.result.msg),
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    },

    onRemoveCustomFile: function() {
        var form = this.panelCaptivePage.down('form[name="remove_form"]').getForm();
        form.submit({
            waitMsg: this.i18n._("Please wait while the previous custom file is removed..."),
            success: Ext.bind(this.removeCustomFileSuccess, this ),
            failure: Ext.bind(this.removeCustomFileFailure, this )
        });
    },

    removeCustomFileSuccess: function(origin,reply) {
        this.settings.customFilename = "";
        var worker = this.panelCaptivePage.down('textfield[name="custom_file"]');
        worker.setValue("");
        Ext.MessageBox.show({
            title: this.i18n._("Custom Page Remove Success"),
            msg: this.i18n._(reply.result.msg),
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO
        });
    },

    removeCustomFileFailure: function(origin,reply) {
        Ext.MessageBox.show({
            title: this.i18n._("Custom Page Remove Failure"),
            msg: this.i18n._(reply.result.msg),
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    },

    beforeSave: function(isApply, handler) {
        if ( this.gridCaptureRules.isDirty() ) {
            this.settings.captureRules.list = this.gridCaptureRules.getList();
        }
        if ( this.gridPassedClients.isDirty() ) {
            this.settings.passedClients.list = this.gridPassedClients.getList();
        }
        if ( this.gridPassedServers.isDirty() ) {
            this.settings.passedServers.list = this.gridPassedServers.getList();
        }
        handler.call(this, isApply);
    },

    validate: function() {
        // Iterate all of the fields checking if they are valid
        if ( !this.down('numberfield[name="idleTimeout"]').isValid() ||
             !this.down('numberfield[name="userTimeout"]').isValid()) {
            Ext.MessageBox.alert(this.i18n._("Warning"),
                this.i18n._("Please correct any highlighted fields."),
                Ext.bind(function () {
                    this.tabs.setActiveTab(this.panelUserAuthentication);
                }, this)
            );
            return false;
        }
        if ( this.settings.pageType == "BASIC_MESSAGE" ) {
            if (this.settings.authenticationType != "NONE" ) {
                Ext.MessageBox.alert(this.i18n._("Warning"),
                    this.i18n._("When using Basic Message, Authentication must be set to None."),
                    Ext.bind(function () {
                        this.tabs.setActiveTab(this.panelUserAuthentication);
                    }, this));
                return false;
            }
            if ( !this.settings.concurrentLoginsEnabled ) {
                Ext.MessageBox.alert(this.i18n._("Warning"),
                    this.i18n._("When using Basic Message, Allow Concurrent Logins must be enabled."),
                    Ext.bind(function () {
                        this.tabs.setActiveTab(this.panelUserAuthentication);
                    }, this));
                return false;
            }
        }
        if ( this.settings.pageType == "BASIC_LOGIN" ) {
            if (this.settings.authenticationType == "NONE" ) {
                Ext.MessageBox.alert(this.i18n._("Warning"),
                    this.i18n._("When using Basic Login, Authentication cannot be set to None."),
                    Ext.bind(function () {
                        this.tabs.setActiveTab(this.panelUserAuthentication);
                    }, this));
                return false;
            }
        }

        // update the redirect URL field in case we automatically pre-pended the method for them
        this.panelCaptivePage.down('textfield[name="redirectUrl"]').setValue(this.settings.redirectUrl);
        return true;
    },
    configureLocalDirectory: function() {
        Ung.Main.openConfig(Ung.Main.configMap["localDirectory"]);
    },
    // There is no way to select the radius tab because we don't get a callback once the settings are loaded.
    configureRadius: function() {
        var node = Ung.Main.getNode("untangle-node-directory-connector");
        if (node != null) {
            var nodeCmp = Ung.Node.getCmp(node.nodeId);
            if (nodeCmp != null) {
                nodeCmp.loadSettings();
            }
        }
    },
    configureActiveDirectory: function() {
        var node = Ung.Main.getNode("untangle-node-directory-connector");
        if (node != null) {
            var nodeCmp = Ung.Node.getCmp(node.nodeId);
            if (nodeCmp != null) {
                nodeCmp.loadSettings();
            }
        }
    }
});
//# sourceURL=captive-portal-settings.js
