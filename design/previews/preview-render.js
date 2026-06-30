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
    const label = badge === "perfect" ? "GR" : badge === "partial" ? "GR" : "GR";
    return `<span class="badge badge-${badge}">${label}</span>`;
  }

  function tileHtml(weapon, selected) {
    const exoticClass = weapon.tier === "Exotic" ? " exotic" : "";
    const selectedClass = selected ? " selected" : "";
    const icon = weapon.iconUrl
      ? `<img class="item-icon-img" src="${weapon.iconUrl}" alt="${weapon.name}" width="38" height="38" loading="lazy" />`
      : `<div class="item-icon"></div>`;

    return `
      <div class="item-tile${exoticClass}${selectedClass}" data-instance-id="${weapon.itemInstanceId}" title="${weapon.name}">
        <div class="element element-${weapon.element}"></div>
        ${icon}
        <span class="power">${weapon.power}</span>
        ${badgeHtml(weapon.badge)}
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
        <div class="item-grid">
          ${section.weapons.map((weapon) => tileHtml(weapon, weapon.itemInstanceId === data.selectedInstanceId)).join("")}
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
          <p class="weapon-sub">${detail.weapon.tier} · ${detail.weapon.element} · equipped</p>
          <p class="weapon-power-row">
            <span class="power-level">${detail.weapon.power}</span>
            <span class="element-tag element-${detail.weapon.element}">${detail.weapon.element}</span>
          </p>
        </div>
        <span class="god-roll-pill">${statusLabel}</span>
      </div>
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
  const powerEl = document.querySelector(".power-level");
  if (powerEl) {
    powerEl.textContent = String(data.character.power);
  }
})();
