document.addEventListener("DOMContentLoaded", function () {
    const resource = GetParentResourceName();
    const wrapper = document.getElementById("target-wrapper");
    const promptIcon = document.getElementById("prompt-icon");
    const promptInstruction = document.getElementById("prompt-instruction");
    const promptOptions = document.getElementById("prompt-options");
    const promptKeyLabel = document.getElementById("prompt-key-label");
    const progressRing = document.getElementById("progress-ring");
    const settingsWrapper = document.getElementById("settings-wrapper");
    const interactionColorInput = document.getElementById("interaction-color");
    const textColorInput = document.getElementById("text-color");
    const settingsSave = document.getElementById("settings-save");
    const settingsClose = document.getElementById("settings-close");

    const circumference = 2 * Math.PI * 30;
    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRing.style.strokeDashoffset = `${circumference}`;

    const state = {
        options: [],
        selected: 1,
        progress: 0,
        icon: "",
        keyLabel: "",
        isTargeting: false,
        lastOptionsSignature: ""
    };

    function getOptionsSignature(options) {
        if (!Array.isArray(options) || options.length === 0) {
            return "";
        }
        const normalized = options
            .map(function (option) {
                return {
                    index: Number(option.index) || 0,
                    label: option.label || "",
                    icon: option.icon || ""
                };
            })
            .sort(function (a, b) {
                return a.index - b.index;
            })
            .map(function (option) {
                return option.index + ":" + option.label + ":" + option.icon;
            });
        return normalized.join("|");
    }

    function setWrapperVisible(visible) {
        wrapper.classList.toggle("hidden", !visible);
        if (!visible) {
            wrapper.classList.remove("progress-complete");
            wrapper.classList.remove("has-target");
        }
    }

    function resetPrompt() {
        state.options = [];
        state.selected = 1;
        state.progress = 0;
        state.icon = "";
        state.keyLabel = "";
        state.isTargeting = false;
        promptIcon.className = "";
        promptInstruction.textContent = "Hold";
        promptOptions.innerHTML = "";
        promptKeyLabel.textContent = "";
        wrapper.classList.remove("has-key-label");
        setProgress(0);
    }

    function setProgress(value) {
        const numeric = Math.max(0, Math.min(1, Number(value) || 0));
        state.progress = numeric;
        const offset = circumference * (1 - numeric);
        progressRing.style.strokeDashoffset = `${offset}`;
        wrapper.classList.toggle("progress-complete", numeric >= 1);
    }

    function setColors(settings) {
        if (!settings) {
            return;
        }
        if (settings.interactionColor) {
            document.documentElement.style.setProperty("--interaction-color", settings.interactionColor);
        }
        if (settings.textColor) {
            document.documentElement.style.setProperty("--interaction-text-color", settings.textColor);
        }
    }

    function renderOptions() {
        promptOptions.innerHTML = "";
        const sorted = Array.isArray(state.options) ? state.options.slice() : [];
        sorted.sort(function (a, b) {
            return (Number(a.index) || 0) - (Number(b.index) || 0);
        });
        sorted.forEach(function (option) {
            const container = document.createElement("div");
            container.className = "prompt-option";
            if (Number(option.index) === Number(state.selected)) {
                container.classList.add("selected");
            }
            const iconWrapper = document.createElement("span");
            iconWrapper.className = "option-icon";
            if (option.icon) {
                const iconElement = document.createElement("i");
                iconElement.className = option.icon;
                iconWrapper.appendChild(iconElement);
            } else {
                iconWrapper.textContent = option.index;
            }
            const label = document.createElement("span");
            label.className = "option-label";
            label.textContent = option.label || "";
            container.appendChild(iconWrapper);
            container.appendChild(label);
            promptOptions.appendChild(container);
        });
        if (sorted.length > 1) {
            promptInstruction.textContent = "Scroll to switch";
        } else {
            promptInstruction.textContent = "Hold [E] to interact";
        }
        state.lastOptionsSignature = getOptionsSignature(sorted);
    }

    function openSettingsPanel(data) {
        settingsWrapper.classList.remove("hidden");
        wrapper.classList.remove("has-key-label");
        if (data && data.interactionColor) {
            interactionColorInput.value = data.interactionColor;
        }
        if (data && data.textColor) {
            textColorInput.value = data.textColor;
        }
    }

    function closeSettingsPanel() {
        settingsWrapper.classList.add("hidden");
        wrapper.classList.remove("has-key-label");
        promptKeyLabel.textContent = "";
        state.keyLabel = "";
    }

    settingsSave.addEventListener("click", function () {
        const payload = {
            interactionColor: interactionColorInput.value,
            textColor: textColorInput.value
        };
        fetch(`https://${resource}/applySettings`, {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            body: JSON.stringify(payload)
        }).catch(function (error) {
            console.error("Error:", error);
        });
    });

    settingsClose.addEventListener("click", function () {
        fetch(`https://${resource}/closeSettings`, {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            body: ""
        }).catch(function (error) {
            console.error("Error:", error);
        });
    });

    window.addEventListener("message", function (event) {
        const message = event.data;
        switch (message.response) {
            case "openTarget":
                resetPrompt();
                setWrapperVisible(true);
                wrapper.classList.remove("has-target");
                wrapper.classList.remove("pop-in");
                void wrapper.offsetWidth;
                wrapper.classList.add("pop-in");
                state.isTargeting = true;
                break;
            case "closeTarget":
            case "promptClose":
                setWrapperVisible(false);
                resetPrompt();
                wrapper.classList.remove("pop-in");
                state.isTargeting = false;
                break;
            case "leftTarget":
                wrapper.classList.remove("has-target");
                state.options = [];
                promptOptions.innerHTML = "";
                promptInstruction.textContent = "Hold to interact";
                setProgress(0);
                state.keyLabel = "";
                if (state.isTargeting) {
                    wrapper.classList.remove("has-key-label");
                    promptKeyLabel.textContent = "";
                    setWrapperVisible(true);
                } else {
                    wrapper.classList.remove("has-key-label");
                    promptKeyLabel.textContent = "";
                    setWrapperVisible(false);
                }
                break;
            case "foundTarget":
                if (message.data) {
                    state.icon = message.data;
                    promptIcon.className = state.icon;
                }
                setWrapperVisible(true);
                wrapper.classList.add("has-target");
                wrapper.classList.remove("pop-in");
                void wrapper.offsetWidth;
                wrapper.classList.add("pop-in");
                break;
            case "validTarget":
                setWrapperVisible(true);
                wrapper.classList.remove("pop-in");
                void wrapper.offsetWidth;
                wrapper.classList.add("pop-in");
                break;
            case "promptUpdate":
                if (message.data) {
                    const data = message.data;
                    const previousSignature = state.lastOptionsSignature;
                    const previousIcon = state.icon;
                    state.selected = Number(data.selected) || 1;
                    state.options = Array.isArray(data.options) ? data.options : [];
                    if (data.icon !== undefined) {
                        state.icon = data.icon;
                    }
                    state.keyLabel = data.keyLabel ? data.keyLabel : "";
                    setColors(data.settings);
                    promptKeyLabel.textContent = state.keyLabel ? String(state.keyLabel).toUpperCase() : "";
                    if (promptKeyLabel.textContent) {
                        wrapper.classList.add("has-key-label");
                    } else {
                        wrapper.classList.remove("has-key-label");
                    }
                    if (state.icon) {
                        promptIcon.className = state.icon;
                        promptIcon.style.display = "";
                    } else {
                        promptIcon.className = "";
                        promptIcon.style.display = "none";
                    }
                    setProgress(data.progress);
                    if (state.options.length === 0) {
                        wrapper.classList.remove("has-target");
                        wrapper.classList.remove("has-key-label");
                        promptKeyLabel.textContent = "";
                        state.keyLabel = "";
                        renderOptions();
                        const currentSignature = state.lastOptionsSignature;
                        const optionsChanged = previousSignature !== currentSignature;
                        const iconChanged = previousIcon !== state.icon;
                        if (optionsChanged || iconChanged) {
                            wrapper.classList.remove("pop-in");
                            void wrapper.offsetWidth;
                            wrapper.classList.add("pop-in");
                        }
                        break;
                    }
                    wrapper.classList.add("has-target");
                    renderOptions();
                    setWrapperVisible(true);
                    const currentSignature = state.lastOptionsSignature;
                    const optionsChanged = previousSignature !== currentSignature;
                    const iconChanged = previousIcon !== state.icon;
                    const shouldAnimate = optionsChanged || iconChanged || !wrapper.classList.contains("pop-in");
                    if (shouldAnimate) {
                        wrapper.classList.remove("pop-in");
                        void wrapper.offsetWidth;
                        wrapper.classList.add("pop-in");
                    }
                }
                break;
            case "holdProgress":
                setProgress(message.data);
                break;
            case "openSettings":
                openSettingsPanel(message.data || {});
                break;
            case "settingsClosed":
                closeSettingsPanel();
                break;
        }
    });
});
