/*
 * Copyright (c) 2003, 2004, 2005 Metavize Inc.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * Metavize Inc. ("Confidential Information").  You shall
 * not disclose such Confidential Information.
 *
 */
package com.metavize.tran.protofilter;

import java.util.TreeMap;

/**
 * <b>WARNING WARNING WARNING WARNING WARNING WARNING</b>
 *
 * This class is autogenerated, do not edit
 *
 * <b>WARNING WARNING WARNING WARNING WARNING WARNING</b>
 */
public class LoadPatterns {

    private LoadPatterns() {}

    public static TreeMap getPatterns()
    {
        // Now that we have Policies,  we create a new map every time since we don't want sharing.
        return createPatterns();
    }

    private static TreeMap createPatterns()
    {
        TreeMap pats = new TreeMap();

