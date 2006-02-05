# SNMP - Simple Network Management Protocol - RFC 1157
# Pattern quality: good veryfast
# Protocol groups: ietf_internet_standard networking
#
# Usually runs on UDP ports 161 (monitoring) and 162 (traps).
#
# These filters match SNMPv1 packets without fail, and are made
# as specific as possible not to match any ASN.1 encoded protocols.
# However these could still be matched by other protocols that 
# use ASN.1 encoding

# Contributed by Goli SriSairam <goli_sai AT yahoo.com>

# This pattern has been tested and is believed to work well.
#
# To get or provide more information about this protocol and/or pattern:
# http://www.protocolinfo.org/wiki/SNMP
# http://lists.sourceforge.net/lists/listinfo/l7-filter-developers

# All SNMPv1 traffic.  See snmp-mon.pat and snmp-trap.pat for details.
snmp
^\x02\x01\x04.+([\xa0-\xa3]\x02[\x01-\x04].?.?.?.?\x02\x01.?\x02\x01.?\x30|\xa4\x06.+\x40\x04.?.?.?.?\x02\x01.?\x02\x01.?\x43)
