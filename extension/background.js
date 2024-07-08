chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'checkToxicity',
    title: 'Check Toxicity',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'checkToxicity') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'openSidebar',
      selectedText: info.selectionText
    });
  }
});
