#!/bin/sh

ALL_MODULES='untangle-libuvm 
    untangle-casing-mail untangle-base-virus 
    untangle-node-webfilter untangle-node-phish untangle-node-spyware untangle-node-spamassassin untangle-node-shield untangle-node-protofilter untangle-node-ips'

function update_keys()
{
case "$1" in 
"untangle-libuvm")
    cd ../uvm-lib/po
    echo 'get main keys'
    xgettext --copyright-holder='Untangle, Inc.' -L Python -ki18n._ -o tmp_keys.pot ../servlets/webui/root/script/main.js
    xgettext -j --copyright-holder='Untangle, Inc.' -L Python -ki18n._ -o tmp_keys.pot ../servlets/webui/root/script/components.js
    echo 'get config keys'
    xgettext -j --copyright-holder='Untangle, Inc.' -L Python -ki18n._ -o tmp_keys.pot ../servlets/webui/root/script/config/administration.js
    xgettext -j --copyright-holder='Untangle, Inc.' -L Python -ki18n._ -o tmp_keys.pot ../servlets/webui/root/script/config/email.js
    xgettext -j --copyright-holder='Untangle, Inc.' -L Python -ki18n._ -o tmp_keys.pot ../servlets/webui/root/script/config/localDirectory.js
    xgettext -j --copyright-holder='Untangle, Inc.' -L Python -ki18n._ -o tmp_keys.pot ../servlets/webui/root/script/config/upgrade.js
    xgettext -j --copyright-holder='Untangle, Inc.' -L Python -ki18n._ -o tmp_keys.pot ../servlets/webui/root/script/config/system.js
    xgettext -j --copyright-holder='Untangle, Inc.' -L Python -ki18n._ -o tmp_keys.pot ../servlets/webui/root/script/config/systemInfo.js
    msgcat tmp_keys.pot fmt_keys.pot -o tmp_keys.pot
    msgmerge -U $1.pot tmp_keys.pot
    rm tmp_keys.pot
    echo 'update po files'
    msgmerge -U ro/$1.po $1.pot
    ;;
"untangle-node-webfilter")
    moduleName=`echo "$1"|cut -d"-" -f3`
    cd ../${moduleName}/po/
    echo 'get new keys'
    xgettext --copyright-holder='Untangle, Inc.' -L Python -ki18n._ -o tmp_keys.pot ../hier/usr/share/untangle/web/webui/script/${1}/settings.js
    msgcat tmp_keys.pot db_keys.pot block_page_keys.pot -o tmp_keys.pot
    msgmerge -U $1.pot tmp_keys.pot
    rm tmp_keys.pot
    echo 'update po files'
    msgmerge -U ro/$1.po $1.pot
    ;;
"untangle-node-phish"|"untangle-node-spyware")
    moduleName=`echo "$1"|cut -d"-" -f3`
    cd ../${moduleName}/po/
    echo 'get new keys'
    xgettext --copyright-holder='Untangle, Inc.' -L Python -ki18n._ -o tmp_keys.pot ../hier/usr/share/untangle/web/webui/script/${1}/settings.js
    msgcat tmp_keys.pot block_page_keys.pot -o tmp_keys.pot
    msgmerge -U $1.pot tmp_keys.pot
    rm tmp_keys.pot
    echo 'update po files'
    msgmerge -U ro/$1.po $1.pot
    ;;
"untangle-node-spamassassin"|"untangle-node-shield"|"untangle-node-protofilter"|"untangle-node-ips")    
    moduleName=`echo "$1"|cut -d"-" -f3`
    cd ../${moduleName}/po/
    echo 'get new keys'
    xgettext --copyright-holder='Untangle, Inc.' -L Python -ki18n._ -o tmp_keys.pot ../hier/usr/share/untangle/web/webui/script/${1}/settings.js
    msgmerge -U $1.pot tmp_keys.pot
    rm tmp_keys.pot
    echo 'update po files'
    msgmerge -U ro/$1.po $1.pot
    ;;
"untangle-casing-mail")
    cd ../mail-casing/po/
    xgettext --copyright-holder='Untangle, Inc.' -L Python -ki18n._ -o tmp_keys.pot ../servlets/quarantine/root/quarantine.js
    xgettext -j --copyright-holder='Untangle, Inc.' -L Python -ki18n._ -o tmp_keys.pot ../servlets/quarantine/root/remaps.js
    xgettext -j --copyright-holder='Untangle, Inc.' -L Python -ki18n._ -o tmp_keys.pot ../servlets/quarantine/root/request.js
    xgettext -j --copyright-holder='Untangle, Inc.' -L Python -ki18n._ -o tmp_keys.pot ../servlets/quarantine/root/safelist.js
    msgcat tmp_keys.pot jspx_keys.pot -o tmp_keys.pot
    msgmerge -U $1.pot tmp_keys.pot
    rm tmp_keys.pot
    echo 'update po files'
    msgmerge -U ro/$1.po $1.pot
    ;;    
"untangle-base-virus")
    cd ../virus-base/po/
    echo 'get new keys'
    xgettext --copyright-holder='Untangle, Inc.' -L Python -ki18n._ -o tmp_keys.pot ../hier/usr/share/untangle/web/webui/script/$1/settings.js
    msgcat tmp_keys.pot block_page_keys.pot -o tmp_keys.pot
    msgmerge -U $1.pot tmp_keys.pot
    rm tmp_keys.pot
    echo 'update po files'
    msgmerge -U ro/$1.po $1.pot
    ;;
*)
    echo 1>&2 Module Name \"$1\" is invalid ...
    exit 127
    ;;
esac
}

if [ $# -ne 1 ]; then
     echo 1>&2 Usage: $0 "<module_name | all>"
     exit 127
fi

if [ $1 == 'all' ]
then
    
    current_dir=`pwd`
    for module in ${ALL_MODULES}
    do 
        echo 'Updating keys for '${module}'...'
        update_keys ${module}
        cd ${current_dir}
    done
    
else
    update_keys $1
fi

    
# All done, exit ok
exit 0