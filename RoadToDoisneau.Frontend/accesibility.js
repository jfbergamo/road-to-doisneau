document.addEventListener('DOMContentLoaded', function() {
        new Accessibility({
            position: {
                bottom: { size: 20, units: 'px' },
                left: { size: 20, units: 'px' },
                right: 'auto'
            },
            session: {
                persistent: true
            },
            baseFont: 16 
        });
    });