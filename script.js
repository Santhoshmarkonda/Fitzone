/* ===== Small utilities ===== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ===== Responsive Navigation ===== */
const nav = $("nav");
const burger = $(".hamburger");
if (burger) {
    burger.addEventListener("click", () => {
        nav.classList.toggle("nav-active");
        burger.setAttribute("aria-expanded", nav.classList.contains("nav-active"));
    });
}

/* ===== Smooth Scrolling ===== */
$$("nav a[href^='#']").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const target = $(link.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth" });
        nav.classList.remove("nav-active");
        burger && burger.setAttribute("aria-expanded", "false");
    });
});

/* ===== BMI Calculator ===== */
const bmiForm = $("#bmiForm");
if (bmiForm) {
    bmiForm.addEventListener("submit", e => {
        e.preventDefault();
        const weight = parseFloat($("#weight").value);
        const height = parseFloat($("#height").value);
        if (!weight || !height) return alert("Enter valid values!");

        const bmi = weight / ((height / 100) ** 2);
        let category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
        $("#bmiResult").textContent = `Your BMI is ${bmi.toFixed(1)} (${category})`;
    });
}

/* ===== Fade-In on Scroll ===== */
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("fade-in"); });
}, { threshold: 0.1 });
$$("section").forEach(sec => observer.observe(sec));

/* ===== Scroll-to-Top Button ===== */
const topBtn = document.createElement("button");
topBtn.textContent = "↑";
topBtn.className = "top-btn";
document.body.appendChild(topBtn);
const onScroll = () => { topBtn.style.display = window.scrollY > 300 ? "block" : "none"; };
window.addEventListener("scroll", onScroll);
topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ===== Login / Signup Logic (left as-is) ===== */
const loginForm = $("#loginForm");
const signupForm = $("#signupForm");
const signupLink = $("#signupLink");
const loginLink = $("#loginLink");
const logoutBtn = $("#logoutBtn");

signupLink && signupLink.addEventListener("click", () => {
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
});
loginLink && loginLink.addEventListener("click", () => {
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
});
signupForm && signupForm.addEventListener("submit", e => {
    e.preventDefault();
    const user = $("#newUsername").value.trim();
    const pass = $("#newPassword").value;
    if (!user || !pass) return;
    localStorage.setItem(user, pass);
    alert("Signup successful! You can now log in.");
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
});
loginForm && loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const user = $("#username").value.trim();
    const pass = $("#password").value;
    const stored = localStorage.getItem(user);
    if (stored && stored === pass) {
        alert("Login successful!");
        window.location.href = "index.html";
    } else {
        alert("Invalid credentials!");
    }
});
logoutBtn && logoutBtn.addEventListener("click", () => {
    alert("Logged out successfully!");
    window.location.href = "login.html";
});

/* =========================================================
   ONLY ENHANCEMENTS to Contact / Terms / Privacy / FAQ
   (No layout changes; pure JS interactivity)
========================================================= */

/* --- Terms & Privacy: Add “Read more” toggles if long --- */
["#terms", "#privacy"].forEach(sel => {
    const sec = $(sel);
    if (!sec) return;
    const paras = $$("#" + sec.id + " p", sec);
    if (paras.length <= 1) return;

    // Initially collapse after the first paragraph
    paras.slice(1).forEach(p => p.style.display = "none");

    const btn = document.createElement("button");
    btn.className = "readmore-btn";
    btn.setAttribute("aria-expanded", "false");
    btn.textContent = "Read more";
    sec.appendChild(btn);

    btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        paras.slice(1).forEach(p => p.style.display = expanded ? "none" : "block");
        btn.textContent = expanded ? "Read more" : "Show less";
        btn.setAttribute("aria-expanded", String(!expanded));
    });
});

/* --- FAQ: Convert existing <p> blocks into a simple accordion --- */
(() => {
    const faq = $("#faq");
    if (!faq) return;
    const blocks = $$("#faq p", faq);

    // Build accordion items based on each paragraph’s bold question
    blocks.forEach(p => {
        const strong = p.querySelector("strong");
        if (!strong) return;

        const question = strong.textContent.trim();
        const answer = p.innerHTML.replace(strong.outerHTML, "").trim(); // keep existing line breaks

        // create item
        const item = document.createElement("div");
        item.className = "faq-item";

        const q = document.createElement("div");
        q.className = "faq-q";
        q.innerHTML = `<span>${question}</span><span>＋</span>`;

        const a = document.createElement("div");
        a.className = "faq-a";
        a.innerHTML = answer;

        item.appendChild(q);
        item.appendChild(a);

        // replace the original paragraph
        p.replaceWith(item);

        // toggle
        q.addEventListener("click", () => {
            const open = item.classList.toggle("open");
            q.lastElementChild.textContent = open ? "–" : "＋";
        });
    });
})();
