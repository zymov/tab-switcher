let recent2Tabs = [];

function modifyTabsStack(tab) {
  recent2Tabs.push(tab) > 2 && recent2Tabs.shift();
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
    modifyTabsStack(tab[0]);
  });
});

chrome.tabs.onRemoved.addListener(function (tab) {
  recent2Tabs.length > 1 && (recent2Tabs.length = 1);
});

chrome.commands.onCommand.addListener(function(command) {
  switch (command) {
    case 'switch-back':
      if(recent2Tabs.length > 0) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
          if(tab[0].windowId !== recent2Tabs[0].windowId) return;
          chrome.tabs.highlight({tabs: recent2Tabs[0].index, windowId: recent2Tabs[0].windowId});
        });
      }
      break;
    case 'go-next-2-tab':
      chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
        let cur = tab[0];
        chrome.tabs.query({windowId: cur.windowId}, function(allTabInWindow) {
          if(allTabInWindow.length < 2) return;
          let len = allTabInWindow.length, gotoIndex;
          (gotoIndex = cur.index + 2) > len - 1 && (gotoIndex -= len);
          chrome.tabs.highlight({tabs: gotoIndex, windowId: cur.windowId});
        });
      });
      break;
    default:
      return;
  }
});
