Ext.define('Ung.apps.intrusionprevention.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.app-intrusion-prevention',

    control: {
        '#': {
            afterrender: 'getSettings',
        },
    },

    getSettings: function () {
        var me = this, v = this.getView(), vm = this.getViewModel();
        v.setLoading(true);

        v.appManager.getLastUpdateCheck(function (result, ex) {
            if (ex) {
                Util.handleException(ex);
                return;
            }
            var lastUpdateCheck = result;
            vm.set('lastUpdateCheck', (lastUpdateCheck !== null && lastUpdateCheck.time !== 0 ) ? Util.timestampFormat(lastUpdateCheck) : "Never".t() );

            v.appManager.getLastUpdate(function (result, ex) {
                if (ex) {
                    Util.handleException(ex);
                    return;
                }
                var lastUpdate = result;
                vm.set('lastUpdate', ( lastUpdateCheck != null && lastUpdateCheck.time !== 0 && lastUpdate !== null && lastUpdate.time !== 0 ) ? Util.timestampFormat(lastUpdate) : "Never".t() );
            });
        });

        vm.set('classtypes', Ext.create('Ext.data.ArrayStore', {
            fields: [ 'name', 'description', 'priority' ],
            sorters: [{
                property: 'name',
                direction: 'ASC'
            }],
            data: [
            [ "attempted-admin", "Attempted Administrator Privilege Gain".t(), "high"],
            [ "attempted-user", "Attempted User Privilege Gain".t(), "high" ],
            [ "inappropriate-content", "Inappropriate Content was Detected".t(), "high" ],
            [ "policy-violation", "Potential Corporate Privacy Violation".t(), "high" ],
            [ "shellcode-detect", "Executable code was detected".t(), "high" ],
            [ "successful-admin", "Successful Administrator Privilege Gain".t(), "high" ],
            [ "successful-user", "Successful User Privilege Gain".t(), "high" ],
            [ "trojan-activity", "A Network Trojan was detected".t(), "high" ],
            [ "unsuccessful-user", "Unsuccessful User Privilege Gain".t(), "high" ],
            [ "web-application-attack", "Web Application Attack".t(), "high" ],

            [ "attempted-dos", "Attempted Denial of Service".t(), "medium" ],
            [ "attempted-recon", "Attempted Information Leak".t(), "medium" ],
            [ "bad-unknown", "Potentially Bad Traffic".t(), "medium" ],
            [ "default-login-attempt", "Attempt to login by a default username and password".t(), "medium" ],
            [ "denial-of-service", "Detection of a Denial of Service Attack".t(), "medium" ],
            [ "misc-attack", "Misc Attack".t(), "medium" ],
            [ "non-standard-protocol", "Detection of a non-standard protocol or event".t(), "medium" ],
            [ "rpc-portmap-decode", "Decode of an RPC Query".t(), "medium" ],
            [ "successful-dos", "Denial of Service".t(), "medium" ],
            [ "successful-recon-largescale", "Large Scale Information Leak".t(), "medium" ],
            [ "successful-recon-limited", "Information Leak".t(), "medium" ],
            [ "suspicious-filename-detect", "A suspicious filename was detected".t(), "medium" ],
            [ "suspicious-login", "An attempted login using a suspicious username was detected".t(), "medium" ],
            [ "system-call-detect", "A system call was detected".t(), "medium" ],
            [ "unusual-client-port-connection", "A client was using an unusual port".t(), "medium" ],
            [ "web-application-activity", "Access to a potentially vulnerable web application".t(), "medium" ],

            [ "icmp-event", "Generic ICMP event".t(), "low" ],
            [ "misc-activity", "Misc activity".t(), "low" ],
            [ "network-scan", "Detection of a Network Scan".t(), "low" ],
            [ "not-suspicious", "Not Suspicious Traffic".t(), "low" ],
            [ "protocol-command-decode", "Generic Protocol Command Decode".t(), "low" ],
            [ "string-detect", "A suspicious string was detected".t(), "low" ],
            [ "unknown", "Unknown Traffic".t(), "low" ],

            [ "tcp-connection", "A TCP connection was detected".t(), "low" ]
            ]
        }));

        vm.set('categories', Ext.create('Ext.data.ArrayStore', {
            fields: [ 'name', 'description' ],
            sorters: [{
                property: 'name',
                direction: 'ASC'
            }],
            data: [
            ["app-detect", 'This category contains rules that look for, and control, the traffic of certain applications that generate network activity. This category will be used to control various aspects of how an application behaves.'.t() ],
            ["activex", 'These are designed to catch exploits in the ActiveX framework.'.t() ],
            ["attack-response", 'These are designed to catch the results of a successful attack. Things like \'id=root\', or error messages that indicate a compromise may have happened. Note: Trojan and virus post-infection activity is included generally in the VIRUS ruleset, not here.'.t() ],
            ["blacklist", 'This category contains URI, USER-AGENT, DNS, and IP address rules that have been determined to be indicators of malicious activity. These rules are based on activity from the Talos virus sandboxes, public list of malicious URLs, and other data sources.'.t() ],
            ["botcc", 'These are autogenerated from several sources of known and confirmed active Botnet and other Command and Control hosts. Updated daily, primary data source is Shadowserver.org.' .t() ],
            ["browser-chrome", 'This category contains detection for vulnerabilities present in the Chrome browser. (This is separate from the browser-webkit category, as Chrome has enough vulnerabilities to be broken out into it\'s own, and while it uses the Webkit rendering engine, there\'s a lot of other features to Chrome.)'.t() ],
            ["browser-firefox", 'This category contains detection for vulnerabilities present in the Firefox browser, or products that have the Gecko engine. (Thunderbird email client, etc)'.t() ],
            ["browser-ie", 'This category contains detection for vulnerabilities present in the Internet Explorer browser (Trident or Tasman engines)'.t() ],
            ["browser-webkit", 'This category contains detection of vulnerabilities present in the Webkit browser engine (aside from Chrome) this includes Apple\'s Safari, RIM\'s mobile browser, Nokia, KDE, Webkit itself, and Palm.'.t() ],
            ["browser-other", 'This category contains detection for vulnerabilities in other browsers not listed above.'.t() ],
            ["browser-plugins", 'This category contains detection for vulnerabilities in browsers that deal with plugins to the browser. (Example: Active-x)'.t() ],
            ["chat", 'These are designed to catch exploits from various chat applications.'.t() ],
            ["ciarmy", 'These are designed to catch exploits identified by Collective Intellegence Network Security.'.t() ],
            ["community", 'General community shared rules.'.t() ],
            ["compromised", 'Rules to block known hostile or compromised hosts.'.t() ],
            ["content-replace", 'This category contains any rule that utilizes the replace functionality inside of Snort.'.t() ],
            ["current-events", 'Rules identified by various alert agencies.'.t() ],
            ["data", 'Sensitive data such as credit cards, social security numbers, etc.'.t() ],
            ["decoder", 'Detect various TCP/UDP/IP level protocol anomolies that typically indicate exploit attempts.'.t() ],
            ["deleted", 'When a rule has been deprecated or replaced it is moved to this categories. Rules are never totally removed from the ruleset, they are moved here.'.t() ],
            ["dns", 'This category is for rules that may indicate the presence of the DNS protocol or vulnerabilities in the DNS protocol on the network.'.t() ],
            ["dos", 'Intended to catch inbound DOS activity, and outbound indications.'.t() ],
            ["drop", 'This is a daily updated list of the Spamhaus DROP (Don\'t Route or Peer) list. Primarily known professional spammers.'.t() ],
            ["dshield", 'Daily updated list of the DShield top attackers list.'.t() ],
            ["exploit", 'This is an older category which will be deprecated soon. This category looks for exploits against software in a generic form.'.t() ],
            ["exploit-kit", 'This category contains rules that are specifically tailored to detect exploit kit activity. This does not include post-compromise rules (as those would be in indicator-compromise). Files that are dropped as result of visiting an exploit kit would be in their respective file category.'.t() ],
            ["file-executable", 'This category contains rules for vulnerabilities that are found or are delivered through executable files, regardless of platform.'.t() ],
            ["file-flash", 'This category contains rules for vulnerabilities that are found or are delivered through flash files. Either compressed or uncompressed, regardless of delivery method platform being attacked.'.t() ],
            ["file-image", 'This category contains rules for vulnerabilities that are found inside of images files. Regardless of delivery method, software being attacked, or type of image. (Examples include: jpg, png, gif, bmp, etc)'.t() ],
            ["file-identify", 'This category is to identify files through file extension, the content in the file (file magic), or header found in the traffic. This information is usually used to then set a flowbit to be used in a different rule.'.t() ],
            ["file-multimedia", 'This category contains rules for vulnerabilities present inside of multimedia files (mp3, movies, wmv)'.t() ],
            ["file-office", 'This category contains rules for vulnerabilities present inside of files belonging to the Microsoft Office suite of software. (Excel, PowerPoint, Word, Visio, Access, Outlook, etc)'.t() ],
            ["file-pdf", 'This category contains rules for vulnerabilities found inside of PDF files. Regardless of method of creation, delivery method, or which piece of software the PDF affects (for example, both Adobe Reader and FoxIt Reader)'.t() ],
            ["file-other", 'This category contains rules for vulnerabilities present inside a file, that doesn\'t fit into the other categories above.'.t() ],
            ["ftp", 'This category is for rules that may indicate the presence of the ftp protocol or vulnerabilities in the ftp protocol on the network.'.t() ],
            ["games", 'This category is for rules that may indicate the presence of gaming protocols or vulnerabilities in the gaming protocols on the network.'.t() ],
            ["icmp", 'This category is for rules that may indicate the presence of icmp traffic or vulnerabilities in icmp on the network.'.t() ],
            ["icmp-info", 'Attempts to determine target hardware and software using typical ICMP behavior.'.t() ],
            ["imap", 'This category is for rules that may indicate the presence of the imap protocol or vulnerabilities in the imap protocol on the network.'.t() ],
            ["inappropriate", 'Porn, Kiddy porn, sites you shouldn\'t visit at work, etc. Warning: These are generally quite Regex heavy and thus high load and frequent false positives. Only run these if you\'re really interested.'.t() ],
            ["indicator-compromise", 'This category contains rules that are clearly to be used only for the detection of a positively compromised system, false positives may occur.'.t() ],
            ["indicator-obfuscation", 'This category contains rules that are clearly used only for the detection of obfuscated content. Like encoded JavaScript rules.'.t() ],
            ["indicator-shellcode", 'This category contains rules that are simply looking for simple identification markers of shellcode in traffic. This replaces the old shellcode.rules.'.t() ],
            ["info", 'Rules that attempt to send informaton to commonly known malware sites.'.t() ],
            ["malware-backdoor", 'This category contains rules for the detection of traffic destined to known listening backdoor command channels. If a piece of malicious soft are opens a port and waits for incoming commands for its control functions, this type of detection will be here. A simple example would be the detection for BackOrifice as it listens on a specific port and then executes the commands sent.'.t() ],
            ["malware-cnc", 'This category contains known malicious command and control activity for identified botnet traffic. This includes call home, downloading of dropped files, and ex-filtration of data. Actual commands issued from Master to Zombie type stuff will also be here.'.t() ],
            ["malware-tools", 'This category contains rules that deal with tools that can be considered malicious in nature. For example, LOIC.'.t() ],
            ["malware-other", 'This category contains rules that are malware related, but don\'t fit into one of the other malware categories.'.t() ],
            ["misc", 'Various, otherwise uncategorizable exploit attempts.'.t() ],
            ["mobile-malware", 'This category contains rules for the detection of traffic on mobile devices.'.t() ],
            ["netbios", 'This category is for rules that may indicate the presence of NetBIOS traffic or vulnerabilities in NetBIOS on the network.'.t() ],
            ["os-linux", 'This category contains rules that are looking for vulnerabilities in Linux based OSes. Not for browsers or any other software on it, but simply against the OS itself.'.t() ],
            ["os-solaris", 'This category contains rules that are looking for vulnerabilities in Solaris based OSes. Not for any browsers or any other software on top of the OS.'.t() ],
            ["os-windows", 'This category contains rules that are looking for vulnerabilities in Windows based OSes. Not for any browsers or any other software on top of the OS.'.t() ],
            ["os-other", 'This category contains rules that are looking for vulnerabilities in an OS that is not listed above.'.t() ],
            ["p2p", 'This category deals with pua or Potentially Unwanted Applications that deal with p2p.'.t() ],
            ["pop3", 'This category is for rules that may indicate the presence of the pop3 protocol or vulnerabilities in the pop3 protocol on the network.'.t() ],
            ["preprocessor_portscan", 'This category contains rules that are looking for vulnerabilities via portscans.'.t() ],
            ["policy-multimedia", 'This category contains rules that detect potential violations of policy for multimedia. Examples like the detection of the use of iTunes on the network. This is not for vulnerabilities found within multimedia files, as that would be in file-multimedia.'.t() ],
            ["policy-social", 'This category contains rules for the detection potential violations of policy on corporate networks for the use of social media. (p2p, chat, etc)'.t() ],
            ["policy-other", 'This category is for rules that may violate the end-users corporate policy bud do not fall into any of the other policy categories first.'.t() ],
            ["policy-spam", 'This category is for rules that may indicate the presence of spam on the network.'.t() ],
            ["protocol-finger", 'This category is for rules that may indicate the presence of the finger protocol or vulnerabilities in the finger protocol on the network.'.t() ],
            ["protocol-ftp", 'This category is for rules that may indicate the presence of the ftp protocol or vulnerabilities in the ftp protocol on the network.'.t() ],
            ["protocol-icmp", 'This category is for rules that may indicate the presence of icmp traffic or vulnerabilities in icmp on the network.'.t() ],
            ["protocol-imap", 'This category is for rules that may indicate the presence of the imap protocol or vulnerabilities in the imap protocol on the network.'.t() ],
            ["protocol-pop", 'This category is for rules that may indicate the presence of the pop protocol or vulnerabilities in the pop protocol on the network.'.t() ],
            ["protocol-services", 'This category is for rules that may indicate the presence of the rservices protocol or vulnerabilities in the rservices protocols on the network.'.t() ],
            ["protocol-voip", 'This category is for rules that may indicate the presence of voip services or vulnerabilities in the voip protocol on the network.'.t() ],
            ["pua-adware", 'This category deals with pua or Potentially Unwanted Applications that deal with adware or spyware.'.t() ],
            ["pua-p2p", 'This category deals with pua or Potentially Unwanted Applications that deal with p2p.'.t() ],
            ["pua-toolbars", 'This category deals with pua or Potentially Unwanted Applications that deal with toolbars installed on the client system. (Google Toolbar, Yahoo Toolbar, Hotbar, etc)'.t() ],
            ["pua-other", 'This category deals with pua or Potentially Unwanted Applications that don\'t fit into one of the categories shown above.'.t() ],
            ["rpc", 'Remote Proceudre Call exploits.'.t() ],
            ["scada", 'SCADA sourced exploits.'.t() ],
            ["scan", 'Scanning exploits.'.t() ],
            ["server-apache", 'This category deals with vulnerabilities in or attacks against the Apache Web Server.'.t() ],
            ["server-iis", 'This category deals with vulnerabilities in or attacks against the Microsoft IIS Web server.'.t() ],
            ["server-mssql", 'This category deals with vulnerabilities in or attacks against the Microsoft SQL Server.'.t() ],
            ["server-mysql", 'This category deals with vulnerabilities in or attacks against Oracle\'s MySQL server.'.t() ],
            ["server-oracle", 'This category deals with vulnerabilities in or attacks against Oracle\'s Oracle DB Server.'.t() ],
            ["server-webapp", 'This category deals with vulnerabilities in or attacks against Web based applications on servers.'.t() ],
            ["server-mail", 'This category contains rules that detect vulnerabilities in mail servers. (Exchange, Courier). These are separate from the protocol categories, as those deal with the traffic going to the mail servers itself.'.t() ],
            ["server-other", 'This category contains rules that detect vulnerabilities in or attacks against servers that are not detailed in the above list.'.t() ],
            ["shellcode", 'Exploits that attempt to excute shell commands on various operating systems.'.t() ],
            ["smtp", 'This category is for rules that may indicate the presence of the SMTP protocol or vulnerabilities in the SMTP protocol on the network.'.t() ],
            ["snmp", 'This category is for rules that may indicate the presence of the SNMP protocol or vulnerabilities in the SNMP protocol on the network.'.t() ],
            ["sql", 'SQL exploits.'.t() ],
            ["tftp", 'This category is for rules that may indicate the presence of the TFTP protocol or vulnerabilities in the TFTP protocol on the network.'.t() ],
            ["tor", 'TOR exploits.'.t() ],
            ["trojan", 'Trojan Horse exploits.'.t() ],
            ["user-agents", 'This category deals with vulnerabilities in or attacks against common application clients.'.t() ],
            ["voip", 'This category deals with vulnerabilities in or attacks against Voice Over IP applications.'.t() ],
            ["web-client", 'This category deals with vulnerabilities in or attacks against Web clients.'.t() ],
            ["web-server", 'This category deals with vulnerabilities in or attacks against Web servers.'.t() ],
            ["web-specific-apps", 'This category deals with vulnerabilities in or attacks against Web based applications on servers.'.t() ],
            ["worm", 'Worm exploits.'.t() ],
            ]
        }));

        Ext.Ajax.request({
            url: "/admin/download",
            method: 'POST',
            params: {
                type: "IntrusionPreventionSettings",
                arg1: "load",
                arg2: v.appManager.getAppSettings().id
            },
            scope: v.appManager,
            timeout: 600000,
            success: function(response){
                vm.set('settings', Ext.decode( response.responseText ) );
                vm.set('profileStoreLoad', true);
                vm.set('rulesStoreLoad', true);
                vm.set('variablesStoreLoad', true);
                v.getController().updateStatus();
                v.setLoading(false);
            },
            failure: function(response){
                vm.set('settings', null );
                v.setLoading(false);
                console.log("Failed load");
            }
        });
        Ext.Ajax.request({
            url: "/admin/download",
            method: 'POST',
            params: {
                type: "IntrusionPreventionSettings",
                arg1: "wizard",
                arg2: v.appManager.getAppSettings().id
            },
            scope: this,
            timeout: 600000,
            success: function(response){
                vm.set('wizardDefaults', Ext.decode( response.responseText ));
            },
            failure: function(response){
                Ext.MessageBox.alert( "Setup Wizard Error".t(), "Unable to obtain default settings.  Please run the Setup Wizard again.".t(), Ext.bind(function () {
                    Ext.MessageBox.hide();
                }, this));
            }
        });

    },

    getChangedDataRecords: function(target){
        var me = this, v = this.getView(), vm = this.getViewModel();
        var changed = {};
        v.query('app-intrusion-prevention-' + target).forEach(function(grid){
            var store = grid.getStore();
            store.getModifiedRecords().forEach( function(record){
                var data = {
                    op: 'modified',
                    recData: record.data
                };
                if(record.get('markedForDelete')){
                    data.op = 'deleted';
                }else if(record.get('markedForNew')){
                    data.op = 'added';
                }
                changed[record.get('_id')] = data;
            });
            store.commitChanges();
        });

        return changed;
    },

    getChangedData: function(){
        var me = this, v = this.getView(), vm = this.getViewModel();

        var settings = vm.get('settings');
        var changedDataSet = {};
        var keys = Object.keys(settings);
        for( var i = 0; i < keys.length; i++){
            if( ( keys[i] == "rules" ) ||
                ( keys[i] == "variables" ) ||
                ( keys[i] == "profileId" ) ||
                ( keys[i] == "activeGroups") ){
                continue;
            }
            changedDataSet[keys[i]] = settings[keys[i]];
        }

        changedDataSet.rules = me.getChangedDataRecords('rules');
        changedDataSet.variables = me.getChangedDataRecords('variables');

        return changedDataSet;
    },

    setSettings: function (overrideChangedData) {
        var me = this, v = this.getView(), vm = this.getViewModel();

        if (!Util.validateForms(v)) {
            return;
        }

        v.setLoading(true);

        var changedData = me.getChangedData();
        if(arguments.length == 1){
            if(overrideChangedData){
                changedData= overrideChangedData;
            }
        }

        Ext.Ajax.request({
            url: "/admin/download",
            jsonData: changedData,
            method: 'POST',
            params: {
                type: "IntrusionPreventionSettings",
                arg1: "save",
                arg2: v.appManager.getAppSettings().id
            },
            scope: this,
            timeout: 600000,
            success: function(response){
                var r = Ext.decode( response.responseText );
                vm.set('profileStoreLoad', true);
                vm.set('rulesStoreLoad', true);
                vm.set('variablesStoreLoad', true);
                if( !r.success) {
                    Ext.MessageBox.alert("Error".t(), "Unable to save settings".t());
                } else {
                    rpc.appManager.app('intrusion-prevention').reconfigure(Ext.bind(function(result, exception) {
                        if (exception) {
                            Util.handleException(ex);
                            return;
                        }

                        v.setLoading(false);
                        me.getSettings();
                        Util.successToast('Settings saved...');
                        Ext.fireEvent('resetfields', v);
                    }, this));
                }
            },
            failure: function(response){
                Ext.MessageBox.alert("Error".t(), "Unable to save settings".t());
                v.setLoading(false);
                Util.successToast('Unable to save settings...');
            }
        });
    },

    regexRuleVariable :  /^\$([A-Za-z0-9\_]+)/,
    regexRule: /^([#]+|)(alert|log|pass|activate|dynamic|drop|sdrop|reject)\s+(tcp|udp|icmp|ip)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+\((.+)\)$/,
    isVariableUsed: function(variable) {
        var me = this, v = this.getView(), vm = this.getViewModel();

        if(Ext.isEmpty(variable)) {
            return false;
        }

        var rule, originalId, ruleMatches, variableMatches, j, internalId, d;
        var isUsed = false;
        vm.get('rules').each(function(record){
            var ruleMatches = me.regexRule.exec( record.get('rule') );
            if( ruleMatches ) {
                for( j = 1; j < ruleMatches.length; j++ ) {
                    variableMatches = me.regexRuleVariable.exec( ruleMatches[j] );
                    if( variableMatches && variableMatches.shift().indexOf(variable)!= -1) {
                        isUsed = true;
                        return false;
                    }
                }
            }

        });
        return isUsed;
    },

    runWizard: function (btn) {
        this.wizard = this.getView().add({
            xtype: 'app-intrusion-prevention-wizard',
            appManager: this.getView().appManager
        });
        this.wizard.show();
    },

    storeDataChanged: function( store ){
        /*
         * Inexplicably, extjs does not see 'inline' data loads as "proper" store
         * reloads so it will never fire the 'load' event which logically sounds
         * like the correct event to listen to.
         *
         * The problem occurs on saves where data is "reloaded" but seen in
         * the store as a wholesale change.  Which is ridiculous and on the next
         * save in the same session, causes to see all records as modified
         * and therefore, send send ALL data back.
         *
         * To get around this, we have the inline loader routines set the
         * 'storeId'Load variable and if we see it here, cause all of those changes
         * to be "commited" since nothing has changed.
         *
         * Thanks, ExtJs.
         *
         */
        var vm = this.getViewModel();
        var storeId = store.getStoreId();
        if(vm.get( storeId + 'Load') == true){
            store.commitChanges();
            vm.set( storeId + 'Load', false);
        }
    },

    /*
     * Update bind variables for the Setup Wizard display on status screen.
     * On first blush we could do these as formulas but the code is basically the
     * same and would be duplicated.  So we do it here after the data has been
     * loaded.
     */
    updateStatus: function(){
        var me = this, vm = me.getViewModel();
        var activeGroups = vm.get('settings.activeGroups');
        var profileId= vm.get('settings.profileId');

        var types = ['classtypes', 'categories'];
        types.forEach(function(type){
            var current = activeGroups[type];
            var profile = {};

            var rawSelected = null;
            if(current === 'custom'){
                rawSelected = Ext.clone(activeGroups[type+'Selected']);
            }else{
                vm.get('wizardDefaults').profiles.forEach(function(wizardProfile){
                    if(wizardProfile.profileId === profileId){
                        rawSelected = Ext.clone( wizardProfile.activeGroups[type+'Selected'] );
                    }
                });
            }

            var selected = [];
            rawSelected.forEach(function(item){
                if(item[0] === '-'){
                    return;
                }
                if(item[0] === '+'){
                    item = item.substring(1);
                }
                selected.push(item);
            });
            profile.selected = selected;

            if(current === 'custom'){
                profile.value = 'Custom'.t() + Ext.String.format( ': {0}', selected.join(', ') );
            }else{
                profile.value = 'Recommended'.t();
            }
            profile.tip = selected.join(', ');
            vm.set(type+'Profile', profile);
        });
    },

    /**
     * ExtJs does not seem to allow tooltip binding, so to get around this, create
     * model variable with 'value' and 'tip' keys and when the value changes,
     * look at the bind parent value for that object and set the tooltip.
     */
    bindChange: function(cmp){
        cmp.getEl().set({
            'data-qtip': cmp.bind.value.stub.parentValue.tip
        });
    }

});

Ext.define('Ung.apps.intrusionprevention.cmp.RulesRecordEditor', {
    extend: 'Ung.cmp.RecordEditor',
    xtype: 'ung.cmp.unintrusionrulesrecordeditor',

    controller: 'unintrusionrulesrecordeditorcontroller',
});

Ext.define('Ung.apps.intrusionprevention.cmp.RulesRecordEditorController', {
    extend: 'Ung.cmp.RecordEditorController',
    alias: 'controller.unintrusionrulesrecordeditorcontroller',

    editorClasstypeChange: function( me, newValue, oldValue, eOpts ){
        var vm = this.getViewModel();
        if( newValue == null || vm.get('classtypes').findExact('name', newValue) == null ){
            me.setValidation("Unknown classtype".t());
            return false;
        }
        me.setValidation(true);

        this.getView().up('grid').getController().updateRule( this.getViewModel().get('record'), 'classtype', newValue );
    },

    editorMsgChange: function( me, newValue, oldValue, eOpts ){
        if( /[";]/.test( newValue ) ){
            me.setValidation( 'Msg contains invalid characters.'.t() );
            return false;
        }
        me.setValidation(true);
        this.getView().up('grid').getController().updateRule( this.getViewModel().get('record'), 'msg', newValue );
    },

    sidRegex: /\s+sid:([^;]+);/,
    gidRegex: /\s+gid:\s*([^;]+);/,
    editorSidChange: function( me, newValue, oldValue, eOpts ){
        var v = this.getView();
        var vm = this.getViewModel();

        // Perform validation
        if( ! /^[0-9]+$/.test( newValue )){
            me.setValidation("Sid must be numeric".t());
            return false;
        }
        var record = vm.get('record');
        var originalRecord = v.record;

        var gid = '1';
        var rule = record.get('rule');
        if( this.gidRegex.test( rule )){
            gid = this.gidRegex.exec( rule )[1];
        }

        var match = false;
        vm.get('rules').each( function( storeRecord ) {
            if( storeRecord != originalRecord && storeRecord.get('sid') == newValue) {
                var ruleGid = "1";
                ruleValue = storeRecord.get("rule");
                if( this.gidRegex.test( ruleValue ) ) {
                    ruleGid = this.gidRegex.exec( ruleValue )[1];
                    this.gidRegex.lastIndex = 0;
                }

                if( gid == ruleGid ){
                    match = true;
                    return false;
                }
            }
        }, this);

        if( match === true ){
            me.setValidation("Sid already in use.".t());
            return false;
        }

        me.setValidation(true);
        this.getView().up('grid').getController().updateRule( this.getViewModel().get('record'), 'sid', newValue );
    },

    editorLogChange: function( me, newValue, oldValue, eOpts ) {
        // If log disabled, ensure that block is also disabled.
        var record = this.getViewModel().get('record');
        if( newValue === false) {
            record.set('block', false);
        }
        this.getView().up('grid').getController().updateRule( record, 'log', newValue );
    },

    editorBlockChange: function( me, newValue, oldValue, eOpts ) {
        // If block enabled, that log is also enabled.
        var record = this.getViewModel().get('record');
        if( newValue === true ){
            record.set('log', true);
        }
        this.getView().up('grid').getController().updateRule( record, 'block', newValue );
    },

    actionRegex: /^([#]+|)\s*(alert|log|pass|activate|dynamic|drop|sdrop|reject)/,
    editorRuleChange: function( me, newValue, oldValue, eOpts ){
        var gridController = this.getView().up('grid').getController();
        var record = this.getViewModel().get('record');

        newValue = newValue.replace( /(\r\n|\n|\r)/gm, "" );

        var recordValue;
        var updateRuleKeys = gridController.updateRuleKeys;
        for( var i = 0; i < updateRuleKeys.length; i++ ){
            key = updateRuleKeys[i]['key'];
            regex = updateRuleKeys[i]['regex'];
            quoted = updateRuleKeys[i]['quoted'];

            if( regex.test( newValue ) ){
                match = regex.exec( newValue );
                recordValue = match[1];
                if(quoted){
                    recordValue = recordValue.substr(1, recordValue.length - 2);
                }
                record.set(key, recordValue);
            }
        }

        var logValue = null;
        var blockValue = null;
        var actionRegexMatch = gridController.actionRegexMatch;
        if( this.actionRegex.test( newValue ) === true ){
            match = actionRegexMatch.exec( newValue );
            if( match[2] == "alert" ){
                logValue = true;
                blockValue = false;
            }else if( ( match[2] == "drop" ) || ( match[2] == "sdrop" ) ){
                logValue = true;
                blockValue = true;
            }
            if( match[1] == "#" ){
                logValue = false;
                blockValue = false;
            }
        }
        if(logValue != null){
            record.set('log', logValue);
        }
        if(blockValue != null){
            record.set('block', blockValue);
        }
    },

});

Ext.define('Ung.apps.intrusionprevention.cmp.RuleGridController', {
    extend: 'Ung.cmp.GridController',

    alias: 'controller.unintrusionrulesgrid',

    editorWin: function (record) {
        this.dialog = this.getView().add({
            xtype: 'ung.cmp.unintrusionrulesrecordeditor',
            record: record
        });
        this.dialog.show();
    },

    regexRuleGid: /\s+gid:\s*([^;]+);/,
    sidRenderer: function( value, metaData, record, rowIdx, colIdx, store ){
        var sid = record.get('sid');
        var gid = '1';
        if( this.regexRuleGid.test( record.get('rule') ) ){
            gid = this.regexRuleGid.exec( record.get('rule') )[1];
        }
        metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode( "Sid".t() + ": " + sid + ", " + "Gid".t() + ":" + gid) + '"';
        return value;
    },

    classtypeRenderer: function( value, metaData, record, rowIdx, colIdx, store ){
        var me = this, v = this.getView(), vm = this.getViewModel();
        var description = value;
        var classtypeRecord = vm.get('classtypes').findRecord('name', value);
        if( classtypeRecord != null ){
            description = classtypeRecord.get('description');
        }
        metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode( description ) + '"';
        return value;
    },

    categoryRenderer: function( value, metaData, record, rowIdx, colIdx, store ){
        var me = this, vm = this.getViewModel();
        var description = value;
        var categoryRecord = vm.get('categories').findRecord('name', value);
        if( categoryRecord != null ){
            description = categoryRecord.get('description');
        }
        metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode( description  ) + '"';
        return value;
    },

    regexRuleReference: /\s+reference:\s*([^\;]+)\;/g,
    referencesMap: {
        "bugtraq": "http://www.securityfocus.com/bid/",
        "cve": "http://cve.mitre.org/cgi-bin/cvename.cgi?name=",
        "nessus": "http://cgi.nessus.org/plugins/dump.php3?id=",
        "arachnids": "http://www.whitehats.com/info/IDS",
        "mcafee": "http://vil.nai.com/vil/content/v",
        "osvdb": "http://osvdb.org/show/osvdb/",
        "msb": "http://technet.microsoft.com/en-us/security/bulletin/",
        "url": "http://"
    },
    referenceRenderer: function( value, metaData, record, rowIdx, colIdx, store ){
        var matches = null;
        matches = value.match(this.regexRuleReference);
        if( matches == null ){
            return "";
        }
        var references = [];
        for( var i = 0; i < matches.length; i++ ){
            var rmatches = this.regexRuleReference.exec( matches[i] );
            this.regexRuleReference.lastIndex = 0;

            var url = "";
            var referenceFields = rmatches[1].split(",");
            var prefix = this.referencesMap[referenceFields[0]];
            if( prefix != null ){
                referenceFields[1] = referenceFields[1].trim();
                if((referenceFields[1].charAt(0) == '"') &&
                    (referenceFields[1].charAt(referenceFields[1].length - 1) == '"')){
                    referenceFields[1] = referenceFields[1].substr(1,referenceFields[1].length - 2);
                }
                url = prefix + referenceFields[1];
                references.push('<a href="'+ url + '" class="fa fa-search fa-black" style="text-decoration: none; color:black" target="_reference"></a>');
            }
        }
        return references.join("");
    },

    logBeforeCheckChange: function ( elem, rowIndex, checked ){
        var record = elem.getView().getRecord(rowIndex);
        if( !checked){
            record.set('log', false);
            record.set('block', false );
            this.updateRule(record, 'block', false );
            this.updateRule(record, 'log', false );
        }else{
            record.set('log', true);
            this.updateRule(record, 'log', true );
        }
    },

    logCheckAll: function(checkbox, checked){
        Ext.MessageBox.wait(checked ? "Checking All ...".t() : "Unchecking All ...".t(), "Please wait".t());
        Ext.Function.defer(function() {
            var grid=checkbox.up("grid");
            var records=grid.getStore().getRange();
            grid.getStore().suspendEvents(true);
            var record;
            for(var i=0; i<records.length; i++) {
                record = records[i];
                if(checked == false ) {
                    record.set('block', false);
                    this.updateRule(records[i], 'block', checked );
                }
                record.set('log', checked);
                this.updateRule(records[i], 'log', checked );
            }
            grid.getStore().resumeEvents();
            grid.getStore().getFilters().notify('endupdate');
            Ext.MessageBox.hide();
        }, 100, this);

    },

    blockBeforeCheckChange: function ( elem, rowIndex, checked ){
        var record = elem.getView().getRecord(rowIndex);
        if(checked) {
            record.set('log', true );
            record.set('block', true);
            this.updateRule(record, 'log', true );
            this.updateRule(record, 'block', true );
        }else{
            record.set('block', false);
            this.updateRule(record, 'block', false );
        }
    },

    blockCheckAll: function(checkbox, checked){
        Ext.MessageBox.wait(checked ? "Checking All ...".t() : "Unchecking All ...".t(), "Please wait".t());
        Ext.Function.defer(function() {
            var grid=checkbox.up("grid");
            var records=grid.getStore().getRange();
            grid.getStore().suspendEvents(true);
            var record;
            for(var i=0; i<records.length; i++) {
                record = records[i];
                if(checked) {
                    record.set('log', true);
                    this.updateRule(records[i], 'log', checked );
                }
                record.set('block', checked);
                this.updateRule(records[i], 'block', checked );
            }
            grid.getStore().resumeEvents();
            grid.getStore().getFilters().notify('endupdate');
            Ext.MessageBox.hide();
        }, 100, this);
    },

    updateSearchStatusBar: function(){
        var v = this.getView();
        var searchStatus = v.down("[name=searchStatus]");
        var hasLogOrBlockFilter = ( v.down("[name=searchLog]").getValue() === true ) || ( v.down("[name=searchBlock]").getValue() === true );
        var hasFilter = hasLogOrBlockFilter || ( v.down("[name=searchFilter]").getValue().length >= 2 );
        var statusText = "", logOrBlockText = "", totalEnabled = 0;
        if(!hasLogOrBlockFilter) {
            v.getStore().each(function( record ){
                if( ( record.get('log')) || ( record.get('block')) ) {
                    totalEnabled++;
                }
            });
            logOrBlockText = Ext.String.format( '{0} logging or blocking'.t(), totalEnabled);
        }
        if(hasFilter) {
            statusText = Ext.String.format( '{0} matching rules(s) found'.t(), v.getStore().getCount() );
            if(!hasLogOrBlockFilter) {
                statusText += ', ' + logOrBlockText;
            }
        } else {
            statusText = Ext.String.format( '{0} available rules'.t(), v.getStore().getCount()) + ', ' + logOrBlockText;
        }
        searchStatus.update( statusText );
    },

    searchFilter: Ext.create('Ext.util.Filter', {
        filterFn: function(){}
    }),
    filterSearch: function(elem, newValue, oldValue, eOpts){
        var store = this.getView().getStore();
        if( newValue ){
            if( newValue.length > 1 ){
                var re = new RegExp(newValue, 'gi');
                this.searchFilter.setFilterFn( function(record){
                    return re.test(record.get('category')) ||
                        re.test(record.get('rule'));
                });
                store.addFilter( this.searchFilter );
            }
        }else{
            store.removeFilter( this.searchFilter );
            if(store.filters.length === 0){
                this.getView().reconfigure();
            }
        }
        this.updateSearchStatusBar();
    },

    logFilter: Ext.create('Ext.util.Filter', {
        property: 'log',
        value: true
    }),

    filterLog: function(elem, newValue, oldValue, eOpts){
        var store = this.getView().getStore();
        if( newValue ){
            store.addFilter( this.logFilter );
        }else{
            store.removeFilter( this.logFilter );
            if(store.filters.length === 0){
                this.getView().reconfigure();
            }
        }
        this.updateSearchStatusBar();
    },

    blockFilter: Ext.create('Ext.util.Filter', {
        property: 'block',
        value: true
    }),

    filterBlock: function(elem, newValue, oldValue, eOpts){
        var store = this.getView().getStore();
        if( newValue ){
            store.addFilter( this.blockFilter );
        }else{
            store.removeFilter( this.blockFilter );
            if(store.filters.length === 0){
                this.getView().reconfigure();
            }
        }
        this.updateSearchStatusBar();
    },

    exportData: function(){
        var grid = this.getView(),
            gridName = (grid.name !== null) ? grid.name : grid.recordJavaClass;

        Ext.MessageBox.wait('Exporting Settings...'.t(), 'Please wait'.t());

        var downloadForm = document.getElementById('downloadForm');
        downloadForm["type"].value = "IntrusionPreventionSettings";
        downloadForm["arg1"].value = "export";
        downloadForm["arg2"].value = grid.up('app-intrusion-prevention').getController().getView().appManager.getAppSettings().id;
        downloadForm["arg3"].value = gridName.trim().replace(/ /g, '_');
        downloadForm["arg4"].value = Ext.encode({rules: grid.up('app-intrusion-prevention').getController().getChangedDataRecords('rules')});
        downloadForm.submit();

        Ext.MessageBox.hide();
    },

    importHandler: function(importMode, newData){
        var me = this;

        this.callParent(arguments);
        var store = this.getView().getStore();

        store.each( function(record){
            me.updateRule(record, 'log', record.get('log') );
            me.updateRule(record, 'block', record.get('block') );

        });
    },

    rulesReconfigure: function( me , store , columns , oldStore , oldColumns , eOpts ){
        me.getController().updateSearchStatusBar();
    },

    updateRuleKeys: [{
        key: 'classtype',
        regex: /\s+classtype:([^;]+);/,
        quoted: false
    },{
        key: 'msg',
        regex: /\s+msg:([^;]+);/,
        quoted: true
    },{
        key: 'sid',
        regex: /\s+sid:([^;]+);/,
        quoted: false
    },{
        key: 'metadata',
        regex: /\s+metadata:([^;]+);/,
        quoted: false
    }],
    actionRegexMatch: /^([#]+|)(alert|log|pass|activate|dynamic|drop|sdrop|reject)/,
    updateRule: function( record, updatedKey, updatedValue){
        var me = this;
        var gridSourced = record.store ? true : false;
        var i, regex;
        var ruleValue = record.get('rule');

        var metadataValue = null;
        if( ( updatedKey === 'log' || updatedKey === 'block' ) &&
            gridSourced ||
            ( record.get(updatedKey) !== updatedValue) ){
            var metadata = [];
            regex = null;
            for(i = 0; i < this.updateRuleKeys.length; i++){
                if(this.updateRuleKeys[i].key === "metadata"){
                    regex = this.updateRuleKeys[i].regex;
                }
            }
            if(regex != null){
                var metadataFound = regex.test( ruleValue );
                var matches = ruleValue.match(regex);
                if( metadataFound && matches.length > 1 ){
                    matches[1].split(',').forEach(function(keypair){
                        var kv = keypair.trim().split(" ");
                        if( kv[0] == 'untangle_action' ){
                            return;
                        }
                        metadata.push(kv[0].trim() + ' ' + kv[1].trim());
                    });
                }
                var date = new Date(Date.now() + Renderer.timestampOffset);
                metadata.push('untangle_action ' + Ext.util.Format.date(date, "Y_m_d"));
                metadataValue = metadata.join(', ');
            }
        }

        // Standard field (key:value;) replacements.
        var key;
        var value;
        var quoted;
        var newField;
        for(i = 0; i < this.updateRuleKeys.length; i++ ){
            key = this.updateRuleKeys[i]['key'];
            regex = this.updateRuleKeys[i]['regex'];
            quoted = this.updateRuleKeys[i]['quoted'];

            if(updatedKey == key){
                value = updatedValue;
            }else{
                if(key === "metadata"){
                    if(metadataValue == null){
                        continue;
                    }else{
                        value = metadataValue;
                    }
                }else{
                    value = record.get(key);
                }
            }
            value = (quoted ? '"' : '' ) + value + (quoted ? '"' : '' );

            newField = " " + key + ":" + value + ";";

            if( regex.test( ruleValue )) {
                ruleValue = ruleValue.replace( regex, newField );
            } else {
                var idx = ruleValue.lastIndexOf(")");
                if(idx != -1) {
                    ruleValue = ruleValue.slice(0, idx-1) + newField + ruleValue.slice(idx - 1);
                } else {
                    ruleValue += " (" + newField + " )";
                }
            }
        }

        // Action replacement
        if(updatedKey == 'log' || updatedKey == 'block'){
            var logValue = record.get('log');
            var blockValue = record.get('block');
            if(updatedKey == 'log'){
                logValue = updatedValue;
            }
            if(updatedKey == 'block'){
                blockValue = updatedValue;
            }

            var actionField = "alert";
            if( logValue === true && blockValue === true ) {
                actionField = "drop";
            } else if( logValue === false && blockValue === true ) {
                actionField = "sdrop";
            }else if( logValue === false && blockValue === false ) {
                actionField = "#" + actionField;
            }

            if( this.actionRegexMatch.test( ruleValue ) === true ) {
                ruleValue = ruleValue.replace( this.actionRegexMatch, actionField );
            } else {
                ruleValue = actionField + ruleValue;
            }
        }
        record.set('rule', ruleValue );
    }

});

Ext.define('Ung.apps.intrusionprevention.cmp.VariablesRecordEditor', {
    extend: 'Ung.cmp.RecordEditor',
    xtype: 'ung.cmp.unintrusionvariablesrecordeditor',

    controller: 'unintrusionvariablesrecordeditorcontroller',
});

Ext.define('Ung.apps.intrusionprevention.cmp.VariablesRecordEditorController', {
    extend: 'Ung.cmp.RecordEditorController',
    alias: 'controller.unintrusionvariablesrecordeditorcontroller',

    editorVariableChange: function( me, newValue, oldValue, eOpts ){
        var v = this.getView();
        var vm = this.getViewModel();

        var record = vm.get('record');
        var originalRecord = v.record;

        var match = false;
        vm.get('variables').each( function( storeRecord ) {
            if( ( storeRecord !== v.record ) && ( newValue == storeRecord.get('variable') ) ){
                match = true;
            }
        });
        if(match){
            me.setValidation("Variable name already in use.".t());
            return false;

        }
        me.setValidation(true);

        var activeVariable = v.up('app-intrusion-prevention').getController().isVariableUsed(newValue);
        me.setReadOnly(activeVariable);
        me.up("").down("[name=activeVariable]").setVisible(activeVariable);
    }

});

Ext.define('Ung.apps.intrusionprevention.cmp.VariablesGridController', {
    extend: 'Ung.cmp.GridController',

    alias: 'controller.unintrusionvariablesgrid',

    editorWin: function (record) {
        this.dialog = this.getView().add({
            xtype: 'ung.cmp.unintrusionvariablesrecordeditor',
            record: record
        });
        this.dialog.show();
    },

    exportData: function(){
        var grid = this.getView(),
            gridName = (grid.name !== null) ? grid.name : grid.recordJavaClass;

        Ext.MessageBox.wait('Exporting Settings...'.t(), 'Please wait'.t());

        var downloadForm = document.getElementById('downloadForm');
        downloadForm["type"].value = "IntrusionPreventionSettings";
        downloadForm["arg1"].value = "export";
        downloadForm["arg2"].value = grid.up('app-intrusion-prevention').getController().getView().appManager.getAppSettings().id;
        downloadForm["arg3"].value = gridName.trim().replace(/ /g, '_');
        downloadForm["arg4"].value = Ext.encode({variables: grid.up('app-intrusion-prevention').getController().getChangedDataRecords('variables')});
        downloadForm.submit();

        Ext.MessageBox.hide();
    },

    deleteRecord: function (view, rowIndex, colIndex, item, e, record) {
        if( this.getView().up('app-intrusion-prevention').getController().isVariableUsed( record.get('variable') ) ){
            Ext.MessageBox.alert( "Cannot Delete Variable".t(), "Variable is used by one or more rules.".t() );
        }else{
            if (record.get('markedForNew')) {
                record.drop();
            } else {
                record.set('markedForDelete', true);
            }
        }
    }
});
