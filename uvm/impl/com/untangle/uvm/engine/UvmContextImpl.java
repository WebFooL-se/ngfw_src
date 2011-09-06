/*
 * $Id$
 */
package com.untangle.uvm.engine;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.Map;
import java.util.List;
import java.util.LinkedList;
import java.util.StringTokenizer;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;
import org.apache.log4j.Logger;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.AnnotationConfiguration;

import org.jabsorb.JSONSerializer;

import com.untangle.uvm.CronJob;
import com.untangle.uvm.SettingsManager;
import com.untangle.uvm.LocalUvmContext;
import com.untangle.uvm.LocalTomcatManager;
import com.untangle.uvm.LocalDirectory;
import com.untangle.uvm.Period;
import com.untangle.uvm.BrandingManager;
import com.untangle.uvm.OemManager;
import com.untangle.uvm.AppServerManager;
import com.untangle.uvm.NetworkManager;
import com.untangle.uvm.UvmException;
import com.untangle.uvm.UvmState;
import com.untangle.uvm.SessionMonitor;
import com.untangle.uvm.argon.Argon;
import com.untangle.uvm.argon.ArgonManagerImpl;
import com.untangle.uvm.node.LicenseManager;
import com.untangle.uvm.logging.EventLogger;
import com.untangle.uvm.logging.EventLoggerFactory;
import com.untangle.uvm.logging.LogEvent;
import com.untangle.uvm.logging.UvmRepositorySelector;
import com.untangle.uvm.message.MessageManager;
import com.untangle.uvm.message.MessageManager;
import com.untangle.uvm.networking.NetworkManagerImpl;
import com.untangle.uvm.node.NodeContext;
import com.untangle.uvm.node.NodeManager;
import com.untangle.uvm.policy.PolicyManager;
import com.untangle.uvm.servlet.ServletUtils;
import com.untangle.uvm.servlet.UploadHandler;
import com.untangle.uvm.servlet.UploadManager;
import com.untangle.uvm.util.TransactionRunner;
import com.untangle.uvm.util.TransactionWork;
import com.untangle.uvm.util.XMLRPCUtil;
import com.untangle.uvm.util.JsonClient;

/**
 * Implements LocalUvmContext.
 *
 * @author <a href="mailto:amread@untangle.com">Aaron Read</a>
 * @version 1.0
 */
public class UvmContextImpl extends UvmContextBase implements LocalUvmContext
{
    private static final UvmContextImpl CONTEXT = new UvmContextImpl();

    private static final String REBOOT_SCRIPT = "/sbin/reboot";
    private static final String SHUTDOWN_SCRIPT = "/sbin/shutdown";

    private static final String CREATE_UID_SCRIPT;
    private static final String UID_FILE;
    private static final String WIZARD_COMPLETE_FLAG_FILE;

    private static final String PROPERTY_IS_DEVEL = "com.untangle.isDevel"; /* devel Env */
    private static final String PROPERTY_IS_INSIDE_VM = "com.untangle.isInsideVM"; /* vmWare */

    private static final String FACTORY_DEFAULT_FLAG = System.getProperty("uvm.conf.dir") + "/factory-defaults";
    
    private static final Object startupWaitLock = new Object();

    private final Logger logger = Logger.getLogger(UvmContextImpl.class);

    private static String uid;
    
    private UvmState state;
    private AdminManagerImpl adminManager;
    private ArgonManagerImpl argonManager;
    private LoggingManagerImpl loggingManager;
    private SyslogManagerImpl syslogManager;
    private EventLogger<LogEvent> eventLogger;
    private DefaultPolicyManager defaultPolicyManager;
    private MailSenderImpl mailSender;
    private NetworkManagerImpl networkManager;
    private ReportingManagerImpl reportingManager;
    private ConnectivityTesterImpl connectivityTester;
    private PipelineFoundryImpl pipelineFoundry;
    private ToolboxManagerImpl toolboxManager;
    private NodeManagerImpl nodeManager;
    private CronManager cronManager;
    private AppServerManagerImpl appServerManager;
    private BrandingManagerImpl brandingManager;
    private SkinManagerImpl skinManager;
    private MessageManagerImpl messageManager;
    private LanguageManagerImpl languageManager;
    private DefaultLicenseManagerImpl defaultLicenseManager;
    private TomcatManagerImpl tomcatManager;
    private HeapMonitor heapMonitor;
    private UploadManagerImpl uploadManager;
    private SettingsManagerImpl settingsManager;
    private OemManagerImpl oemManager;
    private SessionMonitorImpl sessionMonitor;
    private BackupManager backupManager;
    private LocalDirectoryImpl localDirectory;
    
