// renamer.js content
document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        let title = prompt("New Name:", document.title);
        if (title) document.title = title;

        let icon = prompt("New Icon URL:");
        if (icon) {
            let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = icon;
            document.getElementsByTagName('head')[0].appendChild(link);
        }
    }
});
