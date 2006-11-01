#!/bin/zsh

## first: element = c name or if no second, c and java name
## second: java name
packages=( "Vector" "IncomingSocketQueue" "OutgoingSocketQueue" "TCPSink" "TCPSource" "Relay" "Crumb" "Source" "Sink" "UDPSource" "UDPSink" )
package=$1

c_package=${package//./_}
j_package=${package//./\/}

header='
#ifndef __JNI_HEADER_H_
#define __JNI_HEADER_H_

/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! *
 * This file is autogenerated, do not edit manually, edit java_header_src.sh instead *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

// JN Build standard name eg com_untangle_${c_package}_Class_name
// JF Build function name eg Java_com_untangle_${c_package}_Class_name
// JP Build path
#define JN_BUILD_NAME(CLASS,NAME)  '${c_package}'_ ## CLASS ## _ ## NAME
#define JF_BUILD_NAME(CLASS,FUNC)  Java_ ## '${c_package}'_ ## CLASS ## _ ## FUNC
#define JP_BUILD_NAME(OBJ)         "'$j_package'/" #OBJ
'

footer="
#endif  // __JNI_HEADER_H_
"

page=""

generateRule() 
{
    c_name=$1
    j_name=$2
    
    if [[ "$j_name" == "" ]]; then
        j_name=$c_name
    fi
    
    page=$page"
#define JH_${c_name}       \"${c_package}_${j_name}.h\"
#define JN_${c_name}(VAL)  JN_BUILD_NAME( ${j_name}, VAL )
#define JF_${c_name}(FUNC) JF_BUILD_NAME( ${j_name}, FUNC )
#define JP_${c_name}       JP_BUILD_NAME( ${j_name} )
"
}

buildPage() 
{
    page=$header
    
    for package in $packages; do
        generateRule ${=${package}}
    done
    
    page="$page $footer"
}

buildPage

echo $page
