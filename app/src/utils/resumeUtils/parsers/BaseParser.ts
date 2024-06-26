// src/utils/parsers/BaseParser.ts
import { ParsedResume, ResumeSection } from "@/model";

export abstract class BaseParser {
    protected text: string;
    protected sections: Map<string, string>;

    constructor(text: string) {
        this.text = text;
        this.sections = this.splitIntoSections();
    }

    protected splitIntoSections(): Map<string, string> {
        const sectionRegex = /^([A-Z][A-Z\s]+)$/gm;
        const sections = new Map<string, string>();
        let lastSectionTitle = '';
        let lastIndex = 0;

        this.text.replace(sectionRegex, (match, sectionTitle, index) => {
            if (lastSectionTitle) {
                sections.set(lastSectionTitle.trim().toLowerCase(), this.text.slice(lastIndex, index).trim());
            }
            lastSectionTitle = sectionTitle;
            lastIndex = index + match.length;
            return match;
        });

        if (lastSectionTitle) {
            sections.set(lastSectionTitle.trim().toLowerCase(), this.text.slice(lastIndex).trim());
        }

        return sections;
    }

    abstract parse(): Promise<ParsedResume>;

    protected formatDate(dateString: string): string {
        const months: { [key: string]: string } = {
            'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
            'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12',
            'january': '01', 'february': '02', 'march': '03', 'april': '04', 'june': '06',
            'july': '07', 'august': '08', 'september': '09', 'october': '10', 'november': '11', 'december': '12'
        };

        const parts = dateString.toLowerCase().split(/\s*(-|–|to)\s*/);
        const formattedParts = parts.map(part => {
            if (part.toLowerCase() === 'present') {
                return 'Present';
            }
            const [month, year] = part.split(/[\/\s]+/);
            if (months[month]) {
                return `${months[month]}/${year}`;
            } else if (month.length === 2 && year.length === 4) {
                return `${month}/${year}`;
            }
            return '';
        });

        return formattedParts.filter(Boolean).join(' - ');
    }

    protected parseSection(sectionContent: string): ResumeSection[] {
        const entries = sectionContent.split(/\n(?=[A-Z])/);
        return entries.map(entry => {
            const lines = entry.split('\n');
            const title = lines[0];
            const content = lines.slice(1).map(line => line.trim());
            const dateMatch = title.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\.?\s+\d{4}\s*(-|–|to)?\s*(Present|\w+\.?\s+\d{4})?\b|\b\d{1,2}\/\d{4}\s*(-|–|to)?\s*(\d{1,2}\/\d{4}|Present)?\b/i);
            const date = dateMatch ? this.formatDate(dateMatch[0]) : '';
            const companyOrInstitution = title.replace(dateMatch ? dateMatch[0] : '', '').split('|')[0].trim();

            return {
                title,
                content,
                date,
                company: companyOrInstitution,
                institution: companyOrInstitution,
            };
        });
    }
}