    private volatile SessionFactory sessionFactory;
    private volatile TransactionRunner transactionRunner;
    private volatile List<String> annotatedClasses = new LinkedList<String>();
    
    // constructor ------------------------------------------------------------

    private UvmContextImpl()
    {
        initializeUvmAnnotatedClasses();
        refreshSessionFactory();

        state = UvmState.LOADED;
    }

    // static factory ---------------------------------------------------------

    static UvmContextImpl getInstance()
    {
        return CONTEXT;
    }

    public static LocalUvmContext context()
    {
        return CONTEXT;
    }

    // singletons -------------------------------------------------------------

    public LocalDirectory localDirectory()
    {
        return this.localDirectory;
    }

    public BrandingManager brandingManager()
    {
        return this.brandingManager;
    }

    public SkinManagerImpl skinManager()
    {
        return this.skinManager;
    }

    public MessageManager messageManager()
    {
        return this.messageManager;
    }

    public LanguageManagerImpl languageManager()
    {
        return this.languageManager;
    }

    public AppServerManagerImpl localAppServerManager()
    {
        return this.appServerManager;
    }

    public AppServerManager appServerManager()
    {
        return this.appServerManager;
    }
    
    public ToolboxManagerImpl toolboxManager()
    {
        return this.toolboxManager;
    }

    public NodeManager nodeManager()
    {
        return this.nodeManager;
    }

    public LoggingManagerImpl loggingManager()
    {
        return this.loggingManager;
    }

    public SyslogManagerImpl syslogManager()
    {
        return this.syslogManager;
    }

    public PolicyManager policyManager()
    {
        PolicyManager pm = (PolicyManager)this.nodeManager().node("untangle-node-policy");

        if (pm == null)
            return this.defaultPolicyManager;
        else
            return pm;
    }

    public MailSenderImpl mailSender()
    {
        return this.mailSender;
    }

    public AdminManagerImpl adminManager()
    {
        return this.adminManager;
    }

    @Override
    public NetworkManager networkManager()
    {
        return this.networkManager;
    }

    public ReportingManagerImpl reportingManager()
    {
        return this.reportingManager;
    }

    public ConnectivityTesterImpl getConnectivityTester()
    {
        return this.connectivityTester;
    }

    public ArgonManagerImpl argonManager()
    {
        return this.argonManager;
    }

    public LicenseManager licenseManager()
    {
        LicenseManager lm = (LicenseManager)this.nodeManager().node("untangle-node-license");

        if (lm == null)
            return this.defaultLicenseManager;
        else
            return lm;
    }

    public PipelineFoundryImpl pipelineFoundry()
    {
        return this.pipelineFoundry;
    }

    public SessionMonitor sessionMonitor()
    {
        return this.sessionMonitor;
    }

    public void waitForStartup()
    {
        synchronized (startupWaitLock) {
            while (state == UvmState.LOADED || state == UvmState.INITIALIZED) {
                try {
                    startupWaitLock.wait();
                } catch (InterruptedException exn) {
                    // reevaluate exit condition
                }
            }
        }
    }

    // service methods --------------------------------------------------------

    public boolean runTransaction(TransactionWork<?> tw)
    {
        return transactionRunner.runTransaction(tw);
    }

    /* For autonumbering anonymous threads. */
    private static class ThreadNumber
    {
        private static int threadInitNumber = 1;

        public static synchronized int nextThreadNum()
        {
            return threadInitNumber++;
        }
    }

    public Thread newThread(final Runnable runnable)
    {
        return newThread(runnable, "UTThread-" + ThreadNumber.nextThreadNum());
    }

