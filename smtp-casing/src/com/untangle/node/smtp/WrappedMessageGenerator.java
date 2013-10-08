/*
 * $HeadURL: svn://chef/work/src/smtp-casing/src/com/untangle/node/smtp/WrappedMessageGenerator.java $
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

import javax.mail.internet.MimeMessage;

import org.apache.log4j.Logger;

import com.untangle.node.smtp.mime.MIMEMessageTemplateValues;
import com.untangle.node.smtp.mime.MIMEUtil;
import com.untangle.uvm.node.Template;
import com.untangle.uvm.node.TemplateValues;
import com.untangle.uvm.node.TemplateValuesChain;

/**
 * Class which wraps a MIMEMessage with another, providing templates for the resulting subject and body. <br>
 * <br>
 * This class uses the {@link #com Template} class internally. You can create templates which derefference keys found in
 * any number of TemplateValues, passed-into the {@link #wrap wrap method} <br>
 * <br>
 * Note that the {@link #getBodyTemplate Body} and {@link #getSubjectTemplate Subject} templates may be null. If The
 * subject template is null, the subject will not be modified. If the body template is null, the message will not be
 * wrapped (i.e. disables wrapping).
 * 
 */
public class WrappedMessageGenerator
{

    private final Logger m_logger = Logger.getLogger(getClass());
    private Template m_subjectTemplate;
    private Template m_bodyTemplate;

    public WrappedMessageGenerator() {
        this(null, null);
    }

    /**
     * Full constructor. Please read the class-docs to understand impact of null templates
     * 
     * @param subjectTemplate
     *            the subject template
     * @param bodyTemplate
     *            the bodyTemplate
     */
    public WrappedMessageGenerator(String subjectTemplate, String bodyTemplate) {
        setSubject(subjectTemplate);
        setBody(bodyTemplate);
    }

    /**
     * Wrap the given MIMEMessage. Only the message itself will provide any substitution values for the body or subject
     * templates.
     * 
     * @param msg
     *            the Message to be wrapped
     * 
     * @return the wrapped message, or the original (possibly with modified subject) if the body template was null.
     */
    public MimeMessage wrap(MimeMessage msg)
    {
        return wrap(msg, new TemplateValuesChain());
    }

    /**
     * Wrap the given MIMEMessage, using the provided TemplateValues objects as sources for any substitution keys found
     * within the {@link #getBodyTemplate Body} or {@link #getSubjectTemplate Subject} templates.
     * 
     * @param msg
     *            the Message to be wrapped
     * @param values
     *            the source of any substitution values
     * 
     * @return the wrapped message, or the original (possibly with modified subject) if the body template was null.
     */
    public MimeMessage wrap(MimeMessage msg, TemplateValues... values)
    {
        return wrap(msg, new TemplateValuesChain(values));
    }

    /**
     * Wrap the given MIMEMessage, using the provided TemplateValuesChain as the source for any substitution keys found
     * within the {@link #getBodyTemplate Body} or {@link #getSubjectTemplate Subject} templates.
     * 
     * @param msg
     *            the Message to be wrapped
     * @param values
     *            the source of any substitution values
     * 
     * @return the wrapped message, or the original (possibly with modified subject) if the body template was null.
     */
    public MimeMessage wrap(MimeMessage msg, TemplateValuesChain values)
    {
        // Add the original message to the chain
        values.append(new MIMEMessageTemplateValues(msg));

        MimeMessage ret = msg;
        Template bodyTemplate = getBodyTemplate();
        if (bodyTemplate != null) {
            try {
                m_logger.debug("Wrapping body");
                ret = MIMEUtil.simpleWrap(bodyTemplate.format(values), msg);
            } catch (Exception ex) {
                m_logger.error(ex);
            }
        } else {
            m_logger.debug("No template to wrap body");
        }
        Template subjectTemplate = getSubjectTemplate();
        if (subjectTemplate != null) {
            try {
                m_logger.debug("Wrapping subject");
                ret.setSubject(subjectTemplate.format(values));
            } catch (Exception ex) {
                m_logger.error(ex);
            }
        } else {
            m_logger.debug("No template for new subject");
        }
        return ret;
    }

    public String getSubject()
    {
        return m_subjectTemplate == null ? null : m_subjectTemplate.getTemplate();
    }

    /**
     * Set the subject template.
     * 
     * @param template
     *            the template (or null to declare that subjects should not be modified).
     */
    public void setSubject(String template)
    {
        if (template == null) {
            m_subjectTemplate = null;
        }
        if (m_subjectTemplate == null) {
            m_subjectTemplate = new Template(template, false);
        } else {
            m_subjectTemplate.setTemplate(template);
        }
    }

    public String getBody()
    {
        return m_bodyTemplate == null ? null : m_bodyTemplate.getTemplate();
    }

    /**
     * Set the body template.
     * 
     * @param template
     *            the template (or null to declare that body should not be wrapped).
     */
    public void setBody(String template)
    {
        if (template == null) {
            m_bodyTemplate = null;
        }
        if (m_bodyTemplate == null) {
            m_bodyTemplate = new Template(template, false);
        } else {
            m_bodyTemplate.setTemplate(template);
        }
    }

    /**
     * For subclasses to access the internal body Template Object (or null if not set).
     */
    protected Template getBodyTemplate()
    {
        return m_bodyTemplate;
    }

    /**
     * For subclasses to access the internal subject Template Object (or null if not set).
     */
    protected Template getSubjectTemplate()
    {
        return m_subjectTemplate;
    }

}
