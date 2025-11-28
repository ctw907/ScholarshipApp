// Configure your POST endpoint here.
// Replace this URL with your real endpoint when ready.
const POST_ENDPOINT = "https://defaultff6ba2824f544b34b3ee2dfa83ff71.b2.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/e37e49114c9f45ba9212561f8d20f5cc/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=hHlIPWojRFAbFF90MEL4_SJzwPkKRwTzm7VCPEQ8qFE"; // e.g. "https://customtradeworkflows.com/api/scholarship"

// Elements
const form = document.getElementById("scholarshipForm");
const steps = document.querySelectorAll(".step");
const stepLabel = document.getElementById("stepLabel");
const progressFill = document.getElementById("progressFill");
const formMessage = document.getElementById("formMessage");
const personalizationScoreEl = document.getElementById("personalizationScore");
const analysisStatus = document.getElementById("analysisStatus");

// Inputs
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const company = document.getElementById("company");
const role = document.getElementById("role");
const focusHidden = document.getElementById("focus");
const teamSize = document.getElementById("teamSize");
const bottleneck = document.getElementById("bottleneck");
const tools = document.getElementById("tools");
const vision = document.getElementById("vision");
const timeline = document.getElementById("timeline");

// Preview fields (kept for logic, visually hidden in CSS)
const prevName = document.getElementById("prevName");
const prevEmail = document.getElementById("prevEmail");
const prevCompany = document.getElementById("prevCompany");
const prevRole = document.getElementById("prevRole");
const prevFocus = document.getElementById("prevFocus");
const prevTeamSize = document.getElementById("prevTeamSize");
const prevBottleneck = document.getElementById("prevBottleneck");
const prevVision = document.getElementById("prevVision");
const prevTimeline = document.getElementById("prevTimeline");

// Navigation buttons
document.getElementById("next1").addEventListener("click", () => {
  if (!validateStep1()) return;
  goToStep(2);
});

document.getElementById("back2").addEventListener("click", () => {
  goToStep(1);
});

document.getElementById("next2").addEventListener("click", () => {
  if (!validateStep2()) return;
  goToStep(3);
});

document.getElementById("back3").addEventListener("click", () => {
  goToStep(2);
});

// Focus tiles
const focusTiles = document.querySelectorAll("#focusGroup .tile");
focusTiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    focusTiles.forEach((t) => t.classList.remove("selected"));
    tile.classList.add("selected");
    focusHidden.value = tile.dataset.value || "";
    updatePreview();
    updatePersonalization();
  });
});

// Form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  if (!validateStep3()) return;

  updatePreview();
  updatePersonalization();

  analysisStatus.textContent = "Analyzing your answers…";
  formMessage.className = "form-message";
  formMessage.textContent = "";

  const payload = buildPayload();

  // Optional HTTP POST request
  if (POST_ENDPOINT) {
    try {
      const response = await fetch(POST_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (err) {
      console.error("POST failed:", err);
      formMessage.className = "form-message error";
      formMessage.textContent =
        "We captured your answers locally, but there was an issue sending them to the server. Please try again later.";
      return;
    }
  }

  setTimeout(() => {
    analysisStatus.textContent =
      "Analysis ready – this looks like a strong candidate for meaningful workflow upgrades.";
    formMessage.className = "form-message success";
    formMessage.textContent =
      "Thank you. Your application has been captured. If selected, we’ll follow up with next steps and deeper questions.";
  }, 650);
});

// Build payload with simple primitives (strings and integers)
function buildPayload() {
  const sizeValue = teamSize.value.trim();
  const companySize =
    sizeValue !== "" && !Number.isNaN(parseInt(sizeValue, 10))
      ? parseInt(sizeValue, 10)
      : "";

  return {
    fullName: fullName.value.trim(),
    email: email.value.trim(),
    company: company.value.trim(),
    role: role.value.trim(),
    primaryConcern: focusHidden.value,
    companySize: companySize, // integer when provided, otherwise empty string
    biggestBottleneck: bottleneck.value.trim(),
    tools: tools.value.trim(),
    vision: vision.value.trim(),
    timeline: timeline.value,
  };
}

// State
let currentStep = 1;
const totalSteps = steps.length;