    public Thread newThread(final Runnable runnable, final String name)
    {
        Runnable task = new Runnable()
            {
                public void run()
                {
                    NodeContext tctx = null == nodeManager
                        ? null : nodeManager.threadContext();

                    if (null != tctx) {
                        nodeManager.registerThreadContext(tctx);
                    }
                    try {
                        runnable.run();
                    } catch (OutOfMemoryError exn) {
                        UvmContextImpl.getInstance().fatalError("UvmContextImpl", exn);
                    } catch (Exception exn) {
                        logger.error("Exception running: " + runnable, exn);
                    } finally {
                        if (null != tctx) {
                            nodeManager.deregisterThreadContext();
                        }
                    }
                }
            };
        return new Thread(task, name);
    }

    public Process exec(String cmd) throws IOException
    {
        StringTokenizer st = new StringTokenizer(cmd);
        String[] cmdArray = new String[st.countTokens()];
        for (int i = 0; i < cmdArray.length; i++) {
            cmdArray[i] = st.nextToken();
        }

        return exec(cmdArray, null, null);
    }

    public Process exec(String[] cmd) throws IOException
    {
        return exec(cmd, null, null);
    }

    public Process exec(String[] cmd, String[] envp) throws IOException
    {
        return exec(cmd, envp, null);
    }

    public Process exec(String[] cmd, String[] envp, File dir) throws IOException
    {
        if (logger.isInfoEnabled()) {
            String cmdStr = new String();
            for (int i = 0 ; i < cmd.length; i++) {
                cmdStr = cmdStr.concat(cmd[i] + " ");
            }
            logger.info("System.exec(" + cmdStr + ")");
        }
        try {
            return Runtime.getRuntime().exec(cmd, envp, dir);
        } catch (IOException x) {
            // Check and see if we've run out of virtual memory.  This is very ugly
            // but there's not another apparent way.  XXXXXXXXXX
            String msg = x.getMessage();
            if (msg.contains("Cannot allocate memory")) {
                logger.error("Virtual memory exhausted in Process.exec()");
                UvmContextImpl.getInstance().fatalError("UvmContextImpl.exec", x);
                // There's no return from fatalError, but we have to
                // keep the compiler happy.
                return null;
            } else {
                throw x;
            }
        }
    }

    public void shutdown()
    {
        Thread t = newThread(new Runnable()
            {
                public void run()
                {
                    try {
                        Thread.sleep(200);
                    } catch (InterruptedException exn) {
                        
                    }
                    logger.info("thank you for choosing uvm");
                    System.exit(0);
                }
            });
        t.setDaemon(true);
        t.start();
    }

    public void rebootBox() {
        try {
            Process p = exec(new String[] { REBOOT_SCRIPT });
            for (byte[] buf = new byte[1024]; 0 <= p.getInputStream().read(buf); );
            int exitValue = p.waitFor();
            if (0 != exitValue) {
                logger.error("Unable to reboot (" + exitValue + ")");
            } else {
                logger.info("Rebooted at admin request");
            }
        } catch (InterruptedException exn) {
            logger.error("Interrupted during reboot");
        } catch (IOException exn) {
            logger.error("Exception during reboot");
        }
    }

    public void shutdownBox() {
        try {
            Process p = exec(new String[] { SHUTDOWN_SCRIPT , "-h" , "now" });
            for (byte[] buf = new byte[1024]; 0 <= p.getInputStream().read(buf); );
            int exitValue = p.waitFor();
            if (0 != exitValue) {
                logger.error("Unable to shutdown (" + exitValue + ")");
            } else {
                logger.info("Shutdown at admin request");
            }
        } catch (InterruptedException exn) {
            logger.error("Interrupted during shutdown");
        } catch (IOException exn) {
            logger.error("Exception during shutdown");
        }
    }

    public UvmState state()
    {
        return state;
    }

    public String version()
    {
        return com.untangle.uvm.Version.getVersion();
    }

    public String getFullVersion()
    {
        return com.untangle.uvm.Version.getFullVersion();
    }

    public void syncConfigFiles()
    {
        // Here it would be nice if we had a list of managers.  Then we could
        // just go through the list, testing 'instanceof HasConfigFiles'. XXX 
        adminManager.syncConfigFiles();
        mailSender.syncConfigFiles();
    }

    public byte[] createBackup() throws IOException
    {
        return backupManager.createBackup();
    }

