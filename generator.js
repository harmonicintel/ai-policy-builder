/* AI Policy Builder — rule-based policy generator.
   Fills the core.md template from intake answers. No AI call. */
(function (root) {
  "use strict";

  const TEMPLATE = `# {{company_name}}
## AI Usage Policy

**Effective date:** {{effective_date}}
**Policy owner:** {{policy_owner}}
**Applies to:** All employees, contractors, and anyone doing work for {{company_name}}

*This document is an internal policy, not legal advice, and does not create a lawyer-client relationship. Have a qualified professional review it before you rely on it, especially for regulated data or work in more than one country.*

### 1. Purpose and scope

This policy explains how people at {{company_name}} may use artificial intelligence (AI) tools at work. It covers any AI tool used for company work, including chat assistants, image generators, coding assistants, and AI features in other software.

[IF builds_or_plans_ai_products]
If we add AI features to a product or service we sell, those features must also follow this policy, plus any extra review the policy owner requires before launch.
[END IF]

[IF jurisdiction_includes_us]
We aim to use AI in a way that is consistent with applicable U.S. state privacy laws and with good practice from the NIST AI Risk Management Framework.
[END IF]

[IF jurisdiction_includes_canada]
We aim to use AI in a way that is consistent with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA) and any applicable provincial privacy laws.
[END IF]

[IF jurisdiction_includes_eu]
We aim to use AI in a way that is consistent with the EU AI Act and applicable European data-protection law, including limiting higher-risk uses and being clear with people when AI is involved.
[END IF]

[IF jurisdiction_includes_uk]
We aim to use AI in a way that is consistent with applicable UK data-protection law and the UK's emerging AI rules.
[END IF]

[IF jurisdiction_includes_australia_nz]
We aim to use AI in a way that is consistent with applicable Australian or New Zealand privacy law.
[END IF]

[IF jurisdiction_other_only]
{{other_jurisdiction_sentence}}
[END IF]

### 2. Approved tools and how tools get approved

Staff may use the following approved AI tools for work: {{approved_tools}}.

Ask the policy owner before using a new AI tool for work. Do not put company or client information into an unapproved tool. Approval will consider the tool's purpose, the data it would see, and where that data is stored.

[IF personal_accounts_not_allowed]
Use only company-approved accounts for work. Do not use a personal AI account for company or client work.
[END IF]

[IF personal_accounts_allowed]
Personal AI accounts may be used for work only if this policy is followed in full, including the data rules below. A company account is preferred when one exists.
[END IF]

[IF personal_accounts_undecided]
When a company account exists for an approved tool, use it. If you only have a personal account, follow the data rules in this policy and tell the policy owner so a company option can be considered.
[END IF]

### 3. Acceptable and prohibited uses

**Acceptable uses** (if the data and review rules are followed) include:

- Drafting or editing documents, emails, and presentations
- Brainstorming, outlining, and research that you then verify
- Creating or editing images, design, or marketing copy for review
[IF customer_facing_or_planning]
- Helping with customer-facing content, reviewed by a person before it is sent or published
[END IF]
[IF builds_or_plans_ai_products]
- Developing or testing AI features in our products, with the policy owner's knowledge
[END IF]

**Prohibited uses:**

- Entering data this policy forbids into an AI tool
- Misleading a customer or client, inventing credentials, or impersonating a person
- Generating discriminatory, harassing, or unlawful content
- Making hiring, firing, credit, or similar decisions about a person based solely on AI output
[IF caution_strict]
- Using AI with confidential, personal, health, or financial data unless the policy owner has approved that use in writing
[END IF]
- Bypassing a tool's safety features or this policy
- Sharing login credentials for approved tools

### 4. Data protection rules

Treat anything you type into an AI tool as if the provider could store or use it. When in doubt, leave it out.

Do not enter into an AI tool:

[IF handles_pii]
- Customer or employee personal information (names with contact details, government IDs, or other identifiers), unless the tool is approved for that use and you have minimized what you share
[END IF]
[IF handles_health]
- Health or medical information, including anything that could identify a patient or describe their care
[END IF]
[IF handles_financial]
- Financial account numbers, payment card data, tax records, or similar financial information
[END IF]
[IF handles_confidential_client]
- Confidential client business information (strategies, unpublished work, credentials, or contracts), unless it has been de-identified and the policy owner has approved the tool for that use
[END IF]
[IF handles_childrens_data]
- Information about children
[END IF]
- Passwords, API keys, or other secrets
- Information we are contractually barred from sharing with a third party

[IF caution_permissive]
You may use approved tools with non-sensitive work content. If material might be confidential or personal, strip names and identifying details first, or ask the policy owner.
[END IF]

[IF caution_balanced]
Prefer de-identified or fictional examples. If a task seems to need real client or customer details, stop and ask the policy owner before pasting them into a tool.
[END IF]

[IF caution_strict]
Use only the minimum information needed, and only in approved tools. If a use involves personal, health, financial, or confidential data, get written approval from the policy owner first.
[END IF]

### 5. Human review and accuracy

AI tools can be wrong, outdated, or biased. You are responsible for work you submit or publish, even if AI helped create it.

{{review_rule_text}}

Check facts, figures, names, and quotes before relying on them. Do not present AI output as expert advice unless a qualified person has reviewed it.

### 6. Transparency with customers

[IF customer_facing_or_planning]
If AI helped create something a customer or the public will see, be honest if asked. Do not hide AI use when a person would reasonably want to know, such as a chatbot or a large volume of outreach.

Do not claim that AI-generated work is purely human-made if that would mislead a client or customer.
[END IF]

[IF internal_only_ai]
AI is for internal use only under this policy. Do not deploy a customer-facing AI tool (such as a public chatbot) without the policy owner's approval and a plan for how we will disclose it.
[END IF]

[IF has_client_contract_requirements]
We will also follow any client or contract rules about disclosing or restricting AI use: {{client_requirements_summary}}
[END IF]

### 7. IP and confidentiality

Work you create for {{company_name}} or our clients remains subject to our confidentiality and intellectual property rules, whether or not AI was used.

Do not upload client materials or unpublished work into an AI tool unless that use is approved under Section 4. Do not use AI to copy someone else's protected work.

If a client forbids AI use on their work, we will honor that.

### 8. Roles and accountability

- **Everyone** is responsible for following this policy and for the quality of their work.
- **The policy owner ({{policy_owner}})** approves tools, answers questions, handles incidents, and keeps this policy current.
- **Managers** make sure their teams know the policy and have time to follow it.
[IF builds_or_plans_ai_products]
- **Anyone building AI into a product we sell** must involve the policy owner before launch and document how the feature is used, what data it processes, and how people can get help if something goes wrong.
[END IF]

### 9. Training

Anyone who uses AI for work should read this policy first. The policy owner will share updates when tools or rules change. If you are unsure whether a use is allowed, ask before you proceed.

### 10. Incidents and violations

Tell the policy owner promptly if:

- Sensitive information may have been entered into an unapproved tool, or misused in an approved one
- Inaccurate, biased, or harmful AI output was sent to a customer or published
- An unapproved tool is being used with company or client data
- A client or regulator raises a concern about our AI use

We will contain the issue, notify people if required, and fix the gap. Violations may lead to loss of tool access or other workplace action. Promptly reported mistakes will be handled constructively.

### 11. Review cadence

The policy owner will review this policy at least {{review_cadence}}, and sooner if we adopt a major new tool, enter a new market, or applicable law changes. This version replaces any earlier AI usage policy.
`;

  const TOOL_NAMES = {
    chatgpt: "ChatGPT",
    copilot: "Microsoft Copilot",
    gemini: "Google Gemini",
    claude: "Claude",
    canva: "Canva AI",
    image: "Midjourney and other image generators",
    coding: "GitHub Copilot",
  };

  const NONE_RE = /^\s*(none|n\/a|n\/a\.|na|no|nope|nothing|nil|not applicable|-|—|–)\s*\.?$/i;

  function trim(value) {
    return String(value == null ? "" : value).trim();
  }

  function formatDate(date) {
    const d = date instanceof Date ? date : new Date();
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function naturalList(items) {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return items[0] + " and " + items[1];
    return items.slice(0, -1).join(", ") + ", and " + items[items.length - 1];
  }

  function isNone(text) {
    const t = trim(text);
    return !t || NONE_RE.test(t);
  }

  function sentence(text) {
    let t = trim(text).replace(/\s+/g, " ");
    if (!t) return "";
    if (!/[.?!]$/.test(t)) t += ".";
    return t;
  }

  function approvedToolsText(answers) {
    const tools = Array.isArray(answers.tools) ? answers.tools.slice() : [];
    const named = [];
    const hasUnsure = tools.includes("unsure");
    const specifics = tools.filter((t) => t !== "unsure");

    specifics.forEach((id) => {
      if (id === "industry_specific") {
        named.push(trim(answers.toolsIndustry) || "industry-specific AI tools");
      } else if (id === "other") {
        named.push(trim(answers.toolsOther) || "other approved tools");
      } else if (TOOL_NAMES[id]) {
        named.push(TOOL_NAMES[id]);
      }
    });

    if (named.length === 0) {
      return "tools specifically approved in writing by the policy owner. No tool is pre-approved until that happens.";
    }
    return naturalList(named);
  }

  function reviewRuleText(answers) {
    const review = answers.review || "";
    const caution = answers.caution || "balanced";
    const creator =
      "The person who used the AI tool must review the output before it is shared outside the company or published.";
    if (review === "creator") return creator;
    if (review === "manager") {
      return "A second person (a manager or designated reviewer) must review AI-assisted work before it is sent to a customer or published.";
    }
    if (review === "depends") {
      return "The person who used the tool must review all AI-assisted work. Client deliverables and public-facing content also need a second reviewer before they go out.";
    }
    // Skipped or "We don't have a rule yet"
    if (caution === "strict") {
      return creator + " A second person must also review anything sent to a customer or published.";
    }
    return creator;
  }

  function otherJurisdictionSentence(answers) {
    const place = trim(answers.jurisdictionOther);
    if (place) {
      return "Staff should follow the privacy and AI rules that apply in " + place + ".";
    }
    return "Staff should follow the privacy and AI rules that apply in the places the company operates.";
  }

  function buildConditions(answers) {
    const regions = Array.isArray(answers.regions) ? answers.regions : [];
    const data = Array.isArray(answers.data) ? answers.data : [];
    const specificData = data.filter((d) => d !== "no_sensitive" && d !== "unsure");
    const q7 = answers.customerFacing || "";
    const q8 = answers.products || "";
    const q13 = answers.personalAccounts || "";
    const caution = answers.caution || "balanced";
    const builds = q8 === "yes" || q8 === "planning";
    const customerFacing = q7 === "yes" || q7 === "planning";
    const internalOnly =
      q7 === "internal" || ((!q7 || q7 === "unsure") && !builds);

    return {
      builds_or_plans_ai_products: builds,
      jurisdiction_includes_us: regions.includes("us"),
      jurisdiction_includes_canada: regions.includes("canada"),
      jurisdiction_includes_eu: regions.includes("eu"),
      jurisdiction_includes_uk: regions.includes("uk"),
      jurisdiction_includes_australia_nz: regions.includes("australia_nz"),
      jurisdiction_other_only:
        regions.length === 1 && regions[0] === "other",
      personal_accounts_not_allowed: q13 === "not_allowed",
      personal_accounts_allowed: q13 === "allowed",
      personal_accounts_undecided: !q13 || q13 === "undecided",
      customer_facing_or_planning: customerFacing,
      internal_only_ai: internalOnly,
      caution_permissive: caution === "permissive",
      caution_balanced: caution === "balanced",
      caution_strict: caution === "strict",
      handles_pii: specificData.includes("pii"),
      handles_health: specificData.includes("health"),
      handles_financial: specificData.includes("financial"),
      handles_confidential_client: specificData.includes("confidential"),
      handles_childrens_data: specificData.includes("children"),
      has_client_contract_requirements: !isNone(answers.contracts),
    };
  }

  function buildPlaceholders(answers, conds) {
    const company = trim(answers.companyName) || "the company";
    const owner =
      trim(answers.policyOwner) ||
      "the person designated by management as the AI policy owner";
    const cadence =
      answers.caution === "strict" || conds.handles_health || conds.handles_financial
        ? "every six months"
        : "once a year";

    return {
      company_name: company,
      effective_date: trim(answers.effectiveDate) || formatDate(new Date()),
      policy_owner: owner,
      approved_tools: approvedToolsText(answers),
      review_rule_text: reviewRuleText(answers),
      client_requirements_summary: sentence(answers.contracts),
      review_cadence: cadence,
      other_jurisdiction_sentence: otherJurisdictionSentence(answers),
    };
  }

  function applyConditionals(template, conds) {
    return template.replace(
      /\[IF ([^\]]+)\]\n?([\s\S]*?)\[END IF\]\n?/g,
      function (_, name, body) {
        return conds[name] ? body : "";
      }
    );
  }

  function fillPlaceholders(text, values) {
    return text.replace(/\{\{([a-z_]+)\}\}/g, function (_, key) {
      return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : "";
    });
  }

  function tidy(text) {
    return text
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim() + "\n";
  }

  function leftoverTags(text) {
    const found = [];
    const ifs = text.match(/\[IF [^\]]+\]|\[END IF\]|\{\{[a-z_]+\}\}/g);
    if (ifs) found.push.apply(found, ifs);
    return found;
  }

  function wordCount(text) {
    return String(text).trim().split(/\s+/).filter(Boolean).length;
  }

  function markdownToPlain(md) {
    return md
      .replace(/^#\s+(.*)$/gm, "$1")
      .replace(/^##\s+(.*)$/gm, "$1")
      .replace(/^###\s+(.*)$/gm, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/^- /gm, "• ")
      .trim() + "\n";
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function inlineHtml(s) {
    return escapeHtml(s)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }

  function markdownToHtml(md) {
    const lines = md.replace(/\n$/, "").split("\n");
    const out = [];
    let list = [];

    function flushList() {
      if (!list.length) return;
      out.push("<ul>");
      list.forEach(function (item) {
        out.push("<li>" + inlineHtml(item) + "</li>");
      });
      out.push("</ul>");
      list = [];
    }

    lines.forEach(function (line) {
      if (line.startsWith("- ")) {
        list.push(line.slice(2));
        return;
      }
      flushList();
      if (line === "") {
        return;
      }
      if (line.startsWith("# ")) {
        out.push("<h1>" + inlineHtml(line.slice(2)) + "</h1>");
      } else if (line.startsWith("## ")) {
        out.push("<h2>" + inlineHtml(line.slice(3)) + "</h2>");
      } else if (line.startsWith("### ")) {
        out.push("<h3>" + inlineHtml(line.slice(4)) + "</h3>");
      } else {
        const italicOnly = /^\*[^*]+\*$/.test(line) && line.indexOf("**") === -1;
        const cls = italicOnly ? ' class="disclaimer"' : "";
        out.push("<p" + cls + ">" + inlineHtml(line) + "</p>");
      }
    });
    flushList();
    return out.join("\n");
  }

  function generatePolicy(answers) {
    const input = answers || {};
    const conds = buildConditions(input);
    const values = buildPlaceholders(input, conds);
    let md = applyConditionals(TEMPLATE, conds);
    md = fillPlaceholders(md, values);
    md = tidy(md);

    // If transparency would be a bare heading (rare: Q7 unsure and Q8 yes/planning),
    // keep the required section from looking empty.
    md = md.replace(
      /### 6\. Transparency with customers\n\n(?=### )/g,
      "### 6. Transparency with customers\n\nIf AI is used in work a customer will see, be honest if asked. Do not hide AI use when a person would reasonably want to know.\n\n"
    );

    const leftovers = leftoverTags(md);
    return {
      markdown: md,
      plain: markdownToPlain(md),
      html: markdownToHtml(md),
      wordCount: wordCount(md),
      leftovers: leftovers,
      companyName: values.company_name,
      effectiveDate: values.effective_date,
      conditions: conds,
    };
  }

  const api = {
    generatePolicy: generatePolicy,
    formatDate: formatDate,
    wordCount: wordCount,
    leftoverTags: leftoverTags,
    markdownToPlain: markdownToPlain,
    markdownToHtml: markdownToHtml,
  };

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.AIPolicy = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
