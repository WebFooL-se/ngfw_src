/**
 * $Id$
 */
package com.untangle.app.threat_prevention;

import com.untangle.uvm.app.RuleCondition;


/**
 * This is a matching criteria for a ThreatPreventionPass Rule
 * Example: "Destination Port" == "80"
 *
 * A ThreatPreventionRule has a set of these to determine what traffic to match
 */
@SuppressWarnings("serial")
public class ThreatPreventionRuleCondition extends RuleCondition
{
    /**
     * Create a firewall rule condition
     */
    public ThreatPreventionRuleCondition( )
    {
        super();
    }

    /**
     * Create a firewall rule condition
     * @param matcherType
     * @param value
     */
    public ThreatPreventionRuleCondition( ConditionType matcherType, String value )
    {
        super( matcherType, value );
    }

    /**
     * Create a firewall rule condition
     * @param matcherType
     * @param value
     * @param invert
     */
    public ThreatPreventionRuleCondition( ConditionType matcherType, String value, Boolean invert )
    {
        super( matcherType, value, invert );
    }
}
