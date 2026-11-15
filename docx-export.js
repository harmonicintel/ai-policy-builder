/* Build a .docx Blob from a generated policy using the vendored docx library. */
(function (root) {
  "use strict";

  function parseRuns(text, base) {
    const TextRun = docx.TextRun;
    const extras = base || {};
    const runs = [];
    const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
    let last = 0;
    let m;
    while ((m = re.exec(text))) {
      if (m.index > last) {
        runs.push(new TextRun(Object.assign({ text: text.slice(last, m.index) }, extras)));
      }
      if (m[1] != null) {
        runs.push(new TextRun(Object.assign({}, extras, { text: m[1], bold: true })));
      } else {
        runs.push(new TextRun(Object.assign({}, extras, { text: m[2], italics: true })));
      }
      last = m.index + m[0].length;
    }
    if (last < text.length || runs.length === 0) {
      runs.push(new TextRun(Object.assign({ text: text.slice(last) }, extras)));
    }
    return runs;
  }

  function markdownToParagraphs(md) {
    const Paragraph = docx.Paragraph;
    const HeadingLevel = docx.HeadingLevel;
    const paras = [];
    const lines = md.replace(/\n$/, "").split("\n");

    lines.forEach(function (line) {
      if (line === "") {
        return;
      }
      if (line.startsWith("# ")) {
        paras.push(
          new Paragraph({
            heading: HeadingLevel.TITLE,
            spacing: { after: 80 },
            children: parseRuns(line.slice(2), { font: "Calibri", size: 48, bold: true, color: "152033" }),
          })
        );
        return;
      }
      if (line.startsWith("## ")) {
        paras.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 240 },
            children: parseRuns(line.slice(3), { font: "Calibri", size: 28, bold: true, color: "1C3F66" }),
          })
        );
        return;
      }
      if (line.startsWith("### ")) {
        paras.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
            children: parseRuns(line.slice(4), { font: "Calibri", size: 24, bold: true, color: "152033" }),
          })
        );
        return;
      }
      if (line.startsWith("- ")) {
        paras.push(
          new Paragraph({
            spacing: { after: 60, line: 276 },
            indent: { left: 360, hanging: 180 },
            children: parseRuns("• " + line.slice(2), { font: "Calibri", size: 22, color: "152033" }),
          })
        );
        return;
      }
      const italicOnly = /^\*[^*]+\*$/.test(line) && line.indexOf("**") === -1;
      paras.push(
        new Paragraph({
          spacing: { after: italicOnly ? 280 : 160, line: 276 },
          children: parseRuns(line, {
            font: "Calibri",
            size: italicOnly ? 20 : 22,
            italics: italicOnly,
            color: italicOnly ? "5A6170" : "152033",
          }),
        })
      );
    });
    return paras;
  }

  function fileNameFor(companyName) {
    const slug = String(companyName || "AI-Policy")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "AI-Policy";
    return slug + "-AI-Usage-Policy.docx";
  }

  async function policyToBlob(result) {
    if (typeof docx === "undefined") {
      throw new Error("The Word library did not load.");
    }
    const Document = docx.Document;
    const Packer = docx.Packer;
    const doc = new Document({
      creator: "AI Policy Builder",
      title: (result.companyName || "Company") + " AI Usage Policy",
      description: "Internal AI usage policy drafted with AI Policy Builder (Workshop edition). Not legal advice.",
      styles: {
        default: {
          document: {
            run: { font: "Calibri", size: 22, color: "152033" },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
              size: { width: 12240, height: 15840 },
            },
          },
          children: markdownToParagraphs(result.markdown),
        },
      ],
    });
    return Packer.toBlob(doc);
  }

  async function downloadPolicy(result) {
    const blob = await policyToBlob(result);
    const name = fileNameFor(result.companyName);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 2000);
    return { blob: blob, fileName: name };
  }

  const api = { policyToBlob: policyToBlob, downloadPolicy: downloadPolicy, fileNameFor: fileNameFor };

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.AIPolicyDocx = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
