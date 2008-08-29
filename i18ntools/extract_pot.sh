#!/bin/sh

if [ ! -d pot ]
then
    mkdir pot
fi    


cp ../uvm-lib/po/untangle-libuvm.pot ./pot/
cp ../mail-casing/po/untangle-casing-mail.pot ./pot/
cp ../virus-base/po/untangle-base-virus.pot ./pot/

for module in untangle-node-webfilter untangle-node-phish untangle-node-spyware untangle-node-spamassassin untangle-node-shield untangle-node-protofilter untangle-node-ips
do 
    module_dir=`echo "${module}"|cut -d"-" -f3`
    cp ../${module_dir}/po/${module}.pot ./pot/
done

rm -f pot.zip
zip -r pot.zip ./pot/
rm -rf ./pot/

# All done, exit ok
exit 0