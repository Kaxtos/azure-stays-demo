/* Fixed labels only. Never inspect inputs, form messages or demo records. */
(function () {
  'use strict';
  var templates = ['owner-statement','rental-income-expense-tracker','occupancy-adr-revpar','management-fee-calculator','cleaning-turnover-checklist','guest-check-in-check-out-checklist','calendar-channel-sync-checklist','maintenance-request-log'];
  var allowed = ['template_download_click','case_study_click','enquiry_cta_click','screen_view'];
  function pageLabel() {
    var match = location.pathname.match(/^\/templates\/([^/]+)\/?$/);
    return match && templates.indexOf(match[1]) !== -1 ? match[1] : 'homepage';
  }
  window.staysAnalyticsBeforeSend = function (type, payload) {
    if (type !== 'event') return false;
    if (payload.name && allowed.indexOf(payload.name) === -1) return false;
    payload.url = location.pathname;
    if (payload.referrer) {
      try { payload.referrer = new URL(payload.referrer).origin; } catch (_) { payload.referrer = ''; }
    }
    if (payload.data) {
      var data = {};
      if (templates.indexOf(payload.data.template) !== -1) data.template = payload.data.template;
      if (templates.indexOf(payload.data.page) !== -1 || payload.data.page === 'homepage') data.page = payload.data.page;
      if (['client-case','template-case','other'].indexOf(payload.data.location) !== -1) data.location = payload.data.location;
      if (['overview','properties','bookings','cleaning','maintenance','statements','channels'].indexOf(payload.data.screen) !== -1) data.screen = payload.data.screen;
      payload.data = data;
    }
    return payload;
  };
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href]');
    if (!link || !window.umami) return;
    var url;
    try { url = new URL(link.href, location.href); } catch (_) { return; }
    var data = {page: pageLabel(), location: link.closest('#client-case') ? 'client-case' : link.closest('.template-case') ? 'template-case' : 'other'};
    var download = url.pathname.match(/^\/downloads\/([^/]+)\.xlsx$/);
    if (url.hostname === location.hostname && download && templates.indexOf(download[1]) !== -1) {
      data.template = download[1]; window.umami.track('template_download_click', data);
    } else if (url.hostname === 'streamlinecy.com' && url.pathname === '/blog/nicosia-property-management-crm-owner-portal-case-study') {
      window.umami.track('case_study_click', data);
    } else if (url.hostname === location.hostname && url.hash === '#enquiry') {
      var tracked = window.umami.track('enquiry_cta_click', data);
      // Give a cross-page request a bounded opportunity to leave before navigation.
      if (url.pathname !== location.pathname && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0 && (!link.target || link.target === '_self')) {
        event.preventDefault();
        var moved = false;
        function go() { if (!moved) { moved = true; location.assign(link.href); } }
        setTimeout(go, 300);
        Promise.resolve(tracked).then(go, go);
      }
    }
  });
})();
