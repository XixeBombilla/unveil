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

  function getBackgroundImageUrls(element) {
    const style = window.getComputedStyle(element);
    const backgroundImage = style.backgroundImage;
    
    if (backgroundImage && backgroundImage !== 'none') {
      // Extract all urls from background-image
      const urls = backgroundImage.match(/url\\(['"]?([^'"\\)]+)['"]?\\)/g) || [];
      return urls.map(url => {
        const match = url.match(/url\\(['"]?([^'"\\)]+)['"]?\\)/);
        return match ? match[1] : null;
      }).filter(Boolean);
    }
    return [];
  }

  async function extractContent() {
    console.log('Extracting content...');
    const content = [];
    const links = [];
    const images = [];
    const title = document.title;
    console.log('Title:', title);
    
    const mainContent = await waitForElement('article, main, .article, .post, .content, #content');
    console.log('Using container:', mainContent.tagName);
    
    // Extract regular images
    const allImages = mainContent.querySelectorAll('img');
    allImages.forEach((img, index) => {
      const imageUrl = img.src;
      const alt = img.alt || '';
      if (imageUrl) {
        images.push({
          id: \`image-\${index}\`,
          url: imageUrl,
          alt: alt,
          title: img.title || alt,
          dimensions: {
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height
          },
          location: {
            inContent: Boolean(img.closest('article, main, .content, #content')),
            isHeader: Boolean(img.closest('header')),
            isFooter: Boolean(img.closest('footer'))
          },
          type: 'regular'
        });
      }
    });

    // Extract background images
    const allElements = mainContent.querySelectorAll('*');
    allElements.forEach((el, index) => {
      const backgroundUrls = getBackgroundImageUrls(el);
      backgroundUrls.forEach((url, bgIndex) => {
        images.push({
          id: \`bg-image-\${index}-\${bgIndex}\`,
          url: url,
          alt: el.getAttribute('aria-label') || el.title || 'Background image',
          title: el.getAttribute('aria-label') || el.title || 'Background image',
          cssProperties: {
            backgroundSize: window.getComputedStyle(el).backgroundSize,
            backgroundPosition: window.getComputedStyle(el).backgroundPosition,
            backgroundRepeat: window.getComputedStyle(el).backgroundRepeat
          },
          location: {
            inContent: Boolean(el.closest('article, main, .content, #content')),
            isHeader: Boolean(el.closest('header')),
            isFooter: Boolean(el.closest('footer'))
          },
          type: 'background'
        });
      });
    });

    // Extract text and images in order of appearance
    const elements = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p, img');
    console.log('Found elements:', elements.length);
    
    elements.forEach((el, index) => {
      if (el.tagName.toLowerCase() === 'img') {
        const imageUrl = el.src;
        const alt = el.alt || '';
        if (imageUrl) {
          content.push({
            id: \`content-image-\${index}\`,
            type: 'image',
            content: alt,
            imageUrl: imageUrl,
            accessibility: { 
              label: alt || 'Image from article',
              alt: alt
            }
          });
        }
      } else {
        const text = el.textContent.trim();
        if (text) {
          content.push({
            id: \`\${el.tagName.toLowerCase()}-\${index}\`,
            type: el.tagName.toLowerCase().startsWith('h') ? 'heading' : 'paragraph',
            content: text,
            accessibility: { label: text }
          });
        }
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
    console.log('Extracted images:', images);
    
    return {
      title,
      content,
      links,
      images,
      hasImages: images.length > 0
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

export interface ExtractedImage {
  id: string;
  url: string;
  alt: string;
  title: string;
  dimensions?: {
    width: number;
    height: number;
  };
  location: {
    inContent: boolean;
    isHeader: boolean;
    isFooter: boolean;
  };
  type: string;
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
    images: extractedData.images || [],
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
