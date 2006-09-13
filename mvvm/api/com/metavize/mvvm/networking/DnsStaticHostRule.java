/*
 * Copyright (c) 2005, 2006 Metavize Inc.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * Metavize Inc. ("Confidential Information").  You shall
 * not disclose such Confidential Information.
 *
 * $Id$
 */

package com.metavize.mvvm.networking;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.metavize.mvvm.tran.HostNameList;
import com.metavize.mvvm.tran.IPaddr;
import com.metavize.mvvm.tran.Rule;
import org.hibernate.annotations.Type;

/**
 * Rule for storing DNS static hosts.
 *
 * @author <a href="mailto:rbscott@metavize.com">Robert Scott</a>
 * @version 1.0
 */
@Entity
@Table(name="mvvm_dns_static_host_rule", schema="settings")
public class DnsStaticHostRule extends Rule
{
    private HostNameList hostNameList = HostNameList.getEmptyHostNameList();
    private IPaddr staticAddress = null;

    // Constructors
    public DnsStaticHostRule() { }

    public DnsStaticHostRule(HostNameList hostNameList, IPaddr staticAddress)
    {
        this.hostNameList  = hostNameList;
        this.staticAddress = staticAddress;
    }


    /**
     * Host name list
     *
     * @return the host name list.
     */
    @Column(name="hostname_list")
    @Type(type="com.metavize.mvvm.type.HostNameListUserType")
    public HostNameList getHostNameList()
    {
        if ( hostNameList == null )
            hostNameList = HostNameList.getEmptyHostNameList();

        return hostNameList;
    }

    public void setHostNameList( HostNameList hostNameList )
    {
        this.hostNameList = hostNameList;
    }

    /**
     * Get static IP address
     *
     * @return desired static address.
     */
    @Column(name="static_address")
    @Type(type="com.metavize.mvvm.type.IPaddrUserType")
    public IPaddr getStaticAddress()
    {
        return this.staticAddress;
    }

    public void setStaticAddress( IPaddr staticAddress )
    {
        this.staticAddress = staticAddress;
    }
}
