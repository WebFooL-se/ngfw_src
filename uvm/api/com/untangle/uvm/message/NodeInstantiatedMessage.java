/**
 * $Id: NodeInstantiated.java,v 1.00 2012/04/01 18:13:16 dmorris Exp $
 */
package com.untangle.uvm.message;

import com.untangle.uvm.node.License;
import com.untangle.uvm.node.NodeProperties;
import com.untangle.uvm.NodeSettings;
import com.untangle.uvm.message.Message;
import com.untangle.uvm.message.StatDescs;

@SuppressWarnings("serial")
public class NodeInstantiatedMessage extends Message
{
    private final NodeProperties nodeProperties;
    private final NodeSettings nodeSettings;
    private final StatDescs statDescs;
    private final License license;
    private final Long policyId;
    
    public NodeInstantiatedMessage(NodeProperties nodeProperties, NodeSettings nodeSettings, StatDescs statDescs, License license, Long policyId)
    {
        this.nodeProperties = nodeProperties;
        this.nodeSettings = nodeSettings;
        this.statDescs = statDescs;
        this.license = license;
        this.policyId = policyId;
    }

    public Long getPolicyId()
    {
        return this.policyId;
    }

    public NodeProperties getNodeProperties()
    {
        return this.nodeProperties;
    }

    public NodeSettings getNodeSettings()
    {
        return this.nodeSettings;
    }
    
    public StatDescs getStatDescs()
    {
        return this.statDescs;
    }

    public License getLicense()
    {
        return this.license;
    }
}