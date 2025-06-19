document.addEventListener("DOMContentLoaded", () => {
  // Get all elements with data-key for controller buttons
  const buttons = document.querySelectorAll("[data-key]");
  const logList = document.getElementById("action-log");
  const clearBtn = document.getElementById("clear-log");
  const toast = document.getElementById("toast");
  const themeToggle = document.getElementById("theme-toggle");
  const startBtn = document.getElementById("start-controller");

  // --- Theme Management ---
  // Initialize theme from local storage or default to dark mode
  const savedTheme = localStorage.getItem('theme');
  let lightMode = savedTheme === 'light'; // True if 'light' is saved, otherwise false (default dark)

  // Apply the saved/default theme on page load
  if (lightMode) {
    document.body.classList.add("light-mode");
    themeToggle.innerHTML = `<span class="material-icons">light_mode</span>`;
  } else {
    // Ensure dark mode icon is set if no preference or 'dark' is saved
    themeToggle.innerHTML = `<span class="material-icons">dark_mode</span>`;
  }

  // --- Utility Functions ---

  // Show toast notification
  function showToast(message, type = "info", duration = 3000) {
    toast.textContent = ""; // Clear existing content
    const icon = document.createElement("span");
    icon.classList.add("material-icons");

    // Set icon based on toast type
    switch (type) {
      case "success":
        icon.textContent = "check_circle";
        break;
      case "error":
        icon.textContent = "error_outline";
        break;
      default: // info
        icon.textContent = "info";
        break;
    }

    const msg = document.createElement("span");
    msg.textContent = " " + message;

    toast.className = 'toast'; // Reset classes to just 'toast'
    toast.classList.add(type); // Add type class for styling (e.g., 'toast success')
    toast.append(icon, msg);
    toast.classList.add("show"); // Trigger the show animation
    toast.removeAttribute('hidden'); // Make sure it's visible

    setTimeout(() => {
      toast.classList.remove("show"); // Hide after duration
      // Use 'hidden' attribute for accessibility and proper hiding after animation
      // Adding a slight delay to allow transition to finish
      setTimeout(() => {
        toast.setAttribute('hidden', '');
      }, 400); // Matches CSS transition duration
    }, duration);
  }

  // Add a new log entry to the list
  function logAction(action) {
    const li = document.createElement("li");
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }); // Add current time
    li.innerHTML = `<span>${action} (${timestamp})</span>
                    <button class="material-icons" aria-label="Remove log entry">close</button>`;

    // Event listener for removing individual log entry
    li.querySelector("button").addEventListener("click", () => {
      li.remove();
      showToast(`Removed "${action}" from log`, "info");
      toggleClearLogButtonState(); // Update button state after removal
    });

    logList.appendChild(li);

    // Keep log at a maximum of 30 items
    if (logList.children.length > 30) {
      logList.removeChild(logList.firstChild);
    }

    // Scroll to the bottom of the log list
    logList.scrollTo({ top: logList.scrollHeight, behavior: "smooth" });

    toggleClearLogButtonState(); // Update button state after adding
  }

  // Function to enable/disable the clear log button based on log content
  function toggleClearLogButtonState() {
    clearBtn.disabled = logList.children.length === 0;
  }

  // --- Event Listeners ---

  // Keyboard support for controller actions
  const keyMap = {
    arrowup: "Up",
    arrowdown: "Down",
    arrowleft: "Left",
    arrowright: "Right",
    a: "A",
    b: "B",
    x: "X",
    y: "Y",
  };

  window.addEventListener("keydown", (e) => {
    // Prevent repeated actions on key hold
    if (e.repeat) return;
    const action = keyMap[e.key.toLowerCase()];
    if (action) {
      const btn = document.querySelector(`[data-key="${action}"]`);
      if (btn) {
        animateButton(btn); // Visual feedback
        logAction(action); // Log the action
        e.preventDefault(); // Prevent default browser actions for arrow keys
      }
    }
  });

  // Animate button press
  function animateButton(btn) {
    btn.classList.add("active");
    setTimeout(() => btn.classList.remove("active"), 150);
  }

  // Mouse/Touch support for controller buttons
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.key;
      animateButton(btn);
      logAction(action);
    });
  });

  // Clear all logs button functionality
  clearBtn.addEventListener("click", () => {
    if (logList.children.length === 0) {
      showToast("Log is already empty!", "info");
      return;
    }
    logList.innerHTML = ""; // Clear all list items
    showToast("All log entries cleared.", "success");
    toggleClearLogButtonState(); // Update button state
  });

  // "Start Playing" button functionality
  startBtn.addEventListener("click", () => {
    showToast("Controller simulation started!", "success");
    // Smoothly scroll to the controller section
    document.getElementById('controller').scrollIntoView({ behavior: 'smooth' });
  });

  // Theme toggle functionality
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    lightMode = document.body.classList.contains("light-mode"); // Get current state
    
    // Update the icon and save preference
    themeToggle.innerHTML = `<span class="material-icons">${lightMode ? "light_mode" : "dark_mode"}</span>`;
    localStorage.setItem('theme', lightMode ? 'light' : 'dark'); // Save user's preference

    showToast(lightMode ? "Light mode activated" : "Dark mode activated", "info");
  });

  // --- Initial Setup ---
  // Call this once on page load to set the initial state of the clear log button
  toggleClearLogButtonState();
});