    public void restoreBackup(byte[] backupBytes)
    throws IOException, IllegalArgumentException
    {
        backupManager.restoreBackup(backupBytes);
    }

    public void restoreBackup(String fileName)
    throws IOException, IllegalArgumentException
    {
        backupManager.restoreBackup(fileName);
    }

    public boolean isWizardComplete()
    {
        File keyFile = new File(WIZARD_COMPLETE_FLAG_FILE);
        return keyFile.exists();
    }

    public boolean isDevel()
    {
        return Boolean.getBoolean(PROPERTY_IS_DEVEL);
    }

    public boolean isInsideVM()
    {
        return Boolean.getBoolean(PROPERTY_IS_INSIDE_VM);
    }

    public void wizardComplete()
    {
        File wizardCompleteFlagFile = new File(WIZARD_COMPLETE_FLAG_FILE);

        try {
            if (wizardCompleteFlagFile.exists())
                return;
            else
                wizardCompleteFlagFile.createNewFile();
        } catch (Exception e) {
            logger.error("Unable to create wizard complete flag",e);
        }
            
    }

    public boolean createUID()
    {
        try {
            Process p;
            p = exec(new String[] { CREATE_UID_SCRIPT });
            for (byte[] buf = new byte[1024]; 0 <= p.getInputStream().read(buf); );
            int exitValue = p.waitFor();
            if (0 != exitValue) {
                logger.error("Unable to activate (" + exitValue + ")");
                return false;
            } else {
                logger.info("Activated");
            }
        } catch (InterruptedException exn) {
            logger.error("Interrupted during activation", exn);
            return false;
        } catch (IOException exn) {
            logger.error("Exception during activation", exn);
            return false;
        }

        return true;
    }
    
    public void doFullGC()
    {
        System.gc();
    }

    public EventLogger<LogEvent> eventLogger()
    {
        return eventLogger;
    }

    public CronJob makeCronJob(Period p, Runnable r)
    {
        return cronManager.makeCronJob(p, r);
    }

    public void loadLibrary(String libname) {
        System.loadLibrary(libname);
    }

    public String setProperty(String key, String value)
    {
        return System.setProperty(key, value);
    }

    public Map<String, String> getTranslations(String module)
    {
        return languageManager.getTranslations(module);
    }
    
    public String getCompanyName(){
        return this.brandingManager.getCompanyName();
    }

    public void addAnnotatedClass(String className)
    {
        if (className == null) {
            logger.warn("Invalid argument: className is null");
            return;
        }

        logger.info("Adding AnnotatedClass: " + className);
        
        for (String cname : this.annotatedClasses) {
            if (className.equals(cname))
                return; /* already in list */
        }

        this.annotatedClasses.add(className);
    }
    
    // UvmContextBase methods --------------------------------------------------

