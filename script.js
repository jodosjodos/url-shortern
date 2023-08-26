const shortenForm = document.getElementById('shortenForm');
const shortenInput = document.getElementById('shortenInput');
const shortenButton = document.getElementById('shortenButton');
const shortenedLinksContainer = document.getElementById('shortenedLinks');

// Retrieve stored links from localStorage
let storedLinks = JSON.parse(localStorage.getItem('shortenedLinks')) || [];

// Display stored links on page load
storedLinks.forEach(link => {
  displayShortenedLink(link);
});

shortenForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = shortenInput.value;
  console.log(url)
  if (!url) {
    alert('Please enter a valid URL.');
    return;
  }

  try {
    const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (data.ok) {
      const shortenedLink = data.result.short_link;
      storedLinks.push({ original: url, shortened: shortenedLink });
      localStorage.setItem('shortenedLinks', JSON.stringify(storedLinks));

      displayShortenedLink({ original: url, shortened: shortenedLink });
      shortenInput.value = '';
    } else {
      alert('Failed to shorten the URL. Please try again.');
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred while processing your request. Please try again.');
  }
});

function displayShortenedLink(linkData) {
  const linkContainer = document.createElement('div');
  linkContainer.className = 'shortened-link-container';

  const originalLink = document.createElement('div');
  originalLink.className = 'original-link';
  originalLink.textContent = linkData.original;

  const shortenedLink = document.createElement('div');
  shortenedLink.className = 'shortened-link';
  shortenedLink.textContent = linkData.shortened;

  const copyButton = document.createElement('button');
  copyButton.className = 'copy-button';
  copyButton.textContent = 'Copy';
  copyButton.addEventListener('click', () => {
    copyToClipboard(linkData.shortened);
    copyButton.textContent = 'Copied!';
    copyButton.classList.add('copied-button');
  });

  linkContainer.appendChild(originalLink);
  linkContainer.appendChild(shortenedLink);
  linkContainer.appendChild(copyButton);

  shortenedLinksContainer.appendChild(linkContainer);
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}
