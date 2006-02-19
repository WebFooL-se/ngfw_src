/*
 * Copyright (c) 2004, 2005 Metavize Inc.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * Metavize Inc. ("Confidential Information").  You shall
 * not disclose such Confidential Information.
 *
 *  $Id$
 */

package com.metavize.mvvm;

public class IntfConstants
{
    public static final String INTERNAL = "Internal";
    public static final String EXTERNAL = "External";
    public static final String DMZ      = "DMZ";
    public static final String VPN      = "VPN";
    
    public static final byte   EXTERNAL_INTF = 0;
    public static final byte   INTERNAL_INTF = 1;
    public static final byte   DMZ_INTF      = 2;
    public static final byte   VPN_INTF      = 3;

    /* Internal constants, the string representation is never shown to the user */
    public static final byte   MAX_INTF      = 8;
    public static final byte   UNKNOWN_INTF  = MAX_INTF + 2;
    public static final byte   LOOPBACK_INTF = MAX_INTF + 1;

    /* If the intf is not in the list, this returns the empty string */
    public static String toName( byte intf  )
    {
        switch ( intf ) {
        case INTERNAL_INTF: return INTERNAL;
        case EXTERNAL_INTF: return EXTERNAL;
        case DMZ_INTF: return DMZ;
        case VPN_INTF: return VPN;
        }
        
        return "unknown";
    }
}

