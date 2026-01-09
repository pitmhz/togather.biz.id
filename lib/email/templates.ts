/**
 * ============================================
 * TOGATHER EMAIL TEMPLATES
 * Industrial/Tactical Brand Design System
 * ============================================
 */

import type { LandingLead } from '@/lib/schemas/leads';

/**
 * Base email styles - Industrial/Clean design
 */
const BASE_STYLES = `
  <style>
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1a1a2e;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #ffffff;
      padding: 32px 24px;
      border-radius: 12px 12px 0 0;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .header .badge {
      display: inline-block;
      background: rgba(99, 102, 241, 0.3);
      color: #a5b4fc;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 8px;
    }
    .content {
      background: #ffffff;
      padding: 32px 24px;
      border: 1px solid #e2e8f0;
      border-top: none;
    }
    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-bottom: 8px;
    }
    .data-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .data-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .data-row:last-child {
      border-bottom: none;
    }
    .data-label {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
    }
    .data-value {
      font-size: 14px;
      color: #1a1a2e;
      font-weight: 600;
      text-align: right;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      margin-top: 16px;
    }
    .footer {
      background: #f1f5f9;
      padding: 24px;
      border-radius: 0 0 12px 12px;
      border: 1px solid #e2e8f0;
      border-top: none;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
    .timestamp {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 16px;
    }
  </style>
`;

/**
 * New Lead Notification Email Template
 * 
 * Sent to core team when a new lead is captured
 */
export function newLeadNotificationTemplate(lead: LandingLead): {
    subject: string;
    html: string;
    text: string;
} {
    const timestamp = new Date(lead.created_at).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
    });

    const subject = `🎯 New Lead: ${lead.church_name} - ${lead.leader_name}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${BASE_STYLES}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📡 INCOMING TRANSMISSION</h1>
          <span class="badge">New Lead Detected</span>
        </div>
        
        <div class="content">
          <p class="section-title">Mission Intel</p>
          <div class="data-card">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <span class="data-label">Church Name</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                  <span class="data-value">${escapeHtml(lead.church_name)}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <span class="data-label">Leader Name</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                  <span class="data-value">${escapeHtml(lead.leader_name)}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <span class="data-label">Email</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                  <span class="data-value">
                    <a href="mailto:${escapeHtml(lead.email)}" style="color: #6366f1; text-decoration: none;">
                      ${escapeHtml(lead.email)}
                    </a>
                  </span>
                </td>
              </tr>
              ${lead.phone ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <span class="data-label">Phone</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                  <span class="data-value">${escapeHtml(lead.phone)}</span>
                </td>
              </tr>
              ` : ''}
              ${lead.estimated_members ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <span class="data-label">Est. Members</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                  <span class="data-value">${lead.estimated_members.toLocaleString()}</span>
                </td>
              </tr>
              ` : ''}
              ${lead.notes ? `
              <tr>
                <td colspan="2" style="padding: 12px 0;">
                  <span class="data-label">Notes</span>
                  <p style="margin: 8px 0 0; color: #1a1a2e; font-size: 14px;">
                    ${escapeHtml(lead.notes)}
                  </p>
                </td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="text-align: center;">
            <a href="https://supabase.com/dashboard/project/hhbcqgxixntpdwlzpclr/editor" class="cta-button">
              View in Command Center
            </a>
          </div>
          
          <p class="timestamp">
            📍 Captured: ${timestamp}<br>
            🔖 Lead ID: ${lead.id}
          </p>
        </div>
        
        <div class="footer">
          <p>Togather Command Center • togather.biz.id</p>
          <p style="margin-top: 8px; font-size: 11px; color: #94a3b8;">
            This is an automated notification. Do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

    const text = `
NEW LEAD DETECTED
=================

Church: ${lead.church_name}
Leader: ${lead.leader_name}
Email: ${lead.email}
${lead.phone ? `Phone: ${lead.phone}` : ''}
${lead.estimated_members ? `Est. Members: ${lead.estimated_members}` : ''}
${lead.notes ? `Notes: ${lead.notes}` : ''}

Captured: ${timestamp}
Lead ID: ${lead.id}

View in Supabase: https://supabase.com/dashboard/project/hhbcqgxixntpdwlzpclr/editor
  `.trim();

    return { subject, html, text };
}

/**
 * Escape HTML to prevent XSS in email templates
 */
function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
