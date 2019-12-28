/*************************************************************
 * クロスブラウザ対応
*************************************************************/

// XMLHttpRequestオブジェクト

function getXHR() {
  var myRequest;
  try {
    myRequest = new XMLHttpRequest();
  } catch(e) {
    try {
      myRequest = new ActiveXObject("Msxml2.XMLHTTP");
    } catch(e) {
      myRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
  }
  return myRequest;
}

// イベントリスナ

function addListener(elem, ev, listener) {
  if (elem.addEventListener) {
    elem.addEventListener(ev, listener, false);
  } else if (elem.attachEvent) {
    elem.attachEvent("on" + ev, listener);
  } else {
    throw new Error("イベントリスナに未対応です。");
  }
}

function removeListener(elem, ev, listener) {
  if (elem.removeEventListener) {
    elem.removeEventListener(ev, listener, false);
  } else if (elem.detachEvent) {
    elem.detachEvent("on" + ev, listener);
  } else {
    throw new Error("イベントリスナに未対応です。");
  }
}
