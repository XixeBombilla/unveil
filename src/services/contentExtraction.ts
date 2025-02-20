import { Article } from "../types/content";

export const EXTRACTION_SCRIPT = `
(function() {
  console.log('Script started');
  
  function waitForElement(selector, timeout = 2000) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
      
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      setTimeout(() => {
        observer.disconnect();
        resolve(document.body);
      }, timeout);
    });
  }

  async function extractContent() {
    console.log('Extracting content...');
    const content = [];
    const links = [];
    const title = document.title;
    console.log('Title:', title);
    
    const mainContent = await waitForElement('article, main, .article, .post, .content, #content');
    console.log('Using container:', mainContent.tagName);
    
    // Extract text content
    const textElements = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
    console.log('Found text elements:', textElements.length);
    
    textElements.forEach((el, index) => {
      const text = el.textContent.trim();
      if (text) {
        content.push({
          id: \`\${el.tagName.toLowerCase()}-\${index}\`,
          type: el.tagName.toLowerCase().startsWith('h') ? 'heading' : 'paragraph',
          content: text,
          accessibility: { label: text }
        });
      }
    });

    // Extract links
    const linkElements = mainContent.querySelectorAll('a');
    linkElements.forEach((link, index) => {
      const href = link.href;
      const text = link.textContent.trim();
      if (href && text && href.startsWith('http')) {
        links.push({
          id: \`link-\${index}\`,
          url: href,
          title: text
        });
      }
    });

    console.log('Extracted content:', content);
    console.log('Extracted links:', links);
    
    return {
      title,
      content,
      links,
      hasImages: mainContent.querySelectorAll('img').length > 0
    };
  }

  // Execute when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
      try {
        const result = await extractContent();
        window.ReactNativeWebView.postMessage(JSON.stringify(result));
      } catch (error) {
        console.error('Extraction error:', error);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          title: 'Error',
          content: [],
          hasImages: false,
          error: error.message
        }));
      }
    });
  } else {
    extractContent().then(result => {
      window.ReactNativeWebView.postMessage(JSON.stringify(result));
    }).catch(error => {
      console.error('Extraction error:', error);
      window.ReactNativeWebView.postMessage(JSON.stringify({
        title: 'Error',
        content: [],
        hasImages: false,
        error: error.message
      }));
    });
  }
})();
true;
`;

export interface ExtractedLink {
  id: string;
  url: string;
  title: string;
}

export const createArticle = (extractedData: any, url: string): Article => {
  console.log("extractedData", extractedData);
  return {
    id: Date.now().toString(),
    url,
    domain: new URL(url).hostname,
    title: extractedData.title,
    content: extractedData.content,
    relatedLinks: extractedData.links || [],
    metadata: {
      author: undefined,
      publishDate: new Date().toISOString(),
    },
    accessibility: {
      hasImages: extractedData.hasImages,
      complexityScore: 1,
      readingLevel: "simple",
    },
    savedAt: new Date().toISOString(),
  };
};
