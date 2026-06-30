/** Renders design/previews/inventory.html from INVENTORY_PREVIEW_DATA. */
(function renderInventoryPreview() {
  const data = window.INVENTORY_PREVIEW_DATA;
  if (!data) {
    console.error("INVENTORY_PREVIEW_DATA is missing — run pnpm generate-inventory-preview");
    return;
  }

  const sectionsRoot = document.getElementById("weapon-sections");
  const detailRoot = document.getElementById("detail-panel");
  if (!sectionsRoot || !detailRoot) {
    return;
  }

  const SLOT_DOT_CLASS = {
    kinetic: "kinetic",
    energy: "energy",
    power: "power",
  };

  function badgeHtml(badge) {
    if (!badge) return "";
    return `<span class="badge badge-${badge}">GR</span>`;
  }

  function dispositionHtml(disposition, label) {
    if (disposition === "only") {
      return "";
    }
    return `<span class="disposition disposition-${disposition}">${label}</span>`;
  }

  function tileHtml(copy, selected) {
    const exoticClass = copy.tier === "Exotic" ? " exotic" : "";
    const selectedClass = selected ? " selected" : "";
    const icon = copy.iconUrl
      ? `<img class="item-icon-img" src="${copy.iconUrl}" alt="${copy.name}" width="38" height="38" loading="lazy" />`
      : `<div class="item-icon"></div>`;

    return `
      <div class="item-tile disposition-${copy.disposition}${exoticClass}${selectedClass}" data-instance-id="${copy.itemInstanceId}" title="${copy.name} · ${copy.dispositionLabel}">
        <div class="element element-${copy.element}"></div>
        ${icon}
        <span class="power">${copy.power}</span>
        ${badgeHtml(copy.badge)}
        ${dispositionHtml(copy.disposition, copy.dispositionLabel)}
      </div>`;
  }

  function groupHtml(group) {
    const isDuplicate = group.copyCount > 1;
    const header = isDuplicate
      ? `
      <div class="weapon-group-header">
        <span class="weapon-group-name">${group.name}</span>
        <span class="weapon-group-meta">${group.dispositionSummary}</span>
      </div>`
      : "";

    return `
      <div class="weapon-group${isDuplicate ? " weapon-group-duplicates" : ""}" data-item-hash="${group.itemHash}">
        ${header}
        <div class="item-grid">
          ${group.copies.map((copy) => tileHtml(copy, copy.itemInstanceId === data.selectedInstanceId)).join("")}
        </div>
      </div>`;
  }

  sectionsRoot.innerHTML = data.sections
    .map(
      (section) => `
      <div class="weapon-section">
        <h2 class="section-label">
          <span class="slot-dot ${SLOT_DOT_CLASS[section.key]}" aria-hidden="true"></span>
          ${section.label}
        </h2>
        <div class="weapon-groups">
          ${section.groups.map((group) => groupHtml(group)).join("")}
        </div>
      </div>`,
    )
    .join("");

  const detail = data.detail;
  const statusLabel =
    detail.weapon.matchStatus === "perfect"
      ? "Perfect roll"
      : detail.weapon.matchStatus === "partial"
        ? "Near-perfect"
        : detail.weapon.matchStatus === "missing"
          ? "Off target"
          : "Unknown";

  const verdictSegments = Array.from({ length: detail.verdict.total }, (_, index) => {
    const match = index < detail.verdict.matched;
    return `<span class="verdict-segment ${match ? "match" : "miss"}"></span>`;
  }).join("");

  const perkRowsHtml = detail.perkRows
    .map((row) => {
      const statusClass = row.matched ? "match" : row.slot === "originTrait" ? "neutral" : "miss";
      const yoursClass = row.matched ? " match" : row.slot === "originTrait" ? "" : " miss";
      return `
        <div class="socket-label">${row.label}</div>
        <div class="perk-socket">
          <div class="perk-socket-row">
            <span class="perk-status ${statusClass}"></span>
            <span class="perk-cell yours${yoursClass}">${row.yours?.iconUrl ? `<img class="perk-icon-img" src="${row.yours.iconUrl}" alt="" width="28" height="28" loading="lazy" />` : ""}${row.yours?.name ?? "—"}</span>
            <span class="perk-cell target${row.matched ? " match" : ""}">${row.target?.name ?? "—"}</span>
          </div>
        </div>`;
    })
    .join("");

  const duplicateCopiesHtml =
    detail.duplicateCopies.length > 1
      ? `
      <div class="copy-compare">
        <h3 class="copy-compare-title">Your copies</h3>
        <div class="copy-compare-list">
          ${detail.duplicateCopies
            .map((copy) => {
              const selected = copy.itemInstanceId === detail.weapon.itemInstanceId;
              const keeper = copy.itemInstanceId === detail.keeperInstanceId;
              return `
            <div class="copy-row${selected ? " copy-row-selected" : ""}">
              <div class="copy-row-rank">#${copy.rank}</div>
              <div class="copy-row-body">
                <div class="copy-row-top">
                  <span class="copy-row-power">${copy.power}</span>
                  ${dispositionHtml(copy.disposition, copy.dispositionLabel)}
                  ${keeper ? '<span class="copy-row-keeper">Recommended keeper</span>' : ""}
                  ${selected ? '<span class="copy-row-inspecting">Inspecting</span>' : ""}
                </div>
                <div class="copy-row-status">${copy.matchStatus} · ${copy.badge ? "god roll match" : "off target"}</div>
              </div>
            </div>`;
            })
            .join("")}
        </div>
      </div>`
      : "";

  const heroStyle = detail.weapon.iconUrl
    ? ` style="background-image: url('${detail.weapon.iconUrl}')"`
    : "";

  detailRoot.innerHTML = `
    <div class="roll-verdict">
      <div class="roll-verdict-top">
        <span class="roll-verdict-label">Roll verdict</span>
        <div class="roll-verdict-score" aria-label="${detail.verdict.matched} of ${detail.verdict.total} perks match">
          ${detail.verdict.matched}<span>/${detail.verdict.total}</span>
        </div>
      </div>
      <div class="verdict-meter" role="img" aria-label="Perk match meter">${verdictSegments}</div>
      <p class="verdict-caption">${detail.verdict.caption}</p>
    </div>
    <div class="detail-inner">
      <div class="weapon-hero">
        <div class="weapon-hero-art"${heroStyle} aria-label="${detail.weapon.name}"></div>
      </div>
      <div class="detail-title-row">
        <div>
          <h2 class="weapon-name legendary">${detail.weapon.name}</h2>
          <p class="weapon-sub">${detail.weapon.tier} · ${detail.weapon.element} · inspecting selected copy</p>
          <p class="weapon-power-row">
            <span class="power-level">${detail.weapon.power}</span>
            <span class="element-tag element-${detail.weapon.element}">${detail.weapon.element}</span>
          </p>
        </div>
        <span class="god-roll-pill">${statusLabel}</span>
      </div>
      ${duplicateCopiesHtml}
      <div class="perk-compare">
        <div class="perk-compare-header">
          <span>Your roll</span>
          <span>PVP target</span>
        </div>
        ${perkRowsHtml}
      </div>
      <p class="roll-source">${detail.rollSource}</p>
      <div class="detail-actions">
        <button class="btn btn-primary btn-block" type="button">Open in DIM</button>
        <div class="detail-actions-row">
          <button class="btn" type="button">Mark as keeper</button>
          <button class="btn" type="button">Share roll</button>
        </div>
      </div>
    </div>`;

  document
    .querySelector(".character-name")
    ?.replaceChildren(document.createTextNode(data.character.className));
  const powerEl = document.querySelector(".character-strip .power-level");
  if (powerEl) {
    powerEl.textContent = String(data.character.power);
  }
  const detailEl = document.querySelector(".character-detail");
  if (detailEl && data.summary) {
    detailEl.innerHTML = `<strong>${data.summary.duplicateGroups}</strong> duplicate weapons · <strong>${data.summary.dismantleCandidates}</strong> to dismantle · PVP targets`;
  }
})();