// Step logic
function goToStep(step) {
  currentStep = step;

  steps.forEach((s) => {
    const index = Number(s.dataset.step);
    s.classList.toggle("active", index === currentStep);
  });

  const labels = {
    1: "Step 1 of 3 · About you",
    2: "Step 2 of 3 · Your operation",
    3: "Step 3 of 3 · What “perfect” looks like",
  };
  stepLabel.textContent = labels[currentStep] || "";

  progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;

  updatePreview();
  updatePersonalization();
  clearMessage();
}

// Validation
function validateStep1() {
  clearMessage();
  if (!fullName.value.trim() || !email.value.trim()) {
    showError("Please add at least your name and a valid email.");
    return false;
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) {
    showError("That email doesn’t look quite right yet.");
    return false;
  }
  return true;
}

function validateStep2() {
  clearMessage();
  if (!focusHidden.value.trim()) {
    showError("Pick the concern that feels closest to your day-to-day.");
    return false;
  }
  if (!bottleneck.value.trim()) {
    showError("Tell us about the main bottleneck in your day-to-day workflow.");
    return false;
  }
  return true;
}

function validateStep3() {
  clearMessage();
  if (!vision.value.trim()) {
    showError("Share what “perfect” looks like in 3–6 sentences or less.");
    return false;
  }
  // Checkbox about contacting applicants has been removed.
  return true;
}

// Messaging
function showError(msg) {
  formMessage.className = "form-message error";
  formMessage.textContent = msg;
}

function clearMessage() {
  formMessage.className = "form-message";
  formMessage.textContent = "";
}

// Preview + personalization
function updatePreview() {
  const trim = (x) => x.value.trim();

  prevName.textContent = trim(fullName) || "Add your name";
  prevName.classList.toggle("value-muted", !trim(fullName));

  prevEmail.textContent = trim(email) || "Add your email";
  prevEmail.classList.toggle("value-muted", !trim(email));

  prevCompany.textContent = trim(company) || "Optional";
  prevCompany.classList.toggle("value-muted", !trim(company));

  prevRole.textContent = trim(role) || "Optional";
  prevRole.classList.toggle("value-muted", !trim(role));

  prevFocus.textContent = focusHidden.value || "Choose a focus area";
  prevFocus.classList.toggle("value-muted", !focusHidden.value);

  prevTeamSize.textContent = teamSize.value || "Optional";
  prevTeamSize.classList.toggle("value-muted", !teamSize.value);

  prevBottleneck.textContent =
    trim(bottleneck) || "Describe your main friction";
  prevBottleneck.classList.toggle("value-muted", !trim(bottleneck));

  prevVision.textContent =
    trim(vision) || "Tell us what “perfect” looks like";
  prevVision.classList.toggle("value-muted", !trim(vision));

  prevTimeline.textContent = timeline.value || "Optional";
  prevTimeline.classList.toggle("value-muted", !timeline.value);

  // Lightly react to detail level
  if (bottleneck.value.trim().length > 120 && vision.value.trim().length > 150) {
    analysisStatus.textContent =
      "Great detail – this level of clarity makes it much easier to design the right system.";
  } else if (bottleneck.value.trim() || vision.value.trim()) {
    analysisStatus.textContent =
      "Good start – a bit more detail helps us estimate impact and ROI.";
  } else {
    analysisStatus.textContent = "Waiting for details…";
  }
}

function updatePersonalization() {
  const fields = [
    fullName,
    email,
    bottleneck,
    vision,
    focusHidden,
    company,
    role,
    teamSize,
    tools,
    timeline,
  ];

  let filled = 0;
  fields.forEach((f) => {
    if (!f) return;
    const val = f.type === "hidden" ? f.value : f.value.trim();
    if (val) filled++;
  });

  const score = Math.round((filled / fields.length) * 100);
  personalizationScoreEl.textContent = `${score}%`;
}

// Initialize
goToStep(1);

// Live updates on input
[
  fullName,
  email,
  company,
  role,
  teamSize,
  bottleneck,
  tools,
  vision,
  timeline,
].forEach((el) => {
  el.addEventListener("input", () => {
    updatePreview();
    updatePersonalization();
  });
});


