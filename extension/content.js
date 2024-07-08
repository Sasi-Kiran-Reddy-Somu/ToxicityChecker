chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openSidebar' && request.selectedText) {
      if (!document.getElementById('toxicity-sidebar')) {
        const sidebar = document.createElement('div');
        sidebar.id = 'toxicity-sidebar';
        sidebar.style.position = 'fixed';
        sidebar.style.right = '0';
        sidebar.style.top = '0';
        sidebar.style.width = '300px';
        sidebar.style.height = '100%';
        sidebar.style.backgroundColor = 'white';
        sidebar.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        sidebar.style.zIndex = '1000';
        sidebar.style.padding = '10px';
        sidebar.style.overflowY = 'auto';
  
        const title = document.createElement('h2');
        title.innerText = 'Toxicity Checker';
        sidebar.appendChild(title);
  
        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.float = 'right';
        closeButton.style.marginBottom = '10px';
        closeButton.addEventListener('click', () => {
          sidebar.remove();
        });
        sidebar.appendChild(closeButton);
  
        const textarea = document.createElement('textarea');
        textarea.id = 'toxicity-text';
        textarea.style.width = '100%';
        textarea.style.height = '150px';
        sidebar.appendChild(textarea);
  
        const button = document.createElement('button');
        button.innerText = 'Check Toxicity';
        button.style.width = '100%';
        button.style.padding = '10px';
        button.style.marginTop = '10px';
        sidebar.appendChild(button);
  
        const resultDiv = document.createElement('div');
        resultDiv.id = 'toxicity-result';
        resultDiv.style.marginTop = '10px';
        sidebar.appendChild(resultDiv);
  
        document.body.appendChild(sidebar);
  
        textarea.value = request.selectedText;
  
        button.addEventListener('click', () => {
          fetch('http://127.0.0.1:7860/api/predict', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: [textarea.value] })
          })
          .then(response => response.json())
          .then(data => {
            const result = data.predictions[0];
            resultDiv.innerText = 'Toxicity levels:\n' + JSON.stringify(result, null, 2);
            console.log('API response received:', data);
          })
          .catch(error => {
            console.error('Error:', error);
            resultDiv.innerText = 'Error: ' + error.message;
          });
        });
      }
    }
  });
  