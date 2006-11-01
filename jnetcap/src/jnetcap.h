
/*
 * Copyright (c) 2003-2006 Untangle Networks, Inc.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * Untangle Networks, Inc. ("Confidential Information"). You shall
 * not disclose such Confidential Information.
 *
 *  $Id$
 */

#ifndef __JNETCAP_H_
#define __JNETCAP_H_

/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  *
 * This file is autogenerated, do not edit manually, edit jnetcap_src.sh instead  *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  */

#define _UNINITIALIZED  0xDEADD00D
#define _INITIALIZED    ~_UNINITIALIZED

#define JLONG_TO_UINT( j_long )  ((unsigned long)(j_long) & 0xFFFFFFFF)
#define UINT_TO_JLONG( num )     ((jlong)((uint)(num)))

extern __thread JNIEnv* thread_env;
JNIEnv* jnetcap_get_java_env( void );

/* Returns INITIALIZED if netcap is unitialized, and unitialized otherwise */
int jnetcap_initialized( void );

// JN Build standard name eg com_untangle_jnetcap_Class_name
// JF Build function name eg Java_com_untangle_jnetcap_Class_name
// JP Build path
#define JN_BUILD_NAME(CLASS,NAME)  com_untangle_jnetcap_ ## CLASS ## _ ## NAME
#define JF_BUILD_NAME(CLASS,FUNC)  Java_ ## com_untangle_jnetcap_ ## CLASS ## _ ## FUNC
#define JP_BUILD_NAME(OBJ)         "com/untangle/jnetcap/" #OBJ

#define JH_Netcap       "com_untangle_jnetcap_Netcap.h"
#define JN_Netcap(VAL)  JN_BUILD_NAME( Netcap, VAL )
#define JF_Netcap(FUNC) JF_BUILD_NAME( Netcap, FUNC )

#define JH_Session       "com_untangle_jnetcap_NetcapSession.h"
#define JN_Session(VAL)  JN_BUILD_NAME( NetcapSession, VAL )
#define JF_Session(FUNC) JF_BUILD_NAME( NetcapSession, FUNC )

#define JH_UDPSession       "com_untangle_jnetcap_NetcapUDPSession.h"
#define JN_UDPSession(VAL)  JN_BUILD_NAME( NetcapUDPSession, VAL )
#define JF_UDPSession(FUNC) JF_BUILD_NAME( NetcapUDPSession, FUNC )

#define JH_TCPSession       "com_untangle_jnetcap_NetcapTCPSession.h"
#define JN_TCPSession(VAL)  JN_BUILD_NAME( NetcapTCPSession, VAL )
#define JF_TCPSession(FUNC) JF_BUILD_NAME( NetcapTCPSession, FUNC )

#define JH_IPTraffic       "com_untangle_jnetcap_IPTraffic.h"
#define JN_IPTraffic(VAL)  JN_BUILD_NAME( IPTraffic, VAL )
#define JF_IPTraffic(FUNC) JF_BUILD_NAME( IPTraffic, FUNC )

#define JH_Shield       "com_untangle_jnetcap_Shield.h"
#define JN_Shield(VAL)  JN_BUILD_NAME( Shield, VAL )
#define JF_Shield(FUNC) JF_BUILD_NAME( Shield, FUNC )

#define JH_ICMPTraffic       "com_untangle_jnetcap_ICMPTraffic.h"
#define JN_ICMPTraffic(VAL)  JN_BUILD_NAME( ICMPTraffic, VAL )
#define JF_ICMPTraffic(FUNC) JF_BUILD_NAME( ICMPTraffic, FUNC )
 
#endif  // __JNETCAP_H_

