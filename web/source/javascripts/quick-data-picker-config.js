
angular.module('wl_a.quickDatePickerDefaults', [ ])
  .config(['ngQuickDateDefaultsProvider',function(ngQuickDateDefaultsProvider) {
    // Configure with icons from font-awesome
    return ngQuickDateDefaultsProvider.set({
      closeButtonHtml: "<i class='fa fa-times'></i>",
      buttonIconHtml: "<i class='fa fa-calendar'></i>",
      nextLinkHtml: "<i class='fa fa-chevron-right'></i>",
      prevLinkHtml: "<i class='fa fa-chevron-left'></i>"
    });
  }]);
