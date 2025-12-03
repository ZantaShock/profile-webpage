import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AsciiService {

    private readonly headerArt = `
 ____            __  _ _         _                     ______ _      _                   
|  _ \\          / _|(_) |       | |                   |___  /(_)    | |                  
| |_) |_ __ ___ | |_ _| | ___   | |    _   _  ___ __ _   / /  _  ___| |__  _ __ ___  ___ 
|  __/| '__/ _ \\|  _| | |/ _ \\  | |   | | | |/ __/ _\` | / /  | |/ _ \\ '_ \\| '__/ _ \\/ __|
| |   | | | (_) | | | | |  __/  | |___| |_| | (_| (_| |/ /__ | |  __/ | | | | |  __/\\__ \\
|_|   |_|  \\___/|_| |_|_|\\___|  |______\\__,_|\\___\\__,_/_____||_|\\___|_| |_|_|  \\___||___/
`;

    private readonly content: Record<string, string> = {
        about: `
> NAME: Luca Ziehres
> ROLE: FULL_STACK_DEVELOPER
> BORN: 09.09.1999
> LANGUAGES: ENGLISH, GERMAN
> LOCATION: LOWER_SAXONY, GERMANY
>
> I am a passionate developer who loves building scalable and interactive things for the web. Currently I am working as a Full Stack Developer in projects integrating Large Language Models and other AI Models into web applications.
>
> In my spare time, I enjoy fiddeling around with my Raspberry Pi and learning new things.
>
> Feel free to look around and ask me anything you want to know.
`,
        skills: `
> [ LANGUAGES ]
> - Java                    [||||||||| ] 85%
> - TypeScript              [|||||     ] 50%
> - Python                  [||        ] 20%
> - HTML / CSS              [||||||||| ] 90%
>
> [ FRAMEWORKS ]
> - Angular                 [|||||     ] 50%
> - Spring Boot             [|||||||   ] 70%
> - Flask                   [||        ] 20%
>
> [ TOOLS ]
> - Git, Docker, VS Code, Figma, Eclipse, Postman, PostgreSQL, MinIO
`,
        contact: `
> Contact me:
> 
> EMAIL:  luca@ziehr.es
> GITHUB: github.com/ZantaShock
`
    };

    getHeader(): string {
        return this.headerArt;
    }

    getContent(id: string): string {
        return this.content[id] || 'CONTENT_NOT_FOUND';
    }

    scrambleText(text: string, progress: number): string {
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/';
        return text.split('').map((char, index) => {
            if (index < progress * text.length) {
                return char;
            }
            return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
    }

    createBox(text: string, width: number = 89): string {
        const lines = text.trim().split('\n');
        const horizontalLine = '+' + '-'.repeat(width - 2) + '+';
        const maxContentWidth = width - 4; // | space ... space |

        const processedLines: string[] = [];

        lines.forEach(line => {
            if (line.length <= maxContentWidth) {
                processedLines.push(line);
            } else {
                // Wrap logic
                let remaining = line;
                let firstLine = true;
                while (remaining.length > 0) {
                    let chunk;
                    let prefix = firstLine ? '' : '> ';
                    let availableWidth = maxContentWidth - prefix.length;

                    if (remaining.length <= availableWidth) {
                        chunk = remaining;
                        remaining = '';
                    } else {
                        // Try to split at space
                        let splitIndex = remaining.lastIndexOf(' ', availableWidth);
                        if (splitIndex === -1) {
                            // No space, force split
                            splitIndex = availableWidth;
                        }
                        chunk = remaining.substring(0, splitIndex);
                        remaining = remaining.substring(splitIndex).trim(); // Trim leading space of next line
                    }

                    processedLines.push(prefix + chunk);
                    firstLine = false;
                }
            }
        });

        const contentLines = processedLines.map(line => {
            const padding = width - 4 - line.length;
            return '| ' + line + ' '.repeat(Math.max(0, padding)) + ' |';
        });

        return [
            horizontalLine,
            ...contentLines,
            horizontalLine
        ].join('\n');
    }

    getMaxHeight(width: number = 89): number {
        let maxLines = 0;
        Object.values(this.content).forEach(text => {
            const box = this.createBox(text, width);
            const lines = box.split('\n').length;
            if (lines > maxLines) {
                maxLines = lines;
            }
        });
        return maxLines;
    }
}
