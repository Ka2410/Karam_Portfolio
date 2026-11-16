(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    var out = form.querySelector('.output_message');
    var name = (f.name.value || '').trim(), email = (f.email.value || '').trim();
    var subject = (f.subject.value || '').trim(), message = (f.message.value || '').trim();
    if (!name || !message) { if (out) out.textContent = 'Please enter your name and message'; return; }
    var text = 'Hello Karam,\n' + (subject ? 'Subject: ' + subject + '\n' : '') + message + '\n\n- ' + name + (email ? ' (' + email + ')' : '');
    window.open('https://wa.me/201211659075?text=' + encodeURIComponent(text), '_blank');
    if (out) out.textContent = 'Opening WhatsApp...';
    form.reset();
  });
})();
