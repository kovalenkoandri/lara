// window.ReactNativeWebView.postMessage(JSON.stringify(window.getComputedStyle(document.body).backgroundColor));
// window.ReactNativeWebView.postMessage(JSON.stringify(document.body.style.backgroundColor
// window.ReactNativeWebView.postMessage(JSON.stringify(document.body.style.color = "rgba(255, 255, 255, 1.0)"));
// window.ReactNativeWebView.postMessage(JSON.stringify(document.body.style.fontSize = "2em")));
// window.ReactNativeWebView.postMessage(JSON.stringify(window.location.href));
// window.ReactNativeWebView.postMessage(JSON.stringify(document.body.style.backgroundColor = "rgba(52, 53, 65, 1.0)"));
// function applyBackgroundColorToDescendants(element, color) {
//   element.style.backgroundColor = color;

//   for (let i = 0; i < element.children.length; i++) {
//     const child = element.children[i];
//     applyBackgroundColorToDescendants(child, color);
//   }
// }
// const currentBackgroundColor = window.getComputedStyle(document.body).backgroundColor;
// const bodyElement = document.body;
// applyBackgroundColorToDescendants(bodyElement, 'pink');

// window.ReactNativeWebView.postMessage(JSON.stringify({ invertedBackgroundColor }));
export const INJECTED_DARK = `
  function dark() {
      document.querySelectorAll(':not(a, img, svg, [style*="background-image"])').forEach(element => {
      
      element.style.filter = 'invert(1)';
    })
    // window.ReactNativeWebView.postMessage('INJECTED_DARK');
  }
  dark();
  `;
export const INJECTED_LIGHT = `function light() {
    // document.querySelector("html").style.filter = "invert(0)";
      document.querySelectorAll(':not(a, img, svg, [style*="background-image"])').forEach(element => {
      
      element.style.filter = 'invert(0)';
    })
    // window.ReactNativeWebView.postMessage('INJECTED_Light');
  }
  light();`;
