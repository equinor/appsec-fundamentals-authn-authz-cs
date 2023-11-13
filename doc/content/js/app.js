import 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.0/reveal.min.js';
import 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.0/plugin/markdown/markdown.min.js';
import 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.0/plugin/highlight/highlight.min.js';
import 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.0/plugin/notes/notes.min.js';

Reveal.initialize({
    history: true,
    transition: 'linear',
    plugins: [RevealMarkdown, RevealHighlight, RevealNotes],
    pdfSeparateFragments: false,
    pdfMaxPagesPerSlide: 1,
});