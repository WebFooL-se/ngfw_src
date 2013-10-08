/*
 * $HeadURL: svn://chef/work/src/smtp-casing/src/com/untangle/node/smtp/CommandWithEmailAddress.java $
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

package com.untangle.node.smtp;

import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;

import com.untangle.node.smtp.mime.MIMEUtil;
import com.untangle.node.token.ParseException;

/**
 * Base class of a Command which holds a parsed EmailAddress (parsed from the arguments).
 */
public class CommandWithEmailAddress extends Command
{

    private InternetAddress m_address;
    private String m_esmtpExtra;

    private static final String PREFIX_FROM = "from:";
    private static final String PREFIX_TO = "to:";

    private static InternetAddress NULL_ADDRESS = new InternetAddress();

    protected CommandWithEmailAddress(CommandType type, String cmdStr, String argStr) throws ParseException,
            FatalMailParseException {
        super(type, cmdStr, argStr);

        if (argStr == null) {
            setAddress(NULL_ADDRESS);
        }
        argStr = argStr.trim();

        if (argStr.length() == 0 || "<>".equals(argStr)) {
            setAddress(NULL_ADDRESS);
        } else {
            String prefix = getArgStrPrefix();

            // Strip-off the prefix if found
            String argStrLower = argStr.toLowerCase();
            if (argStrLower.startsWith(prefix)) {
                argStr = argStr.substring(prefix.length());
            } else if (argStrLower.startsWith(prefix.substring(0, prefix.length() - 1))) {
                argStr = argStr.substring(prefix.length() - 1);
            }
            assignFromWire(argStr);
        }
    }

    public final void setAddress(InternetAddress address)
    {
        m_address = address;
    }

    public final void setEsmtpExtra(String esmtpExtra)
    {
        m_esmtpExtra = esmtpExtra;
    }

    /**
     * Get any ESMTP directives which followed the address. These are "unparsed" in that any internal format of the
     * directive is not understood (i.e. something like "SIZE=100")
     */
    public final String getEsmtpExtra()
    {
        return m_esmtpExtra;
    }

    /**
     * Get the EmailAddress parsed from this Command.
     */
    public final InternetAddress getAddress()
    {
        return m_address;
    }

    protected String getArgStrPrefix()
    {
        if (getType() == CommandType.MAIL)
            return PREFIX_FROM;
        return PREFIX_TO;
    }

    @Override
    public String getArgString()
    {
        StringBuilder sb = new StringBuilder();
        sb.append(getArgStrPrefix().toUpperCase());
        sb.append(MIMEUtil.toSMTPString(getAddress()));
        if (getEsmtpExtra() != null) {
            if (!getEsmtpExtra().startsWith(" ")) {
                sb.append(" ");
            }
            sb.append(getEsmtpExtra());
        }
        return sb.toString();
    }

    /**
     * Helper for subclasses, which have already stripped-off the "TO" or "FROM"
     */
    protected void assignFromWire(String str) throws ParseException, FatalMailParseException
    {
        EmailAddressAndExtra ewe = parseAddressAndExtra(str);
        setAddress(ewe.addr);
        setEsmtpExtra(ewe.extra);
    }

    /**
     * Parses an email address (which is assumed to begin at str index 0) and any extra ESMTP junk at the end
     */
    protected static EmailAddressAndExtra parseAddressAndExtra(String str) throws ParseException,
            FatalMailParseException
    {
        if (str == null) {
            return new EmailAddressAndExtra(NULL_ADDRESS, null);
        }
        str = str.trim();
        int addrEnd = getAddressEnd(str);

        if (addrEnd == str.length() - 1) {
            // No ESMTP junk
            return new EmailAddressAndExtra(parseAddress(str), null);
        }
        String addrString = str.substring(0, addrEnd + 1);
        String esmtpString = str.substring(addrEnd + 1, str.length());

        return new EmailAddressAndExtra(parseAddress(addrString), esmtpString);
    }

    private static class EmailAddressAndExtra
    {
        final InternetAddress addr;
        final String extra;

        EmailAddressAndExtra(InternetAddress addr, String extra) {
            this.addr = addr;
            this.extra = extra;
        }

    }

    /**
     * Helper method to parse an address read from a Command argument. Subclasses using this method must tokenize away
     * any leading stuff ("FROM:", "TO:") as well as any ESMTP trailing tokens. In other words, this should be one and
     * only one address. <br>
     * Leading spaces are trimmed. <br>
     * Will never return null.
     */
    protected static InternetAddress parseAddress(String str) throws FatalMailParseException
    {
        if (str == null) {
            return NULL_ADDRESS;
        }
        str = str.trim();
        if ("".equals(str.trim()) || "<>".equals(str)) {
            return NULL_ADDRESS;
        }
        try {
            InternetAddress[] addresses = InternetAddress.parseHeader(str, false);
            if (addresses == null || addresses.length == 0) {
                return NULL_ADDRESS;
            }
            if (addresses.length > 1) {
                throw new FatalMailParseException("Line contained more than one address \"" + str + "\"");
            }
            return addresses[0];
        } catch (AddressException ex) {
            throw new FatalMailParseException("could not parse email address: " + str, ex);
        }
    }

    // For this quick-hack, I'm making the following assumptions:
    //
    // 1) If I see "<" and ">" in non-quoted portions, then
    // there is an address bounded by "<>" within the address
    // 2) If not, then the whole line is an address
    /**
     * Returns the index of the last valid character in the <code>addr</code> string from the email address (i.e.
     * inclusive).
     */
    private static int getAddressEnd(String addr)
    {
        byte[] bytes = addr.getBytes();

        boolean inQuote = false;
        boolean foundOpen = false;

        for (int i = 0; i < bytes.length; i++) {
            if (bytes[i] == '<' && !inQuote) {
                foundOpen = true;
                continue;
            }
            if (bytes[i] == '>' && !inQuote && foundOpen) {
                return i;
            }
            if (bytes[i] == '\"') {
                if (i != 0 && bytes[i - 1] == '\'') {
                    continue;
                }
                inQuote = !inQuote;
            }
        }
        return bytes.length - 1;
    }

    protected static String extractAddress(String str)
    {
        return str.substring(0, getAddressEnd(str) + 1);
    }

    /************** Tests ******************/

    public static String runTest(String[] args) throws Exception
    {

        String[] boundedTest = new String[] { "foo", "<foo", "foo>", "<foo>", "\"doo\"<foo>", "\"doo<foo>",
                "\"doo<foo\">", "\"doo\"<foo> ABCXYZ FOO", "<foo> ABC123 XYZ" };

        String result = "";
        for (String s : boundedTest) {
            result += "String: " + s + "\n";
            result += "   extractAddress: " + CommandWithEmailAddress.extractAddress(s) + "\n";
        }

        String[] tests = new String[] { "foo@moo.com", "<foo@moo.com", "foo@moo.com>", "<foo@moo.com>", "<>" };
        for (String s : tests) {
            result += "Address: " + s + "\n";
            result += "   Became \"" + CommandWithEmailAddress.parseAddress(s) + "\"\n";
        }
        return result;
    }

}
