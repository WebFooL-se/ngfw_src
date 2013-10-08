/*
 * $Id: SpamSettings.java 35674 2013-08-19 22:12:28Z dmorris $
 */
package com.untangle.node.spam;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

/**
 * Settings for the SpamNode.
 */
@SuppressWarnings("serial")
public class SpamSettings implements Serializable
{
    private List<SpamDnsbl> spamDnsblList;
    private SpamSmtpConfig smtpConfig;

    public SpamSettings()
    {
        spamDnsblList = new LinkedList<SpamDnsbl>();
    }

    public List<SpamDnsbl> getSpamDnsblList() { return spamDnsblList; }
    public void setSpamDnsblList( List<SpamDnsbl> newValue ) { this.spamDnsblList = newValue; }

    public SpamSmtpConfig getSmtpConfig() { return smtpConfig; }
    public void setSmtpConfig( SpamSmtpConfig newValue ) { this.smtpConfig = newValue; }

    // public void copy(SpamSettings argSettings)
    // {
    //     argSettings.setSpamDnsblList(this.spamDnsblList);
    //     argSettings.setSmtpConfig(this.smtpConfig);
    // }    
}
