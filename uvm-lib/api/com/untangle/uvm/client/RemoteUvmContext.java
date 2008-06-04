/*
 * $HeadURL$
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

package com.untangle.uvm.client;

import java.io.IOException;

import com.untangle.uvm.MailSender;
import com.untangle.uvm.RemoteAppServerManager;
import com.untangle.uvm.RemoteBrandingManager;
import com.untangle.uvm.RemoteConnectivityTester;
import com.untangle.uvm.RemoteNetworkManager;
import com.untangle.uvm.RemoteReportingManager;
import com.untangle.uvm.addrbook.RemoteAddressBook;
import com.untangle.uvm.license.RemoteLicenseManager;
import com.untangle.uvm.logging.RemoteLoggingManager;
import com.untangle.uvm.networking.ping.RemotePingManager;
import com.untangle.uvm.node.RemoteIntfManager;
import com.untangle.uvm.node.RemoteNodeManager;
import com.untangle.uvm.policy.RemotePolicyManager;
import com.untangle.uvm.security.RemoteAdminManager;
import com.untangle.uvm.toolbox.RemoteToolboxManager;
import com.untangle.uvm.toolbox.RemoteUpstreamManager;
import com.untangle.uvm.user.RemotePhoneBook;

/**
 * Provides an interface to get major UVM components that are
 * accessible a remote client.
 *
 * @author <a href="mailto:amread@untangle.com">Aaron Read</a>
 * @version 1.0
 */
public interface RemoteUvmContext
{
    /**
     * Get the <code>RemoteToolboxManager</code> singleton.
     *
     * @return the RemoteToolboxManager.
     */
    RemoteToolboxManager toolboxManager();

    /**
     * Get the <code>NodeManager</code> singleton.
     *
     * @return the NodeManager.
     */
    RemoteNodeManager nodeManager();

    /**
     * Get the <code>RemoteLoggingManager</code> singleton.
     *
     * @return the RemoteLoggingManager.
     */
    RemoteLoggingManager loggingManager();

    /**
     * Get the <code>RemoteUpstreamManager</code> singleton.
     * This provides registration & control of upstream
     * services, normally those running on the local machine.
     *
     * @return the <code>UpstreamManager</code>
     */
    RemoteUpstreamManager upstreamManager();

    /**
     * Get the <code>PolicyManager</code> singleton.
     *
     * @return the PolicyManager.
     */
    RemotePolicyManager policyManager();

    /**
     * Get the <code>RemoteAdminManager</code> singleton.
     *
     * @return the RemoteAdminManager.
     */
    RemoteAdminManager adminManager();

    /**
     * Get the <code>RemoteIntfManager</code> singleton.
     *
     * @return the RemoteIntfManager.
     */
    RemoteIntfManager intfManager();

    /**
     * Get the <code>RemotePingManager</code> singleton.
     *
     * @return the RemotePingManager.
     */
    RemotePingManager pingManager();

    /**
     * Get the <code>NetworkManager</code> singleton.
     *
     * @return the NetworkManager.
     */
    RemoteNetworkManager networkManager();

    /**
     * Get the <code>RemoteReportingManager</code> singleton.
     *
     * @return the RemoteReportingManager.
     */
    RemoteReportingManager reportingManager();

    /**
     * Get the <code>RemoteConnectivityTester</code> singleton.
     *
     * @return the RemoteConnectivityTester
     */
    RemoteConnectivityTester getRemoteConnectivityTester();

    MailSender mailSender();

    /**
     * Get the AppServerManager singleton for this instance
     *
     * @return the singleton
     */
    RemoteAppServerManager appServerManager();

    /**
     * Get the phonebook singleton
     * @return the singleton
     */
    RemotePhoneBook phoneBook();

    /**
     * Get the AddressBook singleton for this instance
     *
     * @return the singleton
     */
    RemoteAddressBook appAddressBook();

    /**
     * The BrandingManager allows for customization of logo and
     * branding information.
     *
     * @return the BrandingManager.
     */
    RemoteBrandingManager brandingManager();

    /**
     * The license manager.
     *
     * @return the RemoteLicenseManager
     */
    RemoteLicenseManager licenseManager();

    /**
     * Save settings to local hard drive.
     *
     * @exception IOException if the save was unsuccessful.
     */
    void localBackup() throws IOException;

    /**
     * Save settings to USB key drive.
     *
     * @exception IOException if the save was unsuccessful.
     */
    void usbBackup() throws IOException;

    void shutdown();

    /**
     * Reboots the Untangle Server as if the right button menu was used
     * and confirmed.  Note that this currently will not reboot a
     * non-production (dev) box; this behavior may change in the
     * future.  XXX
     *
     */
    void rebootBox();

    // debugging / performance management
    void doFullGC();

    // making sure the client and uvm versions are the same
    String version();

    /**
     * Get the activation key.
     *
     * @return the activation key.
     */
    String getActivationKey();

    /**
     * Return true if running in a development environment.
     *
     * @return a <code>boolean</code> true if in development.
     */
    boolean isDevel();

    /**
     * Return true if running in an Untangle Appliance (non-cd/iso install).
     *
     * @return a <code>boolean</code> true if in an untangle appliance.
     */
    boolean isUntangleAppliance();

    /**
     * Return true if running inside a Virtualized Platform (like VMWare)
     *
     * @return a <code>boolean</code> true if platform is running in a
     * virtualized machine
     */
    boolean isInsideVM();

    /**
     * Create a backup which the client can save to a local disk.  The
     * returned bytes are for a .tar.gz file, so it is a good idea to
     * either use a ".tar.gz" extension so basic validation can be
     * performed for {@link #restoreBackup restoreBackup}.
     *
     * @return the byte[] contents of the backup.
     *
     * @exception IOException if something goes wrong (a lot can go wrong,
     *            but it is nothing the user did to cause this).
     */
    byte[] createBackup() throws IOException;

    /**
     * Restore from a previous {@link #createBackup backup}.
     *
     * @exception IOException something went wrong to prevent the
     *            restore (not the user's fault).
     * @exception IllegalArgumentException if the provided bytes do not seem
     *            to have come from a valid backup (is the user's fault).
     */
    void restoreBackup(byte[] backupFileBytes)
        throws IOException, IllegalArgumentException;

    /**
     * Restore from a previous {@link #createBackup backup} from a given file.
     *
     * @exception IOException something went wrong to prevent the
     *            restore (not the user's fault).
     * @exception IllegalArgumentException if the provided bytes do not seem
     *            to have come from a valid backup (is the user's fault).
     */
    void restoreBackup(String fileName)
        throws IOException, IllegalArgumentException;

    /**
     * Loads premium functionality.
     *
     * @return true if premium functionality was loaded.
     */
    boolean loadRup();

    /**
     * Restarts Command Line Interface Server
     */
    void restartCliServer();

    /**
     * Stops Command Line Interface Server
     */
    void stopCliServer();

    String setProperty(String key, String value);
}
