/**
 * $Id: ServletUtils.java 35079 2013-06-19 22:15:28Z dmorris $
 */
package com.untangle.uvm.servlet;

import org.jabsorb.JSONRPCBridge;
import org.jabsorb.JSONSerializer;
import org.jabsorb.serializer.Serializer;

import com.untangle.uvm.webui.jabsorb.serializer.EnumSerializer;
import com.untangle.uvm.webui.jabsorb.serializer.IPMaskedAddressSerializer;
import com.untangle.uvm.webui.jabsorb.serializer.InetAddressSerializer;
import com.untangle.uvm.webui.jabsorb.serializer.MimeTypeSerializer;
import com.untangle.uvm.webui.jabsorb.serializer.TimeSerializer;
import com.untangle.uvm.webui.jabsorb.serializer.TimeZoneSerializer;
import com.untangle.uvm.webui.jabsorb.serializer.URLSerializer;
import com.untangle.uvm.webui.jabsorb.serializer.GenericStringSerializer;
import com.untangle.uvm.node.ProtocolMatcher;
import com.untangle.uvm.node.IPMatcher;
import com.untangle.uvm.node.IntMatcher;
import com.untangle.uvm.node.IntfMatcher;
import com.untangle.uvm.node.DayOfWeekMatcher;
import com.untangle.uvm.node.TimeOfDayMatcher;
import com.untangle.uvm.node.UserMatcher;
import com.untangle.uvm.node.GlobMatcher;
import com.untangle.uvm.node.UrlMatcher;

@SuppressWarnings("unchecked")
public class ServletUtils 
{
    public static final ServletUtils INSTANCE = new ServletUtils();
    
    private ServletUtils()
    {
        
    }
    
    public void registerSerializers(JSONRPCBridge bridge ) throws Exception
    {
        registerSerializers(JSON_RPC_BRIDGE_REGISTRATOR, bridge);
    }
    
    public void registerSerializers(JSONSerializer serializer) throws Exception
    {
        serializer.registerDefaultSerializers();
        registerSerializers(JSON_SERIALIZER_REGISTRATOR, serializer);
    }
    
    public static ServletUtils getInstance()
    {
        return INSTANCE;
    }
    
    private <T> void registerSerializers(Registrator<T> registrator, T root) throws Exception
    {
        // general serializers
        registrator.registerSerializer(root, new EnumSerializer());
        registrator.registerSerializer(root, new URLSerializer());
        registrator.registerSerializer(root, new InetAddressSerializer());
        registrator.registerSerializer(root, new TimeSerializer());
        
        // uvm related serializers
        registrator.registerSerializer(root, new IPMaskedAddressSerializer());
        registrator.registerSerializer(root, new TimeZoneSerializer());

        registrator.registerSerializer(root, new MimeTypeSerializer());
        
        // matchers
        registrator.registerSerializer(root, new GenericStringSerializer(ProtocolMatcher.class));
        registrator.registerSerializer(root, new GenericStringSerializer(IPMatcher.class));
        registrator.registerSerializer(root, new GenericStringSerializer(IntMatcher.class));
        registrator.registerSerializer(root, new GenericStringSerializer(IntfMatcher.class));
        registrator.registerSerializer(root, new GenericStringSerializer(DayOfWeekMatcher.class));
        registrator.registerSerializer(root, new GenericStringSerializer(TimeOfDayMatcher.class));
        registrator.registerSerializer(root, new GenericStringSerializer(UserMatcher.class));
        registrator.registerSerializer(root, new GenericStringSerializer(GlobMatcher.class));
        registrator.registerSerializer(root, new GenericStringSerializer(UrlMatcher.class));
    }
    
    private static interface Registrator<T>
    {
        void registerSerializer(T base, Serializer s) throws Exception;
    }
      

    private static Registrator JSON_SERIALIZER_REGISTRATOR = new Registrator<JSONSerializer>() {       
        public void registerSerializer(JSONSerializer serializer, Serializer s ) throws Exception {
            serializer.registerSerializer(s);
        }
    };

    private static Registrator JSON_RPC_BRIDGE_REGISTRATOR = new Registrator<JSONRPCBridge>() {        
        public void registerSerializer(JSONRPCBridge bridge, Serializer s ) throws Exception {
            bridge.registerSerializer(s);
        }
    };

}
