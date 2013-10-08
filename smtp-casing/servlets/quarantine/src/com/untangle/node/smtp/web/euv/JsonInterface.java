/**
 * $Id: JsonInterface.java 34293 2013-03-17 05:22:02Z dmorris $
 */
package com.untangle.node.smtp.web.euv;

import java.util.List;

import com.untangle.node.smtp.quarantine.BadTokenException;
import com.untangle.node.smtp.quarantine.InboxAlreadyRemappedException;
import com.untangle.node.smtp.quarantine.InboxRecord;
import com.untangle.node.smtp.quarantine.NoSuchInboxException;
import com.untangle.node.smtp.quarantine.QuarantineUserActionFailedException;
import com.untangle.node.smtp.safelist.NoSuchSafelistException;
import com.untangle.node.smtp.safelist.SafelistActionFailedException;
import com.untangle.uvm.node.ParseException;

public interface JsonInterface
{
    public boolean requestDigest( String account )
        throws ParseException, QuarantineUserActionFailedException;

    public List<InboxRecord> getInboxRecords( String token )
        throws BadTokenException, NoSuchInboxException, QuarantineUserActionFailedException;

    public ActionResponse releaseMessages( String token, String messages[] )
        throws BadTokenException, NoSuchInboxException, QuarantineUserActionFailedException;

    public ActionResponse purgeMessages( String token, String messages[] )
        throws BadTokenException, NoSuchInboxException, QuarantineUserActionFailedException;

    /* Add the addresses in addresses to the safelist associated with token */
    public ActionResponse safelist( String token, String addresses[] )
        throws BadTokenException, NoSuchInboxException, NoSuchSafelistException, QuarantineUserActionFailedException, SafelistActionFailedException;

    /* Replace the safelist for the account associated with token. */
    public ActionResponse replaceSafelist( String token, String addresses[] )
        throws BadTokenException, NoSuchInboxException, NoSuchSafelistException, QuarantineUserActionFailedException, SafelistActionFailedException;

    /* Delete users from the safelist */
    public ActionResponse deleteAddressesFromSafelist( String token, String addresses[] )
        throws BadTokenException, NoSuchInboxException, NoSuchSafelistException, QuarantineUserActionFailedException, SafelistActionFailedException;

    /* Map the account associated with token to address. */
    public void setRemap( String token, String address )
        throws BadTokenException, NoSuchInboxException, QuarantineUserActionFailedException,
               InboxAlreadyRemappedException;

    /* Delete a set of remaps to the account associated with token, this returns the new list
     * of addresses that are mapped to this address. */
    public String[] deleteRemaps( String token, String[] address )
        throws BadTokenException, NoSuchInboxException, QuarantineUserActionFailedException;
}
