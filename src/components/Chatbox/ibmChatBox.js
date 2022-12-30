import config from 'config.js';

export const ibmChatBox = `
  window.watsonAssistantChatOptions = {
    integrationID: '${config.ibmChatBoxID}', // The ID of this integration.
    region: 'kr-seo', // The region your integration is hosted in.
    serviceInstanceID: 'e33674ee-db48-4b71-8334-10438b234f3d', // The ID of your service instance.
    onLoad: function(instance) {
      instance.render();
      const ibmChatboxButton = document.getElementById('WACLauncher__Button');
      ibmChatboxButton.style.width='0px';
      ibmChatboxButton.style.height='0px';
      document.getElementById('chatBoxIcon').onclick = () => ibmChatboxButton.click();
    }
  };
  const chatBoxScript = document.createElement('script');
  chatBoxScript.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + (window.watsonAssistantChatOptions.clientVersion || 'latest') + "/WatsonAssistantChatEntry.js"
  document.head.appendChild(chatBoxScript);
`;
