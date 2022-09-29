document.addEventListener("DOMContentLoaded", function () {
  let errMsg = document.querySelector(".errMsg");
  if (errMsg.innerHTML !== "") {
    setTimeout(function () {
      errMsg.setAttribute("style", "display:none");
    }, 3000);
  }
});