    @Override
    protected void init()
    {
        this.oemManager = new OemManagerImpl();

        this.backupManager = new BackupManager();
        
        this.uploadManager = new UploadManagerImpl();
        
        this.settingsManager = new SettingsManagerImpl();
        
        this.sessionMonitor = new SessionMonitorImpl();
        
        JSONSerializer serializer = new JSONSerializer();
        serializer.setFixupDuplicates(false);
        serializer.setMarshallNullAttributes(false);
        try {
            ServletUtils.getInstance().registerSerializers(serializer);
            settingsManager.setSerializer(serializer);
            sessionMonitor.setSerializer(serializer);
        } catch (Exception e) {
            throw new IllegalStateException("register serializers should never fail!", e);
        }
        
        uploadManager.registerHandler(new RestoreUploadHandler());

        this.cronManager = new CronManager();

        this.syslogManager = SyslogManagerImpl.manager();
        
        UvmRepositorySelector repositorySelector = UvmRepositorySelector.selector();

        if (!testHibernateConnection()) {
            fatalError("Can not connect to database. Is postgres running?", null);
        }

        this.loggingManager = new LoggingManagerImpl(repositorySelector);
        loggingManager.initSchema("uvm");
        loggingManager.start();

        this.eventLogger = EventLoggerFactory.factory().getEventLogger();

        InheritableThreadLocal<HttpServletRequest> threadRequest = new InheritableThreadLocal<HttpServletRequest>();

        this.tomcatManager = new TomcatManagerImpl(this, threadRequest,
                                                   System.getProperty("uvm.home"),
                                                   System.getProperty("uvm.web.dir"),
                                                   System.getProperty("uvm.log.dir"));

        // start services:
        this.adminManager = new AdminManagerImpl(this, threadRequest);

        // initialize the network Manager
        this.networkManager = NetworkManagerImpl.getInstance();

        this.defaultLicenseManager = new DefaultLicenseManagerImpl();

        this.mailSender = MailSenderImpl.mailSender();

        this.defaultPolicyManager = new DefaultPolicyManager();

        this.toolboxManager = ToolboxManagerImpl.toolboxManager();
        this.toolboxManager.start();

        this.pipelineFoundry = PipelineFoundryImpl.foundry();

        this.localDirectory = new LocalDirectoryImpl();
        
        this.brandingManager = new BrandingManagerImpl();

        //Skins and Language managers
        this.skinManager = new SkinManagerImpl(this);
        this.languageManager = new LanguageManagerImpl(this);

        // start nodes:
        this.nodeManager = new NodeManagerImpl(repositorySelector);

        this.messageManager = new MessageManagerImpl();

        // Retrieve the reporting configuration manager
        this.reportingManager = ReportingManagerImpl.reportingManager();

        // Retrieve the connectivity tester
        this.connectivityTester = ConnectivityTesterImpl.getInstance();

        // Retrieve the argon manager
        this.argonManager = ArgonManagerImpl.getInstance();

        this.appServerManager = new AppServerManagerImpl(this);

        // start vectoring:
        Argon.getInstance().run( networkManager );

        // Start statistic gathering
        messageManager.start();

        this.heapMonitor = new HeapMonitor();
        String useHeapMonitor = System.getProperty(HeapMonitor.KEY_ENABLE_MONITOR);
        if (null != useHeapMonitor && Boolean.valueOf(useHeapMonitor)) {
            this.heapMonitor.start();
        }

        if (isFactoryDefaults())
            initializeWizard();
        
        state = UvmState.INITIALIZED;
    }

    @Override
    protected void postInit()
    {
        syslogManager.postInit();

        // Mailsender can now query the hostname
        mailSender.postInit();

        logger.debug("restarting nodes");
        nodeManager.init();
        pipelineFoundry.clearChains();

        logger.debug("postInit complete");
        synchronized (startupWaitLock) {
            state = UvmState.RUNNING;
            startupWaitLock.notifyAll();
        }
        
        /* Reload Apache */
        tomcatManager.setRootWelcome(tomcatManager.getRootWelcome());

        //Inform the AppServer manager that everything
        //else is started.
        appServerManager.postInit();
    }

    @Override
    protected void destroy()
    {
        state = UvmState.DESTROYED;

        if (messageManager != null)
            messageManager.stop();

        // stop vectoring:
        try {
            Argon.getInstance().destroy();
        } catch (Exception exn) {
            logger.warn("could not destroy Argon", exn);
        }


        // stop nodes:
        try {
            nodeManager.destroy();
        } catch (Exception exn) {
            logger.warn("could not destroy NodeManager", exn);
        }
        nodeManager = null;

        // XXX destroy methods for:
        // - pipelineFoundry
        // - networkingManager
        // - reportingManager
        // - connectivityTester (Doesn't really need one)
        // - argonManager

        // stop services:
        try {
            if (toolboxManager != null)
                toolboxManager.destroy();
        } catch (Exception exn) {
            logger.warn("could not destroy ToolboxManager", exn);
        }
        toolboxManager = null;

        // XXX destroy methods for:
        // - mailSender
        // - adminManager

        try {
            tomcatManager.stopTomcat();
        } catch (Exception exn) {
            logger.warn("could not stop tomcat", exn);
        }

        eventLogger = null;

        try {
            if (loggingManager != null)
                loggingManager.stop();
        } catch (Exception exn) {
            logger.error("could not stop LoggingManager", exn);
        }

        try {
            if (sessionFactory != null)
                sessionFactory.close();
        } catch (HibernateException exn) {
            logger.warn("could not close Hibernate SessionFactory", exn);
        }

        try {
            if (cronManager != null)
                cronManager.destroy();
            cronManager = null;
        } catch (Exception exn) {
            logger.warn("could not stop CronManager", exn);
        }

        try {
            if (null != this.heapMonitor) {
                this.heapMonitor.stop();
            }
        } catch (Exception exn) {
            logger.warn("unable to stop the heap monitor",exn);
        }
    }

