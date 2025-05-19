// Code Component Factory
// Creates code blocks with syntax highlighting and copy button functionality

/**
 * Factory for creating code components
 * @extends ComponentFactory
 */
class CodeFactory extends ComponentFactory {
    /**
     * @inheritdoc
     */
    canCreate(type) {
        return type === 'code';
    }
    
    /**
     * @inheritdoc
     */
    create(item) {
        if (!this.canCreate(item.type)) return null;
        
        // Create pre and code elements
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.className = item.language ? `language-${item.language}` : '';
        code.textContent = item.text;
        pre.appendChild(code);
        
        // Create copy button (will be initialized separately)
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
        copyButton.ariaLabel = 'Copy code to clipboard';
        pre.insertBefore(copyButton, pre.firstChild);
        
        return pre;
    }
    
    /**
     * Adds copy functionality to code blocks
     * @param {HTMLElement} codeBlock - The code block element
     */
    static addCopyFunctionality(codeBlock) {
        const copyButton = codeBlock.querySelector('.copy-code-button');
        if (!copyButton) return;
        
        copyButton.addEventListener('click', () => {
            const code = codeBlock.querySelector('code');
            const textToCopy = code.innerText || code.textContent;
            
            let copySuccess = false;
            
            // Try using the Clipboard API first (modern browsers)
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        copySuccess = true;
                        CodeFactory.showCopySuccess(copyButton);
                    })
                    .catch(err => {
                        console.error('Error with Clipboard API:', err);
                        CodeFactory.fallbackCopyMethod(textToCopy, copyButton);
                    });
            } else {
                // Fallback for browsers without Clipboard API
                CodeFactory.fallbackCopyMethod(textToCopy, copyButton);
            }
        });
    }
    
    /**
     * Fallback copy method using textarea
     * @param {string} text - Text to copy
     * @param {HTMLElement} copyButton - The copy button element
     */
    static fallbackCopyMethod(text, copyButton) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Make the textarea out of viewport
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        // Focus and select the text
        textArea.focus();
        textArea.select();
        
        try {
            // Execute the copy command
            const successful = document.execCommand('copy');
            if (successful) {
                CodeFactory.showCopySuccess(copyButton);
            } else {
                CodeFactory.showCopyError(copyButton, 'Copy command failed');
            }
        } catch (err) {
            console.error('Fallback copy error:', err);
            CodeFactory.showCopyError(copyButton, 'Copy not supported');
        }
        
        // Remove the textarea
        document.body.removeChild(textArea);
    }
    
    /**
     * Show success feedback on copy button
     * @param {HTMLElement} copyButton - The copy button element
     */
    static showCopySuccess(copyButton) {
        copyButton.innerHTML = '<i class="bi bi-clipboard-check"></i> Copied!';
        copyButton.classList.add('copied');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
            copyButton.classList.remove('copied');
        }, 2000);
    }
    
    /**
     * Show error feedback on copy button
     * @param {HTMLElement} copyButton - The copy button element
     * @param {string} errorMsg - The error message
     */
    static showCopyError(copyButton, errorMsg) {
        copyButton.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Error!';
        console.error('Copy failed:', errorMsg);
        
        // Reset button after 2 seconds
        setTimeout(() => {
            copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
        }, 2000);
    }
}

// Make the factory available globally
window.CodeFactory = CodeFactory;