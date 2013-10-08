/**
 * $Id: SpamMessageAction.java 35674 2013-08-19 22:12:28Z dmorris $
 */
package com.untangle.node.spam;

public enum SpamMessageAction
{
    PASS('P', "pass message"),
    MARK('M', "mark message"),
    DROP('D', "drop message"),
    BLOCK('B', "block message"),
    QUARANTINE('Q', "quarantine message"),
    SAFELIST('S', "pass safelist message"),
    OVERSIZE('Z', "pass oversize message"),
    OUTBOUND('O', "pass outbound message");

    public static final char PASS_KEY = 'P';
    public static final char MARK_KEY = 'M';
    public static final char DROP_KEY = 'D';
    public static final char BLOCK_KEY = 'B';
    public static final char QUARANTINE_KEY = 'Q';
    public static final char SAFELIST_KEY = 'S'; // special pass case
    public static final char OVERSIZE_KEY = 'Z'; // special pass case
    public static final char OUTBOUND_KEY = 'O'; // special pass case

    private String name;
    private char key;

    private SpamMessageAction(char key, String name)
    {
        this.key = key;
        this.name = name;
    }

    public static SpamMessageAction getInstance(char key)
    {
        SpamMessageAction[] values = values();
        for (int i = 0; i < values.length; i++) {
            if (values[i].getKey() == key){
                return values[i];
            }
        }
        return null;
    }

    public char getKey()
    {
        return key;
    }
    
    public String getName()
    {
        return name;
    }
}