    // package protected methods ----------------------------------------------

    AppServerManager remoteAppServerManager()
    {
        return appServerManager;
    }

    boolean refreshToolbox()
    {
        boolean result = main.refreshToolbox();
        return result;
    }

    SchemaUtil schemaUtil()
    {
        return main.schemaUtil();
    }

    void fatalError(String throwingLocation, Throwable x)
    {
        main.fatalError(throwingLocation, x);
    }

    void refreshSessionFactory()
    {
        synchronized (this) {
            sessionFactory = this.makeSessionFactory(getClass().getClassLoader());
            transactionRunner = new TransactionRunner(sessionFactory);
        }
    }

    public LocalTomcatManager tomcatManager()
    {
        return tomcatManager;
    }

    boolean loadUvmResource(String name)
    {
        return main.loadUvmResource(name);
    }

    public String getServerUID()
    {
        if (this.uid == null) {
            try {
                File keyFile = new File(UID_FILE);
                if (keyFile.exists()) {
                    BufferedReader reader = new BufferedReader(new FileReader(keyFile));
                    this.uid = reader.readLine();
                    return this.uid;
                }
            } catch (IOException x) {
                logger.error("Unable to get pop id: ", x);
            }
        }
        return this.uid;
    }
    
    @Override
    public UploadManager uploadManager()
    {
        return this.uploadManager;
    }
    
    @Override 
    public SettingsManager settingsManager()
    {
        return this.settingsManager;
    }

    @Override
    public OemManager oemManager()
    {
        return this.oemManager;
    }

    // private methods --------------------------------------------------------

    private boolean testHibernateConnection()
    {
        TransactionWork<Void> tw = new TransactionWork<Void>()
            {
                public boolean doWork(Session s)
                {
                    org.hibernate.SQLQuery q = s.createSQLQuery("select 1");
                    Object o = q.uniqueResult();

                    if (null != o)
                        return true;
                    else
                        return false;
                }
            };

        return context().runTransaction(tw);
    }
    
    private class RestoreUploadHandler implements UploadHandler
    {

        @Override
        public String getName() {
            return "restore";
        }

        @Override
        public String handleFile(FileItem fileItem) throws Exception {
            byte[] backupFileBytes=fileItem.get();
            restoreBackup(backupFileBytes);
            return "restored backup file.";
        }
        
    }

    private boolean isFactoryDefaults()
    {
        return (new File(FACTORY_DEFAULT_FLAG)).exists(); 
    }

    private void initializeWizard()
    {
        /**
         * Tell alpaca to initialize wizard settings
         */
        try {
            JsonClient.getInstance().callAlpaca( XMLRPCUtil.CONTROLLER_UVM, "wizard_start", null );
        } catch (Exception exc) {
            logger.error("Failed to initialize Factory Defaults (net-alpaca returned an error)",exc);
        }

        /**
         * Remove the flag after setting initial settings
         */
        File f = new File(FACTORY_DEFAULT_FLAG);
        if (f.exists()) {
            f.delete();
        }
            
    }

    private SessionFactory makeSessionFactory(ClassLoader cl)
    {
        SessionFactory sessionFactory = null;

        try {
            AnnotationConfiguration cfg = buildAnnotationConfiguration(cl);

            long t0 = System.currentTimeMillis();
            sessionFactory = cfg.buildSessionFactory();
            long t1 = System.currentTimeMillis();

            logger.info("Built new SessionFactory in " + (t1 - t0) + " millis");
        } catch (HibernateException exn) {
            logger.warn("Failed to create SessionFactory", exn);
        }

        return sessionFactory;
    }

