document.addEventListener("DOMContentLoaded", function () {
  let errMsg = document.querySelector(".errMsg");
  // document
  //   .getElementById("expDate")
  //   .setAttribute("max", new Date().toISOString().split("T")[0]);
  if (errMsg.innerHTML !== "") {
    setTimeout(function () {
      errMsg.setAttribute("style", "display:none");
    }, 3000);
  }
});
