/*
 * $HeadURL: svn://chef/work/src/smtp-casing/src/com/untangle/node/smtp/sasl/ClearObserver.java $
 * Copyright (c) 2003-2007 Untangle, Inc. 
 *
 * This library is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2,
 * as published by the Free Software Foundation.
 *
 * This library is distributed in the hope that it will be useful, but
 * AS-IS and WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE, TITLE, or
 * NONINFRINGEMENT.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Linking this library statically or dynamically with other modules is
 * making a combined work based on this library.  Thus, the terms and
 * conditions of the GNU General Public License cover the whole combination.
 *
 * As a special exception, the copyright holders of this library give you
 * permission to link this library with independent modules to produce an
 * executable, regardless of the license terms of these independent modules,
 * and to copy and distribute the resulting executable under terms of your
 * choice, provided that you also meet, for each linked independent module,
 * the terms and conditions of the license of that module.  An independent
 * module is a module which is not derived from or based on this library.
 * If you modify this library, you may extend this exception to your version
 * of the library, but you are not obligated to do so.  If you do not wish
 * to do so, delete this exception statement from your version.
 */
package com.untangle.node.smtp.sasl;

import java.nio.ByteBuffer;

/**
 * Base class for Observers of mechanisms which do not support privacy/integrity protection. <br>
 * <br>
 * By default, this class does not inspect the protocol yet advertizes that integrity and privacy cannot result from the
 * exchange.
 */
abstract class ClearObserver extends SASLObserver
{

    ClearObserver(String mechName, int maxMessageSz) {
        super(mechName, false, false, maxMessageSz);
    }

    @Override
    public FeatureStatus exchangeUsingPrivacy()
    {
        return FeatureStatus.NO;
    }

    @Override
    public FeatureStatus exchangeUsingIntegrity()
    {
        return FeatureStatus.NO;
    }

    @Override
    public FeatureStatus exchangeAuthIDFound()
    {
        return FeatureStatus.UNKNOWN;
    }

    @Override
    public String getAuthID()
    {
        return null;
    }

    @Override
    public FeatureStatus exchangeComplete()
    {
        return FeatureStatus.UNKNOWN;
    }

    @Override
    public boolean initialClientData(ByteBuffer buf)
    {
        return false;
    }

    @Override
    public boolean clientData(ByteBuffer buf)
    {
        return false;
    }

    @Override
    public boolean serverData(ByteBuffer buf)
    {
        return false;
    }

}
