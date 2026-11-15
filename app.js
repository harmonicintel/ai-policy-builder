/* AI Policy Builder — form, navigation, and result actions. */
(function () {
  "use strict";

  const STORAGE_KEY = "ai-policy-builder-draft";
  const LEADS_KEY = "ai-policy-builder-leads";
  const SECTION_NAMES = ["Your business", "Tools and data", "How you use AI", "Ownership and wrap-up"];
  const TOTAL = 4;

  const SAMPLE_NORTHSHORE = {
    companyName: "Northshore Creative",
    industry: "marketing",
    industryOther: "",
    size: "10-49",
    regions: ["canada"],
    usStates: "",
    caProvinces: "Ontario",
    jurisdictionOther: "",
    tools: ["chatgpt", "canva"],
    toolsIndustry: "",
    toolsOther: "",
    data: ["confidential"],
    customerFacing: "yes",
    products: "no",
    caution: "balanced",
    policyOwner: "Priya Shah, Director of Operations",
    contracts: "None",
    review: "depends",
    personalAccounts: "not_allowed",
    email: "",
    effectiveDate: "November 14, 2026",
  };

  const views = {
    landing: document.getElementById("view-landing"),
    form: document.getElementById("view-form"),
    result: document.getElementById("view-result"),
  };

  const form = document.getElementById("intake-form");
  const btnStart = document.getElementById("btn-start");
  const btnSample = document.getElementById("btn-sample");
  const btnBack = document.getElementById("btn-back");
  const btnNext = document.getElementById("btn-next");
  const btnDownload = document.getElementById("btn-download");
  const btnCopy = document.getElementById("btn-copy");
  const btnPrint = document.getElementById("btn-print");
  const btnRestart = document.getElementById("btn-restart");
  const toast = document.getElementById("toast");
  const recap = document.getElementById("recap");
  const policyEl = document.getElementById("policy-document");
  const wordCountEl = document.getElementById("word-count");

  let step = 1;
  let currentPolicy = null;
  let toastTimer = null;

  function showView(name) {
    Object.keys(views).forEach(function (key) {
      views[key].classList.toggle("is-active", key === name);
    });
    window.scrollTo(0, 0);
  }

  function showToast(message) {
    toast.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.textContent = "";
    }, 3200);
  }

  function checkedValues(name) {
    return Array.prototype.map
      .call(form.querySelectorAll('input[name="' + name + '"]:checked'), function (el) {
        return el.value;
      });
  }

  function radioValue(name) {
    const el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : "";
  }

  function setChecked(name, values) {
    const set = Array.isArray(values) ? values : values ? [values] : [];
    form.querySelectorAll('input[name="' + name + '"]').forEach(function (el) {
      el.checked = set.indexOf(el.value) !== -1;
    });
  }

  function collectAnswers() {
    return {
      companyName: document.getElementById("companyName").value,
      industry: document.getElementById("industry").value,
      industryOther: document.getElementById("industryOther").value,
      size: radioValue("size"),
      regions: checkedValues("regions"),
      usStates: document.getElementById("usStates").value,
      caProvinces: document.getElementById("caProvinces").value,
      jurisdictionOther: document.getElementById("jurisdictionOther").value,
      tools: checkedValues("tools"),
      toolsIndustry: document.getElementById("toolsIndustry").value,
      toolsOther: document.getElementById("toolsOther").value,
      data: checkedValues("data"),
      customerFacing: radioValue("customerFacing"),
      products: radioValue("products"),
      caution: radioValue("caution"),
      policyOwner: document.getElementById("policyOwner").value,
      contracts: document.getElementById("contracts").value,
      review: radioValue("review"),
      personalAccounts: radioValue("personalAccounts"),
      email: document.getElementById("email").value,
    };
  }

  function fillAnswers(answers) {
    const a = answers || {};
    document.getElementById("companyName").value = a.companyName || "";
    document.getElementById("industry").value = a.industry || "";
    document.getElementById("industryOther").value = a.industryOther || "";
    setChecked("size", a.size);
    setChecked("regions", a.regions);
    document.getElementById("usStates").value = a.usStates || "";
    document.getElementById("caProvinces").value = a.caProvinces || "";
    document.getElementById("jurisdictionOther").value = a.jurisdictionOther || "";
    setChecked("tools", a.tools);
    document.getElementById("toolsIndustry").value = a.toolsIndustry || "";
    document.getElementById("toolsOther").value = a.toolsOther || "";
    setChecked("data", a.data);
    setChecked("customerFacing", a.customerFacing);
    setChecked("products", a.products);
    setChecked("caution", a.caution);
    document.getElementById("policyOwner").value = a.policyOwner || "";
    document.getElementById("contracts").value = a.contracts || "";
    setChecked("review", a.review);
    setChecked("personalAccounts", a.personalAccounts);
    document.getElementById("email").value = a.email || "";
    syncSubfields();
    updateRecap();
  }

  function saveDraft() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step: step, answers: collectAnswers() }));
    } catch (e) { /* ignore private-mode errors */ }
  }

  function loadDraft() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function clearDraft() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  }

  function storeLead(email, company) {
    const value = (email || "").trim();
    if (!value) return;
    try {
      const list = JSON.parse(localStorage.getItem(LEADS_KEY) || "[]");
      list.push({ email: value, company: company || "", at: new Date().toISOString() });
      localStorage.setItem(LEADS_KEY, JSON.stringify(list));
    } catch (e) { /* ignore */ }
  }

  function showError(id, message) {
    const el = document.getElementById("err-" + id);
    const field = form.querySelector('[data-field="' + id + '"]');
    if (el) {
      el.textContent = message || "";
      el.hidden = !message;
    }
    if (field) field.classList.toggle("has-error", !!message);
  }

  function clearErrors() {
    ["companyName", "regions", "tools", "data", "caution", "email"].forEach(function (id) {
      showError(id, "");
    });
  }

  function validEmail(value) {
    if (!value) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateStep(n) {
    clearErrors();
    const a = collectAnswers();
    let ok = true;
    if (n === 1) {
      if (!a.companyName.trim()) {
        showError("companyName", "Please enter your company name.");
        ok = false;
      }
      if (!a.regions.length) {
        showError("regions", "Select at least one region.");
        ok = false;
      } else if (a.regions.indexOf("other") !== -1 && !a.jurisdictionOther.trim()) {
        showError("regions", "Please specify the other region.");
        ok = false;
      }
    }
    if (n === 2) {
      if (!a.tools.length) {
        showError("tools", "Select at least one option. Choose “We are not sure yet” if you don't know.");
        ok = false;
      }
      if (!a.data.length) {
        showError("data", "Select at least one option. Choose “Not sure” if you don't know.");
        ok = false;
      }
    }
    if (n === 3) {
      if (!a.caution) {
        showError("caution", "Please choose how cautious this policy should be.");
        ok = false;
      }
    }
    if (n === 4) {
      if (!validEmail(a.email.trim())) {
        showError("email", "That email address doesn't look quite right. You can also leave it blank.");
        ok = false;
      }
    }
    return ok;
  }

  function syncSubfields() {
    const industry = document.getElementById("industry").value;
    document.getElementById("industry-other-wrap").hidden = industry !== "other";

    const regions = checkedValues("regions");
    document.getElementById("us-states-wrap").hidden = regions.indexOf("us") === -1;
    document.getElementById("ca-provinces-wrap").hidden = regions.indexOf("canada") === -1;
    document.getElementById("jurisdiction-other-wrap").hidden = regions.indexOf("other") === -1;

    const tools = checkedValues("tools");
    document.getElementById("tools-industry-wrap").hidden = tools.indexOf("industry_specific") === -1;
    document.getElementById("tools-other-wrap").hidden = tools.indexOf("other") === -1;
  }

  function exclusiveGroup(name, justChecked, exclusiveValues, specificValues) {
    if (!justChecked) return;
    const boxes = form.querySelectorAll('input[name="' + name + '"]');
    if (exclusiveValues.indexOf(justChecked.value) !== -1 && justChecked.checked) {
      boxes.forEach(function (el) {
        if (el !== justChecked) el.checked = false;
      });
    } else if (specificValues.indexOf(justChecked.value) !== -1 && justChecked.checked) {
      boxes.forEach(function (el) {
        if (exclusiveValues.indexOf(el.value) !== -1) el.checked = false;
      });
    }
  }

  function renderStep() {
    form.querySelectorAll(".section").forEach(function (sec) {
      sec.classList.toggle("is-active", Number(sec.getAttribute("data-section")) === step);
    });
    document.getElementById("progress-text").textContent = "Step " + step + " of " + TOTAL;
    document.getElementById("progress-name").textContent = SECTION_NAMES[step - 1];
    for (let i = 1; i <= TOTAL; i++) {
      const seg = document.getElementById("pseg-" + i);
      seg.classList.toggle("is-done", i < step);
      seg.classList.toggle("is-current", i === step);
    }
    btnBack.hidden = false;
    btnBack.textContent = step === 1 ? "Home" : "Back";
    btnNext.textContent = step === TOTAL ? "Create my policy" : "Continue";
    if (step === TOTAL) updateRecap();
    const first = form.querySelector(".section.is-active input, .section.is-active select, .section.is-active textarea");
    if (first && window.matchMedia("(min-width: 721px)").matches) {
      try { first.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    }
  }

  function industryLabel(a) {
    const map = {
      professional: "Professional services",
      marketing: "Marketing, advertising, or creative",
      healthcare: "Healthcare or health services",
      financial: "Financial services or insurance",
      retail: "Retail or e-commerce",
      technology: "Technology or software",
      education: "Education",
      manufacturing: "Manufacturing or logistics",
      hospitality: "Hospitality or food service",
      other: a.industryOther || "Other",
    };
    return map[a.industry] || "";
  }

  function regionLabel(a) {
    const parts = [];
    if (a.regions.indexOf("us") !== -1) parts.push("United States" + (a.usStates.trim() ? " (" + a.usStates.trim() + ")" : ""));
    if (a.regions.indexOf("canada") !== -1) parts.push("Canada" + (a.caProvinces.trim() ? " (" + a.caProvinces.trim() + ")" : ""));
    if (a.regions.indexOf("eu") !== -1) parts.push("European Union");
    if (a.regions.indexOf("uk") !== -1) parts.push("United Kingdom");
    if (a.regions.indexOf("australia_nz") !== -1) parts.push("Australia or New Zealand");
    if (a.regions.indexOf("other") !== -1) parts.push(a.jurisdictionOther.trim() || "Other");
    return parts.join(", ");
  }

  function updateRecap() {
    const a = collectAnswers();
    const bits = [];
    if (a.companyName.trim()) bits.push("<li><strong>" + escapeHtml(a.companyName.trim()) + "</strong></li>");
    const who = [industryLabel(a), a.size ? a.size + " people" : "", regionLabel(a)].filter(Boolean).join(" · ");
    if (who) bits.push("<li>" + escapeHtml(who) + "</li>");
    if (a.tools.length) {
      const result = window.AIPolicy.generatePolicy(a);
      bits.push("<li>Approved tools will read: " + escapeHtml(result.markdown.match(/approved AI tools for work: ([^.]+)/) ? result.markdown.match(/approved AI tools for work: ([^.]+)/)[1] : "see policy") + "</li>");
    }
    if (a.caution) bits.push("<li>Caution level: " + a.caution.charAt(0).toUpperCase() + a.caution.slice(1) + "</li>");
    if (a.policyOwner.trim()) bits.push("<li>Policy owner: " + escapeHtml(a.policyOwner.trim()) + "</li>");
    recap.innerHTML = "<h3>Please check these details</h3><ul>" + (bits.join("") || "<li>Add a few details above, then create your policy.</li>") + "</ul>";
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function generateAndShow(answers) {
    const result = window.AIPolicy.generatePolicy(answers);
    currentPolicy = result;
    policyEl.innerHTML = result.html;
    wordCountEl.textContent = result.wordCount + " words";
    showView("result");
    if (result.leftovers && result.leftovers.length) {
      showToast("Something didn't fill in correctly. Please start over or try again.");
    }
    return result;
  }

  function goForm(nextStep) {
    step = nextStep || 1;
    showView("form");
    renderStep();
    saveDraft();
  }

  function onStart() {
    showView("form");
    step = 1;
    renderStep();
  }

  function onSample() {
    fillAnswers(SAMPLE_NORTHSHORE);
    saveDraft();
    storeLead(SAMPLE_NORTHSHORE.email, SAMPLE_NORTHSHORE.companyName);
    generateAndShow(Object.assign({}, SAMPLE_NORTHSHORE));
  }

  function onBack() {
    if (step === 1) {
      showView("landing");
      return;
    }
    step -= 1;
    renderStep();
    saveDraft();
  }

  function onNext() {
    if (!validateStep(step)) {
      const firstErr = form.querySelector(".section.is-active .error:not([hidden])");
      if (firstErr) firstErr.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    if (step < TOTAL) {
      step += 1;
      renderStep();
      saveDraft();
      return;
    }
    const answers = collectAnswers();
    storeLead(answers.email, answers.companyName);
    generateAndShow(answers);
    saveDraft();
  }

  async function onDownload() {
    if (!currentPolicy) return;
    btnDownload.disabled = true;
    try {
      await window.AIPolicyDocx.downloadPolicy(currentPolicy);
      showToast("Word file downloaded.");
    } catch (err) {
      console.error(err);
      showToast("Couldn't create the Word file. Try Copy text or Print instead.");
    } finally {
      btnDownload.disabled = false;
    }
  }

  async function onCopy() {
    if (!currentPolicy) return;
    const text = currentPolicy.plain;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const area = document.createElement("textarea");
        area.value = text;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        area.remove();
      }
      showToast("Policy copied to the clipboard.");
    } catch (err) {
      showToast("Couldn't copy automatically. You can select the text instead.");
    }
  }

  function onPrint() {
    window.print();
  }

  function onRestart() {
    const ok = window.confirm("Start over and clear your answers?");
    if (!ok) return;
    form.reset();
    currentPolicy = null;
    policyEl.innerHTML = "";
    clearDraft();
    clearErrors();
    syncSubfields();
    step = 1;
    showView("landing");
  }

  // Events
  btnStart.addEventListener("click", onStart);
  btnSample.addEventListener("click", onSample);
  btnBack.addEventListener("click", onBack);
  btnNext.addEventListener("click", onNext);
  btnDownload.addEventListener("click", onDownload);
  btnCopy.addEventListener("click", onCopy);
  btnPrint.addEventListener("click", onPrint);
  btnRestart.addEventListener("click", onRestart);

  function clearFieldError(target) {
    const field = target && target.closest("[data-field]");
    if (field) showError(field.getAttribute("data-field"), "");
  }

  form.addEventListener("change", function (ev) {
    const t = ev.target;
    clearFieldError(t);
    if (t && t.name === "tools") {
      exclusiveGroup("tools", t, ["unsure"], ["chatgpt", "copilot", "gemini", "claude", "canva", "image", "coding", "industry_specific", "other"]);
    }
    if (t && t.name === "data") {
      exclusiveGroup("data", t, ["no_sensitive", "unsure"], ["pii", "health", "financial", "confidential", "children"]);
    }
    syncSubfields();
    saveDraft();
    if (step === TOTAL) updateRecap();
  });

  form.addEventListener("input", function (ev) {
    clearFieldError(ev.target);
    saveDraft();
    if (step === TOTAL) updateRecap();
  });

  form.addEventListener("keydown", function (ev) {
    if (ev.key !== "Enter") return;
    if (ev.target && ev.target.tagName === "TEXTAREA") return;
    ev.preventDefault();
    onNext();
  });

  document.querySelector(".brand").addEventListener("click", function (ev) {
    if (views.result.classList.contains("is-active") || views.form.classList.contains("is-active")) {
      ev.preventDefault();
      if (views.form.classList.contains("is-active") && step > 1) {
        showView("landing");
      } else {
        showView("landing");
      }
    }
  });

  // Restore a draft if the page was refreshed mid-form.
  const draft = loadDraft();
  if (draft && draft.answers && draft.answers.companyName) {
    fillAnswers(draft.answers);
  } else {
    syncSubfields();
  }

  // Public helpers for tests and demos.
  window.__policyApp = {
    fillAnswers: fillAnswers,
    collectAnswers: collectAnswers,
    goForm: goForm,
    showView: showView,
    generateAndShow: generateAndShow,
    sample: SAMPLE_NORTHSHORE,
    getPolicy: function () { return currentPolicy; },
    download: onDownload,
  };
})();
