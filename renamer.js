// --- FAZBEAR TAB RENAMER (PERSISTENT) ---

(function() {
    // 1. SETUP HTML FOR THE MENU
    const html = `
    <div id="cloaker-menu" style="
        display: none; 
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        background: #111; 
        border: 2px solid #b30000; 
        padding: 20px; 
        z-index: 99999; 
        font-family: 'Courier New', monospace; 
        color: #eee; 
        text-align: center;
        box-shadow: 0 0 50px #000;
        width: 300px;
    ">
        <h3 style="color: #b30000; margin-top: 0;">TAB CLOAKER</h3>
        
        <label style="font-size: 0.8rem;">TAB TITLE:</label><br>
        <input type="text" id="cloak-title" placeholder="Google Drive" style="width: 90%; margin-bottom: 10px; padding: 5px; background: #000; color: #fff; border: 1px solid #333;"><br>
        
        <label style="font-size: 0.8rem;">ICON URL:</label><br>
        <input type="text" id="cloak-icon" placeholder="https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png" style="width: 90%; margin-bottom: 15px; padding: 5px; background: #000; color: #fff; border: 1px solid #333;"><br>
        
        <button id="btn-cloak" style="background: #b30000; color: white; border: none; padding: 10px 20px; cursor: pointer; font-weight: bold;">APPLY</button>
        <button id="btn-reset-cloak" style="background: #333; color: white; border: none; padding: 10px 20px; cursor: pointer; margin-left: 5px;">RESET</button>
        
        <div style="margin-top: 10px; font-size: 0.7rem; color: #666;">Press ESC to Close</div>
    </div>
    `;

    // Add menu to body
    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);

    // --- VARIABLES ---
    const menu = document.getElementById('cloaker-menu');
    const inputTitle = document.getElementById('cloak-title');
    const inputIcon = document.getElementById('cloak-icon');
    const btnApply = document.getElementById('btn-cloak');
    const btnReset = document.getElementById('btn-reset-cloak');

    // --- FUNCTIONS ---

    // Function to change the Favicon (Tab Image)
    function setFavicon(url) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = url;
    }

    // Function to Load Saved Settings (Runs on Start)
    function loadSettings() {
        const savedTitle = localStorage.getItem('faz_cloak_title');
        const savedIcon = localStorage.getItem('faz_cloak_icon');

        if (savedTitle) {
            document.title = savedTitle;
            inputTitle.value = savedTitle; // Pre-fill the input
        }

        if (savedIcon) {
            setFavicon(savedIcon);
            inputIcon.value = savedIcon; // Pre-fill the input
        }
    }

    // Function to Apply and Save Settings
    function applyCloak() {
        const t = inputTitle.value;
        const i = inputIcon.value;

        if (t) {
            document.title = t;
            localStorage.setItem('faz_cloak_title', t);
        }
        
        if (i) {
            setFavicon(i);
            localStorage.setItem('faz_cloak_icon', i);
        }

        menu.style.display = 'none';
    }

    // Function to Reset to Default
    function resetCloak() {
        localStorage.removeItem('faz_cloak_title');
        localStorage.removeItem('faz_cloak_icon');
        location.reload(); // Refresh to clear changes
    }

    // --- EVENT LISTENERS ---

    // 1. Key Listener (Alt + R to Open, ESC to Close)
    document.addEventListener('keydown', function(e) {
        // Open with Alt + R
        if (e.altKey && e.key.toLowerCase() === 'r') {
            e.preventDefault();
            menu.style.display = 'block';
        }
        // Close with ESC
        if (e.key === 'Escape') {
            menu.style.display = 'none';
        }
    });

    // 2. Button Listeners
    btnApply.addEventListener('click', applyCloak);
    btnReset.addEventListener('click', resetCloak);

    // 3. Run Load Function Immediately
    loadSettings();

})();
