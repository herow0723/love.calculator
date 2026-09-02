document.addEventListener("DOMContentLoaded", () => {
    const login = document.getElementById("login");
    const panel = document.getElementById("panel");

    const password = document.getElementById("password");
    const loginBtn = document.getElementById("loginBtn");
    const loginMsg = document.getElementById("loginMsg");

    const refreshBtn = document.getElementById("refresh");
    const clearBtn = document.getElementById("clear");
    const logoutBtn = document.getElementById("logout");
    const rows = document.getElementById("rows");

    async function loginAdmin() {
        const pass = password.value;
        console.log("Password entered length:", pass.length);
 
        if (!pass) {
            loginMsg.textContent = "Please enter the admin password.";
            return;
        }

        loginBtn.disabled = true;
        loginMsg.textContent = "Signing in...";

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password: pass
                })
            });

            const data = await response.json();

            if (!response.ok) {
                loginMsg.textContent = data.error || "Login failed.";
                loginBtn.disabled = false;
                return;
            }

            login.style.display = "none";
            panel.classList.remove("hidden");

            password.value = "";
            loginMsg.textContent = "";

            loadEntries();

        } catch (error) {
            loginMsg.textContent = "Could not connect to the server.";
            loginBtn.disabled = false;
        }
    }

    async function loadEntries() {
        try {
            const response = await fetch("/api/admin/checks");

            if (!response.ok) {
                if (response.status === 401) {
                    login.style.display = "block";
                    panel.classList.add("hidden");
                }
                return;
            }

            const data = await response.json();

            rows.innerHTML = "";

            data.forEach((entry, index) => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${escapeHTML(entry.boy)}</td>
                    <td>${escapeHTML(entry.girl)}</td>
                    <td>${entry.percentage}%</td>
                    <td>${escapeHTML(entry.created_at)}</td>
                `;

                rows.appendChild(tr);
            });

        } catch (error) {
            console.error("Could not load entries:", error);
        }
    }

    async function logout() {
        try {
            await fetch("/api/admin/logout", {
                method: "POST"
            });
        } finally {
            login.style.display = "block";
            panel.classList.add("hidden");
            loginBtn.disabled = false;
            loginMsg.textContent = "";
        }
    }

    async function clearEntries() {
        const confirmed = confirm(
            "Are you sure you want to delete all calculator entries?"
        );

        if (!confirmed) return;

        const response = await fetch("/api/admin/checks", {
            method: "DELETE"
        });

        if (response.ok) {
            loadEntries();
        } else {
            alert("Could not clear the entries.");
        }
    }

    function escapeHTML(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    loginBtn.addEventListener("click", loginAdmin);

    password.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            loginAdmin();
        }
    });

    refreshBtn.addEventListener("click", loadEntries);
    clearBtn.addEventListener("click", clearEntries);
    logoutBtn.addEventListener("click", logout);
});