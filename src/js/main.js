// Only load modal iframe content on modal show
let myModalEl = document.getElementById('liveChat')
let modalIframe = myModalEl.querySelector('iframe')
myModalEl.addEventListener('show.bs.modal', function (event) {
  modalIframe.src = modalIframe.dataset.src;
})