    @SuppressWarnings("unchecked")
	private AnnotationConfiguration buildAnnotationConfiguration(ClassLoader cl)
    {
        AnnotationConfiguration cfg = new AnnotationConfiguration();
        Thread thisThread = Thread.currentThread();
        ClassLoader oldCl = thisThread.getContextClassLoader();

        try {
            thisThread.setContextClassLoader(cl);

            for (String clz : this.annotatedClasses) {
                Class c = cl.loadClass(clz);
                cfg.addAnnotatedClass(c);
            }
        }
        catch (java.lang.ClassNotFoundException exc) {
            logger.warn("Annotated Class not found", exc);
        }
        finally {
            thisThread.setContextClassLoader(oldCl);
        }

        return cfg;
    }

    private void initializeUvmAnnotatedClasses()
    {
        /* api */
        this.addAnnotatedClass("com.untangle.uvm.LanguageSettings");
        this.addAnnotatedClass("com.untangle.uvm.MailSettings");
        this.addAnnotatedClass("com.untangle.uvm.Period");
        this.addAnnotatedClass("com.untangle.uvm.SkinSettings");
        this.addAnnotatedClass("com.untangle.uvm.AdminSettings");
        this.addAnnotatedClass("com.untangle.uvm.User");
        this.addAnnotatedClass("com.untangle.uvm.message.ActiveStat");
        this.addAnnotatedClass("com.untangle.uvm.logging.LoggingSettings");
        this.addAnnotatedClass("com.untangle.uvm.logging.SystemStatEvent");
        this.addAnnotatedClass("com.untangle.uvm.logging.SessionLogEventFromReports");
        this.addAnnotatedClass("com.untangle.uvm.logging.HttpLogEventFromReports");
        this.addAnnotatedClass("com.untangle.uvm.logging.MailLogEventFromReports");
        this.addAnnotatedClass("com.untangle.uvm.logging.OpenvpnLogEventFromReports");
        this.addAnnotatedClass("com.untangle.uvm.logging.CpdBlockEventsFromReports");
        this.addAnnotatedClass("com.untangle.uvm.logging.CpdLoginEventsFromReports");
        this.addAnnotatedClass("com.untangle.uvm.networking.AccessSettings");
        this.addAnnotatedClass("com.untangle.uvm.networking.AddressSettings");
        this.addAnnotatedClass("com.untangle.uvm.networking.MiscSettings");
        this.addAnnotatedClass("com.untangle.uvm.node.IPMaskedAddressDirectory");
        this.addAnnotatedClass("com.untangle.uvm.node.IPMaskedAddressRule");
        this.addAnnotatedClass("com.untangle.uvm.node.MimeTypeRule");
        this.addAnnotatedClass("com.untangle.uvm.node.NodePreferences");
        this.addAnnotatedClass("com.untangle.uvm.node.PipelineEndpoints");
        this.addAnnotatedClass("com.untangle.uvm.node.StringRule");
        this.addAnnotatedClass("com.untangle.uvm.policy.Policy");
        this.addAnnotatedClass("com.untangle.uvm.policy.UserPolicyRule");
        this.addAnnotatedClass("com.untangle.uvm.policy.UserPolicyRuleSet");
        this.addAnnotatedClass("com.untangle.uvm.security.NodeId");
        this.addAnnotatedClass("com.untangle.uvm.snmp.SnmpSettings");
        this.addAnnotatedClass("com.untangle.uvm.toolbox.UpgradeSettings");
        /* localapi */
        this.addAnnotatedClass("com.untangle.uvm.policy.UserPolicyRuleSet");
        this.addAnnotatedClass("com.untangle.uvm.node.PipelineStats");
        /* impl */
        this.addAnnotatedClass("com.untangle.uvm.engine.StatSettings");
        this.addAnnotatedClass("com.untangle.uvm.engine.LoginEvent");
        this.addAnnotatedClass("com.untangle.uvm.engine.PackageState");
        this.addAnnotatedClass("com.untangle.uvm.engine.NodeManagerState");
        this.addAnnotatedClass("com.untangle.uvm.engine.NodePersistentState");
        this.addAnnotatedClass("com.untangle.uvm.engine.NodeStateChange");
    }
    
    // static initializer -----------------------------------------------------

    static {
        CREATE_UID_SCRIPT = System.getProperty("uvm.bin.dir") + "/ut-createUID";
        UID_FILE = System.getProperty("uvm.conf.dir") + "/uid";
        WIZARD_COMPLETE_FLAG_FILE = System.getProperty("uvm.conf.dir") + "/wizard-complete-flag";
    }
}
