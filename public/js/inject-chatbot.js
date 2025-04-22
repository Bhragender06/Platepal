// Add required CSS and JS files
function addStylesheet(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

function addScript(src) {
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
}

// Add Font Awesome for icons
addStylesheet('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

// Add Plotly for charts
addScript('https://cdn.plot.ly/plotly-latest.min.js');

// Add our chatbot files
addStylesheet('../public/css/chatbot.css');
addScript('../public/js/chatbot.js'); 