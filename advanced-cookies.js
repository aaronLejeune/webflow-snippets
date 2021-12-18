$(function () {

  var hasAlreadyCookies = getCookie('cookie-consent-preferences');
  var allCriteria = ["Essential Trigger", "Analytics Trigger", "Tracking Trigger", "Social Networking Trigger"]

  //if someone hasn't the cookie conset thing 
  console.log(hasAlreadyCookies)

  if (hasAlreadyCookies === null) {
    $('#cookie-popup').show()

    $('#cookie-allow-all').click(allowAllCookies())

    //define vars
    var selected = [];
    var formID = "#wf-form-cookie-form";

    //update input fields when changing value
    var update = function () {
      selected = []
      $(formID + " input:checked").each(function(){
        var attribute = $(this).attr('cookie-cat')
        selected.push(attribute)
      });
      console.log("form result", selected);
    };
    update();
    $(formID).change(update);

    //when form is submitted
    $(formID).on("submit", function (e) {
      //prevent reload
      e.preventDefault();
      console.log(selected.length);
      //check if tracking is enabled
      selected.forEach(function (category) {
        dataLayer.push({
          event: "userPrefUpdate",
          cookieAccepted: category,
        });
      })

      hideAllModals()
      setCookie('cookie-consent-preferences', selected, 365)
      return false;
    });
  }else{

    var array = hasAlreadyCookies.split(',');
    array.forEach(function (category) {
      dataLayer.push({
        event: "userPrefUpdate",
        cookieAccepted: category,
      });
    })
    
    hideAllModals()
  }


  //allow all 
  function allowAllCookies(){
    allCriteria.forEach(function (category){
      dataLayer.push({
        event: "userPrefUpdate",
        cookieAccepted: category,
      });
    })
    hideAllModals()
    setCookie('cookie-consent-preferences', allCriteria, 365)
  }

  //set cookies
  function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }

  //get cookies
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  function hideAllModals() {
    $('#cookie-popup').hide()
    $('#cookie-popup-wrapper').hide()
  }
});
